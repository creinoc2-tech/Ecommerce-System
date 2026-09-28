import { Link } from 'react-router'

export const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/img/img-banner.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-cyan-900/40" />

      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-start justify-center px-4 py-20 lg:px-8 lg:py-32">
        <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur">
          Nueva coleccion
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
          Los mejores celulares al mejor precio
        </h1>
        <p className="mt-5 max-w-xl text-base text-slate-200 lg:text-xl">
          Encuentra smartphones de ultima generacion con envio gratis, garantia de 1 ano y soporte 24/7.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary bg-cyan-600 px-7 py-3.5 hover:bg-cyan-500">
            Ver productos
          </Link>
          <Link to="/about" className="btn-secondary-outline border-white/30 text-white hover:border-white hover:bg-white/10 hover:text-white">
            Conocenos
          </Link>
        </div>
      </div>
    </section>
  )
}
