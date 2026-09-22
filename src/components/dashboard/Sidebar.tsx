import React from 'react'
import { NavLink } from 'react-router'
import { dashboardLinks } from '../../constans/links'
import { IoLogOutOutline } from 'react-icons/io5'
import { signOut } from '../../action'
import { Logo } from '../shared/Logo'

export const Sidebar = () => {

  const handleLogout = async () => {
    await signOut()
  }
  return (
    <div className='w-[120] bg-stone-500 text-white flex flex-col gap-10 items-center p-5 
        h-screen fixed  lg:w-[250px]'>
            
                <Logo isDashboard={true} />
              

            <nav className="w-full space-y-5 flex-1">
                {
                    dashboardLinks.map( link => (
                        <NavLink
                        to ={link.href} 
                        key={link.id}
                        className={({isActive}) => `flex items-center  justify-center gap-3 pl-0 
                        py-3 transition-all duration-300 rounded-md
                        ${isActive ? 'text-white bg-cyan-600' : 'hover:text-white hover:bg-cyan-600'}
                          lg:pl-5 lg:justify-start`}>
                            {link.icon}

                          <p className='font-semibold hidden lg:block'>
                            { link.title}
                          </p>

                        </NavLink>
                    ))
                }
            </nav>
            <button className='bg-red-500  w-full py-[10px] rounded-md flex items-center
            justify-center gap-2 font-semibold text-sm hover:underline'
            onClick={() => handleLogout()}
            >
              <span className='hidden lg:block'>Cerrar Session </span>
              <IoLogOutOutline size={20} className='inline-block' />
            </button>

    </div>
  )
}
