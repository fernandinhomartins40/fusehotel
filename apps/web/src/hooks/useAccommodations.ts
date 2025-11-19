import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useAccommodations(filters?: any) {
  return useQuery({
    queryKey: ['accommodations', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/accommodations', { params: filters });
      return data.data;
    },
  });
}

export function useAccommodation(id: string) {
  return useQuery({
    queryKey: ['accommodation', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accommodations/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useAccommodationBySlug(slug: string) {
  return useQuery({
    queryKey: ['accommodation', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accommodations/slug/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}
