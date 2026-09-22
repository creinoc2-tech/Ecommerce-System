import React from 'react'
import { Link } from 'react-router'
import { de } from 'zod/v4/locales'
import { useOrders } from '../hook/orders/useOrders';
import { Loader } from '../components/shared/Loader';
import { TableOrders } from '../components/orders/TableOrders';

export const OrdersUserPage = () => {

  const { data: orders , isLoading } = useOrders();
  if(isLoading || !orders) return <Loader />;

  return (
    <div className='flex flex-col gap-6 items-center'>
        <div className='flex gap-2'>
            <h1 className='text-3xl font-bold'>Pedidos</h1>
            <span className='w-5 h-5 rounded-full bg-black text-white text-[11px]  flex
            items-center justify-center mt-1'>
                {
                    orders.length
                }
            </span>

        </div>
        {
            orders.length === 0 ? (
                <>
                <p className='text-slate-600 text-[13px]'>
                    Todavia no has hecho ningun pedido 
                </p>

                <Link to='/products' className='bg-black text-white uppercase font-semibold tracking-widest
                 text-xs py-4 px-8 rounded-full'>
                    Empezar a comprar
                </Link>

                </>

            ) :(
                <TableOrders  orders={orders} />
            )


        }


    </div>
  )
}
