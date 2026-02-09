import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  cpf: string | null;
  role: string;
  isProvisional: boolean;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count?: {
    reservations: number;
  };
}

export interface CustomerFilters {
  search?: string;
  isProvisional?: boolean;
  isActive?: boolean;
  role?: string;
}

export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isProvisional !== undefined) params.append('isProvisional', String(filters.isProvisional));
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.role) params.append('role', filters.role);

      const { data } = await apiClient.get(`/users?${params.toString()}`);
      return data.data as Customer[];
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${id}`);
      return data.data as Customer;
    },
    enabled: !!id,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...customerData }: Partial<Customer> & { id: string }) => {
      const { data } = await apiClient.put(`/users/${id}`, customerData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar cliente', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/users/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao remover cliente', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

export function useToggleCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await apiClient.patch(`/users/${id}/status`, { isActive });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(
        variables.isActive
          ? 'Cliente ativado com sucesso!'
          : 'Cliente desativado com sucesso!'
      );
    },
    onError: (error: any) => {
      toast.error('Erro ao alterar status do cliente', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}
