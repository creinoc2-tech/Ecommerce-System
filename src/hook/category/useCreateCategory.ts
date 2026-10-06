import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { createCategory } from "../../action/category";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría creada correctamente.", {
        position: "bottom-right",
      });
      navigate("/dashboard/categorias");
    },
    onError: () => {
      toast.error("Ocurrió un error al crear la categoría.", {
        position: "bottom-right",
      });
    },
  });

  return { mutate, isPending };
};
