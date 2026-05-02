import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit, Loader2, Package, Plus, Search, Trash } from 'lucide-react';
import {
  usePOSProducts,
  useCreatePOSProduct,
  useUpdatePOSProduct,
  useDeletePOSProduct,
} from '@/hooks/usePOS';
import type { POSProduct, POSProductCategory } from '@/types/pms';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const categoryLabels: Record<POSProductCategory, string> = {
  FOOD: 'Alimentos',
  BEVERAGE: 'Bebidas',
  SERVICE: 'Serviços',
  CONVENIENCE: 'Conveniência',
  OTHER: 'Outros',
};

const categoryOptions: POSProductCategory[] = ['FOOD', 'BEVERAGE', 'SERVICE', 'CONVENIENCE', 'OTHER'];

type ProductFormData = {
  name: string;
  sku: string;
  category: POSProductCategory;
  price: string;
  costPrice: string;
  stockQuantity: string;
  minStockQuantity: string;
  saleUnit: string;
  trackStock: boolean;
  isActive: boolean;
  description: string;
};

const emptyForm: ProductFormData = {
  name: '',
  sku: '',
  category: 'OTHER',
  price: '',
  costPrice: '',
  stockQuantity: '0',
  minStockQuantity: '0',
  saleUnit: 'UN',
  trackStock: false,
  isActive: true,
  description: '',
};

function productToForm(product: POSProduct): ProductFormData {
  return {
    name: product.name,
    sku: product.sku ?? '',
    category: product.category,
    price: String(product.price),
    costPrice: String(product.costPrice),
    stockQuantity: String(product.stockQuantity),
    minStockQuantity: String(product.minStockQuantity),
    saleUnit: product.saleUnit,
    trackStock: product.trackStock,
    isActive: product.isActive,
    description: product.description ?? '',
  };
}

export default function Products() {
  const { data: products = [], isLoading } = usePOSProducts();
  const createProduct = useCreatePOSProduct();
  const updateProduct = useUpdatePOSProduct();
  const deleteProduct = useDeletePOSProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<POSProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<POSProductCategory | 'ALL'>('ALL');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filterCategory, search]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    withStock: products.filter((p) => p.trackStock).length,
    lowStock: products.filter((p) => p.trackStock && Number(p.stockQuantity) <= Number(p.minStockQuantity)).length,
  }), [products]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: POSProduct) => {
    setEditingProduct(product);
    setForm(productToForm(product));
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim() || undefined,
      category: form.category,
      price: Number(form.price),
      costPrice: Number(form.costPrice) || undefined,
      stockQuantity: Number(form.stockQuantity) || undefined,
      minStockQuantity: Number(form.minStockQuantity) || undefined,
      saleUnit: form.saleUnit.trim() || undefined,
      trackStock: form.trackStock,
      isActive: form.isActive,
      description: form.description.trim() || undefined,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, payload },
        { onSuccess: () => { setIsDialogOpen(false); setEditingProduct(null); } }
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => { setIsDialogOpen(false); },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProduct.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
            <p className="text-sm text-muted-foreground">Cadastre e gerencie produtos vendidos no PDV e consumo direto.</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Novo produto
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-xs text-muted-foreground">Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
              <div>
                <div className="text-2xl font-bold">{stats.withStock}</div>
                <div className="text-xs text-muted-foreground">Com estoque</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <div>
                <div className="text-2xl font-bold">{stats.lowStock}</div>
                <div className="text-xs text-muted-foreground">Estoque baixo</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, SKU ou descrição"
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as POSProductCategory | 'ALL')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas categorias</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Custo</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredProducts.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      {search || filterCategory !== 'ALL'
                        ? 'Nenhum produto encontrado para os filtros aplicados.'
                        : 'Nenhum produto cadastrado. Clique em "Novo produto" para começar.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className={!product.isActive ? 'opacity-50' : ''}>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        {product.sku && <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>}
                        {product.description && <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{categoryLabels[product.category]}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{currency.format(Number(product.price))}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{currency.format(Number(product.costPrice))}</TableCell>
                      <TableCell className="text-right">
                        {product.trackStock ? (
                          <span className={Number(product.stockQuantity) <= Number(product.minStockQuantity) ? 'font-medium text-red-600' : ''}>
                            {Number(product.stockQuantity)} {product.saleUnit}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar produto' : 'Novo produto'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Altere os dados do produto.' : 'Preencha os dados para cadastrar um novo produto.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Nome do produto" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} placeholder="Código opcional" />
              </div>
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={form.category} onValueChange={(v) => updateField('category', v as POSProductCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preço de venda *</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Preço de custo</Label>
                <Input type="number" step="0.01" min="0" value={form.costPrice} onChange={(e) => updateField('costPrice', e.target.value)} placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unidade de venda</Label>
              <Input value={form.saleUnit} onChange={(e) => updateField('saleUnit', e.target.value)} placeholder="UN, KG, L..." />
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch checked={form.trackStock} onCheckedChange={(v) => updateField('trackStock', v)} />
              <div>
                <Label>Controlar estoque</Label>
                <p className="text-xs text-muted-foreground">Habilite para rastrear entrada e saída deste produto.</p>
              </div>
            </div>

            {form.trackStock && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quantidade em estoque</Label>
                  <Input type="number" step="1" min="0" value={form.stockQuantity} onChange={(e) => updateField('stockQuantity', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estoque mínimo</Label>
                  <Input type="number" step="1" min="0" value={form.minStockQuantity} onChange={(e) => updateField('minStockQuantity', e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Descrição opcional do produto" className="min-h-20" />
            </div>

            {editingProduct && (
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Switch checked={form.isActive} onCheckedChange={(v) => updateField('isActive', v)} />
                <div>
                  <Label>Produto ativo</Label>
                  <p className="text-xs text-muted-foreground">Produtos inativos não aparecem no PDV nem no consumo direto.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.name.trim() || !form.price || createProduct.isPending || updateProduct.isPending}
              >
                {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se este produto já foi usado em pedidos, ele será desativado em vez de excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {deleteProduct.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
