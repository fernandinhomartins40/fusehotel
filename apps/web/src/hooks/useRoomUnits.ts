import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { RoomUnit } from '@/types/pms';

export function useRoomUnits() {
  return useQuery<RoomUnit[]>({
    queryKey: ['room-units'],
    queryFn: async () => {
      const { data } = await apiClient.get('/room-units');
      return data.data;
    },
  });
}

export function useAvailableRoomUnits(accommodationId?: string) {
  return useQuery<RoomUnit[]>({
    queryKey: ['available-room-units', accommodationId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/room-units/available/${accommodationId}`);
      return data.data;
    },
    enabled: Boolean(accommodationId),
  });
}

export function useCreateRoomUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      accommodationId: string;
      name: string;
      code: string;
      floor?: number;
      notes?: string;
    }) => {
      const { data } = await apiClient.post('/room-units', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-stats'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Quarto cadastrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar quarto');
    },
  });
}

export function useUpdateRoomUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: payload,
    }: {
      id: string;
      data: Partial<RoomUnit>;
    }) => {
      const { data } = await apiClient.put(`/room-units/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-stats'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Quarto atualizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar quarto');
    },
  });
}
