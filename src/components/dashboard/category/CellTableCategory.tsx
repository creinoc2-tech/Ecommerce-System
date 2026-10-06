import type { FC } from "react";

interface Props {
  content: string | number;
}

export const CellTableCategory: FC<Props> = ({ content }) => {
  return (
    <td className="border-r border-gray-100 px-6 py-3.5 font-medium tracking-tighter text-gray-700">
      {content}
    </td>
  );
};
