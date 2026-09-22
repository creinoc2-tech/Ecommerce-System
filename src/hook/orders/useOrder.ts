import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderById } from "../../action";

export const useOrder = (orderId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    retry: false,
  });
  return { data, isLoading, isError };
};
