import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Edit2, Save, X, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  useLandingSettings,
  useUpdateLandingSettings,
  useServiceItemsByCategoryAdmin,
  useCreateServiceItem,
  useUpdateServiceItem,
  useDeleteServiceItem,
} from '@/hooks/useLanding';
import {
  ServicesHeroConfig,
  AccommodationSectionConfig,
  GastronomySectionConfig,
  RecreationSectionConfig,
  BusinessSectionConfig,
  SpecialSectionConfig,
  CTASectionConfig,
  defaultServicesHeroConfig,
  defaultAccommodationSectionConfig,
  defaultGastronomySectionConfig,
  defaultRecreationSectionConfig,
  defaultBusinessSectionConfig,
  defaultSpecialSectionConfig,
  defaultCTASectionConfig,
  ServiceItem,
} from '@/types/services-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';

export const ServicesCustomizer = () => {
  const [activeTab, setActiveTab] = useState('hero');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Página de Serviços</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure o conteúdo e visual da página de serviços do hotel
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="accommodation">Hospedagem</TabsTrigger>
              <TabsTrigger value="gastronomy">Gastronomia</TabsTrigger>
              <TabsTrigger value="recreation">Lazer</TabsTrigger>
              <TabsTrigger value="business">Empresarial</TabsTrigger>
              <TabsTrigger value="special">Especiais</TabsTrigger>
              <TabsTrigger value="cta">CTA</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-6 mt-6">
              <HeroSectionEditor />
            </TabsContent>

            <TabsContent value="accommodation" className="space-y-6 mt-6">
              <AccommodationSectionEditor />
            </TabsContent>

            <TabsContent value="gastronomy" className="space-y-6 mt-6">
              <GastronomySectionEditor />
            </TabsContent>

            <TabsContent value="recreation" className="space-y-6 mt-6">
              <RecreationSectionEditor />
            </TabsContent>

            <TabsContent value="business" className="space-y-6 mt-6">
              <BusinessSectionEditor />
            </TabsContent>

            <TabsContent value="special" className="space-y-6 mt-6">
              <SpecialSectionEditor />
            </TabsContent>

            <TabsContent value="cta" className="space-y-6 mt-6">
              <CTASectionEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Hero Section Editor
const HeroSectionEditor = () => {
  const { data: settingsData, isLoading } = useLandingSettings('services-hero');
  const updateSettings = useUpdateLandingSettings();

  const config = (settingsData?.config as ServicesHeroConfig) || defaultServicesHeroConfig;

  const form = useForm<ServicesHeroConfig>({
    defaultValues: config,
    values: config,
  });

  const onSubmit = (data: ServicesHeroConfig) => {
    // Validar e formatar altura
    let formattedHeight = data.height;
    if (formattedHeight && /^\d+$/.test(formattedHeight)) {
      formattedHeight = `${formattedHeight}px`;
    }

    updateSettings.mutate(
      { section: 'services-hero', config: { ...data, height: formattedHeight } },
      {
        onSuccess: () => {
          toast.success('Configurações do Hero salvas!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultServicesHeroConfig);
    toast.success('Configurações resetadas');
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Seção Hero</CardTitle>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Resetar Padrão
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
              placeholder="Nossos Serviços"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Textarea
              id="subtitle"
              {...form.register('subtitle')}
              placeholder="Explore todas as comodidades..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Altura da Seção</Label>
            <Input
              id="height"
              {...form.register('height')}
              placeholder="400px"
            />
            <p className="text-xs text-muted-foreground">
              Exemplos: 300px, 400px, 50vh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPickerField
              label="Cor de Fundo"
              value={form.watch('backgroundColor') || '#0466C8'}
              onChange={(color) => form.setValue('backgroundColor', color)}
            />

            <ColorPickerField
              label="Cor do Título"
              value={form.watch('titleColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('titleColor', color)}
            />

            <ColorPickerField
              label="Cor do Subtítulo"
              value={form.watch('subtitleColor') || '#FFFFFF'}
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
  );
};

// Accommodation Section Editor
const AccommodationSectionEditor = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('services-accommodation');
  const { data: items = [], isLoading: itemsLoading } = useServiceItemsByCategoryAdmin('ACCOMMODATION');
  const updateSettings = useUpdateLandingSettings();
  const createItem = useCreateServiceItem();
  const updateItem = useUpdateServiceItem();
  const deleteItem = useDeleteServiceItem();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', description: '', image: '', features: [] as string[], price: '', isChargeable: false });
  const [newItem, setNewItem] = useState({ title: '', subtitle: '', description: '', image: '', features: [] as string[], price: '', isChargeable: false });
  const [showNewForm, setShowNewForm] = useState(false);

  const config = (settingsData?.config as AccommodationSectionConfig) || defaultAccommodationSectionConfig;

  const form = useForm<AccommodationSectionConfig>({
    defaultValues: config,
    values: config,
  });

  const onSubmit = (data: AccommodationSectionConfig) => {
    updateSettings.mutate(
      { section: 'services-accommodation', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações salvas!');
        },
      }
    );
  };

  const handleCreateItem = () => {
    if (!newItem.title || !newItem.description || !newItem.image) {
      toast.error('Preencha título, descrição e imagem');
      return;
    }

    createItem.mutate(
      {
        category: 'ACCOMMODATION',
        title: newItem.title,
        subtitle: newItem.subtitle,
        description: newItem.description,
        image: newItem.image,
        features: newItem.features.filter(f => f.trim() !== ''),
        isActive: true,
        price: newItem.price ? parseFloat(newItem.price) : null,
        isChargeable: newItem.isChargeable,
      },
      {
        onSuccess: () => {
          setNewItem({ title: '', subtitle: '', description: '', image: '', features: [], price: '', isChargeable: false });
          setShowNewForm(false);
        }
      }
    );
  };

  const handleStartEdit = (item: ServiceItem) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description,
      image: item.image,
      features: item.features,
      price: item.price != null ? String(item.price) : '',
      isChargeable: item.isChargeable ?? false,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateItem.mutate(
      {
        id,
        data: {
          title: editForm.title,
          subtitle: editForm.subtitle,
          description: editForm.description,
          image: editForm.image,
          features: editForm.features.filter(f => f.trim() !== ''),
          price: editForm.price ? parseFloat(editForm.price) : null,
          isChargeable: editForm.isChargeable,
        }
      },
      {
        onSuccess: () => {
          setEditingId(null);
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      deleteItem.mutate(id);
    }
  };

  if (settingsLoading || itemsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Configurações da Seção */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input {...form.register('title')} placeholder="Hospedagem" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input {...form.register('subtitle')} placeholder="Acomodações" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea {...form.register('description')} rows={2} />
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

              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input {...form.register('buttonText')} placeholder="Ver Todas as Acomodações" />
              </div>

              <ColorPickerField
                label="Cor do Botão"
                value={form.watch('buttonColor') || '#0466C8'}
                onChange={(color) => form.setValue('buttonColor', color)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Gerenciamento de Itens */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Itens de Hospedagem</CardTitle>
            <Button size="sm" onClick={() => setShowNewForm(!showNewForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Item</h3>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUploader
                  category="GENERAL"
                  value={newItem.image}
                  onChange={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Quarto Standard"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtítulo (opcional)</Label>
                <Input
                  value={newItem.subtitle}
                  onChange={(e) => setNewItem(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Confortável e aconchegante"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição completa..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={newItem.isChargeable}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isChargeable: checked }))}
                  />
                  <Label>Lançável na conta</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateItem} disabled={createItem.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: ServiceItem) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                {editingId === item.id ? (
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Imagem</Label>
                      <ImageUploader
                        category="GENERAL"
                        value={editForm.image}
                        onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={editForm.isChargeable}
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isChargeable: checked }))}
                        />
                        <Label>Lançável na conta</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={updateItem.isPending}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                      <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
                      {(item.price != null || item.isChargeable) && (
                        <div className="flex items-center gap-2 mt-2">
                          {item.price != null && <span className="text-sm font-semibold text-green-700">R$ {Number(item.price).toFixed(2)}</span>}
                          {item.isChargeable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              <DollarSign className="h-3 w-3" /> Lançável
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(item)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteItem.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item cadastrado. Clique em "Novo Item" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Gastronomy Section Editor
const GastronomySectionEditor = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('services-gastronomy');
  const { data: items = [], isLoading: itemsLoading } = useServiceItemsByCategoryAdmin('GASTRONOMY');
  const updateSettings = useUpdateLandingSettings();
  const createItem = useCreateServiceItem();
  const updateItem = useUpdateServiceItem();
  const deleteItem = useDeleteServiceItem();

  const config = (settingsData?.config as GastronomySectionConfig) || defaultGastronomySectionConfig;

  const form = useForm<GastronomySectionConfig>({
    defaultValues: config,
    values: config,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', description: '', image: '', features: [] as string[], price: '', isChargeable: false });
  const [newItem, setNewItem] = useState({ title: '', subtitle: '', description: '', image: '', features: [] as string[], price: '', isChargeable: false });
  const [showNewForm, setShowNewForm] = useState(false);

  const onSubmit = (data: GastronomySectionConfig) => {
    updateSettings.mutate({ section: 'services-gastronomy', config: data });
  };

  const handleCreateItem = () => {
    if (!newItem.title.trim() || !newItem.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    createItem.mutate({
      category: 'GASTRONOMY',
      title: newItem.title,
      subtitle: newItem.subtitle || '',
      description: newItem.description,
      image: newItem.image,
      features: newItem.features.filter(f => f.trim()),
      isActive: true,
      price: newItem.price ? parseFloat(newItem.price) : null,
      isChargeable: newItem.isChargeable,
    }, {
      onSuccess: () => {
        setNewItem({ title: '', subtitle: '', description: '', image: '', features: [], price: '', isChargeable: false });
        setShowNewForm(false);
      }
    });
  };

  const handleUpdateItem = (id: string) => {
    if (!editForm.title.trim() || !editForm.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    updateItem.mutate({
      id,
      data: {
        title: editForm.title,
        subtitle: editForm.subtitle || '',
        description: editForm.description,
        image: editForm.image,
        features: editForm.features.filter(f => f.trim()),
        price: editForm.price ? parseFloat(editForm.price) : null,
        isChargeable: editForm.isChargeable,
      }
    }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      deleteItem.mutate(id);
    }
  };

  if (settingsLoading || itemsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input {...form.register('title')} placeholder="Gastronomia" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input {...form.register('subtitle')} placeholder="Experiências Culinárias" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea {...form.register('description')} rows={2} />
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

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Itens de Gastronomia</CardTitle>
            <Button size="sm" onClick={() => setShowNewForm(!showNewForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Item</h3>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUploader
                  category="GENERAL"
                  value={newItem.image}
                  onChange={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Restaurante Principal"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtítulo (opcional)</Label>
                <Input
                  value={newItem.subtitle}
                  onChange={(e) => setNewItem(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Cozinha Internacional"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descreva a experiência gastronômica..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={newItem.isChargeable}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isChargeable: checked }))}
                  />
                  <Label>Lançável na conta</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateItem} disabled={createItem.isPending}>
                  {createItem.isPending ? 'Criando...' : 'Criar Item'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="p-4 border rounded-lg">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Imagem</Label>
                      <ImageUploader
                        category="GENERAL"
                        value={editForm.image}
                        onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subtítulo (opcional)</Label>
                      <Input
                        value={editForm.subtitle}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={editForm.isChargeable}
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isChargeable: checked }))}
                        />
                        <Label>Lançável na conta</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateItem(item.id)} disabled={updateItem.isPending}>
                        {updateItem.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.subtitle && <p className="text-sm text-gray-500">{item.subtitle}</p>}
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {(item.price != null || item.isChargeable) && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.price != null && <span className="text-sm font-semibold text-green-700">R$ {Number(item.price).toFixed(2)}</span>}
                          {item.isChargeable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              <DollarSign className="h-3 w-3" /> Lançável
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditForm({
                            title: item.title,
                            subtitle: item.subtitle || '',
                            description: item.description,
                            image: item.image,
                            features: item.features || [],
                            price: item.price != null ? String(item.price) : '',
                            isChargeable: item.isChargeable ?? false,
                          });
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item cadastrado. Clique em "Novo Item" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const RecreationSectionEditor = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('services-recreation');
  const { data: items = [], isLoading: itemsLoading } = useServiceItemsByCategoryAdmin('RECREATION');
  const updateSettings = useUpdateLandingSettings();
  const createItem = useCreateServiceItem();
  const updateItem = useUpdateServiceItem();
  const deleteItem = useDeleteServiceItem();

  const config = (settingsData?.config as RecreationSectionConfig) || defaultRecreationSectionConfig;

  const form = useForm<RecreationSectionConfig>({
    defaultValues: config,
    values: config,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', image: '', price: '', isChargeable: false });
  const [newItem, setNewItem] = useState({ title: '', description: '', image: '', price: '', isChargeable: false });
  const [showNewForm, setShowNewForm] = useState(false);

  const onSubmit = (data: RecreationSectionConfig) => {
    updateSettings.mutate({ section: 'services-recreation', config: data });
  };

  const handleCreateItem = () => {
    if (!newItem.title.trim() || !newItem.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    createItem.mutate({
      category: 'RECREATION',
      title: newItem.title,
      description: newItem.description,
      image: newItem.image,
      features: [],
      isActive: true,
      price: newItem.price ? parseFloat(newItem.price) : null,
      isChargeable: newItem.isChargeable,
    }, {
      onSuccess: () => {
        setNewItem({ title: '', description: '', image: '', price: '', isChargeable: false });
        setShowNewForm(false);
      }
    });
  };

  const handleUpdateItem = (id: string) => {
    if (!editForm.title.trim() || !editForm.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    updateItem.mutate({
      id,
      data: {
        title: editForm.title,
        description: editForm.description,
        image: editForm.image,
        price: editForm.price ? parseFloat(editForm.price) : null,
        isChargeable: editForm.isChargeable,
      }
    }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      deleteItem.mutate(id);
    }
  };

  if (settingsLoading || itemsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input {...form.register('title')} placeholder="Lazer e Bem-Estar" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input {...form.register('subtitle')} placeholder="Atividades" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea {...form.register('description')} rows={2} />
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
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Atividades de Lazer</CardTitle>
            <Button size="sm" onClick={() => setShowNewForm(!showNewForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Item</h3>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUploader
                  category="GENERAL"
                  value={newItem.image}
                  onChange={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Piscina"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descreva a atividade..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={newItem.isChargeable}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isChargeable: checked }))}
                  />
                  <Label>Lançável na conta</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateItem} disabled={createItem.isPending}>
                  {createItem.isPending ? 'Criando...' : 'Criar Item'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="p-4 border rounded-lg">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Imagem</Label>
                      <ImageUploader
                        category="GENERAL"
                        value={editForm.image}
                        onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={editForm.isChargeable}
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isChargeable: checked }))}
                        />
                        <Label>Lançável na conta</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateItem(item.id)} disabled={updateItem.isPending}>
                        {updateItem.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {(item.price != null || item.isChargeable) && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.price != null && <span className="text-sm font-semibold text-green-700">R$ {Number(item.price).toFixed(2)}</span>}
                          {item.isChargeable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              <DollarSign className="h-3 w-3" /> Lançável
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditForm({
                            title: item.title,
                            description: item.description,
                            image: item.image,
                            price: item.price != null ? String(item.price) : '',
                            isChargeable: item.isChargeable ?? false,
                          });
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item cadastrado. Clique em "Novo Item" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const BusinessSectionEditor = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('services-business');
  const { data: items = [], isLoading: itemsLoading } = useServiceItemsByCategoryAdmin('BUSINESS');
  const updateSettings = useUpdateLandingSettings();
  const createItem = useCreateServiceItem();
  const updateItem = useUpdateServiceItem();
  const deleteItem = useDeleteServiceItem();

  const config = (settingsData?.config as BusinessSectionConfig) || defaultBusinessSectionConfig;

  const form = useForm<BusinessSectionConfig>({
    defaultValues: config,
    values: config,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', image: '', price: '', isChargeable: false });
  const [newItem, setNewItem] = useState({ title: '', description: '', image: '', price: '', isChargeable: false });
  const [showNewForm, setShowNewForm] = useState(false);

  const onSubmit = (data: BusinessSectionConfig) => {
    updateSettings.mutate({ section: 'services-business', config: data });
  };

  const handleCreateItem = () => {
    if (!newItem.title.trim() || !newItem.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    createItem.mutate({
      category: 'BUSINESS',
      title: newItem.title,
      description: newItem.description,
      image: newItem.image,
      features: [],
      isActive: true,
      price: newItem.price ? parseFloat(newItem.price) : null,
      isChargeable: newItem.isChargeable,
    }, {
      onSuccess: () => {
        setNewItem({ title: '', description: '', image: '', price: '', isChargeable: false });
        setShowNewForm(false);
      }
    });
  };

  const handleUpdateItem = (id: string) => {
    if (!editForm.title.trim() || !editForm.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    updateItem.mutate({
      id,
      data: {
        title: editForm.title,
        description: editForm.description,
        image: editForm.image,
        price: editForm.price ? parseFloat(editForm.price) : null,
        isChargeable: editForm.isChargeable,
      }
    }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      deleteItem.mutate(id);
    }
  };

  if (settingsLoading || itemsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input {...form.register('title')} placeholder="Serviços Empresariais" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input {...form.register('subtitle')} placeholder="Eventos Corporativos" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea {...form.register('description')} rows={2} />
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

              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input {...form.register('buttonText')} placeholder="Solicitar Orçamento" />
              </div>

              <ColorPickerField
                label="Cor do Botão"
                value={form.watch('buttonColor') || '#0466C8'}
                onChange={(color) => form.setValue('buttonColor', color)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Serviços Empresariais</CardTitle>
            <Button size="sm" onClick={() => setShowNewForm(!showNewForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Item</h3>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUploader
                  category="GENERAL"
                  value={newItem.image}
                  onChange={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sala de Reuniões"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descreva o serviço empresarial..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={newItem.isChargeable}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isChargeable: checked }))}
                  />
                  <Label>Lançável na conta</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateItem} disabled={createItem.isPending}>
                  {createItem.isPending ? 'Criando...' : 'Criar Item'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="p-4 border rounded-lg">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Imagem</Label>
                      <ImageUploader
                        category="GENERAL"
                        value={editForm.image}
                        onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={editForm.isChargeable}
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isChargeable: checked }))}
                        />
                        <Label>Lançável na conta</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateItem(item.id)} disabled={updateItem.isPending}>
                        {updateItem.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {(item.price != null || item.isChargeable) && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.price != null && <span className="text-sm font-semibold text-green-700">R$ {Number(item.price).toFixed(2)}</span>}
                          {item.isChargeable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              <DollarSign className="h-3 w-3" /> Lançável
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditForm({
                            title: item.title,
                            description: item.description,
                            image: item.image,
                            price: item.price != null ? String(item.price) : '',
                            isChargeable: item.isChargeable ?? false,
                          });
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item cadastrado. Clique em "Novo Item" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
const SpecialSectionEditor = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('services-special');
  const { data: items = [], isLoading: itemsLoading } = useServiceItemsByCategoryAdmin('SPECIAL');
  const updateSettings = useUpdateLandingSettings();
  const createItem = useCreateServiceItem();
  const updateItem = useUpdateServiceItem();
  const deleteItem = useDeleteServiceItem();

  const config = (settingsData?.config as SpecialSectionConfig) || defaultSpecialSectionConfig;

  const form = useForm<SpecialSectionConfig>({
    defaultValues: config,
    values: config,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', image: '', price: '', isChargeable: false });
  const [newItem, setNewItem] = useState({ title: '', description: '', image: '', price: '', isChargeable: false });
  const [showNewForm, setShowNewForm] = useState(false);

  const onSubmit = (data: SpecialSectionConfig) => {
    updateSettings.mutate({ section: 'services-special', config: data });
  };

  const handleCreateItem = () => {
    if (!newItem.title.trim() || !newItem.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    createItem.mutate({
      category: 'SPECIAL',
      title: newItem.title,
      description: newItem.description,
      image: newItem.image,
      features: [],
      isActive: true,
      price: newItem.price ? parseFloat(newItem.price) : null,
      isChargeable: newItem.isChargeable,
    }, {
      onSuccess: () => {
        setNewItem({ title: '', description: '', image: '', price: '', isChargeable: false });
        setShowNewForm(false);
      }
    });
  };

  const handleUpdateItem = (id: string) => {
    if (!editForm.title.trim() || !editForm.image.trim()) {
      alert('Título e imagem são obrigatórios');
      return;
    }

    updateItem.mutate({
      id,
      data: {
        title: editForm.title,
        description: editForm.description,
        image: editForm.image,
        price: editForm.price ? parseFloat(editForm.price) : null,
        isChargeable: editForm.isChargeable,
      }
    }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      deleteItem.mutate(id);
    }
  };

  if (settingsLoading || itemsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input {...form.register('title')} placeholder="Serviços Especiais" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input {...form.register('subtitle')} placeholder="Comodidades Exclusivas" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea {...form.register('description')} rows={2} />
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
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Serviços Especiais</CardTitle>
            <Button size="sm" onClick={() => setShowNewForm(!showNewForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-medium">Novo Item</h3>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUploader
                  category="GENERAL"
                  value={newItem.image}
                  onChange={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Serviço de Quarto 24h"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descreva o serviço especial..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={newItem.isChargeable}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isChargeable: checked }))}
                  />
                  <Label>Lançável na conta</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateItem} disabled={createItem.isPending}>
                  {createItem.isPending ? 'Criando...' : 'Criar Item'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="p-4 border rounded-lg">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Imagem</Label>
                      <ImageUploader
                        category="GENERAL"
                        value={editForm.image}
                        onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={editForm.isChargeable}
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isChargeable: checked }))}
                        />
                        <Label>Lançável na conta</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateItem(item.id)} disabled={updateItem.isPending}>
                        {updateItem.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {(item.price != null || item.isChargeable) && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.price != null && <span className="text-sm font-semibold text-green-700">R$ {Number(item.price).toFixed(2)}</span>}
                          {item.isChargeable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              <DollarSign className="h-3 w-3" /> Lançável
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditForm({
                            title: item.title,
                            description: item.description,
                            image: item.image,
                            price: item.price != null ? String(item.price) : '',
                            isChargeable: item.isChargeable ?? false,
                          });
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item cadastrado. Clique em "Novo Item" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// CTA Section Editor
const CTASectionEditor = () => {
  const { data: settingsData, isLoading } = useLandingSettings('services-cta');
  const updateSettings = useUpdateLandingSettings();

  const config = (settingsData?.config as CTASectionConfig) || defaultCTASectionConfig;

  const form = useForm<CTASectionConfig>({
    defaultValues: config,
    values: config,
  });

  const onSubmit = (data: CTASectionConfig) => {
    updateSettings.mutate(
      { section: 'services-cta', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações do CTA salvas!');
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seção Call-to-Action</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input {...form.register('title')} placeholder="Reserve Sua Experiência" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea {...form.register('description')} rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPickerField
              label="Cor de Fundo"
              value={form.watch('backgroundColor') || '#0466C8'}
              onChange={(color) => form.setValue('backgroundColor', color)}
            />

            <ColorPickerField
              label="Cor do Título"
              value={form.watch('titleColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('titleColor', color)}
            />
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold">Botão Primário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto</Label>
                <Input {...form.register('primaryButtonText')} placeholder="Reservar Agora" />
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <Input {...form.register('primaryButtonUrl')} placeholder="#" />
              </div>

              <ColorPickerField
                label="Cor do Botão"
                value={form.watch('primaryButtonColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('primaryButtonColor', color)}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold">Botão Secundário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto</Label>
                <Input {...form.register('secondaryButtonText')} placeholder="Contato" />
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <Input {...form.register('secondaryButtonUrl')} placeholder="/contato" />
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
  );
};
