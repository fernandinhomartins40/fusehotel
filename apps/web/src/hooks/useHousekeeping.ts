import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { HousekeepingTask, HousekeepingTaskStatus } from '@/types/pms';

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
    mutationFn: async ({ id, status }: { id: string; status: HousekeepingTaskStatus }) => {
      const { data } = await apiClient.patch(`/housekeeping/tasks/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      toast.success('Status de governanca atualizado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar tarefa');
    },
  });
}
