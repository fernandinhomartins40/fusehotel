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

            {/* Cores da Seção em grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Estilização dos Cards */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Estilização dos Cards de Promoções</h3>

              {/* Cores dos Cards em grid 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPickerField
                  label="Cor da Borda do Card"
                  value={form.watch('cardBorderColor') || '#E5E5E5'}
                  onChange={(color) => form.setValue('cardBorderColor', color)}
                />

                <ColorPickerField
                  label="Cor de Fundo do Card"
                  value={form.watch('cardBackground') || '#FFFFFF'}
                  onChange={(color) => form.setValue('cardBackground', color)}
                />

                <ColorPickerField
                  label="Cor de Fundo do Badge de Tipo"
                  value={form.watch('cardBadgeBackground') || '#0466C8'}
                  onChange={(color) => form.setValue('cardBadgeBackground', color)}
                />

                <ColorPickerField
                  label="Cor do Texto do Badge de Tipo"
                  value={form.watch('cardBadgeText') || '#FFFFFF'}
                  onChange={(color) => form.setValue('cardBadgeText', color)}
                />

                <ColorPickerField
                  label="Cor do Título do Card"
                  value={form.watch('cardTitleColor') || '#000000'}
                  onChange={(color) => form.setValue('cardTitleColor', color)}
                />

                <ColorPickerField
                  label="Cor da Data de Validade"
                  value={form.watch('cardDateColor') || '#6B7280'}
                  onChange={(color) => form.setValue('cardDateColor', color)}
                />

                <ColorPickerField
                  label="Cor da Descrição do Card"
                  value={form.watch('cardDescriptionColor') || '#6B7280'}
                  onChange={(color) => form.setValue('cardDescriptionColor', color)}
                />

                <ColorPickerField
                  label="Cor de Fundo das Tags de Features"
                  value={form.watch('cardFeatureBadgeBackground') || '#F3F4F6'}
                  onChange={(color) => form.setValue('cardFeatureBadgeBackground', color)}
                />

                <ColorPickerField
                  label="Cor do Texto das Tags de Features"
                  value={form.watch('cardFeatureBadgeText') || '#374151'}
                  onChange={(color) => form.setValue('cardFeatureBadgeText', color)}
                />

                <ColorPickerField
                  label="Cor do Preço Original (Tachado)"
                  value={form.watch('cardOriginalPriceColor') || '#9CA3AF'}
                  onChange={(color) => form.setValue('cardOriginalPriceColor', color)}
                />

                <ColorPickerField
                  label="Cor do Preço com Desconto"
                  value={form.watch('cardDiscountedPriceColor') || '#0466C8'}
                  onChange={(color) => form.setValue('cardDiscountedPriceColor', color)}
                />

                <ColorPickerField
                  label="Cor de Fundo do Botão"
                  value={form.watch('cardButtonBackground') || '#0466C8'}
                  onChange={(color) => form.setValue('cardButtonBackground', color)}
                />

                <ColorPickerField
                  label="Cor do Texto do Botão"
                  value={form.watch('cardButtonTextColor') || '#FFFFFF'}
                  onChange={(color) => form.setValue('cardButtonTextColor', color)}
                />

                <div className="space-y-2">
                  <Label htmlFor="cardBorderRadius">Arredondamento das Bordas</Label>
                  <Input
                    id="cardBorderRadius"
                    {...form.register('cardBorderRadius')}
                    placeholder="8px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemplos: 0px, 8px, 16px
                  </p>
                </div>
              </div>
            </div>

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
