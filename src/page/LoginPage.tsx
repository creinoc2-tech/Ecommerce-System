import React, { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useLogin } from '../hook/Auth/UseLogin'
import { LuLoader } from 'react-icons/lu'
import { useUser } from '../hook'
import { Loader } from '../components/shared/Loader'

export const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { mutate, isPending } = useLogin();
    const { session, isLoading } = useUser()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ email, password });
    }

    if (isLoading) return <Loader />
    if(session) return <Navigate to="/" />



  return (
    <div className='h-full flex flex-col items-center mt-12 gap-5'>
        <h1 className='text-4xl font-bold capitalize'>
        Iniciar sesión
        </h1>

        <p className='text-sm font-medium'>
            ¡Bienvenido de nuevo! Por favor, ingresa tus credenciales para 
            acceder a tu cuenta.
        </p>

       {
        isPending ? (
            <div className='w-full h-full flex justify-center mt-20'>
            <LuLoader className='animate-spin' size={60} />
           </div>


        ) :(
             <>
            <form onSubmit={handleSubmit}
              className='flex flex-col items-center gap-4 w-full
             mt-10 sm:w-[400px]  lg:w-[500px]'>

                 <input 
                 type="email" 
                 placeholder=' Ingrese su correo electrónico'
                 className='border border-slate-200 text-black px-5 py-4 
                 placeholder:text-black text-sm rounded-lg w-full'
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 />

                  <input 
                 type="password" 
                 placeholder=' Ingrese su contraseña'
                 className='border border-slate-200 text-black px-5 py-4 
                 placeholder:text-black text-sm rounded-lg w-full'
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 />

                 <button 
                    type="submit"
                 className='bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 
                  rounded-full mt-5 w-full'>
                    Iniciar sesión
                 </button>
            
            </form>

            <p className='text-sm text-stone-800'>
                ¿No tienes una cuenta?
                <Link to="/register" 
                className=' ml-2 underline'>
                    Regístrate
                </Link>
            </p>
        </>

        )
       }

    </div>
  )
}
