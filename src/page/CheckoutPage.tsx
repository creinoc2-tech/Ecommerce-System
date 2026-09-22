import { Link, useNavigate } from "react-router"
import { useGlobalStore } from "../store/global.state"
import { useCartStore } from "../store/cart.store"
import { FormCheckout } from "../components/checkout/FormCheckout"
import { ItemsCheckout } from "../components/checkout/ItemsCheckout"
import { useUser } from "../hook"
import { useEffect } from "react"
import supabases from "../superbase/superbase"
import { Loader } from "../components/shared/Loader"

export const CheckoutPage = () => {
    const  totalItems = useCartStore(state => state.totalItemsInCart)
    const  {isLoading} = useUser()
    const navigate = useNavigate()

    useEffect(()=>{
        supabases.auth.onAuthStateChange((event , session) => {
             if(event === 'SIGNED_OUT'  || !session  ) {
                 navigate('/login')
             }
        })
    } , [navigate])

     if(isLoading) return <Loader />

  return (
    <div
     style={{
        minHeight : "calc(100vh - 100px)"
     }}>
        <header className="h-[100px] bg-white text-black  flex items-center justify-center
         flex-col px-10 border-b border-slate-200">
            <Link to="/"
            className="text-4xl font-bold self-center tracking-tighter transition-all 
             md:text-5xl md:self-start ">
               <p>
                 Productos
                 <span className="text-cyan-600"> en oferta</span>
               </p>
            </Link>

        </header>

        <main className="w-full h-full flex relative">
            {
                totalItems == 0 ? (
                    <div className="flex flex-col items-center justify-center
                    gap-5 w-full"

                    style={{ height : "calc(100vh - 100px)" }}>

                       <p className='text-sm font-medium tracking-tight'>
                           Tu carrito está vacío
                       </p>
                       <Link to={"/products"}
                           className='py-4 bg-black rounded-full text-white px-7
                            uppercase text-xs font-semibold  tracking-widest'>
                       
                           Ir a la tienda
                       </Link>
                    </div>

                ) :(
                    <>
                    <div className="w-full md:w-[50%] p-10">
                        <FormCheckout />
                    </div>

                    <div className="bg-stone-100 w-[50%] sticky top-0 
                     right-0 p-10 hidden md:block"
                      style={{ minHeight : "calc(100vh - 100px)" }}
                     >
                        <ItemsCheckout />

                    </div>

                    </>

                )
            }

        </main>


    </div>
  )
}
