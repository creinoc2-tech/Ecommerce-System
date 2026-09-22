import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../../action';
 
export const useAllOrders = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['orders', 'admin'],
		queryFn: getAllOrders,
	});

	return {
		data,
		isLoading,
	};
};