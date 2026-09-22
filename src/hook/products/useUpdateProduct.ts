import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { updateProduct } from "../../action";
import type { ProductInput } from "../../interfaces";
import toast from "react-hot-toast";

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProductInput) => updateProduct(productId, data),
    onSuccess: () => {
      
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success(" El producto actualizado correctamente.", {
        position: "bottom-right",
      });
      navigate("/dashboard/productos");
    },

    onError: (error) => {
      console.log(error);
      toast.error("Ocurrió un error al actualizar el producto.", {
        position: "bottom-right",
      });
    },
  });

  return { mutate, isPending };
};
