import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Edit, Plus, Trash, Loader2 } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { ImageCropUpload } from '@/components/admin/ImageCropUpload';
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion
} from '@/hooks/usePromotions';
import type { Promotion, CreatePromotionData } from '@/types/promotion';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

const PackagesPromotions = () => {
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  // Buscar promoções da API
  const { data: allPromotions, isLoading, error } = usePromotions({});
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();

  const form = useForm<CreatePromotionData>({
    defaultValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      image: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      originalPrice: 0,
      discountedPrice: 0,
      type: 'PROMOTION',
      isActive: true,
      isFeatured: false,
      features: []
    }
  });

  const onSubmit: SubmitHandler<CreatePromotionData> = (data) => {
    if (editingPromotion) {
      updateMutation.mutate({
        id: editingPromotion.id,
        data
      }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingPromotion(null);
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false);
        }
      });
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset({
      title: promotion.title,
      shortDescription: promotion.shortDescription,
      longDescription: promotion.longDescription,
      image: promotion.image || '',
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      originalPrice: Number(promotion.originalPrice) || 0,
      discountedPrice: Number(promotion.discountedPrice) || 0,
      type: promotion.type,
      isActive: promotion.isActive,
      isFeatured: promotion.isFeatured,
      features: promotion.features?.map(f => f.feature) || []
    });
    setDialogOpen(true);
  };

  const handleNewPromotion = () => {
    setEditingPromotion(null);
    form.reset({
      title: '',
      shortDescription: '',
      longDescription: '',
      image: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      originalPrice: 0,
      discountedPrice: 0,
      type: 'PROMOTION',
      isActive: true,
      isFeatured: false,
      features: []
    });
    setDialogOpen(true);
  };

  const handleDeletePromotion = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta promoção?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (promotion: Promotion) => {
    updateMutation.mutate({
      id: promotion.id,
      data: { isActive: !promotion.isActive }
    });
  };

  const handleToggleFeatured = (promotion: Promotion) => {
    updateMutation.mutate({
      id: promotion.id,
      data: { isFeatured: !promotion.isFeatured }
    });
  };

  // Filtrar promoções por aba
  const promotions = activeTab === 'active'
    ? allPromotions?.filter(p => p.isActive)
    : allPromotions;

  // Estado de erro
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="text-red-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Erro ao carregar promoções</h2>
              <p className="text-gray-600">
                {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar as promoções'}
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pacotes e Promoções</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Carregando...' : `${promotions?.length || 0} ${activeTab === 'active' ? 'ativas' : 'no total'}`}
            </p>
          </div>
          <Button onClick={handleNewPromotion}>
            <Plus className="mr-2 h-4 w-4" /> Criar Novo
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'all')}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-lg">Carregando promoções...</span>
                </CardContent>
              </Card>
            ) : promotions && promotions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'active' ? 'Promoções e Pacotes Ativos' : 'Todas as Promoções e Pacotes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Destaque</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.map((promotion) => (
                        <TableRow key={promotion.id}>
                          <TableCell className="font-medium">{promotion.title}</TableCell>
                          <TableCell>
                            {promotion.type === 'PACKAGE' ? 'Pacote' : 'Promoção'}
                          </TableCell>
                          <TableCell>
                            {format(new Date(promotion.startDate), 'dd/MM/yyyy')} - {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              {promotion.originalPrice && (
                                <span className="text-muted-foreground line-through text-xs">
                                  {formatCurrency(Number(promotion.originalPrice))}
                                </span>
                              )}
                              {promotion.discountedPrice && (
                                <span className="font-medium">
                                  {formatCurrency(Number(promotion.discountedPrice))}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={promotion.isFeatured}
                              onCheckedChange={() => handleToggleFeatured(promotion)}
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={promotion.isActive}
                              onCheckedChange={() => handleToggleActive(promotion)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="icon" variant="outline" onClick={() => handleEditPromotion(promotion)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDeletePromotion(promotion.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhuma promoção encontrada</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'active'
                      ? 'Não há promoções ou pacotes ativos no momento.'
                      : 'Ainda não há promoções cadastradas no sistema.'}
                  </p>
                  <Button onClick={handleNewPromotion}>
                    <Plus className="mr-2 h-4 w-4" /> Criar Nova Promoção
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Editar Promoção' : 'Criar Promoção'}</DialogTitle>
            <DialogDescription>
              {editingPromotion
                ? 'Atualize os detalhes da promoção ou pacote abaixo.'
                : 'Preencha os detalhes para criar uma nova promoção ou pacote.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  onValueChange={(value) => form.setValue('type', value as 'PACKAGE' | 'PROMOTION')}
                  defaultValue={form.getValues('type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="PACKAGE">Pacote</SelectItem>
                      <SelectItem value="PROMOTION">Promoção</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descrição Curta</Label>
              <Input
                id="shortDescription"
                {...form.register('shortDescription')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Descrição Completa</Label>
              <Textarea
                id="longDescription"
                {...form.register('longDescription')}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register('startDate')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register('endDate')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Preço Original</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="originalPrice"
                    type="number"
                    className="pl-8"
                    {...form.register('originalPrice', { valueAsNumber: true })}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Preço Promocional</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="discountedPrice"
                    type="number"
                    className="pl-8"
                    {...form.register('discountedPrice', { valueAsNumber: true })}
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem da Promoção</Label>
              <ImageCropUpload
                value={form.watch('image')}
                onChange={(url) => form.setValue('image', url)}
                aspectRatio={3 / 2}
                cropWidth={600}
                cropHeight={400}
                cropDescription="Imagem será exibida nos cards de promoção em 600x400px"
              />
            </div>

            <div className="space-y-2">
              <Label>Recursos Inclusos</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {form.getValues('features')?.map((feature, index) => (
                  <div key={index} className="flex items-center bg-muted px-2 py-1 rounded-md">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => {
                        const features = form.getValues('features')?.filter((_, i) => i !== index);
                        form.setValue('features', features);
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {(!form.getValues('features') || form.getValues('features')?.length === 0) && (
                  <p className="text-sm text-muted-foreground">Nenhum recurso adicionado.</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Input
                  id="newFeature"
                  placeholder="Adicionar recurso..."
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newFeature = (document.getElementById('newFeature') as HTMLInputElement)?.value;
                    if (newFeature) {
                      const features = [...(form.getValues('features') || []), newFeature];
                      form.setValue('features', features);
                      (document.getElementById('newFeature') as HTMLInputElement).value = '';
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={form.getValues('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={form.getValues('isFeatured')}
                  onCheckedChange={(checked) => form.setValue('isFeatured', checked)}
                />
                <Label htmlFor="featured">Destaque</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {editingPromotion ? 'Salvar Alterações' : 'Criar Promoção'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PackagesPromotions;
