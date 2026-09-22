import type { Color, Product, VariantProduct } from "../interfaces";

export const formatPrice = (price: number) =>{
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}


// Función para preparar los productos - (CELULARES)
export const prepareProducts = (products: Product[]) => {
	return products.map(product => {
		// Agrupar las variantes por color
		const colors = product.variants.reduce(
			(acc: Color[], variant: VariantProduct) => {
				const existingColor = acc.find(
					item => item.color === variant.color
				);

				if (existingColor) {
					// Si ya existe el color, comparamos los precios
					existingColor.price = Math.min(
						existingColor.price,
						variant.price
					);
				} // Mantenemos el precio mínimo
				else {
					acc.push({
						color: variant.color,
						price: variant.price,
						name: variant.color_name,
					});
				}

				return acc;
			},
			[]
		);

		// Obtener el precio más bajo de las variantes agrupadas
		const price = Math.min(...colors.map(item => item.price));

		// Devolver el producto formateado
		return {
			...product,
			price,
			colors: colors.map(({ name, color }) => ({ name, color })),
			variants: product.variants,
		};
	});
};


export const formatDateLong = (dateString: string) : string =>{
	const dateObject = new Date (dateString);

	return dateObject.toLocaleDateString( 'es-ES' ,{
		year : 'numeric',
		month : 'long',
		day : 'numeric',
	});
}

export const formatDateShort = (dateString: string) : string =>{
	const dateObject = new Date (dateString);

	return dateObject.toLocaleDateString( 'es-ES' ,{
		year : 'numeric',
		month : '2-digit',
		day : 'numeric',
	});
}

export const getStatus = (statusCode : string) : string => {
	switch (statusCode) {
		case 'Pending':
			return 'Pendiente';
		case 'Shipped':
			return 'Enviado';
		case 'Delivered':
			return 'Entregado';
		case 'Processing':
			return 'En proceso';
		case 'Completed':
			return 'Completado';
		default:
			return statusCode;
	}
}

export const generateSlug = (text : string) : string => {
	return text 
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const extractFilePath = (url: string) => {
		const parts = url.split(
		'/storage/v1/object/public/product-images/'
	);

	if (parts.length !== 2) {
		throw new Error(`URL de imagen no válida: ${url}`);
	}

	return parts[1];
};
