import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Check, Edit, Loader2, Plus, Trash } from 'lucide-react';
import { useForm, SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageCropUpload } from '@/components/admin/ImageCropUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreatePromotion,
  useDeletePromotion,
  usePromotions,
  useUpdatePromotion
} from '@/hooks/usePromotions';
import { Promotion, PromotionType } from '@/types/promotion';
import { PromotionFormData, promotionFormSchema } from '@/lib/validations/promotion';

const promotionTypeOptions: Array<{ value: PromotionType; label: string }> = [
  { value: 'PACKAGE', label: 'Pacote' },
  { value: 'DISCOUNT', label: 'Promocao' },
  { value: 'SEASONAL', label: 'Sazonal' },
  { value: 'SPECIAL_OFFER', label: 'Oferta Especial' },
  { value: 'EARLY_BIRD', label: 'Reserva Antecipada' },
  { value: 'LAST_MINUTE', label: 'Ultima Hora' },
];

const promotionTypeLabels = promotionTypeOptions.reduce<Record<PromotionType, string>>((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<PromotionType, string>);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function getDefaultFormValues(): PromotionFormData {
  return {
    title: '',
    shortDescription: '',
    longDescription: '',
    image: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    originalPrice: undefined,
    discountedPrice: undefined,
    discountPercent: undefined,
    type: 'DISCOUNT',
    isActive: true,
    isFeatured: false,
    termsAndConditions: '',
    maxRedemptions: undefined,
    promotionCode: '',
    features: []
  };
}

function getPromotionFormValues(promotion: Promotion): PromotionFormData {
  return {
    title: promotion.title,
    shortDescription: promotion.shortDescription,
    longDescription: promotion.longDescription || '',
    image: promotion.image || '',
    startDate: promotion.startDate.split('T')[0],
    endDate: promotion.endDate.split('T')[0],
    originalPrice: promotion.originalPrice ?? undefined,
    discountedPrice: promotion.discountedPrice ?? undefined,
    discountPercent: promotion.discountPercent ?? undefined,
    type: promotion.type,
    isActive: promotion.isActive,
    isFeatured: promotion.isFeatured,
    termsAndConditions: promotion.termsAndConditions || '',
    maxRedemptions: promotion.maxRedemptions ?? undefined,
    promotionCode: promotion.promotionCode || '',
    features: promotion.features?.map((feature) => feature.feature) || []
  };
}

function getFirstErrorMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  if ('message' in value && typeof value.message === 'string') {
    return value.message;
  }

  for (const nestedValue of Object.values(value)) {
    const message = getFirstErrorMessage(nestedValue);
    if (message) {
      return message;
    }
  }

  return undefined;
}

