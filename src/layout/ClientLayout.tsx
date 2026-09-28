import { NavLink, Outlet } from "react-router";
import { signOut } from "../action";
import { useAuth } from "../context/AuthContext";
import { HiOutlineExternalLink } from "react-icons/hi";

export const ClientLayout = () => {
  const { role } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col gap-8">
      <nav className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <NavLink
          to="/account/pedidos"
          className={({ isActive }) =>
            `rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          Mis Pedidos
        </NavLink>

        {role === "admin" && (
          <NavLink
            to="/dashboard/productos"
            className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            Dashboard
            <HiOutlineExternalLink size={16} />
          </NavLink>
        )}
        <button
          className="rounded-xl px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
          onClick={handleLogout}
        >
          Cerrar sesion
        </button>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
