import type { FC } from "react";
import { formatPrice } from "../../helpers";
import { useCounterStore } from "../../store/counter.state";
import { LuMinus, LuPlus } from "react-icons/lu";
import { useCartStore } from "../../store/cart.store";

export interface ICarrtItem {
    variantId: string;
    productId: string;
    name : string ;
    color : string ;
    storage : string ;
    price : number ;
    quantity : number ;
    image : string ;
}

interface Props {
    items: ICarrtItem;
}
export const CartItems : FC<Props> = ({ items }) => {
    const removeItem = useCartStore(state => state.removeItem)
    const updateQuantity = useCartStore(state => state.updateQuantity)

   const increment =() => {
     updateQuantity(items.variantId, items.quantity + 1)
   }

    const decrement = () => {
       if(items.quantity > 1){
          updateQuantity(items.variantId, items.quantity - 1)
       }
    }
  return (
    <li className="flex justify-between items-center gap-5">
        <div>
            <img src={items.image}
             alt={items.name} 
             className="w-20 h-20 object-cover " />
        </div>

        <div className="flex-1 space-y-3">
            <div className="flex justify-between">
                <p className="font-semibold">{items.name}</p>
                <p className=" text-sm font-medium text-gray-600 mt-1">
                {formatPrice(items.price)}
                </p>
            </div>

            <div className="flex gap-3">
                <p className="text-[13px] text-gray-600">
                    {items.color} - {items.storage}
                </p>
            </div>

            <div className="flex gap-4">
                <div className="flex items-center gap-5 px-2 py-1 border
                    border-slate-300 rounded-full">
                             <button
                                onClick={decrement}
                                disabled={items.quantity == 1}
                            >
                                <LuMinus size={15} />
                           </button>
                            <span className='text-slate-500 text-sm'>
                                {items.quantity}</span>
                            <button
                                onClick={increment}
                            >
                                <LuPlus size={15} />
                            </button>
                      </div>
                      <button className="underline font-medium text-[10px]"
                      onClick={() => removeItem(items.variantId)}
                      >
                        Eliminar 
                      </button>
            </div>



        </div>

    </li>
  )
}
