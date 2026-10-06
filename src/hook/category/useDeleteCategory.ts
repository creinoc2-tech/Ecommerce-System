import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCategory } from "../../action/category";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada correctamente.", {
        position: "bottom-right",
      });
    },
    onError: () => {
      toast.error("Ocurrió un error al eliminar la categoría.", {
        position: "bottom-right",
      });
    },
  });

  return { mutate, isPending };
};
