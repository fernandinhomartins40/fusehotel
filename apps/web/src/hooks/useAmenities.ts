import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Amenity } from '@/types/accommodation';

export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const { data } = await apiClient.get('/amenities');
      return data.data as Amenity[];
    },
  });
}
