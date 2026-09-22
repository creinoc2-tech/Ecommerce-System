import React from 'react'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { useGlobalStore } from '../../store/global.state'
import { IoMdClose } from 'react-icons/io'
import { Link } from 'react-router'
import { RiSecurePaymentLine } from 'react-icons/ri'
import { CartItems } from './Cart.items'
import { useCartStore } from '../../store/cart.store'

export const Cart = () => {
    const closeSheet = useGlobalStore(state => state.closeSheet)

    const cartItems = useCartStore(state => state.items)
    const cleanCart = useCartStore(state => state.clearCart)
    const totalItemsInCart = useCartStore(state => state.totalItemsInCart)

  return (
    <div className='flex flex-col h-full'>
        <div className='px-5 py-4 flex justify-between items-center border-b border-slate-200'>
            <span className='flex gap-3 items-center font-semibold'>
                <HiOutlineShoppingBag size={20} /> {totalItemsInCart} Artículos
            </span>
            <button onClick={closeSheet}>
                <IoMdClose size={25} className='text-black' />
            </button>
        </div>

        {
            totalItemsInCart > 0 ? (
                 <>
        <div className="p-7 overflow-auto flex-1">
            <ul className='space-y-9'>
                {
                    cartItems.map( item => (
                        <CartItems  items={item}  key ={item.variantId}/>
                    ))
                }
            </ul>
        </div>

        <div className='mt-4 p-7'>
            <Link to={"/checkout"} 
              onClick={closeSheet}

            className='w-full bg-black text-white py-3.5 rounded-full flex 
            items-center justify-center gap-3'>
            <RiSecurePaymentLine size={20}  />
            Continuar con la compra
            </Link>

            <button className='mt-3 w-full text-black border border-black rounded-full py-3 '
              onClick={cleanCart}>
                Limpiar Carrito

            </button>

        </div>

        </>
            ) : (
                <div className='flex flex-col items-center justify-center h-full gap-7'>
                    <p className='text-sm font-medium tracking-tight'>
                        Tu carrito está vacío
                    </p>
                    <Link to={"/products"}
                     className='py-4 bg-black rounded-full text-white px-7
                      uppercase text-xs font-semibold  tracking-widest'
                      onClick={closeSheet}
                    >
                        Ir a la tienda
                    </Link>

                </div>
            )
        }
    </div>
  )
}
