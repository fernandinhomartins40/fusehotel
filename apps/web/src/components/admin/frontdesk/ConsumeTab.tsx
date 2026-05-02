import { useMemo, useState } from 'react';
import { Briefcase, Package, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConsumeProduct, useConsumeService } from '@/hooks/useFolios';
import { usePOSProducts } from '@/hooks/usePOS';
import { useServiceItemsAdmin } from '@/hooks/useLanding';
import type { POSProductCategory } from '@/types/pms';

interface ConsumeTabProps {
  folioId: string;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
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

type CategoryFilter = 'ALL' | POSProductCategory;

export function ConsumeTab({ folioId }: ConsumeTabProps) {
  const { data: products, isLoading: loadingProducts } = usePOSProducts();
  const { data: serviceItems, isLoading: loadingServices } = useServiceItemsAdmin();
  const consumeProduct = useConsumeProduct();
  const consumeService = useConsumeService();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [mainTab, setMainTab] = useState<'products' | 'services'>('products');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const query = search.trim().toLowerCase();

    return products
      .filter((p) => p.isActive)
      .filter((p) => categoryFilter === 'ALL' || p.category === categoryFilter)
      .filter((p) => {
        if (!query) return true;
        return (
          p.name.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
        );
      });
  }, [products, search, categoryFilter]);

  const chargeableServices = useMemo(() => {
    if (!serviceItems) return [];
    const query = search.trim().toLowerCase();

    return (serviceItems as any[])
      .filter((s) => s.isActive && s.isChargeable && s.price)
      .filter((s) => {
        if (!query) return true;
        return (
          s.title.toLowerCase().includes(query) ||
          s.subtitle?.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query)
        );
      });
  }, [serviceItems, search]);

  const categoryCounts = useMemo(() => {
    if (!products) return {};
    const active = products.filter((p) => p.isActive);
    const counts: Partial<Record<POSProductCategory, number>> = {};
    for (const p of active) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const handleConsumeProduct = (productId: string) => {
    consumeProduct.mutate({ folioId, productId, quantity: 1 });
  };

  const handleConsumeService = (serviceItemId: string) => {
    consumeService.mutate({ folioId, serviceItemId, quantity: 1 });
  };

  const isLoading = loadingProducts || loadingServices;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full mt-3 gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto ou serviço..."
          className="pl-9"
        />
      </div>

      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as 'products' | 'services')}>
        <TabsList className="w-full">
          <TabsTrigger value="products" className="flex-1 gap-1.5">
            <Package className="h-3.5 w-3.5" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="services" className="flex-1 gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Serviços
            {chargeableServices.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{chargeableServices.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-3 space-y-3">
          <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
            <TabsList className="h-auto flex-wrap rounded-2xl bg-slate-100 p-1 w-full">
              <TabsTrigger value="ALL" className="rounded-xl px-3 py-1.5 text-xs">
                Todos
              </TabsTrigger>
              {(Object.keys(categoryLabels) as POSProductCategory[])
                .filter((cat) => categoryCounts[cat])
                .map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="rounded-xl px-3 py-1.5 text-xs">
                    {categoryLabels[cat]}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>

          <ScrollArea className="flex-1">
            {!filteredProducts.length ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                <Package className="mx-auto h-8 w-8 mb-2 text-slate-300" />
                Nenhum produto encontrado.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-slate-900">{product.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-slate-700">
                          {currencyFormatter.format(product.price)}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {categoryLabels[product.category]}
                        </Badge>
                        {product.trackStock && product.stockQuantity <= product.minStockQuantity && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            Estoque baixo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-8 w-8 p-0"
                      onClick={() => handleConsumeProduct(product.id)}
                      disabled={consumeProduct.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="services" className="mt-3">
          <ScrollArea className="flex-1">
            {!chargeableServices.length ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                <Briefcase className="mx-auto h-8 w-8 mb-2 text-slate-300" />
                <div>Nenhum serviço disponível para lançamento.</div>
                <div className="mt-1 text-xs">Configure serviços com preço em Site &gt; Serviços.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {chargeableServices.map((service: any) => (
                  <div
                    key={service.id}
                    className="rounded-xl border p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-slate-900">{service.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-slate-700">
                          {currencyFormatter.format(Number(service.price))}
                        </span>
                        {service.subtitle && (
                          <span className="text-xs text-slate-500">{service.subtitle}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-8 w-8 p-0"
                      onClick={() => handleConsumeService(service.id)}
                      disabled={consumeService.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
