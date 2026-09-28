import { FeatureGrid } from '../components/home/FeatureGrid'
import { ProductGrid } from '../components/home/ProductGrid'
import { Brands } from '../components/home/Brands'
import { prepareProducts } from '../helpers'
import { useHomeProducts } from '../hook/products/useHomeProducts'
import { ProductGridSkeletons } from '../components/skeletons/ProductGridSkeletons'

export const HomePage = () => {
   const { recentProducts, popularProducts, isLoading } = useHomeProducts();

   const preparedProducts = prepareProducts(recentProducts);
   const preparedPopularProducts = prepareProducts(popularProducts);

  return (
     <div>
       <FeatureGrid />
       {isLoading ? (
         <ProductGridSkeletons numberOfProducts={4} />
       ) : (
         <ProductGrid title="Nuevos productos" products={preparedProducts} />
       )}
       {isLoading ? (
         <ProductGridSkeletons numberOfProducts={4} />
       ) : (
         <ProductGrid title="Productos destacados" products={preparedPopularProducts} />
       )}
       <Brands />
     </div>
  )
}
