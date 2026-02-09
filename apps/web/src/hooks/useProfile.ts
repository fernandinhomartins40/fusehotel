import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  cpf: string | null;
  role: string;
  isActive: boolean;
  isProvisional: boolean;
  emailVerified: boolean;
  profileImage: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  cpf?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/profile');
      return data.data as UserProfile;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileData) => {
      const { data } = await apiClient.put('/users/profile', profileData);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.setQueryData(['auth-user'], (old: any) => ({
        ...old,
        ...data,
      }));
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar perfil', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordData) => {
      const { data } = await apiClient.put('/auth/change-password', passwordData);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao alterar senha', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}
