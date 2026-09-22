import React, { type FC } from 'react'
import { tr } from 'zod/v4/locales';
import type { OrderItemSingle } from '../../interfaces';
import { formatDateLong, formatPrice, getStatus } from '../../helpers';
import { useNavigate } from 'react-router';

interface TableOrdersProps {
    orders: OrderItemSingle[];
}
const tableHeaders = ["ID" , "Fecha" , "Estado" , "Total"]


export const TableOrders:FC<TableOrdersProps> = ({ orders }) => {
    const navigate = useNavigate();
  return (
    <div className='relative w-full h-full border border-gray-200'>
        <table className='text-sm w-full  caption-bottom overflow-auto'>
            <thead className='border-b border-gray-200 pb-3'>
                <tr className='text-sm font-bold'>
                    {tableHeaders.map((header , index) => (
                        <th key={index} 
                        className='text-left  h-12 px-4'>{header}
                       </th>
                    ))}
                </tr>

            </thead>

            <tbody className='[&_tr:last-child]:border-0'>
                {
                    orders.map((order) => (
                     <tr key={order.id } 
                     className='cursor-pointer hover:bg-gray-100 transition-colors duration-200'
                        onClick={() => navigate(`/account/pedidos/${order.id}`)}
                      > 
                     <td className='p-4  tracking-tight'>
                        {order.id}
                     </td>

                     <td className='p-4  tracking-tight'>
                        {formatDateLong(order.created_at)}
                     </td>


                     <td className='p-4   tracking-tight'>
                        { getStatus(order.status)}
                     </td>

                     <td className='p-4 tracking-tight'>
                        {formatPrice(order.total_amount)}
                     </td>

                     </tr>
                    ))
                }

            </tbody>
        </table>


    </div>
  )
}
