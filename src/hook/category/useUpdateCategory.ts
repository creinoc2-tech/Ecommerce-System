import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { updateCategory, type CategoryInput } from "../../action/category";

export const useUpdateCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (categoryData: CategoryInput) =>
      updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría actualizada correctamente.", {
        position: "bottom-right",
      });
      navigate("/dashboard/categorias");
    },
    onError: () => {
      toast.error("Ocurrió un error al actualizar la categoría.", {
        position: "bottom-right",
      });
    },
  });

  return { mutate, isPending };
};
