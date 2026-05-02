import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { Folio, FolioEntrySource, FolioEntryType } from '@/types/pms';

export function useFolio(stayId?: string) {
  return useQuery<Folio>({
    queryKey: ['folio', stayId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/folios/stay/${stayId}`);
      return data.data;
    },
    enabled: Boolean(stayId),
  });
}

export function useConsumeProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folioId,
      productId,
      quantity,
    }: {
      folioId: string;
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await apiClient.post(`/folios/${folioId}/consume`, {
        productId,
        quantity: quantity ?? 1,
      });
      return data.data;
    },
    onSuccess: (folio) => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      queryClient.setQueryData(['folio', folio.stayId], folio);
      toast.success('Consumo registrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar consumo');
    },
  });
}

export function useAddFolioEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folioId,
      payload,
    }: {
      folioId: string;
      payload: {
        type: FolioEntryType;
        source: FolioEntrySource;
        description: string;
        amount: number;
        quantity?: number;
      };
    }) => {
      const { data } = await apiClient.post(`/folios/${folioId}/entries`, payload);
      return data.data;
    },
    onSuccess: (folio) => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
      queryClient.setQueryData(['folio', folio.stayId], folio);
      toast.success('Lancamento registrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar lancamento');
    },
  });
}
