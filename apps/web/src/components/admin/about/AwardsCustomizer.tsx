import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
  AwardIcon,
  awardIconOptions,
  DEFAULT_AWARD_ICON,
  resolveAwardIconValue,
} from '@/lib/award-icons';
import {
  useLandingSettings,
  useUpdateLandingSettings,
  useAwardsAdmin,
  useCreateAward,
  useUpdateAward,
  useDeleteAward,
} from '@/hooks/useLanding';
import {
  AwardsSectionConfig,
  defaultAwardsSectionConfig,
  Award,
} from '@/types/about-config';
import { toast } from 'sonner';

const emptyAwardForm = {
  title: '',
  description: '',
  icon: DEFAULT_AWARD_ICON,
  isActive: true,
};

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
    defaultValues: emptyAwardForm,
  });

  const watchedValues = form.watch();
  const selectedIconValue = resolveAwardIconValue(awardForm.watch('icon')) ?? DEFAULT_AWARD_ICON;
  const selectedIconOption =
    awardIconOptions.find((option) => option.value === selectedIconValue) ?? awardIconOptions[0];
  const SelectedIcon = selectedIconOption.icon;

  const onSubmit = (data: AwardsSectionConfig) => {
    updateSettings.mutate(
      { section: 'about-awards', config: data },
      {
        onSuccess: () => {
          toast.success('Configuracoes de premios salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configuracoes');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultAwardsSectionConfig);
    toast.success('Configuracoes resetadas para o padrao');
  };

  const handleAddAward = () => {
    setIsAddingNew(true);
    setEditingAward(null);
    awardForm.reset(emptyAwardForm);
  };

  const handleEditAward = (award: Award) => {
    setEditingAward(award);
    setIsAddingNew(false);
    awardForm.reset({
      ...award,
      icon: resolveAwardIconValue(award.icon) ?? DEFAULT_AWARD_ICON,
    });
  };

  const handleSaveAward = async (data: Partial<Award>) => {
    const payload = {
      ...data,
      icon: resolveAwardIconValue(data.icon) ?? DEFAULT_AWARD_ICON,
    };

    if (editingAward) {
      updateAward.mutate(
        {
          id: editingAward.id,
          data: payload,
        },
        {
          onSuccess: () => {
            setEditingAward(null);
            awardForm.reset(emptyAwardForm);
          },
        }
      );
      return;
    }

    createAward.mutate(payload, {
      onSuccess: () => {
        setIsAddingNew(false);
        awardForm.reset(emptyAwardForm);
      },
    });
  };

  const handleDeleteAward = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este premio?')) {
      deleteAward.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingAward(null);
    setIsAddingNew(false);
    awardForm.reset(emptyAwardForm);
  };

  if (isLoading || isLoadingAwards) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configuracoes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Secao Reconhecimentos e Premios</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} type="button">
              Resetar para Padrao
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo da Secao</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Reconhecimentos e Premios"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#F9F9F9'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Titulo"
                value={form.watch('titleColor') || '#0466C8'}
                onChange={(color) => form.setValue('titleColor', color)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configuracoes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Premios e Reconhecimentos</CardTitle>
            <Button onClick={handleAddAward} size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Adicionar Premio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(isAddingNew || editingAward) && (
            <form
              onSubmit={awardForm.handleSubmit(handleSaveAward)}
              className="mb-6 space-y-4 rounded-lg border p-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input id="title" {...awardForm.register('title', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Input id="description" {...awardForm.register('description', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icone</Label>
                <Select
                  value={selectedIconValue}
                  onValueChange={(value) =>
                    awardForm.setValue('icon', value, { shouldDirty: true, shouldValidate: true })
                  }
                >
                  <SelectTrigger id="icon" className="justify-start">
                    <div className="flex items-center gap-2">
                      <SelectedIcon className="h-4 w-4 text-primary" />
                      <span>{selectedIconOption.label}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {awardIconOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Selecione um icone da biblioteca usada pelo projeto.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAward.isPending || updateAward.isPending}>
                  <Save className="mr-1 h-4 w-4" />
                  {editingAward ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-1 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {awards.map((award: Award) => (
              <div key={award.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AwardIcon
                    value={award.icon}
                    className="h-6 w-6"
                    fallbackClassName="text-3xl leading-none"
                  />
                </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <section
              className="page-section"
              style={{ backgroundColor: watchedValues.backgroundColor || '#F9F9F9' }}
            >
              <div className="page-container">
                <h2
                  className="mb-12 text-center text-3xl font-bold"
                  style={{ color: watchedValues.titleColor || '#0466C8' }}
                >
                  {watchedValues.title || 'Reconhecimentos e Premios'}
                </h2>
                <div
                  className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-${watchedValues.gridColumns || 4}`}
                >
                  {awards
                    .filter((award: Award) => award.isActive)
                    .map((award: Award) => (
                      <div
                        key={award.id}
                        className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md"
                      >
                        <div
                          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                          style={{ color: watchedValues.titleColor || '#0466C8' }}
                        >
                          <AwardIcon
                            value={award.icon}
                            className="h-8 w-8"
                            fallbackClassName="text-4xl leading-none"
                          />
                        </div>
                        <h3 className="mb-2 text-lg font-bold">{award.title}</h3>
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
