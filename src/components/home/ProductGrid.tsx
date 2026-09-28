import type { FC } from 'react'
import { CardProduct } from '../products/CardProduct';
import type { PreparedProducts } from '../../interfaces/product.interface';
import { Link } from 'react-router';

interface ProductGridProps {
    title : string ;
    products :PreparedProducts[]
}

export const ProductGrid : FC<ProductGridProps> = ({ title, products }) => {
  return (
    <section className="my-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Catalogo</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                {title}
            </h2>
          </div>
          <Link to="/products" className="hidden text-sm font-semibold text-cyan-700 hover:underline md:inline">
            Ver todos
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No hay productos disponibles por ahora.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                  <CardProduct
                      key={product.id}
                      img={product.images[0]}
                      name={product.name}
                      price={product.price}
                      slug={product.slug}
                      colors={product.colors}
                      variants={product.variants}
                  />
              ))}
          </div>
        )}
    </section>
  )
}
