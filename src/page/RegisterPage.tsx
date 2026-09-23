import { Link, Navigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hook'
import { useAuth } from '../context/AuthContext'
import { LuLoader } from 'react-icons/lu'
import { Loader } from '../components/shared/Loader'
import { userRegisterSchema, type UserRegisterFormValues } from '../lib/validator'



export const RegisterPage = () => {
 const { register , handleSubmit , formState : { errors } } = useForm<UserRegisterFormValues>({
    defaultValues : {
        fullName : '',
        phone : '',
        email : '',
        password : '',
    } ,
    resolver : zodResolver(userRegisterSchema)
 })
  const { mutate , isPending } = useRegister();
    const { session, isLoading } = useAuth()
  

 const  onRegister = (data : UserRegisterFormValues) => {
    const { fullName , phone , email , password } = data;
    mutate({ fullName , phone: phone || '' , email , password });
 }

 if (isLoading) return <Loader />
 if(session) return <Navigate to="/" />
 

  return (
    <div className='h-full flex flex-col items-center  gap-2'>
        <h1 className='text-4xl font-bold capitalize'>
        Crear una cuenta
        </h1>

        <p className='text-sm font-medium'>
            Por favor, complete el siguiente formulario para crear una nueva cuenta.
        </p>

         {
            isPending ? (
                <div className='w-full h-full flex justify-center mt-20'>
                    <LuLoader className='animate-spin' size={60} />
                </div>
            ) : (
                <>
            <form 
              className='flex flex-col items-center gap-4 w-full
             mt-6 sm:w-[400px]  lg:w-[500px]'
             onSubmit={handleSubmit(onRegister)}
            >

                <input 
                 type="text" 
                 placeholder=' Ingrese su nombre completo'
                 className='border border-slate-200 text-black px-5 py-4 
                 placeholder:text-black text-sm rounded-lg w-full'
                 {...register('fullName')}
                 
                 />
                 {
                    errors.fullName && (
                        <p className='text-red-500'>
                            {errors.fullName.message}
                        </p>
                    )}

                <input 
                 type="text" 
                 placeholder=' Ingrese su  numero de teléfono'
                 className='border border-slate-200 text-black px-5 py-4 
                 placeholder:text-black text-sm rounded-lg w-full'
                 {...register('phone')}
                 
                 />
                 {
                    errors.phone && (
                        <p className='text-red-500'>
                            {errors.phone.message}
                        </p>
                    )}


                 <input 
                 type="email" 
                 placeholder=' Ingrese su correo electrónico'
                 className='border border-slate-200 text-black px-5 py-4 
                 placeholder:text-black text-sm rounded-lg w-full'
                 {...register('email')}
                 />
                 {
                    errors.email && (
                        <p className='text-red-500'>
                            {errors.email.message}
                        </p>
                    )}
                 

                  <input 
                 type="password" 
                 placeholder=' Ingrese su contraseña'
                 className='border border-slate-200 text-black px-5 py-4 
                 placeholder:text-black text-sm rounded-lg w-full'
                 {...register('password')}
                 />
                 {
                    errors.password && (
                        <p className='text-red-500'>
                            {errors.password.message}
                        </p>
                    )}

                 <button 
                    type="submit"
                 className='bg-black text-white uppercase font-semibold 
                 tracking-widest text-xs py-4 rounded-full mt-5 w-full'>
                    Crear cuenta
                 </button>
            
            </form>

            <p className='text-sm text-stone-800'>
                ¿Ya tienes una cuenta?
                <Link to="/login" 
                className=' ml-2 underline'>
                    Iniciar sesión
                </Link>
            </p>
        </>
)
         }

    </div>
  )
}
