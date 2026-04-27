import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { FrontdeskDashboard, Stay } from '@/types/pms';

export function useFrontdeskDashboard(date?: string) {
  return useQuery<FrontdeskDashboard>({
    queryKey: ['frontdesk-dashboard', date],
    queryFn: async () => {
      const { data } = await apiClient.get('/frontdesk/dashboard', {
        params: date ? { date } : undefined,
      });
      return data.data;
    },
  });
}

export function useStays() {
  return useQuery<Stay[]>({
    queryKey: ['stays'],
    queryFn: async () => {
      const { data } = await apiClient.get('/frontdesk/stays');
      return data.data;
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { reservationId: string; roomUnitId: string; notes?: string }) => {
      const { data } = await apiClient.post('/frontdesk/check-in', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Check-in realizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao realizar check-in');
    },
  });
}

export function useWalkInCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      roomUnitId: string;
      customerId?: string;
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      guestWhatsApp?: string;
      guestCpf?: string;
      checkInDate: string;
      checkOutDate: string;
      adults: number;
      children?: number;
      notes?: string;
    }) => {
      const { data } = await apiClient.post('/frontdesk/walk-in', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Walk-in realizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao realizar walk-in');
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { stayId: string; notes?: string }) => {
      const { data } = await apiClient.post('/frontdesk/check-out', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['room-units'] });
      queryClient.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Check-out realizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao realizar check-out');
    },
  });
}
