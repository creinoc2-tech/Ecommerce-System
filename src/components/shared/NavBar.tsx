import { Link } from "react-router";
import { HiOutlineSearch, HiOutlineUser } from "react-icons/hi";
import { FaBarsStaggered, FaChevronDown } from "react-icons/fa6";
import { Logo } from "./Logo";
import { useGlobalStore } from "../../store/global.state";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useCartStore } from "../../store/cart.store";
import { useAuth } from "../../context/AuthContext";
import { LuLoader } from "react-icons/lu";
import { useCustomer } from "../../hook/Auth/UseCustomer";
import { Categoria } from "./categoria/Categoria";
import { ItemsCategorias } from "./categoria/ItemsCategorias";
import { categories } from "./categoria/categories";

export const Navbar = () => {
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  const openSheet = useGlobalStore((state) => state.openSheet);
  const setActiveNavMobile = useGlobalStore(
    (state) => state.setActiveNavMobile,
  );

  const { session, isLoading } = useAuth();
  const userId = session?.user.id;
  const { data: customer } = useCustomer(userId!);

  const iniciales = customer?.full_name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra: string) => palabra.charAt(0).toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-[0_3px_14px_rgba(15,23,42,0.06)]">
      <div className="flex h-7 items-center justify-center bg-violet-700 px-3 text-center text-[10px] font-medium tracking-wide text-white sm:text-xs">
        Envio gratis en compras seleccionadas · Compra facil y segura
      </div>

      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="flex min-h-[76px] items-center gap-3 py-3 lg:gap-5">
          <Logo />

          <button
            type="button"
            aria-label="Tu ubicacion"
            className="hidden min-w-[130px] flex-col rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:border-violet-300 lg:flex"
          >
            <span className="text-[10px] font-medium text-slate-500">
              Tu ubicacion
            </span>
            <span className="mt-0.5 flex items-center justify-between gap-2 text-xs font-semibold text-violet-700">
              Todo Ecuador
              <FaChevronDown size={11} className="text-slate-500" />
            </span>
          </button>

          <button
            type="button"
            aria-label="Buscar productos"
            onClick={() => openSheet("search")}
            className="hidden h-[42px] min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-400 transition hover:border-violet-300 hover:bg-white md:flex"
          >
            <span className="flex-1">Buscar productos...</span>
            <HiOutlineSearch size={20} className="shrink-0 text-slate-600" />
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {!session && !isLoading && (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/login"
                  className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-violet-700"
                >
                  Iniciar sesion
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-violet-800"
                >
                  Crear cuenta
                </Link>
              </div>
            )}

            {isLoading ? (
              <span className="grid h-10 w-10 place-items-center">
                <LuLoader className="animate-spin text-violet-700" size={20} />
              </span>
            ) : session ? (
              <Link
                to="/account"
                aria-label="Mi cuenta"
                className="grid h-9 w-9 place-items-center rounded-full bg-violet-50 text-[11px] font-bold text-violet-800 ring-1 ring-violet-100 transition hover:bg-violet-100"
              >
                {iniciales || <HiOutlineUser size={17} />}
              </Link>
            ) : (
              <Link
                to="/login"
                aria-label="Iniciar sesion"
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
              >
                <HiOutlineUser size={19} />
              </Link>
            )}

            <button
              type="button"
              aria-label="Abrir carrito"
              onClick={() => openSheet("cart")}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <MdOutlineShoppingCart size={21} />
              {totalItemsInCart > 0 && (
                <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {totalItemsInCart}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Abrir menu"
              className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 md:hidden"
              onClick={() => setActiveNavMobile(true)}
            >
              <FaBarsStaggered size={16} />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Buscar productos"
          onClick={() => openSheet("search")}
          className="mb-3 flex h-10 w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-400 transition hover:border-violet-300 md:hidden"
        >
          <span className="flex-1">Buscar productos...</span>
          <HiOutlineSearch size={19} className="shrink-0 text-slate-600" />
        </button>

        <nav
          aria-label="Categorias principales"
          className="flex min-h-[54px] items-center gap-4 overflow-x-auto border-t border-slate-100 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 lg:gap-8"
        >
          <Categoria items={categories} />
          <ItemsCategorias items={categories} />
        </nav>
      </div>
    </header>
  );
};
