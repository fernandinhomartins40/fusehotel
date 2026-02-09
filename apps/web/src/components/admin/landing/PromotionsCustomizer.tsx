import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { PromotionsConfig, defaultPromotionsConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { PromotionsSection } from '@/components/sections/PromotionsSection';

export const PromotionsCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('promotions');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultPromotionsConfig;

  const form = useForm<PromotionsConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: PromotionsConfig) => {
    updateSettings.mutate(
      { section: 'promotions', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da seção Promoções salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultPromotionsConfig);
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
            <CardTitle>Configurações da Seção Promoções</CardTitle>
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
                placeholder="PROMOÇÕES ESPECIAIS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Aproveite nossas ofertas exclusivas e economize em sua próxima estadia."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonText">Texto do Botão</Label>
              <Input
                id="buttonText"
                {...form.register('buttonText')}
                placeholder="Ver Promoção"
              />
            </div>

            <ColorPickerField
              label="Cor de Fundo"
              value={form.watch('backgroundColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('backgroundColor', color)}
            />

            <ColorPickerField
              label="Cor do Título"
              value={form.watch('titleColor') || '#000000'}
              onChange={(color) => form.setValue('titleColor', color)}
            />

            <ColorPickerField
              label="Cor do Botão"
              value={form.watch('buttonColor') || '#0466C8'}
              onChange={(color) => form.setValue('buttonColor', color)}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview da seção - Componente real */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real da seção Promoções
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <PromotionsSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
