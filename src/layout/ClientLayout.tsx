import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { signOut } from "../action";
import { useUser } from "../hook";
import supabases from "../superbase/superbase";
import { Loader } from "../components/shared/Loader";
import { useRoleUser } from "../hook/Auth/useRoleUser";
import { HiOutlineExternalLink } from "react-icons/hi";

export const ClientLayout = () => {
  const { session, isLoading: isLoadingSession } = useUser();
  const navigate = useNavigate();

  const { data: role, isLoading: isLoadingRole } = useRoleUser(
    session?.user.id as string,
  );

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    supabases.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  if (isLoadingSession || isLoadingRole) return <Loader />;

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
