import { brands } from "../../constans/links"

export const Brands = () => {
  return (
    <section className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Marcas</p>
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
          Marcas que disponemos
        </h2>
        <p className="max-w-2xl text-center text-sm text-slate-500 md:text-base">
            Amplia variedad de marcas reconocidas, con calidad y confianza en cada equipo.
        </p>
        <div className="mt-6 grid w-full grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-6">
            {brands.map((brand) => (
                <div key={brand.alt} className="grid h-16 place-items-center rounded-2xl bg-slate-50 p-3">
                    <img src={brand.image} alt={brand.alt} className="max-h-10 w-auto object-contain grayscale transition hover:grayscale-0" />
                </div>
            ))}
        </div>
    </section>
  )
}
