import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { FooterConfig, defaultFooterConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Footer } from '@/components/layout/Footer';

export const FooterCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('footer');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultFooterConfig;

  const form = useForm<FooterConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: FooterConfig) => {
    updateSettings.mutate(
      { section: 'footer', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações do Footer salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultFooterConfig);
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
            <CardTitle>Configurações do Footer</CardTitle>
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
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUploader
                category="LANDING_FOOTER"
                value={form.watch('logo') || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png'}
                onChange={(url) => form.setValue('logo', url)}
              />
            </div>

            {/* Texto Sobre */}
            <div className="space-y-2">
              <Label htmlFor="aboutText">Texto Sobre o Hotel</Label>
              <Textarea
                id="aboutText"
                {...form.register('aboutText')}
                placeholder="Oferecemos experiências únicas em hospedagem..."
                rows={4}
              />
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <Label htmlFor="copyright">Texto de Copyright</Label>
              <Input
                id="copyright"
                {...form.register('copyright')}
                placeholder="© 2024 FuseHotel. Todos os direitos reservados."
              />
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  {...form.register('address')}
                  placeholder="Rua Exemplo, 123 - Cidade, Estado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="(11) 1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...form.register('whatsapp')}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  {...form.register('email')}
                  type="email"
                  placeholder="contato@fusehotel.com"
                />
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div className="space-y-2">
              <Label htmlFor="businessHours">Horário de Funcionamento</Label>
              <Textarea
                id="businessHours"
                {...form.register('businessHours')}
                placeholder="Segunda - Sexta: 8h às 22h&#10;Sábado - Domingo: 10h às 20h"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Use quebras de linha para separar os horários
              </p>
            </div>

            {/* Redes Sociais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  {...form.register('facebookUrl')}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  {...form.register('instagramUrl')}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  {...form.register('linkedinUrl')}
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>

            {/* Cores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#000000'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Texto"
                value={form.watch('textColor') || '#9CA3AF'}
                onChange={(color) => form.setValue('textColor', color)}
              />

              <ColorPickerField
                label="Cor dos Títulos"
                value={form.watch('headingColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('headingColor', color)}
              />

              <ColorPickerField
                label="Cor do Copyright"
                value={form.watch('copyrightColor') || '#6B7280'}
                onChange={(color) => form.setValue('copyrightColor', color)}
              />

              <ColorPickerField
                label="Cor da Borda"
                value={form.watch('borderColor') || '#1F2937'}
                onChange={(color) => form.setValue('borderColor', color)}
              />

              <ColorPickerField
                label="Cor de Fundo do Mapa"
                value={form.watch('mapBackgroundColor') || '#1F2937'}
                onChange={(color) => form.setValue('mapBackgroundColor', color)}
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

      {/* Preview do footer - Componente real */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real do Footer
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Footer />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
