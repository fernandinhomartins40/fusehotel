import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { AboutHeroConfig, defaultAboutHeroConfig } from '@/types/about-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';

export const AboutHeroCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('about-hero');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultAboutHeroConfig;

  const form = useForm<AboutHeroConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: AboutHeroConfig) => {
    updateSettings.mutate(
      { section: 'about-hero', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações do Hero salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultAboutHeroConfig);
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
            <CardTitle>Seção Hero - Sobre Nós</CardTitle>
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
                placeholder="Sobre Nós"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Conheça a história e a equipe..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura da Seção</Label>
              <Input
                id="height"
                {...form.register('height')}
                placeholder="400px"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#0466C8'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título"
                value={form.watch('titleColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('titleColor', color)}
              />

              <ColorPickerField
                label="Cor da Descrição"
                value={form.watch('subtitleColor') || '#FFFFFF'}
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
            <div
              className="text-white page-section-hero"
              style={{
                backgroundColor: watchedValues.backgroundColor || '#0466C8',
                height: watchedValues.height || '400px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="page-container">
                <h1
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: watchedValues.titleColor || '#FFFFFF' }}
                >
                  {watchedValues.title || 'Sobre Nós'}
                </h1>
                <p
                  className="text-xl max-w-3xl"
                  style={{ color: watchedValues.subtitleColor || '#FFFFFF' }}
                >
                  {watchedValues.description || 'Descrição da seção'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
