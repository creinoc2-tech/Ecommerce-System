import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { signOut } from "../../action";

type SubItem = {
  title: string;
  href: string;
};

type MenuItem = {
  id: string;
  title: string;
  href?: string;
  children?: SubItem[];
};

const menuItems: MenuItem[] = [
  { id: "dashboard", title: "Dashboard", href: "/dashboard" },
  { id: "banner-slides", title: "Home Banner Slides" },
  {
    id: "category",
    title: "Category",
    children: [
      { title: "Category List", href: "/dashboard/categorias" },
      { title: "Add Category", href: "/dashboard/categorias/new" },
    ],
  },
  {
    id: "products",
    title: "Products",
    children: [
      { title: "Product List", href: "/dashboard/productos" },
      { title: "Product Upload", href: "/dashboard/productos/new" },
      { title: "Add Product RAMS", href: "#" },
      { title: "Add Product WEIGHT", href: "#" },
      { title: "Add Product SIZE", href: "#" },
    ],
  },
  { id: "orders", title: "Orders", href: "/dashboard/ordenes" },
  { id: "home-banners", title: "Home Banners" },
  { id: "side-banners", title: "Home Side Banners" },
  { id: "bottom-banners", title: "Home Bottom Banners" },
];

const GridIcon = () => (
  <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
    <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
  </svg>
);

const BannerIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <rect height="13" rx="2" width="20" x="2" y="3" />
    <circle cx="7" cy="8" fill="currentColor" r="1.5" />
    <path d="M18 13l-4.5-4.5L6 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20h12" strokeDasharray="2 2" strokeLinecap="round" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
    <rect height="7" rx="1.5" width="7" x="3" y="3" />
    <rect height="7" rx="1.5" width="7" x="14" y="3" />
    <rect height="7" rx="1.5" width="7" x="3" y="14" />
    <rect height="7" rx="1.5" width="7" x="14" y="14" />
  </svg>
);

const ProductIcon = () => (
  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1976d2] text-[12px] font-bold leading-none text-white">
    P
  </span>
);

const OrdersIcon = () => (
  <span className="flex h-[19px] w-[19px] items-center justify-center rounded-md bg-[#0265dc] text-white shadow-sm">
    <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

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

const icons: Record<string, ReactNode> = {
  dashboard: <GridIcon />,
  "banner-slides": <BannerIcon />,
  category: <CategoryIcon />,
  products: <ProductIcon />,
  orders: <OrdersIcon />,
  "home-banners": <BannerIcon />,
  "side-banners": <BannerIcon />,
  "bottom-banners": <BannerIcon />,
};

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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    products: location.pathname.startsWith("/dashboard/productos"),
    category: location.pathname.startsWith("/dashboard/categorias"),
  });

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
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
        {menuItems.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const isOpen = Boolean(openMenus[item.id]);
          const childActive = item.children?.some((child) =>
            isPathActive(location.pathname, child.href),
          );
          const active = isPathActive(location.pathname, item.href) || Boolean(childActive);

          if (hasChildren) {
            return (
              <div key={item.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.id)}
                  className={`${itemBase} group focus:outline-none ${
                    isOpen || active ? "bg-slate-100/90 text-[#3b4b66]" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="flex w-7 items-center justify-start text-[#596780]">
                    {icons[item.id]}
                  </span>
                  <span
                    className={`hidden flex-1 text-left lg:block ${
                      isOpen || active ? "font-semibold text-[#334155]" : ""
                    }`}
                  >
                    {item.title}
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
                  {item.children?.map((child) =>
                    child.href === "#" ? (
                      <span
                        key={child.title}
                        className="hidden py-2 pl-7 text-[13.5px] font-normal text-[#475569] lg:block"
                      >
                        {child.title}
                      </span>
                    ) : (
                      <NavLink
                        key={child.title}
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
                    ),
                  )}
                </div>
              </div>
            );
          }

          if (item.href) {
            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={item.href === "/dashboard"}
                className={() =>
                  `${itemBase} group ${
                    active ? "bg-[#edf2f7] text-[#334155]" : "hover:bg-slate-50"
                  }`
                }
              >
                <span className="flex w-7 items-center justify-start text-[#596780]">
                  {icons[item.id]}
                </span>
                <span
                  className={`hidden flex-1 lg:block ${active ? "font-semibold text-[#334155]" : ""}`}
                >
                  {item.title}
                </span>
              </NavLink>
            );
          }

          return (
            <div key={item.id} className={`${itemBase} cursor-default group hover:bg-slate-50`}>
              <span className="flex w-7 items-center justify-start text-[#596780]">
                {icons[item.id]}
              </span>
              <span className="hidden flex-1 lg:block">{item.title}</span>
              <span className="hidden lg:block">
                <ChevronIcon open={false} />
              </span>
            </div>
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
