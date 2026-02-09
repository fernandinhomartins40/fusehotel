import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface HotelSettings {
  id: string;
  hotelWhatsApp: string;
  hotelName: string;
  hotelEmail?: string;
  hotelPhone?: string;
  hotelAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ['hotel-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settings/hotel');
      return data.data as HotelSettings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settingsData: Partial<HotelSettings>) => {
      const { data } = await apiClient.put('/settings/hotel', settingsData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar configurações', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}
