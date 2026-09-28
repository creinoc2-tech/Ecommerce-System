# Analisis del sistema — Celulares Baratos

Fecha: 2026-09-28  
Alcance: frontend React + TypeScript + Vite + Supabase  
Objetivo: errores a corregir, arquitectura objetivo para escalar, y plan de trabajo priorizado.

* ---

## 1. Que es este proyecto

SPA de e-commerce de smartphones con:

- Catalogo publico (home, listado, detalle, busqueda)
- Carrito persistente en `localStorage`
- Checkout con transferencia bancaria
- Cuenta de usuario (pedidos)
- Dashboard admin (CRUD de productos y gestion de ordenes)

### Stack actual

| Capa | Tecnologia |
|---|---|
| UI | React 19, TypeScript, Vite 7, Tailwind CSS 4 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| Auth / DB / Storage | Supabase JS (llamadas directas desde el browser) |
| Forms | React Hook Form + Zod (solo en registro, checkout y productos admin) |
| Rich text | TipTap |
| Toasts | react-hot-toast |

### Estructura actual (tecnica, no por dominio)

```
src/
  action/          acceso a datos (queries/mutations Supabase)
  hook/            wrappers de TanStack Query
  store/           Zustand: cart, counter, UI global
  context/         AuthContext (session + role)
  superbase/       cliente (typo)
  interfaces/      Product, Order
  lib/             schemas Zod
  helpers/         formatters, prepareProducts
  constans/        links (typo)
  page/            paginas + dashboard/
  components/      por area visual
  layout/
  router/
  data/            mock muerto (initialData.ts)
```

Esto funciona como MVP. No escala: cada feature nueva (pagos, reviews, wishlist, inventario) termina en los mismos tres cajones (`action/`, `hook/`, `page/`).

---

## 2. Arquitectura actual — problemas de diseno

### 2.1 Naming roto (deuda que se propaga)

| Actual | Correcto |
|---|---|
| `src/superbase/superbase.ts` | `src/supabase/client.ts` |
| `src/constans/links.tsx` | `src/constants/links.tsx` |
| `src/hook/products/UseDelecteProduct.ts` | `useDeleteProduct.ts` |
| `ICarrtItem` en `Cart.items.tsx` | `ICartItem` en `interfaces/` |
| `Cart.items.tsx` | `CartItem.tsx` |
| `Swipper.tsx` / `swipper.css` | Swiper (y hoy no se usa) |
| `ganeratedSlug` | `generatedSlug` |
| `getFristError` | `getFirstError` |
| `UseCreateProducts` / `UseLogin` / `UseRegister` | `use*` camelCase |

Casing inconsistente: `hook/Auth/` vs `hook/products/`; `Order.interface.ts` vs `product.interface.ts`; `counter.state.ts` vs `cart.store.ts`.

### 2.2 Rutas mezcladas ES/EN

| Ingles | Espanol |
|---|---|
| `/products`, `/products/:slug` | `/dashboard/productos` |
| `/checkout`, `/checkout/:id/thank-you` | `/account/pedidos`, `/dashboard/ordenes` |

Elegir un idioma de URL y no mezclar.

### 2.3 Acoplamiento

- El store del carrito importa un tipo de un componente UI: `src/store/cart.store.ts` → `ICarrtItem` desde `src/components/shared/Cart.items.tsx`. Los tipos de dominio no pueden vivir en la UI.
- No hay capa API/repositorio. Paginas y hooks llaman `src/action/*`, y ahi se habla con Supabase sin tipos generados.
- Auth partido: `AuthContext` + `useCustomer` + `action/auth.ts`. Login invalida `["user"]`, query que nadie usa.
- Reglas de negocio en la UI: stock en `CardProduct`, cantidad en un store global, totales copiados 3 veces en el carrito, mapper de orden duplicado en `getOrderById` y `getOrderByIdAdmin`.
- `src/hook/index.ts` solo reexporta 3 hooks. El resto se importa por path profundo.
- `src/page/index.ts` exporta `ProductsPage` dos veces y omite login/checkout/dashboard.

