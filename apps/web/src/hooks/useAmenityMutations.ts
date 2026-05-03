import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Amenity, AmenityCategory } from '@/types/accommodation';

export interface AmenityPayload {
  name: string;
  icon: string;
  category: AmenityCategory;
  description?: string;
}

function getAmenityErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || fallback;
}

export function useCreateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AmenityPayload) => {
      const { data } = await apiClient.post('/amenities', payload);
      return data.data as Amenity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Comodidade criada com sucesso');
    },
    onError: (error: any) => {
      toast.error(getAmenityErrorMessage(error, 'Erro ao criar comodidade'));
    },
  });
}

export function useUpdateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<AmenityPayload> }) => {
      const { data } = await apiClient.put(`/amenities/${id}`, payload);
      return data.data as Amenity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Comodidade atualizada com sucesso');
    },
    onError: (error: any) => {
      toast.error(getAmenityErrorMessage(error, 'Erro ao atualizar comodidade'));
    },
  });
}

export function useDeleteAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/amenities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Comodidade exclu?da com sucesso');
    },
    onError: (error: any) => {
      toast.error(getAmenityErrorMessage(error, 'Erro ao excluir comodidade'));
    },
  });
}
