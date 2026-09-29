import { useState, type FC } from "react";
import { NavLink } from "react-router";
import { FaBarsStaggered, FaChevronDown } from "react-icons/fa6";
import type { ICategory } from "../../../interfaces/category.interface";

interface CategoriaProps {
  items: ICategory[];
}

export const Categoria: FC<CategoriaProps> = ({ items }) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-expanded={isCategoryMenuOpen}
        onClick={() => setIsCategoryMenuOpen((isOpen) => !isOpen)}
        className="flex h-9 items-center gap-2 rounded-full bg-violet-700 px-4 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-violet-800 sm:text-[11px]"
      >
        <FaBarsStaggered size={13} />
        Todas las categorias
        <FaChevronDown
          size={11}
          className={`transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isCategoryMenuOpen && (
        <div className="absolute left-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsCategoryMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-50 text-violet-800"
                    : "text-slate-700 hover:bg-violet-50 hover:text-violet-800"
                }`
              }
            >
              <span className="text-violet-600">{item.icon}</span>
              {item.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
