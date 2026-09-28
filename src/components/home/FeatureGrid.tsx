import { BiWorld } from 'react-icons/bi'
import { FaHammer } from 'react-icons/fa6'
import { HiMiniReceiptRefund } from 'react-icons/hi2'
import { MdLocalShipping } from 'react-icons/md'

const features = [
  {
    icon: MdLocalShipping,
    title: 'Envio gratis',
    description: 'En todos nuestros productos',
  },
  {
    icon: HiMiniReceiptRefund,
    title: 'Devoluciones',
    description: '72 horas si no te satisface la compra',
  },
  {
    icon: FaHammer,
    title: 'Soporte 24/7',
    description: 'Asistencia tecnica cuando la necesites',
  },
  {
    icon: BiWorld,
    title: 'Garantia',
    description: '1 ano en todos los equipos',
  },
]

export const FeatureGrid = () => {
  return (
    <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
            <Icon size={22} />
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
