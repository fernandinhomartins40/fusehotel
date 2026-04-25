import { Link } from 'react-router-dom';
import { BarChart3, Building2, CalendarClock, CreditCard, Package, ShoppingCart, Users } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminReservations } from '@/hooks/useAdminReservations';
import { useGeneratePaymentLink, useIssuePreCheckIn, usePreCheckIns, useQuotes } from '@/hooks/useCRM';
import { useFinancialEntries } from '@/hooks/useFinance';
import { useInventoryProducts } from '@/hooks/useInventory';
import { useOperationsReport } from '@/hooks/useReports';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PMSCentral() {
  const { data: report } = useOperationsReport();
  const { data: reservations = [] } = useAdminReservations();
  const { data: preCheckIns = [] } = usePreCheckIns();
  const { data: quotes = [] } = useQuotes();
  const { data: inventory } = useInventoryProducts();
  const { data: finance } = useFinancialEntries();
  const generatePaymentLink = useGeneratePaymentLink();
  const issuePreCheckIn = useIssuePreCheckIn();

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Central operacional</h1>
            <p className="text-slate-600">Resumo do hotel com ações rápidas e acesso direto a todos os módulos.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">PWA instalável</Badge>
            <Badge variant="outline">pt-BR</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Ocupação" value={`${report?.rooms.occupancyRate ?? 0}%`} subtitle={`${report?.rooms.occupied ?? 0}/${report?.rooms.total ?? 0} quartos`} icon={BarChart3} />
          <MetricCard title="Receita hospedagem" value={money.format(report?.finance.reservationRevenueMonth ?? 0)} subtitle={`${report?.finance.reservationCountMonth ?? 0} reservas`} icon={CalendarClock} />
          <MetricCard title="Receita PDV" value={money.format(report?.finance.posRevenueMonth ?? 0)} subtitle={`${report?.finance.posOrdersMonth ?? 0} pedidos`} icon={ShoppingCart} />
          <MetricCard title="RevPAR" value={money.format(report?.finance.revpar ?? 0)} subtitle={`Conversão ${report?.commercial.conversionRate ?? 0}%`} icon={CreditCard} />
        </div>

        <Tabs defaultValue="acoes" className="space-y-4">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="acoes">Ações rápidas</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="modulos">Módulos</TabsTrigger>
          </TabsList>

          <TabsContent value="acoes" className="grid gap-6 xl:grid-cols-3">
            <QuickCard title="Reservas" description="Automatize cobrança, voucher e pré-check-in.">
              {reservations.slice(0, 5).map((reservation: any) => (
                <div key={reservation.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <span>{reservation.reservationCode} • {reservation.guestName}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => generatePaymentLink.mutate(reservation.id)}>Link</Button>
                    <Button size="sm" onClick={() => issuePreCheckIn.mutate(reservation.id)}>Pré-check-in</Button>
                  </div>
                </div>
              ))}
            </QuickCard>

            <QuickCard title="CRM" description="Acompanhe orçamentos e pré-check-ins em aberto.">
              <div className="space-y-3 text-sm">
                <div className="rounded-md border p-3">Orçamentos abertos: <strong>{quotes.filter((quote) => quote.status !== 'CONVERTED').length}</strong></div>
                <div className="rounded-md border p-3">Pré-check-ins pendentes: <strong>{preCheckIns.filter((item) => item.status !== 'APPROVED').length}</strong></div>
                <div className="rounded-md border p-3">Contas B2B ativas: <strong>{report?.commercial.activeBusinessAccounts ?? 0}</strong></div>
              </div>
            </QuickCard>

            <QuickCard title="Financeiro e estoque" description="Resumo operacional para ação imediata.">
              <div className="space-y-3 text-sm">
                <div className="rounded-md border p-3">Contas a receber: <strong>{money.format(finance?.summary.receivableOpen ?? 0)}</strong></div>
                <div className="rounded-md border p-3">Contas a pagar: <strong>{money.format(finance?.summary.payableOpen ?? 0)}</strong></div>
                <div className="rounded-md border p-3">Estoque baixo: <strong>{inventory?.alerts.length ?? 0}</strong></div>
              </div>
            </QuickCard>
          </TabsContent>

          <TabsContent value="alertas" className="grid gap-6 xl:grid-cols-3">
            <QuickCard title="Pré-check-in / FNRH" description="Pendências regulatórias e de recepção.">
              <div className="space-y-2 text-sm">
                {preCheckIns.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-md border p-3">
                    {item.reservation?.reservationCode} • {item.status} • FNRH {item.fnrhStatus}
                  </div>
                ))}
              </div>
            </QuickCard>

            <QuickCard title="Estoque" description="Produtos abaixo do mínimo configurado.">
              <div className="space-y-2 text-sm">
                {(inventory?.alerts ?? []).slice(0, 6).map((product) => (
                  <div key={product.id} className="rounded-md border p-3">
                    {product.name} • {product.stockQuantity}/{product.minStockQuantity}
                  </div>
                ))}
              </div>
            </QuickCard>

            <QuickCard title="Receita por canal" description="Leitura comercial resumida do mês.">
              <div className="space-y-2 text-sm">
                {(report?.commercial.channelSales ?? []).slice(0, 6).map((channel) => (
                  <div key={channel.source} className="rounded-md border p-3">
                    {channel.source} • {channel.reservations} reservas • {money.format(channel.revenue)}
                  </div>
                ))}
              </div>
            </QuickCard>
          </TabsContent>

          <TabsContent value="modulos" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ShortcutCard title="Recepção" description="Check-in, check-out e hospedagens." icon={CalendarClock} to="/admin/frontdesk" />
            <ShortcutCard title="Mapa de reservas" description="Disponibilidade, agenda e bloqueios." icon={BarChart3} to="/admin/schedule" />
            <ShortcutCard title="Quartos" description="Inventário físico e status operacional." icon={Package} to="/admin/room-units" />
            <ShortcutCard title="Governança" description="Limpeza, equipe e achados e perdidos." icon={Users} to="/admin/housekeeping" />
            <ShortcutCard title="Manutenção" description="Bloqueios, ordens e indisponibilidade." icon={Package} to="/admin/maintenance" />
            <ShortcutCard title="PDV" description="Pedidos, caixa, room service e consumo." icon={ShoppingCart} to="/admin/pos-legacy" />
            <ShortcutCard title="Reservas" description="Manual, online, voucher e cobrança." icon={CalendarClock} to="/admin/reservations" />
            <ShortcutCard title="Relatórios" description="Ocupação, RevPAR, canais e receita." icon={BarChart3} to="/admin/reports" />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof BarChart3 }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
        </div>
        <div className="rounded-full bg-slate-100 p-3 text-slate-700"><Icon className="h-5 w-5" /></div>
      </CardContent>
    </Card>
  );
}

function QuickCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ShortcutCard({ title, description, icon: Icon, to }: { title: string; description: string; icon: typeof Building2; to: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link to={to}>Abrir módulo</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
