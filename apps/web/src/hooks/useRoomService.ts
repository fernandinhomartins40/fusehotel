import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type {
  MyRoomServiceStay,
  POSOrder,
  POSProduct,
  RoomConditionStatus,
  RoomServiceConferencePreview,
  RoomServiceConfiguration,
  RoomServiceConfigType,
} from '@/types/pms';

function invalidateRoomServiceQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['room-service-configurations'] });
  queryClient.invalidateQueries({ queryKey: ['room-service-my-stay'] });
  queryClient.invalidateQueries({ queryKey: ['room-service-catalog'] });
  queryClient.invalidateQueries({ queryKey: ['room-service-my-orders'] });
  queryClient.invalidateQueries({ queryKey: ['frontdesk-dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['stays'] });
  queryClient.invalidateQueries({ queryKey: ['room-map'] });
  queryClient.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
  queryClient.invalidateQueries({ queryKey: ['maintenance-orders'] });
  queryClient.invalidateQueries({ queryKey: ['room-units'] });
  queryClient.invalidateQueries({ queryKey: ['folio'] });
  queryClient.invalidateQueries({ queryKey: ['pos-orders'] });
  queryClient.invalidateQueries({ queryKey: ['pos-products'] });
}

export function useRoomServiceConfigurations(roomUnitId?: string) {
  return useQuery<RoomServiceConfiguration[]>({
    queryKey: ['room-service-configurations', roomUnitId],
    queryFn: async () => {
      const { data } = await apiClient.get('/room-service/configurations', {
        params: roomUnitId ? { roomUnitId } : undefined,
      });
      return data.data;
    },
  });
}

export function useUpsertRoomServiceConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      roomUnitId: string;
      productId: string;
      configType: RoomServiceConfigType;
      quantity: number;
      notes?: string;
    }) => {
      const { data } = await apiClient.post('/room-service/configurations', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidateRoomServiceQueries(queryClient);
      toast.success('Item do serviço de quarto salvo com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao salvar item do serviço de quarto');
    },
  });
}

export function useDeleteRoomServiceConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/room-service/configurations/${id}`);
      return data.data;
    },
    onSuccess: () => {
      invalidateRoomServiceQueries(queryClient);
      toast.success('Item do serviço de quarto removido com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao remover item do serviço de quarto');
    },
  });
}

export function useRoomServiceConferencePreview(stayId?: string) {
  return useQuery<RoomServiceConferencePreview>({
    queryKey: ['room-service-conference', stayId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/room-service/checkout/${stayId}`);
      return data.data;
    },
    enabled: Boolean(stayId),
  });
}

export function useConfirmRoomServiceConference(stayId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      items: Array<{
        productId: string;
        configurationId?: string;
        source: RoomServiceConfigType;
        quantity: number;
        notes?: string;
      }>;
      notes?: string;
      roomConditionStatus: RoomConditionStatus;
      roomConditionNotes?: string;
      roomConditionChecklist: {
        minibarChecked: boolean;
        bathroomChecked: boolean;
        linensChecked: boolean;
        furnitureChecked: boolean;
        electronicsChecked: boolean;
        visualInspectionChecked: boolean;
      };
      releaseCheckout: boolean;
    }) => {
      const { data } = await apiClient.post(`/room-service/checkout/${stayId}`, payload);
      return data.data;
    },
    onSuccess: () => {
      invalidateRoomServiceQueries(queryClient);
      if (stayId) {
        queryClient.invalidateQueries({ queryKey: ['room-service-conference', stayId] });
      }
      toast.success('Conferência do quarto registrada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registrar conferência do quarto');
    },
  });
}

export function useMyRoomServiceStay() {
  return useQuery<MyRoomServiceStay | null>({
    queryKey: ['room-service-my-stay'],
    queryFn: async () => {
      const { data } = await apiClient.get('/room-service/my-stay');
      return data.data;
    },
  });
}

export function useRoomServiceCatalog() {
  return useQuery<POSProduct[]>({
    queryKey: ['room-service-catalog'],
    queryFn: async () => {
      const { data } = await apiClient.get('/room-service/catalog');
      return data.data;
    },
  });
}

export function useMyRoomServiceOrders() {
  return useQuery<POSOrder[]>({
    queryKey: ['room-service-my-orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/room-service/my-orders');
      return data.data;
    },
  });
}

export function useCreateRoomServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      items: Array<{
        productId: string;
        quantity: number;
        notes?: string;
      }>;
      notes?: string;
    }) => {
      const { data } = await apiClient.post('/room-service/my-orders', payload);
      return data.data;
    },
    onSuccess: () => {
      invalidateRoomServiceQueries(queryClient);
      toast.success('Pedido enviado para o hotel');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao solicitar serviço de quarto');
    },
  });
}

export function useToggleDoNotDisturb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { enabled: boolean; note?: string }) => {
      const { data } = await apiClient.post('/room-service/do-not-disturb', payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      invalidateRoomServiceQueries(queryClient);
      toast.success(
        variables.enabled ? 'Quarto marcado como não perturbe' : 'Sinalização de não perturbe removida'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar não perturbe');
    },
  });
}
