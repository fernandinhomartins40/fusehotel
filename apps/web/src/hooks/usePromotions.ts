import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Promotion, PromotionFilters, CreatePromotionData } from '@/types/promotion';

// Hook para listar promoções (público ou admin)
export function usePromotions(filters?: PromotionFilters) {
  return useQuery({
    queryKey: ['promotions', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/promotions', { params: filters });
      return data.data as Promotion[];
    },
  });
}

// Hook para buscar uma promoção por ID
export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/promotions/${id}`);
      return data.data as Promotion;
    },
    enabled: !!id,
  });
}

// Hook para buscar uma promoção por slug
export function usePromotionBySlug(slug: string) {
  return useQuery({
    queryKey: ['promotion', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/promotions/slug/${slug}`);
      return data.data as Promotion;
    },
    enabled: !!slug,
  });
}

// Hook para criar promoção (admin)
export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotionData: CreatePromotionData) => {
      const { data } = await apiClient.post('/promotions', promotionData);
      return data.data as Promotion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promoção criada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar promoção';
      toast.error(message);
    },
  });
}

// Hook para atualizar promoção (admin)
export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePromotionData> }) => {
      const response = await apiClient.put(`/promotions/${id}`, data);
      return response.data.data as Promotion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promoção atualizada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar promoção';
      toast.error(message);
    },
  });
}

// Hook para deletar promoção (admin)
export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/promotions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promoção removida com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao remover promoção';
      toast.error(message);
    },
  });
}
