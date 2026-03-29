import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Promotion, PromotionFilters, CreatePromotionData } from '@/types/promotion';

const normalizePromotion = (promotion: any): Promotion => ({
  ...promotion,
  originalPrice:
    promotion?.originalPrice !== undefined && promotion?.originalPrice !== null
      ? Number(promotion.originalPrice)
      : null,
  discountedPrice:
    promotion?.discountedPrice !== undefined && promotion?.discountedPrice !== null
      ? Number(promotion.discountedPrice)
      : null,
  discountPercent:
    promotion?.discountPercent !== undefined && promotion?.discountPercent !== null
      ? Number(promotion.discountPercent)
      : null,
});

function getPromotionErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.errors?.[0]?.message ||
    error?.response?.data?.message ||
    fallback
  );
}

export function usePromotions(filters?: PromotionFilters) {
  return useQuery({
    queryKey: ['promotions', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/promotions', { params: filters });
      return (data.data || []).map(normalizePromotion);
    },
  });
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/promotions/${id}`);
      return normalizePromotion(data.data);
    },
    enabled: !!id,
  });
}

export function usePromotionBySlug(slug: string) {
  return useQuery({
    queryKey: ['promotion', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/promotions/slug/${slug}`);
      return normalizePromotion(data.data);
    },
    enabled: !!slug,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotionData: CreatePromotionData) => {
      const { data } = await apiClient.post('/promotions', promotionData);
      return data.data as Promotion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promocao criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getPromotionErrorMessage(error, 'Erro ao criar promocao'));
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePromotionData> }) => {
      const response = await apiClient.put(`/promotions/${id}`, data);
      return response.data.data as Promotion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promocao atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getPromotionErrorMessage(error, 'Erro ao atualizar promocao'));
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/promotions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promocao removida com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getPromotionErrorMessage(error, 'Erro ao remover promocao'));
    },
  });
}
