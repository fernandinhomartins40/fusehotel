import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useLogin(redirectTo?: string) {
  const { toast } = useToast();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      // Tokens agora são armazenados em httpOnly cookies automaticamente pelo backend
      // Apenas salvar dados do usuário no localStorage para acesso local
      const user = data.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar contexto de autenticação
      setUser(user);

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${user.name}!`,
      });

      // Redirecionar baseado no role do usuário ou redirectTo fornecido
      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/area-do-cliente';
      }
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
      // Tokens agora são armazenados em httpOnly cookies automaticamente pelo backend
      // Apenas salvar dados do usuário no localStorage para acesso local
      const user = data.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar contexto de autenticação
      setUser(user);

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

export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Solicitação enviada',
        description: 'Se o email existir, você receberá as instruções de redefinição.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao solicitar recuperação',
        description: error.response?.data?.message || 'Tente novamente mais tarde',
      });
    },
  });
}

export function useResetPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const { data } = await apiClient.post('/auth/reset-password', payload);
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Senha redefinida',
        description: 'Você já pode acessar sua conta com a nova senha.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao redefinir senha',
        description: error.response?.data?.message || 'Token inválido ou expirado',
      });
    },
  });
}
