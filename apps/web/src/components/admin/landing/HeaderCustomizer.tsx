import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { HeaderConfig, defaultHeaderConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Header } from '@/components/layout/Header';

export const HeaderCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('header');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultHeaderConfig;

  const form = useForm<HeaderConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: HeaderConfig) => {
    updateSettings.mutate(
      { section: 'header', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações do Header salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultHeaderConfig);
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
      {/* Formulário de configuração */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configurações do Header</CardTitle>
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
              <Label>Logo</Label>
              <ImageUploader
                category="LANDING_HEADER"
                value={form.watch('logo') || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png'}
                onChange={(url) => form.setValue('logo', url)}
              />
              <p className="text-sm text-muted-foreground">
                Tamanho recomendado: 210x48px
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonText">Texto do Botão</Label>
              <Input
                id="buttonText"
                {...form.register('buttonText')}
                placeholder="Área do cliente"
              />
            </div>

            {/* Cores em grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Texto"
                value={form.watch('textColor') || '#000000'}
                onChange={(color) => form.setValue('textColor', color)}
              />

              <ColorPickerField
                label="Cor do Texto (Hover)"
                value={form.watch('hoverColor') || '#0466C8'}
                onChange={(color) => form.setValue('hoverColor', color)}
              />

              <ColorPickerField
                label="Cor de Fundo do Botão"
                value={form.watch('buttonBackground') || '#0466C8'}
                onChange={(color) => form.setValue('buttonBackground', color)}
              />

              <ColorPickerField
                label="Cor de Fundo do Botão (Hover)"
                value={form.watch('buttonHover') || '#0354A8'}
                onChange={(color) => form.setValue('buttonHover', color)}
              />

              <ColorPickerField
                label="Cor do Texto do Botão"
                value={form.watch('buttonTextColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('buttonTextColor', color)}
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

      {/* Preview do header - Componente real */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real do Header
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Header />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
