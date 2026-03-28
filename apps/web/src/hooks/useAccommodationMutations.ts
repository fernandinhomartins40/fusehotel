import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface CreateAccommodationData {
  name: string;
  type: 'ROOM' | 'SUITE' | 'CHALET' | 'VILLA' | 'APARTMENT';
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string;
  images: Array<{ url: string; alt: string; order: number; isPrimary: boolean }>;
  amenityIds: string[];
  floor?: number;
  view?: string;
  area?: number;
  checkInTime?: string;
  checkOutTime?: string;
  extraBeds?: number;
  maxExtraBeds?: number;
  extraBedPrice?: number;
  cancellationPolicy?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface UpdateAccommodationData extends Partial<CreateAccommodationData> {}

function getAccommodationErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.errors?.[0]?.message ||
    error?.response?.data?.message ||
    fallback
  );
}

export function useCreateAccommodation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAccommodationData) => {
      const response = await apiClient.post('/accommodations', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-stats'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Acomodacao criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getAccommodationErrorMessage(error, 'Erro ao criar acomodacao'));
    },
  });
}

export function useUpdateAccommodation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAccommodationData }) => {
      const response = await apiClient.put(`/accommodations/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-stats'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Acomodacao atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getAccommodationErrorMessage(error, 'Erro ao atualizar acomodacao'));
    },
  });
}

export function useDeleteAccommodation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/accommodations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-stats'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Acomodacao removida com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getAccommodationErrorMessage(error, 'Erro ao remover acomodacao'));
    },
  });
}
