import type { FC } from 'react'
import { Link } from 'react-router'

interface Props {
  isDashboard?: boolean
  light?: boolean
}

export const Logo: FC<Props> = ({ isDashboard, light }) => {
  const textClass = light ? 'text-white' : 'text-slate-950'

  return (
    <Link
      to={isDashboard ? '/dashboard' : '/'}
      className={`group inline-flex items-center gap-2.5 ${textClass}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-md shadow-cyan-600/30 transition-transform duration-200 group-hover:scale-105">
        <span className="text-sm font-extrabold tracking-tight">CB</span>
      </span>
      <span className="hidden leading-none lg:block">
        <span className="block text-lg font-extrabold tracking-tight">
          Celulares
          <span className={light ? 'text-cyan-300' : 'text-cyan-600'}> Baratos</span>
        </span>
        <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${light ? 'text-slate-300' : 'text-slate-400'}`}>
          Tech Store
        </span>
      </span>
    </Link>
  )
}
