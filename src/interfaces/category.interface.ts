import type { ReactNode } from "react";

export interface ICategory {
  id: number;
  title: string;
  path: string;
  icon: ReactNode;
}


export interface ICategories {
  id?: string; // uuid (usa number si tu id es bigint)
  name: string;
  slug: string;
  image_url: File[]
  is_active: boolean;
  created_at?: string;  
}