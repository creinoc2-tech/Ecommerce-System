import type { FC } from "react";

type TagType = "nuevo" | "agotado"

interface Props {
    contentTag: TagType;
}

 const getTagColor = (content : TagType) => {
    if (content === 'nuevo') return 'bg-cyan-600';
    if (content === 'agotado') return 'bg-slate-950';
    return 'bg-slate-500';
 }
export const Tag: FC<Props> = ({ contentTag }) => {
  return (
    <div className={`w-fit rounded-full px-2.5 py-1 text-white shadow-sm ${getTagColor(contentTag)}`}>
       <p className="text-[10px] font-semibold uppercase tracking-wider">{contentTag}</p>
    </div>
  )
}
