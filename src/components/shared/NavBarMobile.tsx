import { Link, NavLink } from 'react-router';
import { useGlobalStore } from '../../store/global.state'
import { IoMdClose } from 'react-icons/io';
import { navbarLinks } from '../../constans/links';

export const NavBarMobile = () => {

    const setActiveNavMobile = useGlobalStore(state => state.setActiveNavMobile)
  return (
    <div className='bg-white text-black h-screen w-full shadow-lg
     z-50 flex justify-center py-32 fixed
    '>
        <button className='absolute top-5 right-5'
        onClick={() => setActiveNavMobile(false)}
        >
            <IoMdClose size={30} className='text-black' />
        </button>

        <div className="flex flex-col gap-20">
            <Link to={"/"}
            onClick={() => setActiveNavMobile(false)}
            className='text-4xl font-bold tracking-tighter transition-all'
            >
                <p>
                 Productos {" "}
                 <span className='text-cyan-600'>Baratos </span>
                 </p>

            </Link>

            <nav className='flex flex-col items-center gap-5'>
                {
                    navbarLinks.map(  item => (
                        <NavLink
                       key={item.id}
                       to={item.path}
                       onClick={() => setActiveNavMobile(false)}
                       className={({ isActive }) =>
                            `${isActive ? 'text-cyan-600 underline' : ''}
                        transition-all duration-300 font-semibold text-xl hover:text-cyan-600
                         hover:underline`
                        }
                       >
                          {item.title}
                       </NavLink>
                    ))
                }
            </nav>

        </div>

    </div>
  )
}
  

