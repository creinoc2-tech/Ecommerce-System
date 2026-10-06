import { useQuery } from "@tanstack/react-query";
import { getFilteredCategories } from "../../action/category";

export const useFilteredCategories = ({
  page,
  isActive,
}: {
  page: number;
  isActive?: boolean;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", "filtered", { page, isActive }],
    queryFn: () => getFilteredCategories({ page, isActive }),
    retry: false,
  });

  return {
    categories: data?.data,
    isLoading,
    totalCategories: data?.count ?? 0,
  };
};
