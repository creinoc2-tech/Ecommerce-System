import React from 'react'
import { FeatureGrid } from '../components/home/FeatureGrid'
import { ProductGrid } from '../components/home/ProductGrid'
import { Brands } from '../components/home/Brands'
import { allCelulares, popularCelulares, recentCelulares } from '../data/initialData'
import { prepareProducts } from '../helpers'
import { useProduct } from '../hook'
import { useHomeProducts } from '../hook/products/useHomeProducts'
import { ProductGridSkeletons } from '../components/skeletons/ProductGridSkeletons'
import SwiperComponent from '../components/shared/Swipper'

export const HomePage = () => {
   const { recentProducts, popularProducts, isLoading, isError } = useHomeProducts();

   const preparedProducts = prepareProducts(recentProducts);
   const preparedPopularProducts = prepareProducts(popularProducts);

  return (
     <div>
       <FeatureGrid />

       {
          isLoading ? (
            <ProductGridSkeletons numberOfProducts={4} />
          ) :(
             <ProductGrid title="Nuevos Productos" products={preparedProducts} />
          )
       }
       {
         isLoading ? (
           <ProductGridSkeletons numberOfProducts={4} />
         ) :(
           <ProductGrid title="Productos Destacados" products={preparedPopularProducts} />
         )
       }
      


       <Brands />

     </div>
  )
}
