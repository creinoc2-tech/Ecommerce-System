import { useMutation, useQueryClient} from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { signUp } from "../../action";
import toast from "react-hot-toast";

export const useRegister = () =>{
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const  { mutate , isPending } = useMutation( {
        mutationFn: signUp,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["user"]})
            toast.success("Revisa tu correo para confirmar la cuenta", {
              position: "bottom-right",
            })
            navigate("/login");
        },
        onError: (error) => {
          toast.error(error.message, {
            position: "bottom-right",
          })
        }
    });

    return { mutate, isPending };
}