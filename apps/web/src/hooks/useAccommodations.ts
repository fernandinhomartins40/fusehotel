import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Accommodation } from '@/types/accommodation';

const normalizeAccommodation = (accommodation: any): Accommodation => ({
  ...accommodation,
  pricePerNight:
    accommodation?.pricePerNight !== undefined && accommodation?.pricePerNight !== null
      ? Number(accommodation.pricePerNight)
      : 0,
  area:
    accommodation?.area !== undefined && accommodation?.area !== null
      ? Number(accommodation.area)
      : accommodation?.area ?? null,
  extraBedPrice:
    accommodation?.extraBedPrice !== undefined && accommodation?.extraBedPrice !== null
      ? Number(accommodation.extraBedPrice)
      : 0,
});

export function useAccommodations(filters?: any) {
  return useQuery({
    queryKey: ['accommodations', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/accommodations', { params: filters });
      return (data.data || []).map(normalizeAccommodation);
    },
  });
}

export function useAccommodation(id: string) {
  return useQuery({
    queryKey: ['accommodation', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accommodations/${id}`);
      return normalizeAccommodation(data.data);
    },
    enabled: !!id,
  });
}

export function useAccommodationBySlug(slug: string) {
  return useQuery({
    queryKey: ['accommodation', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accommodations/slug/${slug}`);
      return normalizeAccommodation(data.data);
    },
    enabled: !!slug,
  });
}
