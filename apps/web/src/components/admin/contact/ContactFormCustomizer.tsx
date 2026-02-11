import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { ContactFormConfig, defaultContactFormConfig } from '@/types/contact-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { MapPin, Clock } from 'lucide-react';

export const ContactFormCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('contact-form');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultContactFormConfig;

  const form = useForm<ContactFormConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const onSubmit = (data: ContactFormConfig) => {
    updateSettings.mutate(
      { section: 'contact-form', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações do formulário salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultContactFormConfig);
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
            <CardTitle>Formulário e Localização</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} type="button">
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Section */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">Seção do Formulário</h3>
              <div className="space-y-2">
                <Label htmlFor="formTitle">Título do Formulário</Label>
                <Input id="formTitle" {...form.register('formTitle')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formDescription">Descrição do Formulário</Label>
                <Textarea id="formDescription" {...form.register('formDescription')} rows={2} />
              </div>
            </div>

            {/* Map Section */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">Seção do Mapa</h3>
              <div className="space-y-2">
                <Label htmlFor="mapTitle">Título do Mapa</Label>
                <Input id="mapTitle" {...form.register('mapTitle')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapDescription">Descrição do Mapa</Label>
                <Textarea id="mapDescription" {...form.register('mapDescription')} rows={2} />
              </div>
            </div>

            {/* Address Section */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </h3>
              <div className="space-y-2">
                <Label htmlFor="addressLabel">Label do Endereço</Label>
                <Input id="addressLabel" {...form.register('addressLabel')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Linha 1</Label>
                <Input id="addressLine1" {...form.register('addressLine1')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Linha 2</Label>
                <Input id="addressLine2" {...form.register('addressLine2')} />
              </div>
            </div>

            {/* Hours Section */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Funcionamento
              </h3>
              <div className="space-y-2">
                <Label htmlFor="hoursLabel">Label</Label>
                <Input id="hoursLabel" {...form.register('hoursLabel')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hoursLine1">Linha 1</Label>
                <Input id="hoursLine1" {...form.register('hoursLine1')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hoursLine2">Linha 2</Label>
                <Input id="hoursLine2" {...form.register('hoursLine2')} />
              </div>
            </div>

            {/* Button Section */}
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">Botão de Envio</h3>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input id="buttonText" {...form.register('buttonText')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPickerField
                  label="Cor do Botão"
                  value={form.watch('buttonColor') || '#0466C8'}
                  onChange={(color) => form.setValue('buttonColor', color)}
                />
                <ColorPickerField
                  label="Cor do Texto"
                  value={form.watch('buttonTextColor') || '#FFFFFF'}
                  onChange={(color) => form.setValue('buttonTextColor', color)}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />
              <ColorPickerField
                label="Cor dos Títulos"
                value={form.watch('titleColor') || '#0466C8'}
                onChange={(color) => form.setValue('titleColor', color)}
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
          <div className="border rounded-lg overflow-hidden p-8" style={{ backgroundColor: watchedValues.backgroundColor || '#FFFFFF' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form Preview */}
              <div>
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: watchedValues.titleColor || '#0466C8' }}
                >
                  {watchedValues.formTitle || 'Envie uma Mensagem'}
                </h2>
                <p className="text-gray-700 mb-4 text-sm">
                  {watchedValues.formDescription}
                </p>
                <Button
                  className="w-full rounded-full"
                  style={{
                    backgroundColor: watchedValues.buttonColor || '#0466C8',
                    color: watchedValues.buttonTextColor || '#FFFFFF',
                  }}
                >
                  {watchedValues.buttonText || 'Enviar Mensagem'}
                </Button>
              </div>

              {/* Map and Info Preview */}
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-3xl font-bold mb-6"
                    style={{ color: watchedValues.titleColor || '#0466C8' }}
                  >
                    {watchedValues.mapTitle || 'Nossa Localização'}
                  </h2>
                  <p className="text-gray-700 mb-4 text-sm">
                    {watchedValues.mapDescription}
                  </p>
                  <div className="h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-[#0466C8] mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{watchedValues.addressLabel}</p>
                        <p className="text-gray-600 text-sm">{watchedValues.addressLine1}</p>
                        <p className="text-gray-600 text-sm">{watchedValues.addressLine2}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-[#0466C8] mr-3" />
                      <div>
                        <p className="font-medium">{watchedValues.hoursLabel}</p>
                        <p className="text-gray-600 text-sm">{watchedValues.hoursLine1}</p>
                        <p className="text-gray-600 text-sm">{watchedValues.hoursLine2}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
