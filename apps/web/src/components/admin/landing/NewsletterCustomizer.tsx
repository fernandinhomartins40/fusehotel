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
            {/* Preview em tamanho real - seguindo o padrão do NewsletterSection */}
            <section
              className="page-section-tight"
              style={{
                backgroundColor: watchedValues.backgroundColor || '#0466C8',
              }}
            >
              <div className="page-container flex flex-col md:flex-row justify-between items-center">
                {/* Title */}
                <div className="mb-6 md:mb-0">
                  <h3
                    className="text-[56px] font-extrabold tracking-tight leading-none uppercase"
                    style={{
                      color: watchedValues.titleColor || '#FFFFFF',
                    }}
                  >
                    {watchedValues.title || 'NEWSLETTER'}
                  </h3>
                </div>

                {/* Form */}
                <div className="w-full md:max-w-md">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow">
                      <Input
                        type="email"
                        placeholder="E-mail"
                        className="w-full bg-white text-gray-800 h-12 px-4"
                        disabled
                      />
                    </div>
                    <Button
                      className="h-12 px-6"
                      style={{
                        backgroundColor: watchedValues.buttonColor || '#000000',
                        color: '#FFFFFF',
                      }}
                      disabled
                    >
                      {watchedValues.buttonText || 'Enviar'}
                    </Button>
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm mt-3"
                    style={{
                      color: watchedValues.titleColor || '#FFFFFF',
                    }}
                  >
                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8125 6.70508H11.1562V4.73633C11.1562 2.44492 9.29141 0.580078 7 0.580078C4.70859 0.580078 2.84375 2.44492 2.84375 4.73633V6.70508H2.1875C1.46289 6.70508 0.875 7.29297 0.875 8.01758V13.2676C0.875 13.9922 1.46289 14.5801 2.1875 14.5801H11.8125C12.5371 14.5801 13.125 13.9922 13.125 13.2676V8.01758C13.125 7.29297 12.5371 6.70508 11.8125 6.70508Z" fill="currentColor"/>
                    </svg>
                    <span>Seu email está protegido. Nunca enviaremos SPAM.</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
