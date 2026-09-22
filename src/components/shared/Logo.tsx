import React, { type FC } from 'react'
import { Link } from 'react-router'
import logoImage from '../../../public/img/brands/1750047766437_logo.jpg';

interface props {
  isDashboard?: boolean
}
export const Logo : FC<props> = ({ isDashboard }) => {

  return (
    <Link to="/"
     className={`text-2xl font-bold tracking-tighter transition-all ${isDashboard && "hover-scale-105"} `}>
        <p className='hidden lg:block  items-center'>
            Productos  
            <span className='text-cyan-600'> Baratos</span>
        </p>

        <p className='flex text-4xl lg:hidden'>
            <span className='-skew-x-6 '>C</span>
            <span className='text-cyan-600 skew-x-6'>B</span>
        </p>

    </Link>
  )
}
