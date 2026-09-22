import { useState, type FC } from "react";

interface Props {
    images: string[];
}

export const GridImages: FC<Props> = ({ images }) => {
    const [activeImage, setActiveImage] = useState(images[0]);

     const handleImageClick = (img: string) => {
        setActiveImage(img);
     }
  return (
    <div className="flex-1 flex flex-col gap-3 relative">
        <div className="bg-[#f2f2f2] h-[500px] p-4">
            <img src={activeImage} alt="Imagen de Producto" 
              className="h-full w-full object-contain " 
            />
        </div>

        <div className="flex mt-4 gap-2">
            {
                images.map( (imagen , index) => (
                    <button key={index} onClick={()=>handleImageClick(imagen)}
                    className={`w-16 h-16 p-1 border ${imagen === activeImage ? 
                    "border-black" : "border-transparent"}  
                    rounded-lg  hover:border-black focus:outline-none
                    `}>
                        <img src={imagen} alt={`Imagen de Producto ${index + 1}`}
                         className="h-full w-full object-contain rounded-lg "
                        />

                    </button>
                ))
            }

        </div>
    </div>
  )
}
