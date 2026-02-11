import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Visual Identity
export function useVisualIdentity() {
  return useQuery({
    queryKey: ['visual-identity'],
    queryFn: async () => {
      const { data } = await apiClient.get('/system-settings/visual-identity');
      return data.data;
    },
  });
}

export function useUpdateVisualIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visualData: {
      logo?: string;
      footerLogo?: string;
      favicon?: string;
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
    }) => {
      const { data } = await apiClient.put('/system-settings/visual-identity', visualData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visual-identity'] });
      toast.success('Identidade visual atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar identidade visual', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

// SEO
export function useSEO() {
  return useQuery({
    queryKey: ['seo-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/system-settings/seo');
      return data.data;
    },
  });
}

export function useUpdateSEO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seoData: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      ogImage?: string;
    }) => {
      const { data } = await apiClient.put('/system-settings/seo', seoData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-settings'] });
      toast.success('Configurações de SEO atualizadas com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar SEO', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

// Content (Policies, Terms, etc.)
export function useContent(key: string) {
  return useQuery({
    queryKey: ['content', key],
    queryFn: async () => {
      const { data } = await apiClient.get(`/system-settings/content/${key}`);
      return data.data.content;
    },
    enabled: !!key,
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, content }: { key: string; content: string }) => {
      const { data } = await apiClient.put(`/system-settings/content/${key}`, { content });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', variables.key] });
      toast.success('Conteúdo atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar conteúdo', {
        description: error.response?.data?.message || 'Tente novamente',
      });
    },
  });
}

// Public Settings (for frontend use)
export function usePublicSettings() {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/system-settings/public');
      return data.data;
    },
  });
}
