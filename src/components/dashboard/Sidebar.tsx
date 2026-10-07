import { useState } from "react";
import { NavLink } from "react-router";
import { dashboardLinks } from "../../constans/links";
import { IoLogOutOutline } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import { signOut } from "../../action";
import { Logo } from "../shared/Logo";

export const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<number[]>([]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      return;
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id],
    );
  };

  return (
    <div
      className="fixed flex h-screen w-[120px] select-none flex-col items-center gap-6 border border-slate-200/80 bg-white p-3.5 text-[#475569] shadow-sm lg:w-[250px] lg:rounded-none"
    >
      <Logo isDashboard={true} />

      <nav className="flex w-full flex-1 flex-col gap-1">
        {dashboardLinks.map((link) => {
          const hasChildren = Boolean(link.children?.length);
          const isOpen = openMenus.includes(link.id);

          if (!hasChildren) {
            return (
              <NavLink
                to={link.href}
                key={link.id}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors lg:justify-start ${
                    isActive
                      ? "bg-[#edf2f7] font-semibold text-[#334155]"
                      : "text-[#475569] hover:bg-slate-50"
                  }`
                }
              >
                <span className="flex w-7 items-center justify-center text-[#596780]">
                  {link.icon}
                </span>
                <p className="hidden flex-1 lg:block">{link.title}</p>
              </NavLink>
            );
          }

          return (
            <div key={link.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleMenu(link.id)}
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors lg:justify-start ${
                  isOpen
                    ? "bg-slate-100/90 font-semibold text-[#334155]"
                    : "text-[#475569] hover:bg-slate-50"
                }`}
              >
                <span className="flex w-7 items-center justify-center text-[#596780]">
                  {link.icon}
                </span>
                <p className="hidden flex-1 text-left lg:block">{link.title}</p>
                <FaChevronDown
                  size={11}
                  className={`hidden text-[#64748b] transition-transform duration-200 lg:block ${
                    isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              <div
                className={`relative overflow-hidden pl-4 transition-all duration-300 ${
                  isOpen ? "max-h-40 pt-1 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <span className="absolute bottom-1.5 left-[22px] top-0 hidden w-px bg-[#d8dde6] lg:block" />
                {link.children?.map((child) => (
                  <NavLink
                    key={child.href}
                    to={child.href}
                    end
                    className={({ isActive }) =>
                      `hidden py-2 pl-7 text-[13.5px] font-normal transition-colors lg:block ${
                        isActive
                          ? "text-[#1976d2]"
                          : "text-[#475569] hover:text-[#1976d2]"
                      }`
                    }
                  >
                    {child.title}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="relative mt-4 flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#bcd8ff] shadow-inner">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#5794fc]" />
        <div className="pointer-events-none absolute left-3.5 top-5 h-7 w-7 rounded-full bg-[#5b97fd]" />
        <button
          className="relative z-10 flex items-center gap-2 rounded-lg bg-[#1677df] px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#1265c0] hover:shadow-lg active:scale-95"
          onClick={() => handleLogout()}
        >
          <IoLogOutOutline size={16} className="inline-block" />
          <span className="hidden lg:block">LOGOUT</span>
        </button>
      </div>
    </div>
  );
};
