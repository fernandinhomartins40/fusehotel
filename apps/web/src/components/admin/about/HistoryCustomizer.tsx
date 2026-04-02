import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { HistorySectionConfig, defaultHistorySectionConfig } from '@/types/about-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';

export const HistoryCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('about-history');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultHistorySectionConfig;

  const form = useForm<HistorySectionConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: HistorySectionConfig) => {
    updateSettings.mutate(
      { section: 'about-history', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da História salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultHistorySectionConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seção Nossa História</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} type="button">
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
                placeholder="Nossa História"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paragraph1">Parágrafo 1</Label>
              <Textarea
                id="paragraph1"
                {...form.register('paragraph1')}
                placeholder="Primeiro parágrafo da história..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paragraph2">Parágrafo 2</Label>
              <Textarea
                id="paragraph2"
                {...form.register('paragraph2')}
                placeholder="Segundo parágrafo da história..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paragraph3">Parágrafo 3</Label>
              <Textarea
                id="paragraph3"
                {...form.register('paragraph3')}
                placeholder="Terceiro parágrafo da história..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem</Label>
              <ImageUploader
                category="ABOUT_HISTORY"
                value={form.watch('image') || ''}
                onChange={(url) => form.setValue('image', url)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageAlt">Texto Alternativo da Imagem</Label>
              <Input
                id="imageAlt"
                {...form.register('imageAlt')}
                placeholder="Vista do Hotel Águas Claras"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título"
                value={form.watch('titleColor') || '#0466C8'}
                onChange={(color) => form.setValue('titleColor', color)}
              />

              <ColorPickerField
                label="Cor do Texto"
                value={form.watch('subtitleColor') || '#666666'}
                onChange={(color) => form.setValue('subtitleColor', color)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <section
              className="page-section"
              style={{ backgroundColor: watchedValues.backgroundColor || '#FFFFFF' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2
                    className="text-3xl font-bold mb-6"
                    style={{ color: watchedValues.titleColor || '#0466C8' }}
                  >
                    {watchedValues.title || 'Nossa História'}
                  </h2>
                  <p
                    className="mb-4"
                    style={{ color: watchedValues.subtitleColor || '#666666' }}
                  >
                    {watchedValues.paragraph1 || 'Primeiro parágrafo...'}
                  </p>
                  <p
                    className="mb-4"
                    style={{ color: watchedValues.subtitleColor || '#666666' }}
                  >
                    {watchedValues.paragraph2 || 'Segundo parágrafo...'}
                  </p>
                  <p style={{ color: watchedValues.subtitleColor || '#666666' }}>
                    {watchedValues.paragraph3 || 'Terceiro parágrafo...'}
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg h-96">
                  {watchedValues.image ? (
                    <img
                      src={watchedValues.image}
                      alt={watchedValues.imageAlt || 'História'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Imagem não definida</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
