import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight">404</h1>
      <p className="text-lg text-slate-600">Pagina no encontrada</p>
      <Link
        to="/"
        className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
};
