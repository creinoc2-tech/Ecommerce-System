import { useQueries, useQuery } from "@tanstack/react-query";
import { getRandomProducts, getRecentProducts } from "../../action";

export const useHomeProducts = () => {
    const results = useQueries({
        queries :[
            {
                queryKey: ['recentproducts'],
                queryFn: () => getRecentProducts(),
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
            {
                queryKey: ['popularproducts'],
                queryFn: () => getRandomProducts(),
                staleTime: 1000 * 60 * 5, // 5 minutes
            }
        ]

    })

    const [recentProductsQuery, popularProductsQuery] = results;

    const isLoading = recentProductsQuery.isLoading || popularProductsQuery.isLoading;
    const isError = recentProductsQuery.isError || popularProductsQuery.isError;

    return {
        isLoading,
        isError,
        recentProducts: recentProductsQuery?.data || [],
        popularProducts: popularProductsQuery?.data || [],
    }
}