import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as localDb from '@/lib/localDb';

export function useOrders(status?: localDb.OrderStatus) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => {
      if (status) {
        return localDb.getOrdersByStatus(status);
      }
      return localDb.getAllOrders();
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => localDb.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<localDb.LocalOrder, 'id' | 'created_at' | 'updated_at'>) => {
      return localDb.createOrder(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: localDb.OrderStatus }) => {
      return localDb.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