const PackagesPromotions = () => {
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  const { data: allPromotions, isLoading, error } = usePromotions({});
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: getDefaultFormValues(),
  });

  const watchedType = form.watch('type');
  const watchedImage = form.watch('image');
  const watchedFeatures = form.watch('features') || [];
  const watchedIsActive = form.watch('isActive');
  const watchedIsFeatured = form.watch('isFeatured');

  const onSubmit: SubmitHandler<PromotionFormData> = (data) => {
    if (editingPromotion) {
      updateMutation.mutate(
        {
          id: editingPromotion.id,
          data
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingPromotion(null);
            form.reset(getDefaultFormValues());
          }
        }
      );
      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
        form.reset(getDefaultFormValues());
      }
    });
  };

  const onInvalid: SubmitErrorHandler<PromotionFormData> = () => {
    const message =
      getFirstErrorMessage(form.formState.errors) ||
      'Revise os campos obrigatorios antes de salvar.';

    toast.error(message);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset(getPromotionFormValues(promotion));
    setDialogOpen(true);
  };

  const handleNewPromotion = () => {
    setEditingPromotion(null);
    form.reset(getDefaultFormValues());
    setDialogOpen(true);
  };

  const handleDeletePromotion = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta promocao?')) {
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

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingPromotion(null);
      form.reset(getDefaultFormValues());
    }
  };

  const promotions = activeTab === 'active'
    ? allPromotions?.filter((promotion) => promotion.isActive)
    : allPromotions;

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 text-red-600">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold">Erro ao carregar promocoes</h2>
              <p className="text-gray-600">
                {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar as promocoes'}
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pacotes e Promocoes</h1>
            <p className="mt-1 text-gray-600">
              {isLoading ? 'Carregando...' : `${promotions?.length || 0} ${activeTab === 'active' ? 'ativas' : 'no total'}`}
            </p>
          </div>
          <Button onClick={handleNewPromotion}>
            <Plus className="mr-2 h-4 w-4" /> Criar Novo
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'all')}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-lg">Carregando promocoes...</span>
                </CardContent>
              </Card>
            ) : promotions && promotions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'active' ? 'Promocoes e Pacotes Ativos' : 'Todas as Promocoes e Pacotes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titulo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Preco</TableHead>
                        <TableHead>Destaque</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acoes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.map((promotion) => (
                        <TableRow key={promotion.id}>
                          <TableCell className="font-medium">{promotion.title}</TableCell>
                          <TableCell>{promotionTypeLabels[promotion.type] || promotion.type}</TableCell>
                          <TableCell>
                            {format(new Date(promotion.startDate), 'dd/MM/yyyy')} - {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              {promotion.originalPrice !== null && promotion.originalPrice !== undefined && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatCurrency(Number(promotion.originalPrice))}
                                </span>
                              )}
                              {promotion.discountedPrice !== null && promotion.discountedPrice !== undefined && (
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
                  <div className="mb-4 text-gray-400">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Nenhuma promocao encontrada</h3>
                  <p className="mb-4 text-gray-600">
                    {activeTab === 'active'
                      ? 'Nao ha promocoes ou pacotes ativos no momento.'
                      : 'Ainda nao ha promocoes cadastradas no sistema.'}
                  </p>
                  <Button onClick={handleNewPromotion}>
                    <Plus className="mr-2 h-4 w-4" /> Criar Nova Promocao
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Editar Promocao' : 'Criar Promocao'}</DialogTitle>
            <DialogDescription>
              {editingPromotion
                ? 'Atualize os detalhes da promocao ou pacote abaixo.'
                : 'Preencha os detalhes para criar uma nova promocao ou pacote.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input id="title" {...form.register('title')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={watchedType}
                  onValueChange={(value) => form.setValue('type', value as PromotionType, { shouldDirty: true })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {promotionTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descricao Curta</Label>
              <Input id="shortDescription" {...form.register('shortDescription')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Descricao Completa</Label>
              <Textarea id="longDescription" {...form.register('longDescription')} rows={5} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Inicio</Label>
                <Input id="startDate" type="date" {...form.register('startDate')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Termino</Label>
                <Input id="endDate" type="date" {...form.register('endDate')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Preco Original</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="originalPrice"
                    type="number"
                    className="pl-8"
                    {...form.register('originalPrice', {
                      setValueAs: (value) => value === '' ? undefined : Number(value),
                    })}
                    min={0}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Preco Promocional</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="discountedPrice"
                    type="number"
                    className="pl-8"
                    {...form.register('discountedPrice', {
                      setValueAs: (value) => value === '' ? undefined : Number(value),
                    })}
                    min={0}
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem da Promocao</Label>
              <ImageCropUpload
                value={watchedImage}
                onChange={(url) => form.setValue('image', url, { shouldDirty: true })}
                aspectRatio={3 / 2}
                cropWidth={600}
                cropHeight={400}
                cropDescription="Imagem sera exibida nos cards de promocao em 600x400px"
                uploadCategory="PROMOTION"
              />
            </div>

            <div className="space-y-2">
              <Label>Recursos Inclusos</Label>
              <div className="mb-4 flex flex-wrap gap-2">
                {watchedFeatures.map((feature, index) => (
                  <div key={`${feature}-${index}`} className="flex items-center rounded-md bg-muted px-2 py-1">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-6 w-6"
                      onClick={() => {
                        form.setValue(
                          'features',
                          watchedFeatures.filter((_, currentIndex) => currentIndex !== index),
                          { shouldDirty: true }
                        );
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {watchedFeatures.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum recurso adicionado.</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Input id="newFeature" placeholder="Adicionar recurso..." />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('newFeature') as HTMLInputElement | null;
                    const newFeature = input?.value.trim();

                    if (!newFeature) {
                      return;
                    }

                    form.setValue('features', [...watchedFeatures, newFeature], { shouldDirty: true });

                    if (input) {
                      input.value = '';
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
                  checked={watchedIsActive}
                  onCheckedChange={(checked) => form.setValue('isActive', checked, { shouldDirty: true })}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={watchedIsFeatured}
                  onCheckedChange={(checked) => form.setValue('isFeatured', checked, { shouldDirty: true })}
                />
                <Label htmlFor="featured">Destaque</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {editingPromotion ? 'Salvar Alteracoes' : 'Criar Promocao'}
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
