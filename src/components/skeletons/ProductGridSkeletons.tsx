import type { FC } from "react";

interface Props {
    numberOfProducts : number;
}

export const ProductGridSkeletons:FC<Props> = ({ numberOfProducts }) => {
  return (
    <div className="my-16">
        <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: numberOfProducts }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="h-[240px] animate-pulse bg-slate-200" />
                  <div className="space-y-3 p-4">
                    <div className="mx-auto h-4 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="mx-auto h-4 w-16 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
            ))}
        </div>
    </div>
  )
}