### 2.4 Sin capas

No hay split domain / data / UI. `action/` mezcla validacion, upload a storage, inserts anidados y strings de error en espanol. Los componentes llaman actions y stores directo.

---

## 3. Errores concretos a corregir

### P0 — dinero, datos, integridad

#### 3.1 `createOrder` traga el error y el thank-you crashea

Archivo: `src/action/order.ts` (catch solo hace `console.log` y retorna `undefined`).  
Archivo: `src/hook/orders/useCreateOrders.ts` navega a `/checkout/${data.id}/thank-you`.

Si falla el insert, `data` es `undefined`, `onSuccess` igual corre (la mutation no lanzo), `FormCheckout` limpia el carrito. El usuario pierde el carrito y cae en un thank-you roto.

**Fix:** rethrow en el catch. Navegar solo si `data?.id` existe. No limpiar carrito si la orden no se creo.

#### 3.2 Precio y total confiados al cliente

`createOrder` usa `item.price` y `totalAmount` que vienen de Zustand persistido en `localStorage` (`cart-store`). Cualquiera puede editar el storage y pagar de menos.

**Fix:** el servidor (RPC Postgres / Edge Function) debe leer precio y stock de `variants`, no del body.

#### 3.3 Checkout no atomico + race de stock

Address, order, items y stock son round-trips separados. El stock se lee y luego se escribe en un loop (`order.ts` ~99-122). Dos compras concurrentes pueden oversell.

**Fix:** una sola transaccion SQL / `supabase.rpc('place_order')` con lock de variantes.

#### 3.4 `updateProduct` / `createProduct` no relanzan el error

Catch loguea y retorna `undefined`. TanStack lo trata como exito → toast "actualizado correctamente" y navigate aunque fallo.

#### 3.5 URL de imagen con espacio inicial

`src/action/product.ts` ~149-152:

```ts
const imageUrl = ` ${ supabase.storage...publicUrl }`;
```

Imagenes rotas. `extractFilePath` puede tirar `URL de imagen no valida`.

#### 3.6 Contador global de cantidad

`src/store/counter.state.ts` es un singleton. `ProductPage` lo usa. Si el usuario pone 5 en el producto A y abre el B, sigue en 5. Al cambiar `slug` se resetean color/storage/variant, **nunca** `count`.

`Cart.items.tsx` importa `useCounterStore` y no lo usa.

**Fix:** `useState` local en PDP. Borrar `counter.state.ts`.

#### 3.7 `productId` incorrecto desde las cards

`CardProduct.tsx` guarda `productId: slug`. `ProductPage` guarda `product.id`. El carrito mezcla dos semanticas.

#### 3.8 Match de variante solo por color

`CardProduct` hace `variants.find(v => v.color === activeColor.color)` y toma la primera. Si hay 128GB y 256GB del mismo color, precio/stock/add-to-cart pueden ser del SKU equivocado.

#### 3.9 `prepareProducts` con variantes vacias → `Infinity`

`helpers/index.ts`: `Math.min(...[])` es `Infinity`. Se renderiza `$Infinity`. `CardProduct` usa `colors[0]` sin guard.

#### 3.10 Admin order: nombre y fecha rotos

`DashboardOrderPage.tsx`: usa `order.customer.full_name` pero el mapper admin expone `fullname`. Fecha hardcodeada `"FECHA"`.

#### 3.11 Add/Buy Now en PDP no chequea stock

Solo `CardProduct` valida stock. En detalle se puede agregar agotado. `addItem` / `updateQuantity` no capean por stock.

---

### P1 — seguridad y produccion

