import { HiOutlineDesktopComputer, HiOutlineShoppingBag, HiSparkles } from "react-icons/hi";
import { GiRunningShoe, GiTShirt } from "react-icons/gi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { FaGem } from "react-icons/fa6";
import type { ICategory } from "../../../interfaces/category.interface";

export const categories: ICategory[] = [
  {
    id: 1,
    title: "Moda",
    path: "/products",
    icon: <GiTShirt size={16} />,
  },
  {
    id: 2,
    title: "Electronica",
    path: "/products",
    icon: <HiOutlineDesktopComputer size={16} />,
  },
  {
    id: 3,
    title: "Bolsos",
    path: "/products",
    icon: <HiOutlineShoppingBag size={16} />,
  },
  {
    id: 4,
    title: "Calzado",
    path: "/products",
    icon: <GiRunningShoe size={16} />,
  },
  {
    id: 5,
    title: "Alimentos",
    path: "/products",
    icon: <MdOutlineLocalGroceryStore size={16} />,
  },
  {
    id: 6,
    title: "Joyeria",
    path: "/products",
    icon: <FaGem size={14} />,
  },
  {
    id: 7,
    title: "Belleza",
    path: "/products",
    icon: <HiSparkles size={16} />,
  },
];
