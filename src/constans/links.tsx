import {
	FaBoxOpen,
	FaCartShopping,
	FaFacebookF,
	FaInstagram,
	FaTags,
	FaTiktok,
	FaXTwitter,
} from 'react-icons/fa6';

export const navbarLinks = [
  {
    id: 1,
    title: "Inicio",
    path: "/"
  },
  {
    id: 2,
    title: "Productos",
    path: "/products"
  },
  {
    id: 3,
    title: "Nosotros",
    path: "/about"
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
		icon : <FaBoxOpen size={22} />
	 } ,

	 {
		id: 2,
		title: 'Ordenes',
		href: '/dashboard/ordenes',
		icon : <FaCartShopping size={22} />
	 } ,

	 {
		id: 3,
		title: 'Categorias',
		href: '/dashboard/categorias',
		icon : <FaTags size={22} />
	 }
]
