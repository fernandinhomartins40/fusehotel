import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { ChannelConnection, InventoryBlock, RatePlan } from '@/types/pms';

export function useRatePlans() {
  return useQuery<RatePlan[]>({
    queryKey: ['rate-plans'],
    queryFn: async () => {
      const { data } = await apiClient.get('/distribution/rate-plans');
      return data.data;
    },
  });
}

export function useCreateRatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/distribution/rate-plans', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-plans'] });
      toast.success('Tarifa cadastrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar tarifa');
    },
  });
}

export function useInventoryBlocks() {
  return useQuery<InventoryBlock[]>({
    queryKey: ['inventory-blocks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/distribution/inventory-blocks');
      return data.data;
    },
  });
}

export function useCreateInventoryBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/distribution/inventory-blocks', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-blocks'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-stats'] });
      toast.success('Bloqueio cadastrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar bloqueio');
    },
  });
}

export function useChannels() {
  return useQuery<ChannelConnection[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data } = await apiClient.get('/distribution/channels');
      return data.data;
    },
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/distribution/channels', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      toast.success('Canal cadastrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar canal');
    },
  });
}
