import { useQuery } from "@tanstack/react-query";
import { getRecentCategories } from "../../action/category";

export const useRecentCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", "recent"],
    queryFn: getRecentCategories,
    staleTime: 1000 * 60 * 5,
  });

  return { categories: data ?? [], isLoading, isError };
};
