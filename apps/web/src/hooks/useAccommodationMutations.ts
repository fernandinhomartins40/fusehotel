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

export function useCreateAccommodation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAccommodationData) => {
      const response = await apiClient.post('/accommodations', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Acomodação criada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar acomodação';
      toast.error(message);
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
      toast.success('Acomodação atualizada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar acomodação';
      toast.error(message);
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
      toast.success('Acomodação removida com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao remover acomodação';
      toast.error(message);
    },
  });
}
