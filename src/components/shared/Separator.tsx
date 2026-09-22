import type { FC } from "react";

interface Props {
    className?: string;
}

export const Separator: FC<Props> = ({ className }) => {
	return <div className={`bg-slate-200 h-px my-5 ${className}`} />;
}