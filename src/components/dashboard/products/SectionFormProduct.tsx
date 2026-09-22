import type { FC } from "react"

interface Props {
    titleSection? : string
    className? : string
    children: React.ReactNode
}


export const SectionFormProduct : FC<Props> = ({ titleSection, className, children }) => {
  return (
    <div className={ `bg-white border  border-gray-300 shadow-sm 
    rounded-md flex flex-col gap-4 p-7 h-fit  ${className}` }>
        {
            titleSection && (
                <h2 className="font-bold tracking-tighter text-xl ">
                { titleSection } : 
               </h2>
            )
        }
        {
           children
        }
    </div>
  )
}
