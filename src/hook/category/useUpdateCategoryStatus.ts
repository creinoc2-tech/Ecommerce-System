import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCategoryStatus } from "../../action/category";

export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateCategoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Estado de la categoría actualizado correctamente.", {
        position: "bottom-right",
      });
    },
    onError: () => {
      toast.error("Ocurrió un error al actualizar el estado de la categoría.", {
        position: "bottom-right",
      });
    },
  });

  return { mutate, isPending };
};
