import { useQuery } from "@tanstack/react-query"
import { getUserData } from "../../action"


export const useCustomer = (userId :string) => {
    const { data, isLoading } = useQuery({
        queryKey: ['customer', userId],
        queryFn: () => getUserData(userId),
        enabled: !!userId,
        retry: false,
        refetchOnWindowFocus: true,
        

    })

    return { data, isLoading }
}