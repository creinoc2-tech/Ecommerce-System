import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../action";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export const useCreateOrders = () => {
     const queryClient = useQueryClient();
     const navigate = useNavigate();
     const {mutate , isPending} = useMutation({
        mutationFn : createOrder ,
        onSuccess : data => {
            queryClient.invalidateQueries( { queryKey : ['orders'] } )
            //navigate(`/checkout/${data.id}/thank-you`);
            navigate(`/checkout/${data.id}/thank-you`);
        } ,
        onError : (error) => {
            console.log(error)
            toast.error(error.message , {
                position : "bottom-right",
            })
        }

     })

     return {mutate , isPending};

}
 