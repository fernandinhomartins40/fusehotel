import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { BusinessAccount, GuestFeedback, PreCheckIn, ReservationQuote } from '@/types/pms';

export function useQuotes() {
  return useQuery<ReservationQuote[]>({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/crm/quotes');
      return data.data;
    },
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/crm/quotes', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento criado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar orçamento');
    },
  });
}

export function useConvertQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/crm/quotes/${id}/convert`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      toast.success('Orçamento convertido com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao converter orçamento');
    },
  });
}

export function useBusinessAccounts() {
  return useQuery<BusinessAccount[]>({
    queryKey: ['business-accounts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/crm/business-accounts');
      return data.data;
    },
  });
}

export function useCreateBusinessAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/crm/business-accounts', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-accounts'] });
      toast.success('Conta B2B criada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar conta B2B');
    },
  });
}

export function useFeedbacks() {
  return useQuery<GuestFeedback[]>({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/crm/feedbacks');
      return data.data;
    },
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/crm/feedbacks', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast.success('Avaliação registrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar avaliação');
    },
  });
}

export function usePreCheckIns() {
  return useQuery<PreCheckIn[]>({
    queryKey: ['pre-check-ins'],
    queryFn: async () => {
      const { data } = await apiClient.get('/crm/pre-check-ins');
      return data.data;
    },
  });
}

export function useIssuePreCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const { data } = await apiClient.post('/crm/pre-check-ins/issue', { reservationId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-check-ins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Pré-check-in gerado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao gerar pré-check-in');
    },
  });
}

export function useApprovePreCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/crm/pre-check-ins/${id}/approve`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-check-ins'] });
      toast.success('Pré-check-in aprovado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao aprovar pré-check-in');
    },
  });
}

export function useSendFNRH() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/crm/pre-check-ins/${id}/fnrh`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-check-ins'] });
      toast.success('FNRH enviada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar FNRH');
    },
  });
}

export function useSendVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const { data } = await apiClient.post(`/crm/reservations/${reservationId}/voucher`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Voucher enviado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar voucher');
    },
  });
}

export function useGeneratePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const { data } = await apiClient.post(`/crm/reservations/${reservationId}/payment-link`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Link de pagamento gerado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao gerar link de pagamento');
    },
  });
}

export function usePublicPreCheckIn(token?: string) {
  return useQuery<PreCheckIn>({
    queryKey: ['public-pre-check-in', token],
    queryFn: async () => {
      const { data } = await apiClient.get(`/crm/pre-check-in/${token}`);
      return data.data;
    },
    enabled: Boolean(token),
  });
}

export function useSubmitPublicPreCheckIn() {
  return useMutation({
    mutationFn: async ({ token, payload }: { token: string; payload: any }) => {
      const { data } = await apiClient.post(`/crm/pre-check-in/${token}/submit`, payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Pré-check-in enviado com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar pré-check-in');
    },
  });
}
