import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { AccommodationsConfig, defaultAccommodationsConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { AccommodationsSection } from '@/components/sections/AccommodationsSection';

export const AccommodationsCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('accommodations');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultAccommodationsConfig;

  const form = useForm<AccommodationsConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: AccommodationsConfig) => {
    updateSettings.mutate(
      { section: 'accommodations', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da seção Acomodações salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultAccommodationsConfig);
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
            <CardTitle>Configurações da Seção Acomodações</CardTitle>
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
            {/* Campos de texto em grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="ACOMODAÇÕES"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  {...form.register('subtitle')}
                  placeholder="Conforto e Elegância"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Descubra nossas acomodações luxuosas e confortáveis, projetadas para proporcionar uma experiência inesquecível."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonText">Texto do Botão</Label>
              <Input
                id="buttonText"
                {...form.register('buttonText')}
                placeholder="Ver Detalhes"
              />
            </div>

            {/* Cores da Seção em grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#F9F9F9'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título"
                value={form.watch('titleColor') || '#000000'}
                onChange={(color) => form.setValue('titleColor', color)}
              />

              <ColorPickerField
                label="Cor do Subtítulo"
                value={form.watch('subtitleColor') || '#666666'}
                onChange={(color) => form.setValue('subtitleColor', color)}
              />

              <ColorPickerField
                label="Cor do Botão"
                value={form.watch('buttonColor') || '#0466C8'}
                onChange={(color) => form.setValue('buttonColor', color)}
              />

              <ColorPickerField
                label="Cor do Botão (Hover)"
                value={form.watch('buttonHoverColor') || '#0354A8'}
                onChange={(color) => form.setValue('buttonHoverColor', color)}
              />
            </div>

            {/* Estilização dos Cards */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Estilização dos Cards de Acomodações</h3>

              {/* Cores dos Cards em grid 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPickerField
                  label="Cor de Fundo do Badge"
                  value={form.watch('cardBadgeBackground') || '#0466C8'}
                  onChange={(color) => form.setValue('cardBadgeBackground', color)}
                />

                <ColorPickerField
                  label="Cor do Texto do Badge"
                  value={form.watch('cardBadgeText') || '#FFFFFF'}
                  onChange={(color) => form.setValue('cardBadgeText', color)}
                />

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
                  label="Cor do Título do Card"
                  value={form.watch('cardTitleColor') || '#1D1D1F'}
                  onChange={(color) => form.setValue('cardTitleColor', color)}
                />

                <ColorPickerField
                  label="Cor da Descrição do Card"
                  value={form.watch('cardDescriptionColor') || '#6B7280'}
                  onChange={(color) => form.setValue('cardDescriptionColor', color)}
                />

                <ColorPickerField
                  label="Cor dos Ícones"
                  value={form.watch('cardIconColor') || '#0466C8'}
                  onChange={(color) => form.setValue('cardIconColor', color)}
                />

                <ColorPickerField
                  label="Cor do Label do Preço"
                  value={form.watch('cardPriceLabelColor') || '#6B7280'}
                  onChange={(color) => form.setValue('cardPriceLabelColor', color)}
                />

                <ColorPickerField
                  label="Cor do Valor do Preço"
                  value={form.watch('cardPriceValueColor') || '#000000'}
                  onChange={(color) => form.setValue('cardPriceValueColor', color)}
                />

                <ColorPickerField
                  label="Cor da Borda do Botão"
                  value={form.watch('cardButtonBorderColor') || '#0466C8'}
                  onChange={(color) => form.setValue('cardButtonBorderColor', color)}
                />

                <ColorPickerField
                  label="Cor do Texto do Botão"
                  value={form.watch('cardButtonTextColor') || '#0466C8'}
                  onChange={(color) => form.setValue('cardButtonTextColor', color)}
                />

                <ColorPickerField
                  label="Cor de Fundo do Botão (Hover)"
                  value={form.watch('cardButtonHoverBackground') || '#0466C8'}
                  onChange={(color) => form.setValue('cardButtonHoverBackground', color)}
                />

                <ColorPickerField
                  label="Cor do Texto do Botão (Hover)"
                  value={form.watch('cardButtonHoverText') || '#FFFFFF'}
                  onChange={(color) => form.setValue('cardButtonHoverText', color)}
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
            Visualização em tempo real da seção Acomodações
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <AccommodationsSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
