import { navbarLinks } from '../../constans/links'
import { Link, NavLink } from 'react-router'
import { HiOutlineSearch, HiOutlineUser } from 'react-icons/hi'
import { FaBarsStaggered } from 'react-icons/fa6'
import { Logo } from './Logo'
import { useGlobalStore } from '../../store/global.state'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { useCartStore } from '../../store/cart.store'
import { useAuth } from '../../context/AuthContext'
import { LuLoader } from 'react-icons/lu'
import { useCustomer } from '../../hook/Auth/UseCustomer'

export const Navbar = () => {
  const totalItemsInCart = useCartStore(state => state.totalItemsInCart)
  const openSheet = useGlobalStore(state => state.openSheet)
  const setActiveNavMobile = useGlobalStore(state => state.setActiveNavMobile)

  const { session, isLoading } = useAuth()
  const userId = session?.user.id
  const { data: customer } = useCustomer(userId!)

  const iniciales = customer?.full_name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra: string) => palabra.charAt(0).toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navbarLinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {!session && !isLoading && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/register"
                className="btn-primary !py-2 !px-4 !text-xs tracking-wide"
              >
                Crear cuenta
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label="Buscar productos"
            onClick={() => openSheet("search")}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
          >
            <HiOutlineSearch size={20} />
          </button>

          {isLoading ? (
            <span className="grid h-10 w-10 place-items-center">
              <LuLoader className="animate-spin text-cyan-600" size={20} />
            </span>
          ) : session ? (
            <Link
              to="/account"
              aria-label="Mi cuenta"
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-[11px] font-bold text-white transition-transform hover:scale-105"
            >
              {iniciales || <HiOutlineUser size={16} />}
            </Link>
          ) : (
            <Link
              to="/login"
              aria-label="Iniciar sesion"
              className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 sm:hidden"
            >
              <HiOutlineUser size={20} />
            </Link>
          )}

          <button
            type="button"
            aria-label="Abrir carrito"
            onClick={() => openSheet("cart")}
            className="relative grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
          >
            <MdOutlineShoppingCart size={22} />
            {totalItemsInCart > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cyan-600 px-1 text-[10px] font-bold text-white">
                {totalItemsInCart}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Abrir menu"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setActiveNavMobile(true)}
          >
            <FaBarsStaggered size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
