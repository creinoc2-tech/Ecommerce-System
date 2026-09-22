import { IoAddCircleOutline } from "react-icons/io5"
import { Link } from "react-router"
import { TableProduct } from "../../components/dashboard/products/TableProduct"


export const DashboardProductsPage = () => {
  return (
     <div className="h-full flex flex-col gap-2">
        <Link to={"/dashboard/productos/new"}
        className="bg-black text-white flex items-center self-end py-[10px] px-3 rounded-md
         text-sm gap-1 font-semibold ">
          <IoAddCircleOutline className="inline-block"/>
           Nuevo Producto
        </Link>

          <TableProduct />
     </div>
  )
}
