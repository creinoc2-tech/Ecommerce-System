import { useMutation, useQueryClient } from "@tanstack/react-query";
 import toast from "react-hot-toast";
import { deleteProduct } from "../../action";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

     const {mutate , isPending} = useMutation({
        mutationFn : deleteProduct ,
           onSuccess : () => {
           queryClient.invalidateQueries({
            queryKey : ['products'] 
           }) 
           toast.success('Producto eliminado correctamente.',{
                position: 'bottom-right'
            });
        } ,
        onError : (error) =>{
            toast.error('Ocurrió un error al eliminar el producto.',{
                position: 'bottom-right'
            });
        }

 
       
    });

    return { mutate, isPending };
}