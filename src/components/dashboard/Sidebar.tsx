import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { dashboardLinks } from "../../constans/links";
import { signOut } from "../../action";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`h-3 w-3 text-[#64748b] transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    viewBox="0 0 24 24"
  >
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const itemBase =
  "flex w-full items-center rounded-xl px-3 py-2.5 text-[15px] font-medium text-[#475569] transition-colors";

const isPathActive = (pathname: string, href?: string) => {
  if (!href || href === "#") return false;
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<number[]>(() =>
    dashboardLinks
      .filter((link) =>
        link.children?.some((child) => isPathActive(location.pathname, child.href)),
      )
      .map((link) => link.id),
  );

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id],
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      return;
    }
  };

  return (
    <aside className="fixed bottom-3 left-3 top-3 z-30 flex w-[72px] select-none flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm lg:w-[280px] lg:p-3.5">
      <nav
        aria-label="Main Navigation"
        className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto"
      >
        {dashboardLinks.map((link) => {
          const hasChildren = Boolean(link.children?.length);
          const isOpen = openMenus.includes(link.id);
          const childActive = link.children?.some((child) =>
            isPathActive(location.pathname, child.href),
          );
          const active = isPathActive(location.pathname, link.href) || Boolean(childActive);

          if (hasChildren) {
            return (
              <div key={link.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleMenu(link.id)}
                  className={`${itemBase} group focus:outline-none ${
                    isOpen || active ? "bg-slate-100/90 text-[#3b4b66]" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="flex w-7 items-center justify-start text-[#596780]">
                    {link.icon as ReactNode}
                  </span>
                  <span
                    className={`hidden flex-1 text-left lg:block ${
                      isOpen || active ? "font-semibold text-[#334155]" : ""
                    }`}
                  >
                    {link.title}
                  </span>
                  <span className="hidden lg:block">
                    <ChevronIcon open={isOpen} />
                  </span>
                </button>
                <div
                  className={`submenu-tree flex flex-col overflow-hidden pl-4 transition-all duration-300 ${
                    isOpen ? "max-h-80 pt-1 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {link.children?.map((child) => (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      end
                      className={({ isActive }) =>
                        `hidden py-2 pl-7 text-[13.5px] font-normal transition-colors lg:block ${
                          isActive
                            ? "font-medium text-[#1976d2]"
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
          }

          return (
            <NavLink
              key={link.id}
              to={link.href}
              className={() =>
                `${itemBase} group ${
                  active ? "bg-[#edf2f7] text-[#334155]" : "hover:bg-slate-50"
                }`
              }
            >
              <span className="flex w-7 items-center justify-start text-[#596780]">
                {link.icon as ReactNode}
              </span>
              <span
                className={`hidden flex-1 lg:block ${active ? "font-semibold text-[#334155]" : ""}`}
              >
                {link.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="relative mt-4 flex h-20 items-center justify-center overflow-hidden rounded-2xl bg-[#bcd8ff] shadow-inner lg:h-36">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#5794fc]" />
        <div className="pointer-events-none absolute left-3.5 top-5 h-7 w-7 rounded-full bg-[#5b97fd]" />
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="relative z-10 flex items-center gap-2 rounded-lg bg-[#1677df] px-3 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#1265c0] hover:shadow-lg active:scale-95 lg:px-5"
        >
          <LogoutIcon />
          <span className="hidden lg:inline">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
};
