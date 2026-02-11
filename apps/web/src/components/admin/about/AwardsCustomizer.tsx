import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings, useAwardsAdmin, useCreateAward, useUpdateAward, useDeleteAward } from '@/hooks/useLanding';
import { AwardsSectionConfig, defaultAwardsSectionConfig, Award } from '@/types/about-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export const AwardsCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('about-awards');
  const { data: awards = [], isLoading: isLoadingAwards } = useAwardsAdmin();
  const updateSettings = useUpdateLandingSettings();
  const createAward = useCreateAward();
  const updateAward = useUpdateAward();
  const deleteAward = useDeleteAward();

  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const config = settingsData?.config || defaultAwardsSectionConfig;

  const form = useForm<AwardsSectionConfig>({
    defaultValues: config,
    values: config,
  });

  const awardForm = useForm<Partial<Award>>({
    defaultValues: {
      title: '',
      description: '',
      icon: '🏆',
      isActive: true,
    },
  });

  const watchedValues = form.watch();

  const onSubmit = (data: AwardsSectionConfig) => {
    updateSettings.mutate(
      { section: 'about-awards', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações de Prêmios salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultAwardsSectionConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  const handleAddAward = () => {
    setIsAddingNew(true);
    setEditingAward(null);
    awardForm.reset({
      title: '',
      description: '',
      icon: '🏆',
      isActive: true,
    });
  };

  const handleEditAward = (award: Award) => {
    setEditingAward(award);
    setIsAddingNew(false);
    awardForm.reset(award);
  };

  const handleSaveAward = async (data: Partial<Award>) => {
    if (editingAward) {
      updateAward.mutate({
        id: editingAward.id,
        data,
      }, {
        onSuccess: () => {
          setEditingAward(null);
          awardForm.reset();
        }
      });
    } else {
      createAward.mutate(data, {
        onSuccess: () => {
          setIsAddingNew(false);
          awardForm.reset();
        }
      });
    }
  };

  const handleDeleteAward = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este prêmio?')) {
      deleteAward.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingAward(null);
    setIsAddingNew(false);
    awardForm.reset();
  };

  if (isLoading || isLoadingAwards) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seção Reconhecimentos e Prêmios</CardTitle>
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
                placeholder="Reconhecimentos e Prêmios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gridColumns">Colunas do Grid</Label>
              <Input
                id="gridColumns"
                type="number"
                {...form.register('gridColumns', { valueAsNumber: true })}
                placeholder="4"
                min={1}
                max={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#F9F9F9'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título"
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

      {/* Awards Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prêmios e Reconhecimentos</CardTitle>
            <Button onClick={handleAddAward} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Prêmio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(isAddingNew || editingAward) && (
            <form onSubmit={awardForm.handleSubmit(handleSaveAward)} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" {...awardForm.register('title', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" {...awardForm.register('description', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Ícone (Emoji)</Label>
                <Input id="icon" {...awardForm.register('icon', { required: true })} placeholder="🏆" />
                <p className="text-sm text-muted-foreground">Use emojis como: 🏆 🌟 🍽️ 💼 ⭐</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAward.isPending || updateAward.isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  {editingAward ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awards.map((award: Award) => (
              <div key={award.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="text-4xl">{award.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold">{award.title}</h4>
                  <p className="text-sm text-muted-foreground">{award.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditAward(award)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteAward(award.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
              className="py-16"
              style={{ backgroundColor: watchedValues.backgroundColor || '#F9F9F9' }}
            >
              <div className="container mx-auto px-4">
                <h2
                  className="text-3xl font-bold mb-12 text-center"
                  style={{ color: watchedValues.titleColor || '#0466C8' }}
                >
                  {watchedValues.title || 'Reconhecimentos e Prêmios'}
                </h2>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${watchedValues.gridColumns || 4} gap-6`}>
                  {awards.filter((a: Award) => a.isActive).map((award: Award) => (
                    <div key={award.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                      <div
                        className="text-5xl mb-4"
                        style={{ color: watchedValues.titleColor || '#0466C8' }}
                      >
                        {award.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{award.title}</h3>
                      <p className="text-gray-700">{award.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
