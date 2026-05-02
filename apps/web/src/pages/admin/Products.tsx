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
import { Edit, FolderOpen, Loader2, Package, Plus, Search, Settings2, Trash, X } from 'lucide-react';
import {
  usePOSProducts,
  useCreatePOSProduct,
  useUpdatePOSProduct,
  useDeletePOSProduct,
  useProductCategories,
  useCreateProductCategory,
  useUpdateProductCategory,
  useDeleteProductCategory,
} from '@/hooks/usePOS';
import { ImageCropUploader } from '@/components/admin/ImageCropUploader';
import type { POSProduct, ProductCategory, ServiceCategory } from '@/types/pms';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

type ProductFormData = {
  name: string;
  sku: string;
  categoryId: string;
  image: string;
  price: string;
  costPrice: string;
  stockQuantity: string;
  minStockQuantity: string;
  saleUnit: string;
  trackStock: boolean;
  isActive: boolean;
  description: string;
  showOnServicesPage: boolean;
  servicesPageCategory: ServiceCategory | '';
  servicesPageSubtitle: string;
  servicesPageFeatures: string;
};

const emptyForm: ProductFormData = {
  name: '',
  sku: '',
  categoryId: '',
  image: '',
  price: '',
  costPrice: '',
  stockQuantity: '0',
  minStockQuantity: '0',
  saleUnit: 'UN',
  trackStock: false,
  isActive: true,
  description: '',
  showOnServicesPage: false,
  servicesPageCategory: '',
  servicesPageSubtitle: '',
  servicesPageFeatures: '',
};

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  ACCOMMODATION: 'Hospedagem',
  GASTRONOMY: 'Gastronomia',
  RECREATION: 'Lazer',
  BUSINESS: 'Empresarial',
  SPECIAL: 'Especiais',
};

function productToForm(product: POSProduct): ProductFormData {
  return {
    name: product.name,
    sku: product.sku ?? '',
    categoryId: product.categoryId,
    image: product.image ?? '',
    price: String(product.price),
    costPrice: String(product.costPrice),
    stockQuantity: String(product.stockQuantity),
    minStockQuantity: String(product.minStockQuantity),
    saleUnit: product.saleUnit,
    trackStock: product.trackStock,
    isActive: product.isActive,
    description: product.description ?? '',
    showOnServicesPage: product.showOnServicesPage,
    servicesPageCategory: product.servicesPageCategory ?? '',
    servicesPageSubtitle: product.servicesPageSubtitle ?? '',
    servicesPageFeatures: product.servicesPageFeatures.join('\n'),
  };
}

type CategoryFormData = {
  slug: string;
  label: string;
  color: string;
  order: string;
};

const emptyCategoryForm: CategoryFormData = { slug: '', label: '', color: '', order: '0' };