1. `.env` esta commiteado y **no** esta en `.gitignore`. Las vars Vite son publicas, pero no deben vivir en git. Hay un espacio alrededor de `=` en la API key.
2. Autorizacion admin es solo UI (`ProtectedRoute role="admin"`). Sin RLS en Supabase, cualquiera con la anon key puede CRUD productos, ordenes y storage.
3. IDOR potencial en `getOrderByIdAdmin` si RLS no filtra.
4. `ReactQueryDevtools` montado siempre en `main.tsx` → cache (user/orders) visible en produccion.
5. ~27 `console.log` (incluido `"hola mundo"` en `TableOrdersAdmin`).
6. `signOut` traga errores: la sesion puede quedar viva.
7. Upload de imagen usa `image.name` crudo en el path (nombres raros / path traversal).
8. Datos bancarios hardcodeados en el bundle (`FormCheckout`, `ThankYouPage`).
9. Dependencias MUI/Emotion instaladas y ya no se usan en navbar.

---

### P2 — bugs visibles / UX

| Item | Donde |
|---|---|
| Label fijo "Almacenamiento disponible: 256GB" | `ProductPage.tsx` |
| Doble simbolo `$$` (`formatPrice` ya trae `$`) | `ItemsCheckout.tsx` |
| Search muestra hex (`variant.color`) en vez de `color_name`; no guard si no hay `variants[0]` | `Search.tsx` |
| `getStatus` no mapea `'Paid'` | `helpers/index.ts` |
| `ProtectedRoute` retorna `null` mientras carga → pantalla blanca | `ProtectedRoute.tsx` |
| No hay ruta 404 ni `errorElement` / ErrorBoundary | `router.tsx` |
| Loader de `TableProduct` comentado; rows con `key={index}` | `TableProduct.tsx` |
| Editar producto regenera el slug desde el nombre siempre | `FormProducts.tsx` |
| `InputFormProduct` ignora `type`; siempre `text` | `InputFormProduct.tsx` |
| Toast de registro dice "revisa tu correo" pero `requiresEmailConfirmation: false` | `auth.ts` / `UseRegister.ts` |
| Tailwind invalido: `w-[120]`, `hover:bg-slate-105` | `Sidebar.tsx`, `FormProducts.tsx` |
| "Contactanos aqui" apunta a `#` | `ProductPage.tsx` |
| Newsletter/footer solo hacen toast, no hay API | `Newsletter.tsx`, `Footer.tsx` |
| Locale `'es-US'` en `formatPrice` (invalido) | `helpers/index.ts` |
| Keys de listas de ordenes por index | `OrderUserPage`, `ThankYouPage`, `DashboardOrderPage` |

---

### P3 — calidad / dead code

- `src/data/initialData.ts` (~670 lineas) y `allCelulares` importado y no usado en `ProductsPage`.
- `Swipper.tsx` + `swipper.css` nunca importados.
- Imports basura: `{ de }`, `{ tr }`, `{ sl }` desde `zod/v4/locales`; `toast` default en `main.tsx`; `useQuery` unused en `useHomeProducts`; `useQueryClient` unused en `useOrder`; `React` unused en varios archivos con `react-jsx`.
- Login con `useState`; Register con RHF+Zod. Inconsistente.
- `itemsPerPage = 10` copiado en `getProducts`, `getFilteredProducts` y `Pagination`. Si uno cambia, se desfasá la UI.
- Query keys groseras: invalidar `["products"]` tumba listado, slug y filtros.
- Crear orden no invalida stock/productos. Cambiar status no invalida `['order', 'admin', id]`.
- Brands de filtro hardcodeadas en `ContainerFilter.tsx`, no salen de la DB.
- Sin tests. README sigue siendo el template de Vite.
- `noUnusedLocals` + `strict` hoy rompen `tsc -b`.

---

## 4. Problemas de escalabilidad

- Home "random" trae 20 filas y shufflea en el browser. No escala y no es random real.
- Checkout N+1: 1 read + 1 write de stock por item.
- Sin tipos generados de Supabase → todo `any`.
- Cart persist unbounded; al hidratar no se revalidan precios/stock.
- TipTap por descripcion, sin lazy split.
- Router importa todas las paginas en estatico. Sin code splitting.
- Imagenes crudas de Storage, sin transforms/CDN.
- `AuthContext` refetch de role en cada `onAuthStateChange` (incluye refresh de token).
- No hay lugar natural para pagos, reviews, wishlist, CMS.
- Un solo `QueryClient` con defaults; casi sin politica de `staleTime` por feature.

