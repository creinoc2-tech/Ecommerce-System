import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug } from "../../action/category";

export const useCategoryBySlug = (slug: string) => {
  const { data: category, isLoading, isError } = useQuery({
    queryKey: ["categories", slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
    retry: false,
  });

  return { category, isLoading, isError };
};
