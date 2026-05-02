import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { MaintenanceOrder, MaintenanceOrderPriority, MaintenanceOrderStatus } from '@/types/pms';

export function useMaintenanceOrders() {
  return useQuery<MaintenanceOrder[]>({
    queryKey: ['maintenance-orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/maintenance');
      return data.data;
    },
  });
}

export function useCreateMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      roomUnitId: string;
      title: string;
      description?: string;
      priority?: MaintenanceOrderPriority;
      notes?: string;
      estimatedCost?: number;
      markRoomOutOfOrder?: boolean;
    }) => {
      const { data } = await apiClient.post('/maintenance', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-orders'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['room-map'] });
      queryClient.invalidateQueries({ queryKey: ['reports-operations'] });
      toast.success('Ordem de manutenção criada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar ordem de manutenção');
    },
  });
}

export function useUpdateMaintenanceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: payload,
    }: {
      id: string;
      data: {
        status?: MaintenanceOrderStatus;
        priority?: MaintenanceOrderPriority;
        notes?: string;
        actualCost?: number;
      };
    }) => {
      const { data } = await apiClient.patch(`/maintenance/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-orders'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['room-map'] });
      queryClient.invalidateQueries({ queryKey: ['reports-operations'] });
      toast.success('Ordem de manutenção atualizada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar ordem de manutenção');
    },
  });
}

