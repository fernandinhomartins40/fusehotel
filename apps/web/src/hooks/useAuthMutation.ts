import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useLogin() {
  const { toast } = useToast();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Atualizar contexto de autenticação
      setUser(data.data.user);

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${data.data.user.name}!`,
      });

      window.location.href = '/';
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error.response?.data?.message || 'Verifique suas credenciais',
      });
    },
  });
}

export function useRegister() {
  const { toast } = useToast();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
      phone?: string;
      cpf?: string;
      acceptTerms: boolean;
    }) => {
      const { data: response } = await apiClient.post('/auth/register', data);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Atualizar contexto de autenticação
      setUser(data.data.user);

      toast({
        title: 'Cadastro realizado!',
        description: 'Seja bem-vindo ao FuseHotel!',
      });

      window.location.href = '/';
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error.response?.data?.message || 'Tente novamente mais tarde',
      });
    },
  });
}

export function useLogout() {
  const { toast } = useToast();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
      window.location.href = '/';
    },
  });
}
