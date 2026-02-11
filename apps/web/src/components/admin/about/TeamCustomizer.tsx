import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings, useTeamMembersAdmin, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from '@/hooks/useLanding';
import { TeamSectionConfig, defaultTeamSectionConfig, TeamMember } from '@/types/about-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export const TeamCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('about-team');
  const { data: teamMembers = [], isLoading: isLoadingMembers } = useTeamMembersAdmin();
  const updateSettings = useUpdateLandingSettings();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const config = settingsData?.config || defaultTeamSectionConfig;

  const form = useForm<TeamSectionConfig>({
    defaultValues: config,
    values: config,
  });

  const memberForm = useForm<Partial<TeamMember>>({
    defaultValues: {
      name: '',
      role: '',
      description: '',
      image: '',
      isActive: true,
    },
  });

  const watchedValues = form.watch();

  const onSubmit = (data: TeamSectionConfig) => {
    updateSettings.mutate(
      { section: 'about-team', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da Equipe salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultTeamSectionConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  const handleAddMember = () => {
    setIsAddingNew(true);
    setEditingMember(null);
    memberForm.reset({
      name: '',
      role: '',
      description: '',
      image: '',
      isActive: true,
    });
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsAddingNew(false);
    memberForm.reset(member);
  };

  const handleSaveMember = async (data: Partial<TeamMember>) => {
    if (editingMember) {
      updateMember.mutate({
        id: editingMember.id,
        data,
      }, {
        onSuccess: () => {
          setEditingMember(null);
          memberForm.reset();
        }
      });
    } else {
      createMember.mutate(data, {
        onSuccess: () => {
          setIsAddingNew(false);
          memberForm.reset();
        }
      });
    }
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      deleteMember.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setIsAddingNew(false);
    memberForm.reset();
  };

  if (isLoading || isLoadingMembers) {
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
            <CardTitle>Seção Nossa Equipe</CardTitle>
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
                placeholder="Nossa Equipe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gridColumns">Colunas do Grid</Label>
              <Input
                id="gridColumns"
                type="number"
                {...form.register('gridColumns', { valueAsNumber: true })}
                placeholder="3"
                min={1}
                max={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título"
                value={form.watch('titleColor') || '#0466C8'}
                onChange={(color) => form.setValue('titleColor', color)}
              />

              <ColorPickerField
                label="Cor da Função"
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

      {/* Team Members Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Membros da Equipe</CardTitle>
            <Button onClick={handleAddMember} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(isAddingNew || editingMember) && (
            <form onSubmit={memberForm.handleSubmit(handleSaveMember)} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...memberForm.register('name', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input id="role" {...memberForm.register('role', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...memberForm.register('description', { required: true })} rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Foto</Label>
                <ImageUploader
                  category="ABOUT_TEAM"
                  value={memberForm.watch('image') || ''}
                  onChange={(url) => memberForm.setValue('image', url)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  {editingMember ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {teamMembers.map((member: TeamMember) => (
              <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditMember(member)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteMember(member.id)}>
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
              className="container mx-auto px-4 py-16"
              style={{ backgroundColor: watchedValues.backgroundColor || '#FFFFFF' }}
            >
              <h2
                className="text-3xl font-bold mb-12 text-center"
                style={{ color: watchedValues.titleColor || '#0466C8' }}
              >
                {watchedValues.title || 'Nossa Equipe'}
              </h2>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${watchedValues.gridColumns || 3} gap-8`}>
                {teamMembers.filter((m: TeamMember) => m.isActive).map((member: TeamMember) => (
                  <div key={member.id} className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p
                      className="mb-3"
                      style={{ color: watchedValues.subtitleColor || '#0466C8' }}
                    >
                      {member.role}
                    </p>
                    <p className="text-gray-700 text-center max-w-xs">{member.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
