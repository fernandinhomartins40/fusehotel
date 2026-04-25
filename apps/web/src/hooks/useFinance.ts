import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { FinancialEntry, FinancialSummary } from '@/types/pms';

export function useFinancialEntries() {
  return useQuery<{ entries: FinancialEntry[]; summary: FinancialSummary }>({
    queryKey: ['financial-entries'],
    queryFn: async () => {
      const { data } = await apiClient.get('/finance/entries');
      return data.data;
    },
  });
}

export function useCreateFinancialEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/finance/entries', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
      queryClient.invalidateQueries({ queryKey: ['reports-operations'] });
      toast.success('Lançamento financeiro criado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar lançamento financeiro');
    },
  });
}

export function useRegisterFinancialSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount, notes }: { id: string; amount: number; notes?: string }) => {
      const { data } = await apiClient.post(`/finance/entries/${id}/settlements`, { amount, notes });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
      queryClient.invalidateQueries({ queryKey: ['reports-operations'] });
      toast.success('Baixa financeira registrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar baixa financeira');
    },
  });
}
