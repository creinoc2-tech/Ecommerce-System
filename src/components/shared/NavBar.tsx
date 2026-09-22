import React from 'react'
import { navbarLinks } from '../../constans/links'
import { Link, NavLink } from 'react-router'
import { HiOutlineSearch, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi'
import { FaBarsStaggered } from 'react-icons/fa6'
import { Logo } from './Logo'
import { useGlobalStore } from '../../store/global.state'
import type { BadgeProps } from '@mui/material/Badge';import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge'
import { MdOutlineShoppingCart } from 'react-icons/md'
import Button from '@mui/material/Button'
import { useCartStore } from '../../store/cart.store'
import { useUser } from '../../hook'
import { LuLoader } from 'react-icons/lu'
import { useCustomer } from '../../hook/Auth/UseCustomer'

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));


export const Navbar = () => {

  const totalItemsInCart = useCartStore(state => state.totalItemsInCart)
  const openSheet = useGlobalStore(state => state.openSheet)
  const setActiveNavMobile = useGlobalStore(state => state.setActiveNavMobile)
  

  const { session , isLoading } = useUser()
  const userId = session?.user.id
  const { data: customer } = useCustomer(userId!)

  const iniciales = customer?.full_name
  ?.split(" ")
  .map((palabra : any ) => palabra.charAt(0).toUpperCase())
  .join("");

   return (


      	<header className='bg-white text-black py-4 flex items-center 
        justify-between px-5 border-b border-slate-200 lg:px-12'>

        <Logo />

       

        
       <div className='flex gap-6 items-center'>
         <ul className='flex items-center gap-3'>
          <li className='list-none '>
             <Link className='text-[16px] text-slate-700 font-medium '
             to="/login">Login   </Link>  | &nbsp;
             <Link className='text-[16px] text-slate-700 font-medium ' to="/register">Register</Link>
          </li>
            

         </ul>


         <div className='flex gap-2 items-center'>

          <IconButton aria-label="cart"  onClick={ () => openSheet("search")}>
           <StyledBadge >
           <HiOutlineSearch  size={24}/>
           </StyledBadge>
           </IconButton>



           {
             isLoading ? (
                <LuLoader  className='animate-spin' size={60}/>

             ):  session ? (
              <div className='relative'>
            <Link to="/account"
            className='border-2 border-gray-600 w-8 h-8 rounded-full grid place-items-center text-lg font-bold'>
                <p className='text-gray-500'>{iniciales?? ""}</p>
            </Link>
           </div>

             ) : (
                <Link to={"/login"} >
                   <HiOutlineUser size={25}/>

                </Link>

             )
           }

           <IconButton aria-label="cart" onClick={() => openSheet("cart")}>
           <StyledBadge badgeContent={totalItemsInCart} 
           sx={{ '& .MuiBadge-badge': { backgroundColor: '#ff8a80', color: '#fff' } }}
           >
           <MdOutlineShoppingCart  size={25}/>
           </StyledBadge>
           </IconButton>



         </div>
         
       </div>




       <button className='md:hidden ' 
       onClick={() => setActiveNavMobile(true)}>
				<FaBarsStaggered size={10} />
			</button>

       </header>
  )
}
