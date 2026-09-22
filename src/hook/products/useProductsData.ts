import { useQuery } from "@tanstack/react-query"
import { getProductBySlug } from "../../action"

export const useProductsData = (slug : string) => {
  const {data: product ,isLoading , isError } = useQuery({
    queryKey: ['products', slug],
    queryFn: () => getProductBySlug(slug),
     retry : false,
  })

  return {product, isLoading, isError}
}
