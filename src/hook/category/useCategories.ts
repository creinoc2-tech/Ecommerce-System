import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../action/category";

export const useCategories = (page: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(page),
  });

  return {
    categories: data?.categories,
    isLoading,
    totalCategories: data?.count ?? 0,
  };
};
