import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type {
  CashSession,
  CashMovementType,
  PaymentMethod,
  POSOrder,
  POSOrderOrigin,
  POSOrderStatus,
  POSProduct,
  POSProductCategory,
  POSSettlementType,
} from '@/types/pms';

function invalidatePOSQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['pos-orders'] });
  queryClient.invalidateQueries({ queryKey: ['pos-products'] });
  queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
  queryClient.invalidateQueries({ queryKey: ['pos-cash-session-active'] });
  queryClient.invalidateQueries({ queryKey: ['pos-cash-sessions'] });
  queryClient.invalidateQueries({ queryKey: ['stays'] });
  queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['reports-operations'] });
}

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
      sku?: string;
      category: POSProductCategory;
      price: number;
      costPrice?: number;
      stockQuantity?: number;
      minStockQuantity?: number;
      saleUnit?: string;
      trackStock?: boolean;
      description?: string;
    }) => {
      const { data } = await apiClient.post('/pos/products', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Produto cadastrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar produto');
    },
  });
}

export function useUpdatePOSProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: {
      id: string;
      payload: {
        name: string;
        sku?: string;
        category: POSProductCategory;
        price: number;
        costPrice?: number;
        stockQuantity?: number;
        minStockQuantity?: number;
        saleUnit?: string;
        trackStock?: boolean;
        isActive?: boolean;
        description?: string;
      };
    }) => {
      const { data } = await apiClient.put(`/pos/products/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Produto atualizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar produto');
    },
  });
}

export function useDeletePOSProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/pos/products/${id}`);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Produto removido com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao remover produto');
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
      settlementType?: POSSettlementType;
      customerName?: string;
      tableNumber?: string;
      notes?: string;
      serviceFeeAmount?: number;
      discountAmount?: number;
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
      invalidatePOSQueries(queryClient);
      toast.success('Pedido criado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar pedido');
    },
  });
}

export function useUpdatePOSOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        stayId?: string;
        roomUnitId?: string;
        origin: POSOrderOrigin;
        settlementType?: POSSettlementType;
        customerName?: string;
        tableNumber?: string;
        notes?: string;
        serviceFeeAmount?: number;
        discountAmount?: number;
        items: Array<{
          productId: string;
          quantity: number;
          notes?: string;
        }>;
      };
    }) => {
      const { data } = await apiClient.patch(`/pos/orders/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Pedido atualizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar pedido');
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
      invalidatePOSQueries(queryClient);
      toast.success('Status do pedido atualizado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar pedido');
    },
  });
}

export function useCancelPOSOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      reason,
      refundPayments,
    }: {
      id: string;
      reason: string;
      refundPayments?: boolean;
    }) => {
      const { data } = await apiClient.post(`/pos/orders/${id}/cancel`, { reason, refundPayments });
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Pedido cancelado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cancelar pedido');
    },
  });
}

export function useActiveCashSession() {
  return useQuery<CashSession | null>({
    queryKey: ['pos-cash-session-active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pos/cash-sessions/active');
      return data.data;
    },
  });
}

export function useCashSessions() {
  return useQuery<CashSession[]>({
    queryKey: ['pos-cash-sessions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pos/cash-sessions');
      return data.data;
    },
  });
}

export function useOpenCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { openingFloat?: number; notes?: string }) => {
      const { data } = await apiClient.post('/pos/cash-sessions/open', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Caixa aberto com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao abrir caixa');
    },
  });
}

export function useCloseCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { countedCashAmount: number; notes?: string }) => {
      const { data } = await apiClient.post('/pos/cash-sessions/close', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Caixa fechado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao fechar caixa');
    },
  });
}

export function useCreateCashMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      type: Extract<CashMovementType, 'SUPPLY' | 'WITHDRAWAL' | 'CLOSING_ADJUSTMENT'>;
      amount: number;
      description: string;
      method?: PaymentMethod;
    }) => {
      const { data } = await apiClient.post('/pos/cash-sessions/movements', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Movimentação registrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar movimentação');
    },
  });
}

export function useRegisterPOSPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      orderId: string;
      amount: number;
      method: PaymentMethod;
      cashSessionId?: string;
      transactionId?: string;
      reference?: string;
      gateway?: string;
      notes?: string;
    }) => {
      const { data } = await apiClient.post('/pos/payments', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Pagamento registrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar pagamento');
    },
  });
}

export function useRefundPOSPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { paymentId: string; amount?: number; notes?: string }) => {
      const { data } = await apiClient.post('/pos/payments/refund', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidatePOSQueries(queryClient);
      toast.success('Estorno registrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar estorno');
    },
  });
}
