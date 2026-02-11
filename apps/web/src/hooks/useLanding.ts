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

// Service Items hooks
export const useServiceItems = () => {
  return useQuery({
    queryKey: ['service-items'],
    queryFn: async () => {
      const response = await apiClient.get('/services/service-items');
      return response.data.data;
    }
  });
};

export const useServiceItemsAdmin = () => {
  return useQuery({
    queryKey: ['service-items-admin'],
    queryFn: async () => {
      const response = await apiClient.get('/services/admin/service-items');
      return response.data.data;
    }
  });
};

export const useServiceItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['service-items', category],
    queryFn: async () => {
      const response = await apiClient.get(`/services/service-items/category/${category}`);
      return response.data.data;
    }
  });
};

export const useServiceItemsByCategoryAdmin = (category: string) => {
  return useQuery({
    queryKey: ['service-items-admin', category],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/services/admin/service-items/category/${category}`);
        return response.data.data;
      } catch (error: any) {
        // Se falhar na rota admin (401), tentar a rota pública
        if (error?.response?.status === 401) {
          const response = await apiClient.get(`/services/service-items/category/${category}`);
          return response.data.data;
        }
        throw error;
      }
    }
  });
};

export const useCreateServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/services/admin/service-items', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      queryClient.invalidateQueries({ queryKey: ['service-items-admin'] });
      toast.success('Item de serviço criado!');
    }
  });
};

export const useUpdateServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/services/admin/service-items/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      queryClient.invalidateQueries({ queryKey: ['service-items-admin'] });
      toast.success('Item atualizado!');
    }
  });
};

export const useDeleteServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/services/admin/service-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      queryClient.invalidateQueries({ queryKey: ['service-items-admin'] });
      toast.success('Item removido!');
    }
  });
};

export const useReorderServiceItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceItemIds: string[]) => {
      await apiClient.post('/services/admin/service-items/reorder', { serviceItemIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-items'] });
      queryClient.invalidateQueries({ queryKey: ['service-items-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};

// Team Members hooks
export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const response = await apiClient.get('/about/team-members');
      return response.data.data;
    }
  });
};

export const useTeamMembersAdmin = () => {
  return useQuery({
    queryKey: ['team-members-admin'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/about/admin/team-members');
        return response.data.data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          const response = await apiClient.get('/about/team-members');
          return response.data.data;
        }
        throw error;
      }
    }
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/about/admin/team-members', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-admin'] });
      toast.success('Membro da equipe criado!');
    }
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/about/admin/team-members/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-admin'] });
      toast.success('Membro atualizado!');
    }
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/about/admin/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-admin'] });
      toast.success('Membro removido!');
    }
  });
};

export const useReorderTeamMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamMemberIds: string[]) => {
      await apiClient.post('/about/admin/team-members/reorder', { teamMemberIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};

// Awards hooks
export const useAwards = () => {
  return useQuery({
    queryKey: ['awards'],
    queryFn: async () => {
      const response = await apiClient.get('/about/awards');
      return response.data.data;
    }
  });
};

export const useAwardsAdmin = () => {
  return useQuery({
    queryKey: ['awards-admin'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/about/admin/awards');
        return response.data.data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          const response = await apiClient.get('/about/awards');
          return response.data.data;
        }
        throw error;
      }
    }
  });
};

export const useCreateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/about/admin/awards', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      queryClient.invalidateQueries({ queryKey: ['awards-admin'] });
      toast.success('Prêmio criado!');
    }
  });
};

export const useUpdateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/about/admin/awards/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      queryClient.invalidateQueries({ queryKey: ['awards-admin'] });
      toast.success('Prêmio atualizado!');
    }
  });
};

export const useDeleteAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/about/admin/awards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      queryClient.invalidateQueries({ queryKey: ['awards-admin'] });
      toast.success('Prêmio removido!');
    }
  });
};

export const useReorderAwards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (awardIds: string[]) => {
      await apiClient.post('/about/admin/awards/reorder', { awardIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      queryClient.invalidateQueries({ queryKey: ['awards-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};

// FAQ Categories hooks
export const useFAQCategories = () => {
  return useQuery({
    queryKey: ['faq-categories'],
    queryFn: async () => {
      const response = await apiClient.get('/faq/categories');
      return response.data.data;
    }
  });
};

export const useFAQCategoriesAdmin = () => {
  return useQuery({
    queryKey: ['faq-categories-admin'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/faq/admin/categories');
        return response.data.data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          const response = await apiClient.get('/faq/categories');
          return response.data.data;
        }
        throw error;
      }
    }
  });
};

export const useCreateFAQCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/faq/admin/categories', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Categoria criada!');
    }
  });
};

export const useUpdateFAQCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/faq/admin/categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Categoria atualizada!');
    }
  });
};

export const useDeleteFAQCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/faq/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Categoria removida!');
    }
  });
};

export const useReorderFAQCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: { id: string; order: number }[]) => {
      await apiClient.post('/faq/admin/categories/reorder', { items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};

// FAQ Items hooks
export const useFAQItems = () => {
  return useQuery({
    queryKey: ['faq-items'],
    queryFn: async () => {
      const response = await apiClient.get('/faq/items');
      return response.data.data;
    }
  });
};

export const useFAQItemsAdmin = () => {
  return useQuery({
    queryKey: ['faq-items-admin'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/faq/admin/items');
        return response.data.data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          const response = await apiClient.get('/faq/items');
          return response.data.data;
        }
        throw error;
      }
    }
  });
};

export const useFAQItemsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['faq-items', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(`/faq/items/category/${categoryId}`);
      return response.data.data;
    },
    enabled: !!categoryId,
  });
};

export const useCreateFAQItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/faq/admin/items', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      queryClient.invalidateQueries({ queryKey: ['faq-items-admin'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Pergunta criada!');
    }
  });
};

export const useUpdateFAQItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/faq/admin/items/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      queryClient.invalidateQueries({ queryKey: ['faq-items-admin'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Pergunta atualizada!');
    }
  });
};

export const useDeleteFAQItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/faq/admin/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      queryClient.invalidateQueries({ queryKey: ['faq-items-admin'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Pergunta removida!');
    }
  });
};

export const useReorderFAQItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: { id: string; order: number }[]) => {
      await apiClient.post('/faq/admin/items/reorder', { items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      queryClient.invalidateQueries({ queryKey: ['faq-items-admin'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories-admin'] });
      toast.success('Ordem atualizada!');
    }
  });
};
