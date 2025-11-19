import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { mockPromotions, Promotion } from '@/models/promotion';
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, Edit, Plus, Tag, Trash } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { ImageCropUpload } from '@/components/admin/ImageCropUpload';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

const PackagesPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<Promotion>({
    defaultValues: {
      id: '',
      title: '',
      shortDescription: '',
      longDescription: '',
      image: '',
      startDate: '',
      endDate: '',
      originalPrice: 0,
      discountedPrice: 0,
      type: 'promotion',
      active: true,
      featured: false,
      features: []
    }
  });

  const onSubmit: SubmitHandler<Promotion> = (data) => {
    if (editingPromotion) {
      // Update existing promotion
      setPromotions(promotions.map(p => p.id === editingPromotion.id ? { ...data } : p));
      toast({
        title: "Promoção atualizada",
        description: `${data.title} foi atualizado com sucesso.`,
      });
    } else {
      // Add new promotion
      const newPromotion = {
        ...data,
        id: uuidv4()
      };
      setPromotions([...promotions, newPromotion]);
      toast({
        title: "Promoção criada",
        description: `${data.title} foi criado com sucesso.`,
      });
    }
    setDialogOpen(false);
    setEditingPromotion(null);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset(promotion);
    setDialogOpen(true);
  };

  const handleNewPromotion = () => {
    setEditingPromotion(null);
    form.reset({
      id: '',
      title: '',
      shortDescription: '',
      longDescription: '',
      image: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      originalPrice: 0,
      discountedPrice: 0,
      type: 'promotion',
      active: true,
      featured: false,
      features: []
    });
    setDialogOpen(true);
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
    toast({
      title: "Promoção removida",
      description: "A promoção foi removida com sucesso.",
    });
  };

  const handleToggleActive = (id: string) => {
    setPromotions(
      promotions.map(p => 
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };

  const handleToggleFeatured = (id: string) => {
    setPromotions(
      promotions.map(p => 
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pacotes e Promoções</h1>
          <Button onClick={handleNewPromotion}>
            <Plus className="mr-2 h-4 w-4" /> Criar Novo
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Promoções e Pacotes Ativos</CardTitle>
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
                    {promotions.filter(p => p.active).map((promotion) => (
                      <TableRow key={promotion.id}>
                        <TableCell className="font-medium">{promotion.title}</TableCell>
                        <TableCell>
                          {promotion.type === 'package' ? 'Pacote' : 'Promoção'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(promotion.startDate), 'dd/MM/yyyy')} - {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground line-through text-xs">{formatCurrency(promotion.originalPrice)}</span>
                            <span className="font-medium">{formatCurrency(promotion.discountedPrice)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={promotion.featured}
                            onCheckedChange={() => handleToggleFeatured(promotion.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${promotion.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            {promotion.active ? 'Ativo' : 'Inativo'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="icon" variant="outline" onClick={() => handleEditPromotion(promotion)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDeletePromotion(promotion.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {promotions.filter(p => p.active).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          Não há promoções ou pacotes ativos.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Promoções e Pacotes</CardTitle>
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
                          {promotion.type === 'package' ? 'Pacote' : 'Promoção'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(promotion.startDate), 'dd/MM/yyyy')} - {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground line-through text-xs">{formatCurrency(promotion.originalPrice)}</span>
                            <span className="font-medium">{formatCurrency(promotion.discountedPrice)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={promotion.featured}
                            onCheckedChange={() => handleToggleFeatured(promotion.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={promotion.active}
                            onCheckedChange={() => handleToggleActive(promotion.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="icon" variant="outline" onClick={() => handleEditPromotion(promotion)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDeletePromotion(promotion.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {promotions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          Não há promoções ou pacotes cadastrados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                  onValueChange={(value) => form.setValue('type', value as 'package' | 'promotion')}
                  defaultValue={form.getValues('type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="package">Pacote</SelectItem>
                      <SelectItem value="promotion">Promoção</SelectItem>
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
                aspectRatio={3/2}
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
                        const features = form.getValues('features').filter((_, i) => i !== index);
                        form.setValue('features', features);
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {(!form.getValues('features') || form.getValues('features').length === 0) && (
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
                  checked={form.getValues('active')}
                  onCheckedChange={(checked) => form.setValue('active', checked)}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={form.getValues('featured')}
                  onCheckedChange={(checked) => form.setValue('featured', checked)}
                />
                <Label htmlFor="featured">Destaque</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                {editingPromotion ? 'Salvar Alterações' : 'Criar Promoção'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PackagesPromotions;
