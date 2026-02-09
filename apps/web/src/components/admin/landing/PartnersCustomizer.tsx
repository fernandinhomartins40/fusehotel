import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLandingSettings, useUpdateLandingSettings, usePartnersAdmin, useCreatePartner, useDeletePartner } from '@/hooks/useLanding';
import { PartnersConfig, defaultPartnersConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
  isActive: boolean;
}

export const PartnersCustomizer = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('partners');
  const { data: partners = [], isLoading: partnersLoading } = usePartnersAdmin();
  const updateSettings = useUpdateLandingSettings();
  const createPartner = useCreatePartner();
  const deletePartner = useDeletePartner();

  const [newPartner, setNewPartner] = useState({ name: '', logo: '', url: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  const config = settingsData?.config || defaultPartnersConfig;

  const form = useForm<PartnersConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  const handleCreatePartner = () => {
    if (!newPartner.name || !newPartner.logo) {
      toast.error('Preencha nome e logo');
      return;
    }

    createPartner.mutate(
      {
        name: newPartner.name,
        logo: newPartner.logo,
        url: newPartner.url || undefined,
        isActive: true
      },
      {
        onSuccess: () => {
          setNewPartner({ name: '', logo: '', url: '' });
          setShowNewForm(false);
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este parceiro?')) {
      deletePartner.mutate(id);
    }
  };

  const onSubmit = (data: PartnersConfig) => {
    updateSettings.mutate(
      { section: 'partners', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da seção Parceiros salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultPartnersConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  if (settingsLoading || partnersLoading) {
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
            <CardTitle>Configurações da Seção Parceiros</CardTitle>
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
              <Label htmlFor="title">Título da Seção</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="PARCEIROS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundGradient">Gradiente de Fundo</Label>
              <Input
                id="backgroundGradient"
                {...form.register('backgroundGradient')}
                placeholder="linear-gradient(148deg, #05111D 0%, #0C3864 100%)"
              />
            </div>

            <ColorPickerField
              label="Cor do Título"
              value={form.watch('titleColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('titleColor', color)}
            />

            <div className="space-y-2">
              <Label htmlFor="logoFilter">Filtro CSS para Logos</Label>
              <Input
                id="logoFilter"
                {...form.register('logoFilter')}
                placeholder="grayscale(100%) brightness(200%)"
              />
              <p className="text-sm text-muted-foreground">
                Ex: grayscale(100%) para logos em escala de cinza
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Gerenciamento de Parceiros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Parceiros</CardTitle>
            <Button
              onClick={() => setShowNewForm(!showNewForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Parceiro
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário de novo parceiro */}
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Parceiro</h3>

              <div className="space-y-2">
                <Label>Logo</Label>
                <ImageUploader
                  category="LANDING_PARTNERS"
                  value={newPartner.logo}
                  onChange={(url) => setNewPartner(prev => ({ ...prev, logo: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Nome do Parceiro</Label>
                <Input
                  value={newPartner.name}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do Parceiro"
                />
              </div>

              <div className="space-y-2">
                <Label>URL (Opcional)</Label>
                <Input
                  value={newPartner.url}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://parceiro.com"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreatePartner} disabled={createPartner.isPending}>
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de parceiros */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partners.map((partner: Partner) => (
              <div key={partner.id} className="border rounded-lg p-4 space-y-2">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-16 object-contain"
                />
                <p className="text-sm font-medium text-center">{partner.name}</p>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(partner.id)}
                  disabled={deletePartner.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              </div>
            ))}
          </div>

          {partners.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum parceiro cadastrado. Clique em "Novo Parceiro" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview da seção - Componente real */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real da seção Parceiros
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <PartnersSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
