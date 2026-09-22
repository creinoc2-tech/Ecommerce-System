import { useState } from "react"
import { FaEllipsis } from "react-icons/fa6"
import { HiOutlineExternalLink } from "react-icons/hi"
import { Link } from "react-router"
import { useProduct } from "../../../hook"
import { Loader } from "../../shared/Loader"
import { formatDateLong, formatDateShort, formatPrice } from "../../../helpers"
import { Pagination } from "../../shared/Pagination"
import { CellTableProduct } from "./CellTableProduct"
import { useDeleteProduct } from "../../../hook/products/UseDelecteProduct"

const tableHeaders =[
    "",
    "Nombre" ,
     "Variantes",
    "Precio",
    "Stock",
    "Fecha de creación",
    ""
]

export const TableProduct = () => {
     const [openMenuId, setOpenMenuId] = useState<number | null>(null)

     const [selectedVariant, setSelectedVariant] = useState<{[key: string]: number}>({});

     const [page, setPage] = useState(1);
     const { products, isLoading, totalProducts } = useProduct({ page });

     const { mutate: deleteProduct } = useDeleteProduct();

    const handleDeleteProduct = (productId: string) => {
     deleteProduct(productId);
     setOpenMenuId(null);
    } 
    const handleMenuToggle = (index: number) => {
        if (openMenuId === index) {
            setOpenMenuId(null);
        } else {
            setOpenMenuId(index);
        }
     }

     const handleVariantChange = (productId: string, variantIndex: number) => {
        setSelectedVariant({
            ...selectedVariant,
            [productId]: variantIndex
        })
     }

    
   
     //if(!products || isLoading || totalProducts ) return  <Loader />;

  return (

    <div className='flex flex-col flex-1 border border-gray-200 
    rounded-lg p-5 bg-white'>
     <h1 className='font-bold text-xl'>
        Productos 
     </h1>

     <p className='text-sm mt-1 mb-8 font-regular text-gray-500'>
        Gestiona tus productos y mira las estadísticas de tus ventas.
     </p>

     <div className="relative w-full h-full">
        <table className='text-sm w-full caption-bottom overflow-auto'>
            <thead className="border-b border-gray-200 pb-3">
                <tr className="text-sm font-bold">
                    {
                        tableHeaders.map(  (header, index) => (
                            <th key={index} className='h-12 px-4 text-left'>
                                { header }
                            </th>
                        ))}

                </tr>
            </thead>
             <tbody>
                {
                    products?.map((product , index) =>  {
                   const selectedVariantIndex = selectedVariant[product.id] || 0;
                    const variant = product.variants[selectedVariantIndex] || {};


                        return (
                             <tr key={index}>
                     <td className="p-4 align-middle sm:table-cell">
                        <img src={ product?.images[0] } 
                        alt="Imagen del producto"
                        loading="lazy"
                        decoding="async"
                        className="w-16 h-16 aspect-square rounded-md object-contain"
                        />
                        
                    </td>

                     <CellTableProduct content={product.name } />
                       
                       <td className="p-4 tracking-tighter">
                        <select className="border border-gray-300 rounded-md p-1 w-full"
                         onChange={e => handleVariantChange( product.id , Number(e.target.value))}
                            value={ selectedVariantIndex }
                        >
                            {
                                product.variants.map( (variant : any, index : number) => (
                                    <option key={variant.id} value={index}>
                                        { variant.color_name } - { variant.storage }
                                    </option>
                                ) )
                            }
                        </select>
                       </td >

                     <CellTableProduct content={ formatPrice( variant?.price ) } />
                     <CellTableProduct content={( variant?.stock || 0).toString() } />
                     <CellTableProduct content={ formatDateShort(product?.created_at) } />

                    <td className="relative ">
                          <button className="text-slate-900"
                            onClick={ () => handleMenuToggle( index )}
                          >
                            <FaEllipsis />
                          </button>
                          {
                            openMenuId === index && (
                                <div className="absolute right-0 mt-2 bg-white border border-gray-200
                                 rounded-md shadow-xl z-10 w-[120px]"
                                  role="menu ">
                                    <Link to={`/dashboard/productos/edit/${product.slug}`}
                                    className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium
                                    text-gray-700 hover:bg-gray-100 ">
                                     Editar
                                     <HiOutlineExternalLink 
                                     size={16} 
                                     className="inline-block "/>

                                    </Link>

                                    <button className="block w-full text-left px-4 py-2 text-xs font-medium 
                                    text-red-700 hover:bg-gray-100 " onClick={() => handleDeleteProduct(product.id)}>
                                        Eliminar 
                                    </button>
                                </div>
                            )
                          }
                    </td>
                              </tr>
                        ) 
                    })
                }
             </tbody>

        </table>
     </div>
       <Pagination
        totalItems={totalProducts}
        page={page}
        setPage={setPage}
       />

    </div>
  )
}
