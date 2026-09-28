import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

export const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Ingresa un correo valido')
      return
    }
    toast.success('Te suscribiste al boletin')
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('/img/background-newsletter.webp')" }}
        />
        <div className="absolute inset-0 bg-slate-950/70" />

        <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 lg:px-8">
            <div className="w-full space-y-5 rounded-3xl bg-white p-8 text-slate-900 shadow-2xl md:w-[55%] lg:w-[42%]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Boletin
                </p>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  Recibe promociones exclusivas
                </h3>
                <p className="text-sm text-slate-500">
                  Introduce tu correo para enterarte de ofertas y lanzamientos.
                </p>
                <form className="flex flex-col gap-3 xl:flex-row" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="Correo electronico"
                    />
                    <button type="submit" className="btn-primary xl:px-6">
                      Suscribirse
                    </button>
                </form>
            </div>
        </div>
    </section>
  )
}
