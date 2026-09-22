import React, { useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useGlobalStore } from '../../store/global.state'
import { IoMdClose } from 'react-icons/io';
import { formatPrice } from '../../helpers';
import { searchProducts } from '../../action';
import type { Product } from '../../interfaces';
import { useNavigate } from 'react-router';

export const Search = () => {
    const [searchTerm, setSearchTerm] =useState('')
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const closeSheet = useGlobalStore(state => state.closeSheet)
    const navigate = useNavigate()

    const handleSearch = async ( e : React.FormEvent) => {
        e.preventDefault()
       const products = await searchProducts(searchTerm)
         setSearchResults(products);
    }

  return (
    <>
         <div className='py-5 px-7  flex items-center gap-10 border-b border-slate-200'>
        <form className='flex gap-3 items-center flex-1 ' onSubmit={handleSearch}>
            <HiOutlineSearch size={22} />
            <input 
             type="text" 
             placeholder='Buscar productos...'
             className='outline-none w-full text-sm'
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>

        <button onClick={closeSheet}>
            <IoMdClose size={25} className='text-black' />

        </button>
    </div>

     <div className='p-5'>
         {
            searchResults.length > 0  ? (
                 <ul>
                    {
                        searchResults.map((product) => (
                            <li key={product.id} className='py-2 group'>


                              <button className='flex items-center gap-3' 
                               onClick={ () => {
                                navigate(`/products/${product.slug}`);
                                closeSheet();
                               }}
                              >
                            <img src={product?.images[0]} 
                             alt={product.name}
                             className='h-20 w-20 object-contain p-3' />
                     
                           <div className='flex flex-col gap-1'>
                           <p className='text-sm font-semibold group-hover:underline'
                            
                           >
                            {product.name}
                           </p>
                          <p className='text-[13px] text-gray-600'>
                            {product.variants[0].storage}/ {" "}
                            {product.variants[0].color}
                          </p>
                          <p className='text-sm font-medium  text-gray-600'>
                            {formatPrice(product.variants[0].price)}
                          </p>
                         </div>
                     </button>
                     </li>

                        ))
                    }
            
                  </ul>

            ) : (

                <p  className='text-sm text-gray-600'>
                    No se encontraron resultados 

                </p>

            )
         }
     </div>

    </>
    
  )
}