export default function Products() {
  const { data: products = [], isLoading } = usePOSProducts();
  const { data: categories = [] } = useProductCategories();
  const createProduct = useCreatePOSProduct();
  const updateProduct = useUpdatePOSProduct();
  const deleteProduct = useDeletePOSProduct();
  const createCategory = useCreateProductCategory();
  const updateCategory = useUpdateProductCategory();
  const deleteCategory = useDeleteProductCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<POSProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [catForm, setCatForm] = useState<CategoryFormData>(emptyCategoryForm);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  const activeCategories = useMemo(() => categories.filter((c) => c.isActive), [categories]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, ProductCategory>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filterCategory === 'ALL' || product.categoryId === filterCategory;
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
    setForm({ ...emptyForm, categoryId: activeCategories[0]?.id ?? '' });
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
      categoryId: form.categoryId,
      image: form.image || undefined,
      price: Number(form.price),
      costPrice: Number(form.costPrice) || undefined,
      stockQuantity: Number(form.stockQuantity) || undefined,
      minStockQuantity: Number(form.minStockQuantity) || undefined,
      saleUnit: form.saleUnit.trim() || undefined,
      trackStock: form.trackStock,
      isActive: form.isActive,
      description: form.description.trim() || undefined,
      showOnServicesPage: form.showOnServicesPage,
      servicesPageCategory: form.showOnServicesPage ? (form.servicesPageCategory || undefined) : undefined,
      servicesPageSubtitle: form.showOnServicesPage ? form.servicesPageSubtitle.trim() || undefined : undefined,
      servicesPageFeatures: form.showOnServicesPage
        ? form.servicesPageFeatures
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
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

  // Category management
  const openCreateCategoryDialog = () => {
    setEditingCategory(null);
    setCatForm(emptyCategoryForm);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setCatForm({ slug: cat.slug, label: cat.label, color: cat.color ?? '', order: String(cat.order) });
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = () => {
    const payload = {
      slug: catForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      label: catForm.label.trim(),
      color: catForm.color.trim() || undefined,
      order: Number(catForm.order) || 0,
    };

    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, payload },
        { onSuccess: () => { setIsCategoryDialogOpen(false); setEditingCategory(null); } }
      );
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => { setIsCategoryDialogOpen(false); },
      });
    }
  };

  const handleDeleteCategory = () => {
    if (!deleteCatId) return;
    deleteCategory.mutate(deleteCatId, {
      onSuccess: () => setDeleteCatId(null),
    });
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
            <h1 className="text-2xl font-bold tracking-tight">Produtos e serviços</h1>
            <p className="text-sm text-muted-foreground">
              Catálogo único do PDV. Itens publicados aqui também podem aparecer na página pública <code>/servicos</code>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openCreateCategoryDialog}>
              <Settings2 className="mr-2 h-4 w-4" />
              Categorias
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Novo produto
            </Button>
          </div>
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
              placeholder="Buscar por nome, SKU ou descricao"
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas categorias</SelectItem>
              {activeCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
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
                  <TableHead className="text-right">Preco</TableHead>
                  <TableHead className="text-right">Custo</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredProducts.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      {search || filterCategory !== 'ALL'
                        ? 'Nenhum produto encontrado para os filtros aplicados.'
                        : 'Nenhum produto cadastrado. Clique em "Novo produto" para comecar.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className={!product.isActive ? 'opacity-50' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                              <Package className="h-4 w-4 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium">{product.name}</div>
                            {product.sku && <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>}
                            {product.description && <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</div>}
                            {product.showOnServicesPage && product.servicesPageCategory && (
                              <div className="mt-1 text-xs text-sky-700">
                                Página de serviços: {serviceCategoryLabels[product.servicesPageCategory]}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category?.label ?? '—'}</Badge>
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

      {/* Product Dialog */}
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
              <Label>Imagem do produto</Label>
              <ImageCropUploader
                value={form.image || null}
                onChange={(url) => updateField('image', url ?? '')}
                category="GENERAL"
                aspect={1}
                maxWidth={600}
                maxHeight={600}
                quality={0.8}
                placeholder="Enviar foto do produto"
              />
            </div>

            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Nome do produto" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} placeholder="Codigo opcional" />
              </div>
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={form.categoryId} onValueChange={(v) => updateField('categoryId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preco de venda *</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Preco de custo</Label>
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
                <p className="text-xs text-muted-foreground">Habilite para rastrear entrada e saida deste produto.</p>
              </div>
            </div>

            {form.trackStock && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quantidade em estoque</Label>
                  <Input type="number" step="1" min="0" value={form.stockQuantity} onChange={(e) => updateField('stockQuantity', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estoque minimo</Label>
                  <Input type="number" step="1" min="0" value={form.minStockQuantity} onChange={(e) => updateField('minStockQuantity', e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Descricao</Label>
              <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Descricao opcional do produto" className="min-h-20" />
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch checked={form.showOnServicesPage} onCheckedChange={(v) => updateField('showOnServicesPage', v)} />
              <div>
                <Label>Exibir na página pública de serviços</Label>
                <p className="text-xs text-muted-foreground">
                  Usa este mesmo produto ou serviço no PDV e na página pública <code>/servicos</code>.
                </p>
              </div>
            </div>

            {form.showOnServicesPage && (
              <div className="space-y-4 rounded-lg border border-sky-200 bg-sky-50/60 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Seção da página de serviços *</Label>
                    <Select
                      value={form.servicesPageCategory || undefined}
                      onValueChange={(value) => updateField('servicesPageCategory', value as ServiceCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a seção" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serviceCategoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo da página</Label>
                    <Input
                      value={form.servicesPageSubtitle}
                      onChange={(e) => updateField('servicesPageSubtitle', e.target.value)}
                      placeholder="Texto auxiliar para a página pública"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Destaques da página</Label>
                  <Textarea
                    value={form.servicesPageFeatures}
                    onChange={(e) => updateField('servicesPageFeatures', e.target.value)}
                    placeholder="Um destaque por linha"
                    className="min-h-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemplo: café da manhã incluso, atendimento 24h, traslado privativo.
                  </p>
                </div>
              </div>
            )}

            {editingProduct && (
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Switch checked={form.isActive} onCheckedChange={(v) => updateField('isActive', v)} />
                <div>
                  <Label>Produto ativo</Label>
                  <p className="text-xs text-muted-foreground">Produtos inativos nao aparecem no PDV nem no consumo direto.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !form.name.trim() ||
                      form.price === '' ||
                      !form.categoryId ||
                      (form.showOnServicesPage && !form.servicesPageCategory) ||
                      createProduct.isPending ||
                      updateProduct.isPending
                    }
                  >
                {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Gerenciar categorias
              </div>
            </DialogTitle>
            <DialogDescription>
              Crie, edite ou remova categorias de produtos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              {categories.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhuma categoria cadastrada. Crie a primeira abaixo.
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${!cat.isActive ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-2">
                        {cat.color && (
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        )}
                        <span className="text-sm font-medium">{cat.label}</span>
                        <span className="text-xs text-muted-foreground">({cat.slug})</span>
                        {!cat.isActive && <Badge variant="secondary" className="text-xs">Inativa</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCategoryDialog(cat)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteCatId(cat.id)}>
                          <Trash className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-3">{editingCategory ? 'Editar categoria' : 'Nova categoria'}</div>
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nome *</Label>
                    <Input
                      value={catForm.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        setCatForm((prev) => ({
                          ...prev,
                          label,
                          slug: editingCategory ? prev.slug : label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                        }));
                      }}
                      placeholder="Ex: Alimentos"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Slug *</Label>
                    <Input value={catForm.slug} onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))} placeholder="alimentos" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Cor (hex)</Label>
                    <div className="flex gap-2">
                      <Input value={catForm.color} onChange={(e) => setCatForm((prev) => ({ ...prev, color: e.target.value }))} placeholder="#3b82f6" className="flex-1" />
                      {catForm.color && (
                        <div className="h-9 w-9 shrink-0 rounded-md border" style={{ backgroundColor: catForm.color }} />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ordem</Label>
                    <Input type="number" value={catForm.order} onChange={(e) => setCatForm((prev) => ({ ...prev, order: e.target.value }))} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingCategory && (
                    <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(null); setCatForm(emptyCategoryForm); }}>
                      <X className="mr-1 h-3.5 w-3.5" />
                      Cancelar edicao
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleCategorySubmit}
                    disabled={!catForm.label.trim() || !catForm.slug.trim() || createCategory.isPending || updateCategory.isPending}
                  >
                    {(createCategory.isPending || updateCategory.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingCategory ? 'Salvar' : 'Criar categoria'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se este produto ja foi usado em pedidos, ele sera desativado em vez de excluido permanentemente.
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

      {/* Delete Category Dialog */}
      <AlertDialog open={Boolean(deleteCatId)} onOpenChange={(open) => !open && setDeleteCatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Se existem produtos vinculados a esta categoria, ela sera desativada em vez de excluida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700">
              {deleteCategory.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
