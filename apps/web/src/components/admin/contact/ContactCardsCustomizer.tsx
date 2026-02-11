import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { ContactCardsConfig, defaultContactCardsConfig } from '@/types/contact-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export const ContactCardsCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('contact-cards');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultContactCardsConfig;

  const form = useForm<ContactCardsConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: ContactCardsConfig) => {
    updateSettings.mutate(
      { section: 'contact-cards', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações dos cartões salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultContactCardsConfig);
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
            <CardTitle>Cartões de Contato</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} type="button">
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone Card */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Cartão de Telefone
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneTitle">Título</Label>
                  <Input id="phoneTitle" {...form.register('phoneTitle')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Número</Label>
                  <Input id="phoneNumber" {...form.register('phoneNumber')} placeholder="(11) 5555-5555" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneDescription">Descrição</Label>
                <Textarea id="phoneDescription" {...form.register('phoneDescription')} rows={2} />
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Cartão de WhatsApp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappTitle">Título</Label>
                  <Input id="whatsappTitle" {...form.register('whatsappTitle')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">Número</Label>
                  <Input id="whatsappNumber" {...form.register('whatsappNumber')} placeholder="(11) 99999-9999" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappDescription">Descrição</Label>
                <Textarea id="whatsappDescription" {...form.register('whatsappDescription')} rows={2} />
              </div>
            </div>

            {/* Email Card */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Cartão de E-mail
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailTitle">Título</Label>
                  <Input id="emailTitle" {...form.register('emailTitle')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">E-mail</Label>
                  <Input id="emailAddress" {...form.register('emailAddress')} placeholder="contato@hotel.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailDescription">Descrição</Label>
                <Textarea id="emailDescription" {...form.register('emailDescription')} rows={2} />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#F9FAFB'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />
              <ColorPickerField
                label="Cor do Ícone"
                value={form.watch('cardIconColor') || '#0466C8'}
                onChange={(color) => form.setValue('cardIconColor', color)}
              />
              <ColorPickerField
                label="Cor do Link"
                value={form.watch('cardLinkColor') || '#0466C8'}
                onChange={(color) => form.setValue('cardLinkColor', color)}
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
          <div className="border rounded-lg overflow-hidden p-12" style={{ backgroundColor: watchedValues.backgroundColor || '#F9FAFB' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Phone Card */}
              <Card className="border-none shadow-md">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${watchedValues.cardIconColor || '#0466C8'}20` }}
                  >
                    <Phone className="h-8 w-8" style={{ color: watchedValues.cardIconColor || '#0466C8' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{watchedValues.phoneTitle || 'Telefone'}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{watchedValues.phoneDescription}</p>
                  <span style={{ color: watchedValues.cardLinkColor || '#0466C8' }} className="font-medium">
                    {watchedValues.phoneNumber || '(11) 5555-5555'}
                  </span>
                </CardContent>
              </Card>

              {/* WhatsApp Card */}
              <Card className="border-none shadow-md">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${watchedValues.cardIconColor || '#0466C8'}20` }}
                  >
                    <MessageSquare className="h-8 w-8" style={{ color: watchedValues.cardIconColor || '#0466C8' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{watchedValues.whatsappTitle || 'WhatsApp'}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{watchedValues.whatsappDescription}</p>
                  <span style={{ color: watchedValues.cardLinkColor || '#0466C8' }} className="font-medium">
                    {watchedValues.whatsappNumber || '(11) 99999-9999'}
                  </span>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="border-none shadow-md">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${watchedValues.cardIconColor || '#0466C8'}20` }}
                  >
                    <Mail className="h-8 w-8" style={{ color: watchedValues.cardIconColor || '#0466C8' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{watchedValues.emailTitle || 'E-mail'}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{watchedValues.emailDescription}</p>
                  <span style={{ color: watchedValues.cardLinkColor || '#0466C8' }} className="font-medium">
                    {watchedValues.emailAddress || 'contato@hotel.com'}
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
