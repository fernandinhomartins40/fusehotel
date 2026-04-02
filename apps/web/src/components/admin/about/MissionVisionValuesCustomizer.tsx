import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings } from '@/hooks/useLanding';
import { MissionVisionValuesConfig, defaultMissionVisionValuesConfig } from '@/types/about-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { Plus, Trash2 } from 'lucide-react';

export const MissionVisionValuesCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('about-mission-vision-values');
  const updateSettings = useUpdateLandingSettings();

  const config = settingsData?.config || defaultMissionVisionValuesConfig;

  const form = useForm<MissionVisionValuesConfig>({
    defaultValues: config,
    values: config,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'valuesItems',
  });

  const watchedValues = form.watch();

  const onSubmit = (data: MissionVisionValuesConfig) => {
    updateSettings.mutate(
      { section: 'about-mission-vision-values', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações de Missão, Visão e Valores salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultMissionVisionValuesConfig);
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
            <CardTitle>Seção Missão, Visão e Valores</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} type="button">
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Seção</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Missão, Visão e Valores"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="missionTitle">Título da Missão</Label>
                <Input
                  id="missionTitle"
                  {...form.register('missionTitle')}
                  placeholder="Missão"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visionTitle">Título da Visão</Label>
                <Input
                  id="visionTitle"
                  {...form.register('visionTitle')}
                  placeholder="Visão"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="missionText">Texto da Missão</Label>
              <Textarea
                id="missionText"
                {...form.register('missionText')}
                placeholder="Descreva a missão..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visionText">Texto da Visão</Label>
              <Textarea
                id="visionText"
                {...form.register('visionText')}
                placeholder="Descreva a visão..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valuesTitle">Título dos Valores</Label>
              <Input
                id="valuesTitle"
                {...form.register('valuesTitle')}
                placeholder="Valores"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Itens de Valores</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => append('')}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Valor
                </Button>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...form.register(`valuesItems.${index}` as const)}
                      placeholder={`Valor ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#F9F9F9'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título Principal"
                value={form.watch('titleColor') || '#0466C8'}
                onChange={(color) => form.setValue('titleColor', color)}
              />

              <ColorPickerField
                label="Cor dos Subtítulos"
                value={form.watch('subtitleColor') || '#0466C8'}
                onChange={(color) => form.setValue('subtitleColor', color)}
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
            <section
              className="page-section"
              style={{ backgroundColor: watchedValues.backgroundColor || '#F9F9F9' }}
            >
              <div className="page-container">
                <h2
                  className="text-3xl font-bold mb-12 text-center"
                  style={{ color: watchedValues.titleColor || '#0466C8' }}
                >
                  {watchedValues.title || 'Missão, Visão e Valores'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <h3
                      className="text-xl font-bold mb-4"
                      style={{ color: watchedValues.subtitleColor || '#0466C8' }}
                    >
                      {watchedValues.missionTitle || 'Missão'}
                    </h3>
                    <p className="text-gray-700">
                      {watchedValues.missionText || 'Texto da missão...'}
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <h3
                      className="text-xl font-bold mb-4"
                      style={{ color: watchedValues.subtitleColor || '#0466C8' }}
                    >
                      {watchedValues.visionTitle || 'Visão'}
                    </h3>
                    <p className="text-gray-700">
                      {watchedValues.visionText || 'Texto da visão...'}
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <h3
                      className="text-xl font-bold mb-4"
                      style={{ color: watchedValues.subtitleColor || '#0466C8' }}
                    >
                      {watchedValues.valuesTitle || 'Valores'}
                    </h3>
                    <ul className="text-gray-700 list-disc pl-5 space-y-2">
                      {(watchedValues.valuesItems || []).map((value, index) => (
                        <li key={index}>{value}</li>
                      ))}
                    </ul>
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
