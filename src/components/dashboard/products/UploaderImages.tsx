import React, { useState, type FC } from 'react'
import type { FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { ProductFormValues } from '../../../lib/validator';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface ImagePreview {
  file?: File;
    previewUrl: string;
}

 interface Props {
setValue: UseFormSetValue<ProductFormValues>;
errors: FieldErrors<ProductFormValues>;
initialImages?: string[];
}

export const UploaderImages:FC<Props> = ({ setValue, errors, initialImages = [] }) => {
  const [images , setImages ] = useState<ImagePreview[]>([]);

  React.useEffect(() => {
    if (initialImages.length > 0 && images.length === 0) {
      setImages(initialImages.map((image) => ({ previewUrl: image })));
      setValue('images', initialImages, { shouldValidate: true });
    }
  }, [initialImages, images.length, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newImages = Array.from(e.target.files).map( (file) => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        setValue(
            "images",
            updatedImages.map( (image) => image.file || image.previewUrl )
        )
    }
   

  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    setValue(
            "images",
            updatedImages.map( (image) => image.file || image.previewUrl )
        )

  }
  return (
    <>
      <input type="file" 
        onChange={handleImageChange}
        accept="image/*"
        multiple
        	className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
             file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200'
      />

      <div className="grid grid-cols-4 lg:grid-cols-2 gap-4">
         {
             images.map( (image , index) => (
                <div key={index}>
                    <div className='border border-gray-200 w-full h-20 rounded-md p-1 relative 
                     lg:h-28'>
                        <img src={image.previewUrl} alt={`Preview ${index}`}
                        className='rounded-md w-full h-full object-contain '
                        />

                        <button type='button'
                         onClick={() => handleRemoveImage(index)}
                         className='flex justify-end absolute -top-3 -right-4
                          hover:scale-110 transition-all z-10'
                        >
                            <IoIosCloseCircleOutline size={20}
                             className='text-red-500'
                            />

                        </button>

                    </div>

                </div>
               
             ))

             
         }
      </div>
       {
         errors.images && (
         <p className='text-red-500 text-xs mt-1'>
		{errors.images.message}
	   </p>)
     }

    </>
  )
}
