import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export const useHeroSlides = () => {
  return useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/hero-slides');
      return response.data.data;
    }
  });
};

export const useHeroSlidesAdmin = () => {
  return useQuery({
    queryKey: ['hero-slides-admin'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/admin/hero-slides');
      return response.data.data;
    }
  });
};

export const useCreateHeroSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/landing/admin/hero-slides', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] });
      toast.success('Slide criado com sucesso!');
    }
  });
};

export const useUpdateHeroSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/landing/admin/hero-slides/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      toast.success('Slide atualizado!');
    }
  });
};

export const useDeleteHeroSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/landing/admin/hero-slides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      toast.success('Slide deletado!');
    }
  });
};

export const useLandingSettings = (section: string) => {
  return useQuery({
    queryKey: ['landing-settings', section],
    queryFn: async () => {
      const response = await apiClient.get(`/landing/settings/${section}`);
      return response.data.data;
    }
  });
};

export const useUpdateLandingSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ section, config }: { section: string; config: any }) => {
      const response = await apiClient.post(`/landing/admin/settings/${section}`, { config });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['landing-settings', variables.section] });
      toast.success('Configurações salvas!');
    }
  });
};

// Gallery hooks
export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/gallery');
      return response.data.data;
    }
  });
};

export const useGalleryImagesAdmin = () => {
  return useQuery({
    queryKey: ['gallery-images-admin'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/admin/gallery');
      return response.data.data;
    }
  });
};

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/landing/admin/gallery', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      toast.success('Imagem adicionada à galeria!');
    }
  });
};

export const useUpdateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/landing/admin/gallery/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      toast.success('Imagem atualizada!');
    }
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/landing/admin/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      toast.success('Imagem removida da galeria!');
    }
  });
};

export const useReorderGalleryImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageIds: string[]) => {
      await apiClient.post('/landing/admin/gallery/reorder', { imageIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};

// Highlights hooks
export const useHighlights = () => {
  return useQuery({
    queryKey: ['highlights'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/highlights');
      return response.data.data;
    }
  });
};

export const useHighlightsAdmin = () => {
  return useQuery({
    queryKey: ['highlights-admin'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/admin/highlights');
      return response.data.data;
    }
  });
};

export const useCreateHighlight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/landing/admin/highlights', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['highlights-admin'] });
      toast.success('Destaque criado!');
    }
  });
};

export const useUpdateHighlight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/landing/admin/highlights/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['highlights-admin'] });
      toast.success('Destaque atualizado!');
    }
  });
};

export const useDeleteHighlight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/landing/admin/highlights/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['highlights-admin'] });
      toast.success('Destaque removido!');
    }
  });
};

export const useReorderHighlights = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (highlightIds: string[]) => {
      await apiClient.post('/landing/admin/highlights/reorder', { highlightIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['highlights-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};

// Partners hooks
export const usePartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/partners');
      return response.data.data;
    }
  });
};

export const usePartnersAdmin = () => {
  return useQuery({
    queryKey: ['partners-admin'],
    queryFn: async () => {
      const response = await apiClient.get('/landing/admin/partners');
      return response.data.data;
    }
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/landing/admin/partners', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners-admin'] });
      toast.success('Parceiro criado!');
    }
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/landing/admin/partners/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners-admin'] });
      toast.success('Parceiro atualizado!');
    }
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/landing/admin/partners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners-admin'] });
      toast.success('Parceiro removido!');
    }
  });
};

export const useReorderPartners = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (partnerIds: string[]) => {
      await apiClient.post('/landing/admin/partners/reorder', { partnerIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};
