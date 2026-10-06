import { useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link } from "react-router";
import { useCategories } from "../../../hook/category/useCategories";
import { formatDateShort } from "../../../helpers";
import { Pagination } from "../../shared/Pagination";
import { useDeleteCategory } from "../../../hook/category/useDeleteCategory";
import { CellTableCategory } from "./CellTableCategory";
import { useUpdateCategoryStatus } from "../../../hook/category/useUpdateCategoryStatus";

const tableHeaders = [
  "Imagen",
  "Nombre",
  "Activar",
  "Fecha de creación",
  "Action",
];

const statusOptions = [
  { value: "Active", label: "Activo" },
  { value: "Inactive", label: "Inactivo" },
];

export const TableCategoria = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: string;
  }>({});

  const [page, setPage] = useState(1);
  const { categories, totalCategories } = useCategories(page);
  const { mutate: updateCategoryStatus } = useUpdateCategoryStatus();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    setOpenMenuId(null);
  };
  const handleMenuToggle = (index: number) => {
    if (openMenuId === index) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(index);
    }
  };

  const handleStatusChanges = (id: string, is_active: boolean) => {
    updateCategoryStatus({ id, is_active });
  };

  const handleStatusChange = (categoryId: string, status: string) => {
    setSelectedStatus({
      ...selectedStatus,
      [categoryId]: status,
    });
  };

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-[0_3px_12px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)]"
    >
      <h1 className="px-6 pt-5 font-bold text-xl">Categorías</h1>

      <p className="text-sm mt-1 mb-5 px-6 font-regular text-gray-500">
        Gestiona tus categorías y mira las estadísticas de tus ventas.
      </p>

      <div className="relative w-full h-full overflow-hidden">
        <table className="w-full border-collapse text-left text-[14px] text-gray-700">
          <thead>
            <tr className="select-none bg-[#1972f5] text-[13px] font-bold tracking-wider text-white">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`py-3 px-6 text-left uppercase ${
                    index < tableHeaders.length - 1
                      ? "border-r border-blue-400/20"
                      : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories?.map((category, index) => {
              const selectedStatusValue =
                selectedStatus[category.id] || "Active";

              return (
                <tr key={index} className="transition-colors hover:bg-slate-50/50">
                  <td className="border-r border-gray-100 px-6 py-3.5 align-middle sm:table-cell">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200/90 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                      <img
                        src={
                          category?.images?.[0] ??
                          (Array.isArray(category?.image_url)
                            ? category.image_url[0]
                            : category?.image_url)
                        }
                        alt="Imagen de la categoría"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full rounded-md object-contain"
                      />
                    </div>
                  </td>

                  <CellTableCategory content={category.name} />

                  <td className="border-r border-gray-100 px-6 py-3.5 font-medium tracking-tighter text-gray-700">
                    <select
                      className="w-full rounded-md border border-gray-300 p-1"
                      onChange={(e) => {
                        handleStatusChange(category.id, e.target.value);
                        handleStatusChanges(
                          category.id,
                          e.target.value === "Active",
                        );
                      }}
                      value={selectedStatusValue}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <CellTableCategory
                    content={formatDateShort(category?.created_at)}
                  />

                  <td className="relative px-6 py-3.5">
                    <button
                      className="text-slate-900"
                      onClick={() => handleMenuToggle(index)}
                    >
                      <FaEllipsis />
                    </button>
                    {openMenuId === index && (
                      <div
                        className="absolute right-6 z-10 mt-2 w-[120px] rounded-md border border-gray-200 bg-white shadow-xl"
                        role="menu "
                      >
                        <Link
                          to={`/dashboard/categorias/edit/${category.slug}`}
                          className="flex w-full items-center gap-1 px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Editar
                          <HiOutlineExternalLink
                            size={16}
                            className="inline-block "
                          />
                        </Link>

                        <button
                          className="block w-full px-4 py-2 text-left text-xs font-medium text-red-700 hover:bg-gray-100"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination totalItems={totalCategories} page={page} setPage={setPage} />
    </div>
  );
};
