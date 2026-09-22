import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createProduct } from "../../action";
import toast from "react-hot-toast";

export const useCreateProducts = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      navigate("/dashboard/productos");
    },
    onError: (error) => {
      toast.error("Ocurrió un error al crear el producto.");
    },
  });
  return { mutate, isPending };
};
