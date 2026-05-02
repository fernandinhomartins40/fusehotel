import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type {
  HousekeepingStaff,
  HousekeepingTask,
  HousekeepingTaskStatus,
  LostFoundItem,
} from '@/types/pms';

export function useHousekeepingTasks() {
  return useQuery<HousekeepingTask[]>({
    queryKey: ['housekeeping-tasks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/housekeeping/tasks');
      return data.data;
    },
  });
}

export function useUpdateHousekeepingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      assignedToId,
    }: {
      id: string;
      status: HousekeepingTaskStatus;
      assignedToId?: string;
    }) => {
      const { data } = await apiClient.patch(`/housekeeping/tasks/${id}/status`, { status, assignedToId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['housekeeping-staff'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['room-map'] });
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      toast.success('Status de governança atualizado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar tarefa');
    },
  });
}

export function useHousekeepingStaff() {
  return useQuery<HousekeepingStaff[]>({
    queryKey: ['housekeeping-staff'],
    queryFn: async () => {
      const { data } = await apiClient.get('/housekeeping/staff');
      return data.data;
    },
  });
}

export function useCreateHousekeepingStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; phone?: string; role?: string; isActive?: boolean }) => {
      const { data } = await apiClient.post('/housekeeping/staff', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping-staff'] });
      toast.success('Equipe cadastrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar equipe');
    },
  });
}

export function useLostFoundItems() {
  return useQuery<LostFoundItem[]>({
    queryKey: ['lost-found'],
    queryFn: async () => {
      const { data } = await apiClient.get('/housekeeping/lost-found');
      return data.data;
    },
  });
}

export function useCreateLostFoundItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      roomUnitId?: string;
      stayId?: string;
      title: string;
      description?: string;
      foundBy?: string;
      storedLocation?: string;
    }) => {
      const { data } = await apiClient.post('/housekeeping/lost-found', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lost-found'] });
      toast.success('Item registrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar item');
    },
  });
}

export function useUpdateLostFoundItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: payload }: { id: string; data: Partial<LostFoundItem> }) => {
      const { data } = await apiClient.put(`/housekeeping/lost-found/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lost-found'] });
      toast.success('Item atualizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar item');
    },
  });
}
