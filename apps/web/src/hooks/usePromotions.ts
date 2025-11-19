import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function usePromotions(filters?: any) {
  return useQuery({
    queryKey: ['promotions', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/promotions', { params: filters });
      return data.data;
    },
  });
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/promotions/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function usePromotionBySlug(slug: string) {
  return useQuery({
    queryKey: ['promotion', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/promotions/slug/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}
