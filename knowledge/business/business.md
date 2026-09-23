Business

Created by kaddo bootstrap. The minimal why of the project. Refine with the business-agent. As this matures it can split into problem.md, users.md, …

Problem

Vender celulares (smartphones) en línea, permitiendo al comprador elegir entre distintas variantes de un mismo modelo (color y capacidad de almacenamiento), cada una con su propio precio y stock, y completar la compra sin fricción hasta recibir el pedido en su dirección.

Del lado del negocio, el problema es tener un catálogo de celulares administrable (altas, edición y control de stock/precio por variante) y un panel para dar seguimiento a los pedidos generados, sin depender de gestionar esto manualmente fuera del sistema.

Users
Cliente / comprador: navega el catálogo (/products, /products/:slug), arma un carrito, se registra o inicia sesión (/login, /register), hace checkout (/checkout) y da seguimiento a sus pedidos en su cuenta (/account/pedidos, /account/pedidos/:id). No requiere ningún rol especial; es cualquier usuario autenticado (o que se autentica durante el checkout).
Administrador: usuario con role = 'admin' (verificado vía Supabase, tanto en RLS como en el frontend). Accede al panel /dashboard para:
Gestionar el catálogo de productos: crear (/dashboard/productos/new), editar (/dashboard/productos/edit/:slug) y listar (/dashboard/productos).
Ver y dar seguimiento a los pedidos de todos los clientes (/dashboard/ordenes, /dashboard/ordenes/:id), incluyendo cambiar su estado.

No hay evidencia en el código de más roles (ej. soporte, vendedor, repartidor) — solo cliente y admin.

Value Proposition

Una tienda de celulares en línea con catálogo por variantes (el cliente elige color y almacenamiento antes de comprar, viendo el precio correcto para esa combinación) y un flujo de compra completo de extremo a extremo: catálogo → carrito → checkout con dirección de envío → confirmación (/checkout/:id/thank-you) → seguimiento del pedido. Para el negocio, un panel propio para administrar productos y pedidos sin depender de un backoffice externo.

Business Rules
Un producto (Product) tiene una o más variantes (VariantProduct), cada una con su propio stock, price, storage (almacenamiento) y color/color_name.
El precio "de catálogo" que se muestra por color es el precio mínimo entre las variantes de ese color (ver prepareProducts en helpers), es decir, se le muestra al cliente "desde $X".
El carrito (cart.store) agrupa por variantId: si el cliente agrega dos veces la misma variante, se suma la cantidad en vez de duplicar la línea.
El carrito persiste en el cliente (localStorage vía zustand/persist), sobreviviendo recargas de página.
Solo un usuario con role = 'admin' puede crear/editar productos y ver/gestionar los pedidos de otros usuarios; esto está reforzado a nivel de base de datos con políticas RLS de Supabase (auth.uid() debe existir en user_roles con role = 'admin'), no solo en el frontend.
Cada pedido (OrderInput) registra: dirección de envío, ítems del carrito (variante, cantidad, precio) y el monto total (totalAmount).
Los pedidos tienen un status (visible tanto en la vista de cliente como en la de admin) que permite dar seguimiento al ciclo de vida del pedido.
Los precios se manejan y muestran en dólares (USD), formato es-US (ver formatPrice).
Constraints
Backend como servicio: Supabase (Postgres + Auth + RLS), no hay backend propio (src/superbase/superbase.ts). El control de acceso admin/cliente depende de las políticas RLS definidas en Supabase.
Moneda fija a USD; no hay soporte multi-moneda en el código actual.
Envío: solo se captura una dirección por pedido (addressLine1/2, city, state, postalCode, country); no hay lógica de cálculo de costo de envío (se muestra "Envío (Standard)" con costo $0 en DashboardOrderPage).
El proyecto está en español (language: es en .kaddo/config.yml); el contenido de negocio y de cara al usuario debe redactarse en español, manteniendo código, nombres de archivo y configuración en inglés.
No hay pasarela de pago visible en el código provisto (no se encontró integración con Stripe, PayPal, etc.) — el checkout parece terminar en la creación del pedido, no en un cobro real. Esto debe confirmarse con el equipo, ya que podría faltar en este export o estar pendiente de implementar.
Assumptions
Se asume que el negocio vende exclusivamente celulares/smartphones (así lo indica el comentario // (CELULARES) en el código y el modelo de variantes por color/almacenamiento), no un catálogo general de electrónica.
Se asume que solo existen los dos roles observados en el código: cliente (implícito, cualquier usuario autenticado) y admin (explícito, vía user_roles).
Se asume que el pago se procesa fuera de este repositorio (pasarela externa, pago contra entrega, o transferencia manual), ya que no hay integración de pagos visible en el código.
Open Questions
¿El pago se procesa en algún punto del flujo (pasarela, transferencia manual, contra entrega) o falta implementarse?
¿Existen más roles previstos a futuro (ej. soporte, bodega/logística) más allá de cliente y admin?
¿Hay planes de vender otro tipo de productos además de celulares, o el modelo de variantes (color + almacenamiento) es intencionalmente específico a smartphones?
¿Cómo se calcula o cobra el envío en producción? Actualmente aparece fijo en $0.
¿Cuál es el mercado objetivo (país/región) más allá de que los precios están en USD?