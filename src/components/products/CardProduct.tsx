import { useMemo, useState, type FC } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import type { VariantProduct } from "../../interfaces";
import { formatPrice } from "../../helpers";
import { Tag } from "../shared/Tag";
import { useCartStore } from "../../store/cart.store";
import toast from "react-hot-toast";

interface CardProductProps {
	id: string;
	img: string;
	name: string;
	price: number;
	slug: string;
	colors: { name: string; color: string }[];
	variants: VariantProduct[];
}

export const CardProduct: FC<CardProductProps> = ({ id, img, name, price, slug, colors, variants }) => {
   const [activeColor, setActiveColor] = useState<{
		name: string;
		color: string;
	} | undefined>(colors[0]);

    const storagesForColor = useMemo(() => {
        if (!activeColor) return [];
        return [...new Set(
            variants
                .filter((variant) => variant.color === activeColor.color)
                .map((variant) => variant.storage)
        )];
    }, [activeColor, variants]);

    const [selectedStorage, setSelectedStorage] = useState<string | undefined>(
        storagesForColor[0]
    );

    const handleColorChange = (color: { name: string; color: string }) => {
        setActiveColor(color);
        const nextStorages = [...new Set(
            variants
                .filter((variant) => variant.color === color.color)
                .map((variant) => variant.storage)
        )];
        setSelectedStorage(nextStorages[0]);
    };

    const addItem = useCartStore(state => state.addItem)

    const selectedVariant = variants.find((variant) =>
       variant.color === activeColor?.color && variant.storage === selectedStorage
    );

    const handleAddToCart = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(selectedVariant && selectedVariant.stock > 0 && activeColor){
            addItem({
                variantId : selectedVariant.id,
                productId : id,
                name ,
                image :img ,
                color : activeColor.name ,
                storage : selectedVariant.storage ,
                price : selectedVariant.price ,
                quantity : 1,
            })
              toast.success("Producto agregado al carrito"  , {
                position : "bottom-right"
            });
        }else {
            toast.error("Producto agotado"  , {
                position : "bottom-right"
            });
        }
    }

   const stock = selectedVariant?.stock || 0;
  
    return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <Link to={`/products/${slug}`} className="relative overflow-hidden bg-slate-50">
          <div className="flex h-[260px] w-full items-center justify-center p-6 lg:h-[240px]">
            <img src={img} alt={name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
          </div>

          <button
            type="button"
            className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-1 rounded-full bg-slate-950 py-2.5 text-sm font-semibold text-white opacity-100 translate-y-0 shadow-lg transition-all duration-300 hover:bg-cyan-700 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            onClick={handleAddToCart}
          >
            <FiPlus />
			Añadir
          </button>
        </Link>
        <div className="flex flex-col items-center gap-1.5 px-4 pb-5 pt-4">
            <p className="text-center text-sm font-semibold text-slate-900">{name}</p>
            <p className="text-sm font-bold text-cyan-700">{formatPrice(selectedVariant?.price ?? price)}</p>

            <div className="mt-1 flex gap-2">
                {colors.map((color) => (
                    <button
                      type="button"
                      key={color.color}
                      aria-label={color.name}
                      className={`grid h-5 w-5 place-items-center rounded-full ${activeColor?.color === color.color ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                      onClick={() => handleColorChange(color)}
                    >
                        <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.color }} />
                    </button>
                ))}
            </div>
            {storagesForColor.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                    {storagesForColor.map((storage) => (
                        <button
                            type="button"
                            key={storage}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                selectedStorage === storage
                                    ? 'bg-slate-950 text-white'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                            onClick={() => setSelectedStorage(storage)}
                        >
                            {storage}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <div className="absolute left-3 top-3">
            {stock === 0 &&  <Tag contentTag="agotado" />}
        </div>
    </article>
  )
}
