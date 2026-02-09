import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  useLandingSettings,
  useUpdateLandingSettings,
  useHighlightsAdmin,
  useCreateHighlight,
  useUpdateHighlight,
  useDeleteHighlight
} from '@/hooks/useLanding';
import { HighlightsConfig, defaultHighlightsConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export const HighlightsCustomizer = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('highlights');
  const { data: highlights = [], isLoading: highlightsLoading } = useHighlightsAdmin();
  const updateSettings = useUpdateLandingSettings();
  const createHighlight = useCreateHighlight();
  const updateHighlight = useUpdateHighlight();
  const deleteHighlight = useDeleteHighlight();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', imageUrl: '' });
  const [newHighlight, setNewHighlight] = useState({ title: '', subtitle: '', imageUrl: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  const config = settingsData?.config || defaultHighlightsConfig;

  const form = useForm<HighlightsConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: HighlightsConfig) => {
    updateSettings.mutate(
      { section: 'highlights', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da seção Destaques salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultHighlightsConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  const handleCreateHighlight = () => {
    if (!newHighlight.title || !newHighlight.subtitle || !newHighlight.imageUrl) {
      toast.error('Preencha todos os campos');
      return;
    }

    createHighlight.mutate(
      {
        title: newHighlight.title,
        subtitle: newHighlight.subtitle,
        imageUrl: newHighlight.imageUrl,
        isActive: true
      },
      {
        onSuccess: () => {
          setNewHighlight({ title: '', subtitle: '', imageUrl: '' });
          setShowNewForm(false);
        }
      }
    );
  };

  const handleStartEdit = (highlight: Highlight) => {
    setEditingId(highlight.id);
    setEditForm({
      title: highlight.title,
      subtitle: highlight.subtitle,
      imageUrl: highlight.imageUrl
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.title || !editForm.subtitle || !editForm.imageUrl) {
      toast.error('Preencha todos os campos');
      return;
    }

    updateHighlight.mutate(
      {
        id,
        data: {
          title: editForm.title,
          subtitle: editForm.subtitle,
          imageUrl: editForm.imageUrl
        }
      },
      {
        onSuccess: () => {
          setEditingId(null);
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este destaque?')) {
      deleteHighlight.mutate(id);
    }
  };

  if (settingsLoading || highlightsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário de configuração */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configurações da Seção Destaques</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              type="button"
            >
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="DESTAQUES"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                {...form.register('subtitle')}
                placeholder="EXPERIÊNCIAS INCRÍVEIS ESPERAM POR VOCÊ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Descubra as experiências que tornam nosso resort único..."
                rows={3}
              />
            </div>

            <ColorPickerField
              label="Cor de Fundo"
              value={form.watch('backgroundColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('backgroundColor', color)}
            />

            <ColorPickerField
              label="Cor do Título"
              value={form.watch('titleColor') || '#1D1D1F'}
              onChange={(color) => form.setValue('titleColor', color)}
            />

            <ColorPickerField
              label="Cor do Subtítulo/Descrição"
              value={form.watch('subtitleColor') || '#676C76'}
              onChange={(color) => form.setValue('subtitleColor', color)}
            />

            <ColorPickerField
              label="Cor do Título do Card"
              value={form.watch('cardTitleColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('cardTitleColor', color)}
            />

            <ColorPickerField
              label="Cor do Subtítulo do Card"
              value={form.watch('cardSubtitleColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('cardSubtitleColor', color)}
            />

            <div className="space-y-2">
              <Label htmlFor="overlayGradient">Gradiente de Overlay dos Cards</Label>
              <Input
                id="overlayGradient"
                {...form.register('overlayGradient')}
                placeholder="linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
              />
              <p className="text-sm text-muted-foreground">
                CSS gradient para o overlay sobre as imagens dos cards
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Gerenciamento de Highlights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Destaques</CardTitle>
            <Button
              onClick={() => setShowNewForm(!showNewForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Destaque
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Adicione e gerencie os destaques que aparecerão na landing page
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário de novo destaque */}
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Destaque</h3>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUploader
                  category="LANDING_HIGHLIGHTS"
                  value={newHighlight.imageUrl}
                  onChange={(url) => setNewHighlight(prev => ({ ...prev, imageUrl: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="SPA DE LUXO"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={newHighlight.subtitle}
                  onChange={(e) => setNewHighlight(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Relaxamento e Rejuvenescimento"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateHighlight} disabled={createHighlight.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((highlight: Highlight) => (
              <div key={highlight.id} className="border rounded-lg overflow-hidden">
                {editingId === highlight.id ? (
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Imagem</Label>
                      <ImageUploader
                        category="LANDING_HIGHLIGHTS"
                        value={editForm.imageUrl}
                        onChange={(url) => setEditForm(prev => ({ ...prev, imageUrl: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subtítulo</Label>
                      <Input
                        value={editForm.subtitle}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(highlight.id)}
                        disabled={updateHighlight.isPending}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <img
                        src={highlight.imageUrl}
                        alt={highlight.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                        <h4 className="text-white text-xl font-bold">{highlight.title}</h4>
                        <p className="text-white text-sm">{highlight.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(highlight)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(highlight.id)}
                        disabled={deleteHighlight.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {highlights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum destaque cadastrado. Clique em "Novo Destaque" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview da seção - Componente real */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real da seção Destaques
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <HighlightsSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
