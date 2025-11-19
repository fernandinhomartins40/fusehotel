import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export function useMyReservations() {
  return useQuery({
    queryKey: ['my-reservations'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reservations/my-reservations');
      return data.data;
    },
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/reservations/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData: any) => {
      const { data } = await apiClient.post('/reservations', reservationData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      toast({
        title: 'Reserva criada!',
        description: `Código: ${data.data.reservationCode}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar reserva',
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

export function useCancelReservation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await apiClient.post(`/reservations/${id}/cancel`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      toast({
        title: 'Reserva cancelada',
        description: 'Sua reserva foi cancelada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar reserva',
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}
