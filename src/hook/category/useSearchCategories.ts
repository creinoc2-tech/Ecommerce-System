import { useQuery } from "@tanstack/react-query";
import { searchCategories } from "../../action/category";

export const useSearchCategories = (searchTerm: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", "search", searchTerm],
    queryFn: () => searchCategories(searchTerm),
    enabled: !!searchTerm.trim(),
    retry: false,
  });

  return { categories: data ?? [], isLoading, isError };
};
