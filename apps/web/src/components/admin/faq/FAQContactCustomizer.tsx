import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { FAQContactConfig, defaultFAQContactConfig } from '@/types/faq-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';

export const FAQContactCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('faq-contact');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultFAQContactConfig;

  const form = useForm<FAQContactConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: FAQContactConfig) => {
    updateSettings.mutate(
      { section: 'faq-contact', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações de contato salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultFAQContactConfig);
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
            <CardTitle>Seção de Contato</CardTitle>
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
                placeholder="Ainda tem dúvidas?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Se não encontrou a resposta que procura..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input
                  id="buttonText"
                  {...form.register('buttonText')}
                  placeholder="Fale Conosco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonUrl">URL do Botão</Label>
                <Input
                  id="buttonUrl"
                  {...form.register('buttonUrl')}
                  placeholder="/contato"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#F9FAFB'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título"
                value={form.watch('titleColor') || '#000000'}
                onChange={(color) => form.setValue('titleColor', color)}
              />

              <ColorPickerField
                label="Cor da Descrição"
                value={form.watch('subtitleColor') || '#374151'}
                onChange={(color) => form.setValue('subtitleColor', color)}
              />

              <ColorPickerField
                label="Cor do Botão"
                value={form.watch('buttonColor') || '#0466C8'}
                onChange={(color) => form.setValue('buttonColor', color)}
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

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div
              className="p-8 rounded-lg"
              style={{ backgroundColor: watchedValues.backgroundColor || '#F9FAFB' }}
            >
              <h2
                className="text-2xl font-bold mb-4 text-center"
                style={{ color: watchedValues.titleColor || '#000000' }}
              >
                {watchedValues.title || 'Ainda tem dúvidas?'}
              </h2>
              <p
                className="text-center mb-6"
                style={{ color: watchedValues.subtitleColor || '#374151' }}
              >
                {watchedValues.description || 'Se não encontrou a resposta que procura, entre em contato conosco diretamente.'}
              </p>
              <div className="flex justify-center">
                <a
                  href={watchedValues.buttonUrl || '/contato'}
                  className="px-8 py-3 font-medium rounded-full transition-colors"
                  style={{
                    backgroundColor: watchedValues.buttonColor || '#0466C8',
                    color: watchedValues.buttonTextColor || '#FFFFFF',
                  }}
                >
                  {watchedValues.buttonText || 'Fale Conosco'}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
