import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../action'

export const useProduct = ({page = 1} : {page?: number}) => {
    const { data, isLoading } = useQuery({
        queryKey: ['products', page],
        queryFn: () => getProducts(page),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return {  products : data?.products, isLoading ,
         totalProducts : data?.count  ?? 0 }
}
