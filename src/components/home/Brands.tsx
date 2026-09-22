import { brands } from "../../constans/links"




export const Brands = () => {
  return (
    <div className='flex flex-col items-center gap-3 pt-6 pb-12'>
        <h2 className="font-bold text-2xl">Marca que disponemos </h2>

        <p className='w-2/3 text-center text-sm md:text-base'>
            Contamos con una amplia variedad de marcas reconocidas en el mercado, 
            garantizando calidad y confianza en cada producto que ofrecemos.
        </p>
        <div className='grid grid-cols-3  gap-6 mt-8 items-center md:grid-cols-6'>
            {
                brands.map( (brand, index) => (
                    <div key={index} >
                        <img src={brand.image} alt={brand.alt}  />
                    </div>
                ))
            }

        </div>
    </div>
  )
}
