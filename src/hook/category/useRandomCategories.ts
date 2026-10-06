import { useQuery } from "@tanstack/react-query";
import { getRandomCategories } from "../../action/category";

export const useRandomCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", "random"],
    queryFn: getRandomCategories,
    staleTime: 1000 * 60 * 5,
  });

  return { categories: data ?? [], isLoading, isError };
};
