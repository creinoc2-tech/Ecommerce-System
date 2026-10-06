import type { FC } from "react";

interface Props {
  content: string | number;
}

export const CellTableCategory: FC<Props> = ({ content }) => {
  return <td className="p-4 tracking-tighter">{content}</td>;
};
