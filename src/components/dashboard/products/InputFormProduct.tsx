import type {  FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validator";
import type { FC } from "react";

interface Props {
className? : string ;
placeholder? : string ;
label : string ;
type: string ;
name: keyof ProductFormValues ;
register : UseFormRegister<ProductFormValues>;
errors : FieldErrors< ProductFormValues>
required? : boolean ;
}
export const InputFormProduct: FC<Props> = 
({ className, label, type, name, register, errors , required , placeholder }) => {
  return (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
        <label htmlFor={name}
          className="text-xs tracking-tighter capitalize 
           text-gray-900">
        {label}
        </label>
        {
            required && (
                <span className={`${ required && 'text-red-500 text-sm mr-3'} font-bold self-end`}>
                    * 
                </span>
            )
        }

        </div>

        <div className={ `border border-gray-300 rounded-md overflow-hidden gap-5 
           items-center  ${errors[name] ? 'border-red-500' : ''} 
            ` }>
                <input type="text" 
                placeholder={placeholder}
                id ={name} 
                className={`py-1.5 text-sm px-3 font-medium tracking-tighter w-full text-slate-600 outline-none focus:outline-none ${className}`}
				autoComplete='off'
                {...register(name)}
                
                />

        </div>


    </div>
  )
}
