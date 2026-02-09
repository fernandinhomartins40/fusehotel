import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { NewsletterConfig, defaultNewsletterConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';

export const NewsletterCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('newsletter');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultNewsletterConfig;

  const form = useForm<NewsletterConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: NewsletterConfig) => {
    updateSettings.mutate(
      { section: 'newsletter', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da seção Newsletter salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultNewsletterConfig);
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
            <CardTitle>Configurações da Seção Newsletter</CardTitle>
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
                placeholder="FIQUE POR DENTRO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Inscreva-se em nossa newsletter e receba ofertas exclusivas e novidades."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonText">Texto do Botão</Label>
              <Input
                id="buttonText"
                {...form.register('buttonText')}
                placeholder="Inscrever-se"
              />
            </div>

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
              label="Cor do Botão"
              value={form.watch('buttonColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('buttonColor', color)}
            />

            <ColorPickerField
              label="Cor do Botão (Hover)"
              value={form.watch('buttonHoverColor') || '#F0F0F0'}
              onChange={(color) => form.setValue('buttonHoverColor', color)}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview da seção */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real da seção Newsletter
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-auto max-h-[600px]">
            {/* Preview em tamanho real */}
            <section
              className="py-16 px-4"
              style={{
                backgroundColor: watchedValues.backgroundColor || '#0466C8',
              }}
            >
              <div className="container mx-auto max-w-2xl text-center">
                {watchedValues.title && (
                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{
                      color: watchedValues.titleColor || '#FFFFFF',
                    }}
                  >
                    {watchedValues.title}
                  </h2>
                )}

                {watchedValues.description && (
                  <p
                    className="mb-8 text-lg"
                    style={{
                      color: watchedValues.titleColor || '#FFFFFF',
                    }}
                  >
                    {watchedValues.description}
                  </p>
                )}

                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    className="flex-1 bg-white"
                    disabled
                  />
                  <Button
                    style={{
                      backgroundColor: watchedValues.buttonColor || '#FFFFFF',
                      color: '#000000',
                    }}
                    disabled
                  >
                    {watchedValues.buttonText || 'Inscrever-se'}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
