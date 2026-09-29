import type { ReactNode } from "react";

export interface ICategory {
  id: number;
  title: string;
  path: string;
  icon: ReactNode;
}
