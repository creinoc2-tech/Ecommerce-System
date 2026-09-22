import { useQuery } from "@tanstack/react-query";
import { getFilteredProducts } from "../../action";


export const useFilteredProducts= ({ page, brands } : {
    page: number;
    brands: string[];
}) => {
      const {data , isLoading } = useQuery({
        queryKey: ['filtered-products', { page, brands }],
        queryFn: () => getFilteredProducts({ page, brands }),
        retry: false,
    })

    return { products : data?.data,
             isLoading ,
            totalCount : data?.count ?? 0
        };
}