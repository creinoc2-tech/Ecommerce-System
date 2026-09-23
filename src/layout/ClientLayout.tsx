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
    <div className="flex flex-col gap-5">
      <nav className="flex justify-center gap-10 text-sm font-medium">
        <NavLink
          to={""}
          className={({ isActive }) =>
            isActive ? "underline" : "hover:underline"
          }
        >
          Mis Pedidos
        </NavLink>

        {role === "admin" && (
          <NavLink
            to="/dashboard/productos"
            className="flex items-center gap-1 hover:underline"
          >
            Dashboard
            <HiOutlineExternalLink size={16} className="inline-block" />
          </NavLink>
        )}
        <button className="hover:underline" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

      <main className="container mt-12 flex-1">
        <Outlet />
      </main>
    </div>
  );
};
