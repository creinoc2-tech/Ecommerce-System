import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    id: 1,
    image: '/img/img-banner.jpg',
    badge: 'Nueva coleccion',
    title: 'Los mejores celulares al mejor precio',
    description: 'Encuentra smartphones de ultima generacion con envio gratis, garantia de 1 ano y soporte 24/7.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1920&q=80',
    badge: 'Oferta destacada',
    title: 'iPhone y Android de ultima generacion',
    description: 'Modelos premium con camara profesional, bateria de larga duracion y el mejor rendimiento.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1920&q=80',
    badge: 'Envio gratis',
    title: 'Elige tu smartphone ideal',
    description: 'Compara marcas, almacenamiento y color. Compra facil, rapida y segura.',
  },
]

export const Banner = () => {
  const [current, setCurrent] = useState(0)
  const slide = slides[current]

  const prev = () => {
    setCurrent((index) => (index === 0 ? slides.length - 1 : index - 1))
  }

  const next = () => {
    setCurrent((index) => (index === slides.length - 1 ? 0 : index + 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((index) => (index === slides.length - 1 ? 0 : index + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-500"
        style={{ backgroundImage: `url('${slide.image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-cyan-900/40" />

      <button
        type="button"
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-slate-100 lg:left-6"
      >
        <FiChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label="Siguiente"
        onClick={next}
        className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-slate-100 lg:right-6"
      >
        <FiChevronRight size={22} />
      </button>

      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-start justify-center px-4 py-20 lg:px-8 lg:py-32">
        <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur">
          {slide.badge}
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
          {slide.title}
        </h1>
        <p className="mt-5 max-w-xl text-base text-slate-200 lg:text-xl">
          {slide.description}
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
