import { useFieldArray, useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { ProductFormValues } from '../../../lib/validator';
import { useEffect, useState, type FC } from 'react';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';
interface Props {
       control : Control<ProductFormValues>
       errors: FieldErrors<ProductFormValues>;
       register: UseFormRegister<ProductFormValues>;
}

const headersVariants = [ "Stock ", "Precio" , "Capacidad" , "Color" ,"" ];

export const VariantsInput:FC<Props> = ({ control, errors, register }) => {
    const [colorActive, setColorActive] = useState<boolean[]>([]);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    })

    const removeVariant = (index: number) => {
        remove(index);
    }

    const toggleColorActive = (index: number) => {
        setColorActive(prev => prev.map((item , i) => i === index ? !item : item));
            
    }

    const colorValues = useWatch({
        control ,
        name: fields.map((_, index) => `variants.${index}.color` as const)
    })

    const colorNameValues = useWatch({
        control ,
        name: fields.map((_, index) => `variants.${index}.color_name` as const)
    })

    
    const getFristError = (
        variantErros: FieldErrors<ProductFormValues['variants'][number]>
    ) => {
        if (variantErros) {
			const keys = Object.keys(
				variantErros
			) as (keyof typeof variantErros)[];
			if (keys.length > 0) {
				return variantErros[keys[0]]?.message;
			}
		}
	};



    const addVariant = () => {
        append({
            stock: 0,
            price: 0,
            storage: '',
            color: '',
            color_name: ''
        })
    }

    useEffect(()=>{
        setColorActive( 
            prev =>fields.map((_ , index) => prev[index] || false) 
        );

    } , [fields])

  return (
    <div className='flex flex-col gap-3'>
        <div className="space-y-4 border-b border-slate-200 pb-6">
            <div className='grid grid-cols-5 gap-8 justify-start'>
                {
                    headersVariants.map( (header , index) => (
                    <p key={index}
                     className='text-xs font-semibold text-slate-800  '
                    >
                        { header }
                    </p>

                    ))
 
                }
            </div>

            {
                fields.map( (field, index) => (
                    <div key={field.id}>
                        <div className="grid grid-cols-5 gap-4 items-center">

                            <input type="number" 
                             placeholder='Stock'
                             {...register(`variants.${index}.stock` ,
                                { valueAsNumber: true }
                              )}
                              className='border rounded-md px-3 py-1.5 text-xs font-semibold 
                              placeholder:font-normal focus:outline-none appearance-none'
                            />

                            <input type="number" 
                             step="0.01"
                             placeholder='Precio'
                             {...register(`variants.${index}.price` ,
                                { valueAsNumber: true }
                              )}
                              className='border rounded-md px-3 py-1.5 text-xs font-semibold 
                              placeholder:font-normal focus:outline-none appearance-none'
                            />

                            <input type="text" 
                             placeholder='64 GB'
                             {...register(`variants.${index}.storage` )}

                              className='border rounded-md px-3 py-1.5 text-xs font-semibold 
                              placeholder:font-normal focus:outline-none appearance-none'
                            />
                             <div className='flex relative'>
                                {
                                    colorActive[index] && (
                                        <div    className='absolute bg-stone-300 rounded-md bottom-10 
                                        left-[10px] p-1 w-[100px] h-fit space-y-2'>
                                            <input type="color" 
                                             {...register(`variants.${index}.color` )}
                                            className='rounded-md px-3 py-1.5 w-full'
                                            />

                                            <input type="text" 
                                             placeholder='Color'
                                            {...register(`variants.${index}.color_name` )}
                                            className='rounded-md px-3 py-1.5 w-full text-xs focus:outline-none
                                             font-semibold placeholder:font-normal  bg-white'
                                            />

                                        </div>
                                    )
                                }
                                 <button className='border w-full h-8 cursor-pointer rounded text-xs 
                                  font-medium flex items-center justify-center'
                                    type='button'
                                    onClick={() => toggleColorActive(index)}
                                  >
                                    {
                                        colorValues[index] && colorNameValues[index] ? (
                                            <span className='inline-block w-4 h-4
                                             rounded-full bg-block'
                                                style={{ backgroundColor: colorValues[index] }}
                                             
                                             />
                                               


                                        ): (
                                        ' Añadir  color'
                                        )
                                    }

                                 </button>

                             </div>


                            <div className='flex justify-end'>
                                <button type='button' 
                                onClick={()=> removeVariant(index)}
                                className='p-1'
                                >
                                    <IoIosCloseCircleOutline size={20}/>
                                </button>

                            </div>
                        </div>
                        {errors.variants && errors.variants[index] && (
							<p className='text-red-500 text-xs mt-1'>
								{getFristError(errors.variants[index])}
							</p>
						)}

                    </div>

                ) )}
        </div>

        <button
         type='button'
         onClick={ () =>addVariant()}
         className='px-4 py-2 text-slate-800 rounded-md text-sm font-semibold
          tracking-tight flex items-center gap-1 self-center hover:bg-slate-100'

        >
            <IoIosAddCircleOutline size={16} />
            Añadir variante
        </button>
        {
            fields.length === 0  && errors.variants && (
                <p className='text-red-500 text-xs mt-1'>
					Debes añadir al menos una variante
				</p>
            )
        }
    </div>
  )
}