---

## 5. Arquitectura objetivo (escalable)

Mantener Vite SPA + Supabase, pero **dejar de tratar al cliente como fuente de verdad** de dinero y stock.

Organizar por **feature**, con un kernel compartido fino.

```
src/
  app/
    providers.tsx
    router.tsx
    layouts/
    ErrorBoundary.tsx
  shared/
    ui/                 Button, Input, Pagination, Sheet, Tag, Loader
    lib/                formatPrice, cn, slug
    config/             env (zod), constants, bank details
  features/
    auth/
      domain/
      data/             auth.api.ts
      hooks/            useLogin, useRegister, useSession
      ui/               LoginForm, ProtectedRoute
    catalog/
      domain/           Product, Variant, PreparedProduct
      data/             product.api.ts
      hooks/            productKeys, useProduct, useProductList, useSearch
      ui/               CardProduct, ProductGrid, Filters
    cart/
      domain/           CartItem
      store/            cart.store.ts
      ui/               CartDrawer, CartLineItem
    checkout/
      domain/           OrderDraft
      data/             placeOrder via supabase.rpc('place_order')
      ui/               CheckoutForm
    orders/
      data/ + hooks/ + ui/
    admin-products/
    admin-orders/
  supabase/
    client.ts
    database.types.ts   generado con supabase gen types
```

### Capas dentro de cada feature

1. **domain** — tipos y funciones puras (`prepareProducts`, precio, slug). Cero I/O.
2. **data** — solo Supabase/RPC. Devuelve tipos de dominio. Nunca `console.log`. Nunca tragar errores.
3. **hooks** — TanStack Query con key factories: `productKeys.list({ page, brands })`.
4. **ui** — presentacional + hooks. Prohibido `from("products")` en componentes.

### API / backend

- Generar tipos: `supabase gen types typescript`.
- Mover checkout + stock a **Postgres function / Edge Function** que:
  - autentica al usuario
  - lockea variantes
  - usa precios de DB
  - inserta order + items atomico
  - retorna `{ orderId }`
- Mutations admin tambien detras de RPC o RLS (`role = admin`).
- Auditar RLS en `products`, `variants`, `orders`, `order_items`, `addresses`, `customers`, `user_roles`, bucket `product-images`.

### Estado

| Tipo | Donde |
|---|---|
| Server state | Solo TanStack Query (products, orders, customer, session, role) |
| Cart | Zustand persist + revalidar precios al hidratar |
| UI | Zustand `ui` (sheet, mobile nav) |
| Cantidad PDP | `useState` local. **Borrar `counter.state.ts`** |

Evaluar reemplazar `AuthContext` por `useQuery(['session'])` + invalidacion en `onAuthStateChange`.

### Routing

- Un idioma: `/products`, `/account/orders`, `/dashboard/products`, `/dashboard/orders`.
- `React.lazy` por ruta.
- `errorElement` + ErrorBoundary de app.
- `ProtectedRoute` muestra `Loader`, nunca `null`.
- Catch-all `path: '*'` → 404.

### Forms

- Todas las forms: RHF + Zod (tambien login).
- `FormField` compartido que respeta `type`, errores y a11y.
- Imagenes de producto: `z.array(z.union([z.instanceof(File), z.string().url()]))`.
- Slug: generar solo en create, o si el usuario no lo toco.

### Env

- `.env` en `.gitignore`.
- `.env.example` con placeholders.
- Validar al boot con Zod (`VITE_PROJECT_URL` url, `VITE_PROJECT_API_KEY` min 1).
- Sin espacios alrededor de `=`.
- Devtools solo si `import.meta.env.DEV`.

### Query keys (ejemplo)

```ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { page: number; brands: string[] }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
}
```

Invalidar fino: al crear orden, `productKeys.lists()` + `productKeys.detail(slug)`, no todo `['products']`.

---

