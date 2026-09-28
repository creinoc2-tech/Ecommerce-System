import { FormEvent, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { Link } from 'react-router'
import { socialLinks } from '../../constans/links'
import toast from 'react-hot-toast'
import { Logo } from './Logo'

export const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Ingresa un correo valido')
      return
    }
    toast.success('Te suscribiste al boletin')
    setEmail('')
  }

  return (
    <footer className="mt-10 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-6 text-slate-400">
            Smartphones originales de las mejores marcas, con envio gratis y garantia de 1 ano.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Suscribete
          </p>
          <p className="text-sm text-slate-400">
            Recibe promociones exclusivas y lanzamientos.
          </p>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electronico"
              className="w-full bg-transparent pl-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button type="submit" aria-label="Suscribirse" className="grid h-8 w-8 place-items-center rounded-full bg-cyan-600 text-white hover:bg-cyan-500">
              <BiChevronRight size={20} />
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Tienda
          </p>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/products" className="transition-colors hover:text-white">Productos</Link>
            <Link to="/about" className="transition-colors hover:text-white">Nosotros</Link>
            <Link to="/account/pedidos" className="transition-colors hover:text-white">Mis pedidos</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Siguenos
          </p>
          <p className="text-sm leading-6 text-slate-400">
            Novedades, ofertas y lanzamientos semanales.
          </p>
          <div className="flex overflow-hidden rounded-xl border border-slate-800">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.title}
                className="flex flex-1 items-center justify-center py-3 text-slate-300 transition-all hover:bg-white hover:text-slate-950"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-screen-xl px-4 py-4 text-center text-xs text-slate-500 lg:px-8">
          {new Date().getFullYear()} Celulares Baratos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
