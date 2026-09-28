import { Link, NavLink } from 'react-router';
import { useGlobalStore } from '../../store/global.state'
import { IoMdClose } from 'react-icons/io';
import { navbarLinks } from '../../constans/links';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';

export const NavBarMobile = () => {
    const setActiveNavMobile = useGlobalStore(state => state.setActiveNavMobile)
    const { session } = useAuth()

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white px-6 py-6">
        <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              aria-label="Cerrar menu"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"
              onClick={() => setActiveNavMobile(false)}
            >
                <IoMdClose size={24} className="text-slate-900" />
            </button>
        </div>

        <nav className="mt-12 flex flex-col gap-2">
            {navbarLinks.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setActiveNavMobile(false)}
                    className={({ isActive }) =>
                        `rounded-2xl px-4 py-4 text-2xl font-bold transition-colors ${
                            isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-800 hover:bg-slate-50'
                        }`
                    }
                >
                    {item.title}
                </NavLink>
            ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pb-8">
            {session ? (
                <Link
                    to="/account"
                    onClick={() => setActiveNavMobile(false)}
                    className="btn-primary w-full py-4"
                >
                    Mi cuenta
                </Link>
            ) : (
                <>
                    <Link
                        to="/login"
                        onClick={() => setActiveNavMobile(false)}
                        className="btn-secondary-outline w-full py-4"
                    >
                        Iniciar sesion
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setActiveNavMobile(false)}
                        className="btn-primary w-full py-4"
                    >
                        Crear cuenta
                    </Link>
                </>
            )}
        </div>
    </div>
  )
}
