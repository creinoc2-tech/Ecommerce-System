import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "../components/dashboard";
import { useUser } from "../hook";
import { getSession, getUserRole } from "../action";
import supabases from "../superbase/superbase";

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const { isLoading, session } = useUser();
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!session) {
        setRoleLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      setRoleLoading(true);
      const role = await getUserRole(session.user.id);
      setRoleLoading(false);

      if (role !== "admin") {
        navigate("/", { replace: true });
      }
    };
    if (!isLoading) {
      checkRole();
    }

    const { data } = supabases.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_OUT" || !authSession) {
        navigate("/login" , {replace: true});
      }
    });

    return () => data.subscription.unsubscribe();
  }, [isLoading, navigate, session]);

  if (isLoading || !session || roleLoading) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="container m-5 mt-7 flex-1 text-slate-800 ml-[140px] lg:ml-[270px]">
        <Outlet />
      </main>
    </div>
  );
};