## 6. Plan de migracion (incremental, no big bang)

No reescribir el repo de un golpe. Orden:

1. **Semana 1 — P0 dinero:** RPC `place_order`, rethrow, no limpiar carrito si falla, precio/stock desde DB.
2. **Semana 1 — P0 bugs de carrito/PDP:** counter local, `product.id`, match color+storage, guards de `prepareProducts`, cap de stock.
3. **Semana 2 — P1 seguridad:** gitignore `.env`, RLS, sacar Devtools/logs, sanitizar upload.
4. **Semana 2 — P2 UX:** 256GB, `$$`, Paid, ProtectedRoute loader, 404, slug en edit, Tailwind roto.
5. **Semana 3 — extraer features:** mover `cart` y `checkout` al layout feature-based. Luego `catalog`.
6. **Semana 3 — higiene:** rename `superbase`/`constans`/`UseDelecteProduct`, borrar `initialData` y Swiper, tipos generados, lazy routes.
7. **Ongoing:** tests de `prepareProducts`, totales de carrito, mapper de orden, y del RPC de checkout.

Cada PR debe dejar el sistema funcionando. No mezclar rename masivo con cambio de checkout en el mismo commit.

---

## 7. Checklist priorizado

### P0

- [ ] RPC atomico de checkout; no confiar precio/total del cliente
- [ ] Rethrow en `createOrder` / `updateProduct` / `createProduct`
- [ ] Navegar thank-you solo con `data?.id`; no vaciar carrito si fallo
- [ ] Quitar espacio en URL de imagen
- [ ] Borrar `counter.state.ts`; cantidad local en PDP
- [ ] `CardProduct` pasa `product.id`, no slug
- [ ] Match variante por color + storage
- [ ] Guard en `prepareProducts` y `colors[0]`
- [ ] Cap cantidad a stock; chequear stock en PDP add/buy
- [ ] Admin: `fullname` + fecha real

### P1

- [ ] `.gitignore` `.env`; `.env.example`; trim de env
- [ ] RLS en todas las tablas y storage
- [ ] Devtools solo en DEV; borrar `console.log`
- [ ] Quitar MUI/Emotion si no se usan

### P2

- [ ] Label de storage dinamico
- [ ] Quitar `$` extra en `ItemsCheckout`
- [ ] Search: `color_name` + guards
- [ ] Mapear status `Paid`
- [ ] Loader en `ProtectedRoute`; 404; ErrorBoundary
- [ ] Restaurar loader de tabla admin; keys por id
- [ ] No pisar slug en edit
- [ ] Respetar `type` en inputs
- [ ] Alinear toast de signup con confirmacion real
- [ ] Tailwind `w-[120px]`, `slate-105`

### P3

- [ ] Renames (`superbase`, `constans`, hooks, `ICarrtItem`)
- [ ] Mover `ICartItem` a `interfaces/`
- [ ] Borrar `initialData.ts` y Swiper muerto
- [ ] Unificar idioma de rutas + lazy load
- [ ] Deduplicar mappers de orden y lookup de customer
- [ ] Query key factory; invalidar stock post-checkout
- [ ] Tipos generados Supabase; eliminar `any`
- [ ] Bank details a config
- [ ] Env schema + tests minimos
- [ ] Adoptar carpetas por feature: empezar por `cart` + `checkout` + `catalog`

---

## 8. Conclusion

El storefront es un MVP funcional: el loop catalogo → carrito → checkout existe y la UI ya se puede pulir. No esta listo para trafico real.

Los tres bloqueadores de produccion:

1. **El cliente decide el precio y el stock no es transaccional.**
2. **Las mutations mienten (catch sin rethrow) y pueden vaciar el carrito sin crear orden.**
3. **La carpeta actual no tiene un lugar para el segundo dominio.** Sin features + RPC + RLS, cada feature nueva aumenta el acoplamiento y el riesgo de dinero.

Corregir P0 antes de cualquier usuario real. La arquitectura de la seccion 5 se adopta por feature, no con un rewrite.
