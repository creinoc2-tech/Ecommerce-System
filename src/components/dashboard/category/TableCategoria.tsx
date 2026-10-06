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
      className="flex flex-col flex-1 border border-gray-200 
    rounded-lg p-5 bg-white"
    >
      <h1 className="font-bold text-xl">Categorías</h1>

      <p className="text-sm mt-1 mb-8 font-regular text-gray-500">
        Gestiona tus categorías y mira las estadísticas de tus ventas.
      </p>

      <div className="relative w-full h-full">
        <table className="text-sm w-full caption-bottom overflow-auto">
          <thead className="border-b border-gray-200 pb-3">
            <tr className="text-sm font-bold">
              {tableHeaders.map((header, index) => (
                <th key={index} className="h-12 px-4 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories?.map((category, index) => {
              const selectedStatusValue =
                selectedStatus[category.id] || "Active";

              return (
                <tr key={index}>
                  <td className="p-4 align-middle sm:table-cell">
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
                      className="w-16 h-16 aspect-square rounded-md object-contain"
                    />
                  </td>

                  <CellTableCategory content={category.name} />

                  <td className="p-4 tracking-tighter">
                    <select
                      className="border border-gray-300 rounded-md p-1 w-full"
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

                  <td className="relative ">
                    <button
                      className="text-slate-900"
                      onClick={() => handleMenuToggle(index)}
                    >
                      <FaEllipsis />
                    </button>
                    {openMenuId === index && (
                      <div
                        className="absolute right-0 mt-2 bg-white border border-gray-200
                                 rounded-md shadow-xl z-10 w-[120px]"
                        role="menu "
                      >
                        <Link
                          to={`/dashboard/categorias/edit/${category.slug}`}
                          className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium
                                    text-gray-700 hover:bg-gray-100 "
                        >
                          Editar
                          <HiOutlineExternalLink
                            size={16}
                            className="inline-block "
                          />
                        </Link>

                        <button
                          className="block w-full text-left px-4 py-2 text-xs font-medium 
                                    text-red-700 hover:bg-gray-100 "
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
