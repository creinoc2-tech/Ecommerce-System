import {
	FaBoxOpen,
	FaCartShopping,
	FaFacebookF,
	FaInstagram,
	FaTiktok,
	FaXTwitter,
} from 'react-icons/fa6';
import type { href } from 'react-router';

export const navbarLinks = [
  {
    id: 1,
    title: "Home",
    path: "/"
  },
  {
    id: 2,
    title: "About",
    path: "/about"
  },
  {
    id: 3,
    title: "Productos",
    path: "/products"
  } 
]

export const socialLinks = [
	{
		id: 1,
		title: 'Facebook',
		href: 'https://www.facebook.com',
		icon: <FaFacebookF />,
	},
	{
		id: 2,
		title: 'Twitter',
		href: 'https://www.twitter.com',
		icon: <FaXTwitter />,
	},
	{
		id: 3,
		title: 'Instagram',
		href: 'https://www.instagram.com',
		icon: <FaInstagram />,
	},
	{
		id: 4,
		title: 'Tiktok',
		href: 'https://www.tiktok.com',
		icon: <FaTiktok />,
	},
];

 export const brands = [
	{
		image: '/img/brands/apple-logo.webp',
		alt: 'Apple',
	},
	{
		image: '/img/brands/samsung-logo.webp',
		alt: 'Samsung',
	},
	{
		image: '/img/brands/xiaomi-logo.webp',
		alt: 'Xiaomi',
	},
	{
		image: '/img/brands/realme-logo.webp',
		alt: 'Realme',
	},
	{
		image: '/img/brands/huawei-logo.png',
		alt: 'Huawei',
	},

	{
		image: '/img/brands/honor-logo.png',
		alt: 'Honor',
	},
];

export const dashboardLinks = [
	 {
		id: 1,
		title: 'Productos',
		href: '/dashboard/productos',
		icon : <FaBoxOpen size={25} />
	 } ,

	 {
		id: 2,
		title: 'Ordenes',
		href: '/dashboard/ordenes',
		icon : <FaCartShopping size={25} />
	 }
]