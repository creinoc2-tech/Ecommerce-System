import { Outlet } from "react-router";
import { Sidebar } from "../components/dashboard";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="container m-5 mt-7 flex-1 text-slate-800 ml-[96px] lg:ml-[308px]">
        <Outlet />
      </main>
    </div>
  );
};
