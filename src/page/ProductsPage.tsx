import React, { useEffect, useState } from 'react'
import { prepareProducts } from '../helpers'
import { allCelulares } from '../data/initialData';
import { CardProduct } from '../components/products/CardProduct';
import { ContainerFilter } from '../components/products/ContainerFilter';
import { useProduct } from '../hook';
import { useFilteredProducts } from '../hook/products/useFilteredProducts';
import { Pagination } from '../components/shared/Pagination';

export const ProductsPage = () => {
   
    const [page, setPage] = useState(1);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const { products =[], isLoading , totalCount } = useFilteredProducts({
        page,
        brands: selectedBrands
    });


  const preparedProducts = prepareProducts(products);
  return (
    <>
    <h1 className='text-5xl font-semibold text-center mb-12'>
      Productos
    </h1>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3
     xl:grid-cols-5">

      <ContainerFilter 
      selectedBrands={selectedBrands} 
      setSelectedBrands={setSelectedBrands} />

      
      {
        isLoading ? (
          <div className="col-span-2 flex items-center justify-center h-[500px]">
            <p className='text-2xl'>Cargando.....</p>

          </div>
         ):(
           <div  className='col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12'>
              <div className='grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4'
              
              >
           {
            preparedProducts.map( (product) => (
              <CardProduct
               key={product.id}
               img={product.images[0]}
               name={product.name}
                price={product.price}
                slug={product.slug}
                colors={product.colors}
                variants={product.variants}
                              
              />           
            ) ) }

        </div>
        <Pagination
          totalItems={totalCount}
          page={page}
          setPage={setPage}
        />
          </div>
         )

      }

      
    </div>

    </>
  )
}
