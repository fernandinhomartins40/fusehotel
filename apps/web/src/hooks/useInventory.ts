import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { POSProduct, StockMovementType } from '@/types/pms';

export function useInventoryProducts() {
  return useQuery<{ products: POSProduct[]; alerts: POSProduct[] }>({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      const { data } = await apiClient.get('/inventory/products');
      return data.data;
    },
  });
}

export function useCreateInventoryMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      type: Exclude<StockMovementType, 'CONSUMPTION'>;
      quantity: number;
      unitCost?: number;
      referenceId?: string;
      notes?: string;
    }) => {
      const { data } = await apiClient.post('/inventory/movements', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['pos-products'] });
      toast.success('Movimentação de estoque registrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao movimentar estoque');
    },
  });
}
