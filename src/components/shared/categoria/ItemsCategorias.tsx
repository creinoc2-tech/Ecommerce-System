import type { FC } from "react";
import { NavLink } from "react-router";
import type { ICategory } from "../../../interfaces/category.interface";

interface ItemsCategoriasProps {
  items: ICategory[];
}

export const ItemsCategorias: FC<ItemsCategoriasProps> = ({ items }) => {
  return (
    <div className="flex min-w-max items-center gap-5 sm:gap-6 lg:flex-1 lg:justify-between lg:gap-3">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            `group flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.04em] transition-colors sm:text-[11px] ${
              isActive
                ? "text-violet-800"
                : "text-slate-600 hover:text-violet-700"
            }`
          }
        >
          <span className="text-violet-500 transition-transform group-hover:scale-110">
            {item.icon}
          </span>
          {item.title}
        </NavLink>
      ))}
    </div>
  );
};
