import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import { FaHouse } from "react-icons/fa6";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: ReactNode;
}

export interface PageHeaderAction {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: PageHeaderAction;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  action,
}) => {
  return (
    <header className="flex w-full flex-col items-center justify-between gap-4 rounded-xl border border-[#E9ECEF] bg-white px-6 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] sm:flex-row">
      <div className="flex items-center">
        <h1 className="text-[20px] font-semibold leading-none tracking-tight text-[#1e293b]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#4b5563]">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const content = (
                <>
                  {item.icon ??
                    (index === 0 ? (
                      <FaHouse className="text-[11px] text-[#4b5563]" />
                    ) : null)}
                  <span>{item.label}</span>
                </>
              );

              return (
                <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span className="select-none px-0.5 font-normal text-[#9ca3af]">/</span>
                  )}
                  {item.to && !isLast ? (
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1.5 font-medium text-[#374151] transition-colors duration-150 hover:bg-[#e5e7eb]"
                    >
                      {content}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1.5 font-medium text-[#4b5563]">
                      {content}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {action &&
          (action.to ? (
            <Link
              to={action.to}
              className="ml-1 inline-flex items-center justify-center rounded-lg bg-[#0066ff] px-4 py-2 text-[14px] font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#0052cc] active:bg-[#0047b3] focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:ring-offset-2"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="ml-1 inline-flex items-center justify-center rounded-lg bg-[#0066ff] px-4 py-2 text-[14px] font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#0052cc] active:bg-[#0047b3] focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:ring-offset-2"
            >
              {action.label}
            </button>
          ))}
      </div>
    </header>
  );
};
