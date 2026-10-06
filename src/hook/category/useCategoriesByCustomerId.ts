import { useQuery } from "@tanstack/react-query";
import { getCategoriesByCustomerId } from "../../action/category";

export const useCategoriesByCustomerId = () => {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories", "by-customer"],
    queryFn: getCategoriesByCustomerId,
    retry: false,
  });

  return { categories, isLoading, isError };
};
