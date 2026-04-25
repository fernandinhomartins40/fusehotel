import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { POSOrder, POSOrderOrigin, POSOrderStatus, POSProduct, POSProductCategory } from '@/types/pms';

export function usePOSProducts() {
  return useQuery<POSProduct[]>({
    queryKey: ['pos-products'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pos/products');
      return data.data;
    },
  });
}

export function useCreatePOSProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      category: POSProductCategory;
      price: number;
      description?: string;
    }) => {
      const { data } = await apiClient.post('/pos/products', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-products'] });
      toast.success('Produto cadastrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar produto');
    },
  });
}

export function usePOSOrders() {
  return useQuery<POSOrder[]>({
    queryKey: ['pos-orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pos/orders');
      return data.data;
    },
  });
}

export function useCreatePOSOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      stayId?: string;
      roomUnitId?: string;
      origin: POSOrderOrigin;
      notes?: string;
      items: Array<{
        productId: string;
        quantity: number;
        notes?: string;
      }>;
    }) => {
      const { data } = await apiClient.post('/pos/orders', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-orders'] });
      toast.success('Pedido criado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar pedido');
    },
  });
}

export function useUpdatePOSOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: POSOrderStatus }) => {
      const { data } = await apiClient.patch(`/pos/orders/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-orders'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports-operations'] });
      toast.success('Status do pedido atualizado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar pedido');
    },
  });
}
