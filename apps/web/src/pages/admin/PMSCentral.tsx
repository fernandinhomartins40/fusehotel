import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BedDouble,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  LayoutGrid,
  Package,
  ShoppingCart,
  Sparkles,
  UserRound,
  Wallet,
  Wrench,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminReservations } from '@/hooks/useAdminReservations';
import {
  useBusinessAccounts,
  useFeedbacks,
  useGeneratePaymentLink,
  useIssuePreCheckIn,
  usePreCheckIns,
  useQuotes,
  useSendFNRH,
  useSendVoucher,
} from '@/hooks/useCRM';
import { useChannels, useInventoryBlocks, useRatePlans } from '@/hooks/useDistribution';
import { useFinancialEntries } from '@/hooks/useFinance';
import { useFrontdeskDashboard } from '@/hooks/useFrontdesk';
import { useHousekeepingTasks, useLostFoundItems } from '@/hooks/useHousekeeping';
import { useInventoryProducts } from '@/hooks/useInventory';
import { useMaintenanceOrders } from '@/hooks/useMaintenance';
import { useActiveCashSession, usePOSOrders } from '@/hooks/usePOS';
import { useOperationsReport } from '@/hooks/useReports';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function PMSCentral() {
  const { data: report } = useOperationsReport();
  const { data: dashboard } = useFrontdeskDashboard();
  const { data: reservations = [] } = useAdminReservations();
  const { data: preCheckIns = [] } = usePreCheckIns();
  const { data: quotes = [] } = useQuotes();
  const { data: feedbacks = [] } = useFeedbacks();
  const { data: businessAccounts = [] } = useBusinessAccounts();
  const { data: ratePlans = [] } = useRatePlans();
  const { data: inventoryBlocks = [] } = useInventoryBlocks();
  const { data: channels = [] } = useChannels();
  const { data: inventory } = useInventoryProducts();
  const { data: finance } = useFinancialEntries();
  const { data: housekeepingTasks = [] } = useHousekeepingTasks();
  const { data: lostFound = [] } = useLostFoundItems();
  const { data: maintenanceOrders = [] } = useMaintenanceOrders();
  const { data: posOrders = [] } = usePOSOrders();
  const { data: activeCashSession } = useActiveCashSession();

  const generatePaymentLink = useGeneratePaymentLink();
  const issuePreCheckIn = useIssuePreCheckIn();
  const sendVoucher = useSendVoucher();
  const sendFNRH = useSendFNRH();

  const pendingReservations = reservations.filter((reservation: any) => reservation.status === 'PENDING');
  const arrivals = dashboard?.arrivals ?? [];
  const departures = dashboard?.departures ?? [];
  const pendingPreCheckIns = preCheckIns.filter((item) => item.status !== 'APPROVED' && item.status !== 'CHECKED_IN');
  const preCheckInsReadyForFNRH = preCheckIns.filter((item) => item.fnrhStatus === 'READY');
  const lowStockItems = inventory?.alerts ?? [];
  const openQuotes = quotes.filter((quote) => quote.status !== 'CONVERTED' && quote.status !== 'CANCELLED');
  const activeChannels = channels.filter((channel) => channel.isActive);
  const blockedInventory = inventoryBlocks.filter((block) => new Date(block.endsAt) >= new Date());
  const openMaintenance = maintenanceOrders.filter((order) => order.status !== 'COMPLETED' && order.status !== 'CANCELLED');
  const pendingHousekeeping = housekeepingTasks.filter((task) => task.status !== 'INSPECTED' && task.status !== 'CANCELLED');
  const openPosOrders = posOrders.filter((order) => order.status !== 'CLOSED' && order.status !== 'CANCELLED');
  const pendingFeedbacks = feedbacks.filter((feedback) => !feedback.respondedAt);

  const frontdeskQueue = [
    {
      title: 'Chegadas hoje',
      value: arrivals.length,
      description: 'Reservas prontas para check-in',
      icon: CalendarClock,
      to: '/admin/frontdesk',
    },
    {
      title: 'Saídas hoje',
      value: departures.length,
      description: 'Hospedagens para check-out',
      icon: CalendarCheck2,
      to: '/admin/frontdesk',
    },
    {
      title: 'Governança pendente',
      value: pendingHousekeeping.length,
      description: 'Quartos aguardando limpeza ou inspeção',
      icon: ClipboardCheck,
      to: '/admin/housekeeping',
    },
    {
      title: 'Pedidos em aberto',
      value: openPosOrders.length,
      description: 'PDV, room service e consumo interno',
      icon: ShoppingCart,
      to: '/admin/pos',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <section className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Central do Hotel</Badge>
                <Badge className="border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/10">
                  PWA instalável
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Operação centralizada para recepção, PDV e gestão</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Esta tela concentra a rotina diária do hotel. As páginas específicas continuam disponíveis para cadastro,
                  configuração e controle detalhado.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PrimaryAction to="/admin/pos" label="Abrir PDV" description="Cobrança, consumo, caixa e room service" icon={ShoppingCart} />
                <PrimaryAction to="/admin/frontdesk" label="Abrir recepção" description="Check-in, check-out e hospedagens" icon={CalendarClock} />
                <PrimaryAction to="/admin/reservations" label="Abrir reservas" description="Reservas do site, manuais e follow-up" icon={BedDouble} />
                <PrimaryAction to="/admin/schedule" label="Ver mapa" description="Disponibilidade, bloqueios e visão geral" icon={LayoutGrid} />
              </div>
            </div>

            <Card className="w-full border-white/10 bg-white/5 text-white xl:max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Painel rápido do turno</CardTitle>
                <CardDescription className="text-slate-300">
                  Leitura imediata para operador, recepção e gerente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <StatusRow
                  label="Caixa atual"
                  value={activeCashSession ? activeCashSession.code : 'Fechado'}
                  tone={activeCashSession ? 'text-emerald-300' : 'text-amber-300'}
                />
                <StatusRow
                  label="Receber hoje"
                  value={currency.format(finance?.summary.receivableOpen ?? 0)}
                />
                <StatusRow
                  label="Pagar hoje"
                  value={currency.format(finance?.summary.payableOpen ?? 0)}
                />
                <StatusRow
                  label="Quartos ocupados"
                  value={`${report?.rooms.occupied ?? 0} / ${report?.rooms.total ?? 0}`}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            title="Ocupação"
            value={`${report?.rooms.occupancyRate ?? 0}%`}
            subtitle={`${report?.rooms.occupied ?? 0} de ${report?.rooms.total ?? 0} quartos ocupados`}
            icon={BedDouble}
          />
          <MetricCard
            title="Receita de hospedagem"
            value={currency.format(report?.finance.reservationRevenueMonth ?? 0)}
            subtitle={`${report?.finance.reservationCountMonth ?? 0} reservas no mês`}
            icon={CreditCard}
          />
          <MetricCard
            title="Receita do PDV"
            value={currency.format(report?.finance.posRevenueMonth ?? 0)}
            subtitle={`${report?.finance.posOrdersMonth ?? 0} pedidos no mês`}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Saldo gerencial"
            value={currency.format((finance?.summary.receivableOpen ?? 0) - (finance?.summary.payableOpen ?? 0))}
            subtitle={`Receber ${currency.format(finance?.summary.receivableOpen ?? 0)} • Pagar ${currency.format(finance?.summary.payableOpen ?? 0)}`}
            icon={Wallet}
          />
        </section>

        <Tabs defaultValue="operacao" className="space-y-4">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="operacao">Operação</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="comercial">Comercial</TabsTrigger>
            <TabsTrigger value="atalhos">Módulos</TabsTrigger>
          </TabsList>

          <TabsContent value="operacao" className="grid gap-6 2xl:grid-cols-[1.2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Fila operacional do dia</CardTitle>
                <CardDescription>Os fluxos prioritários para uma operação simples e rápida.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {frontdeskQueue.map((item) => (
                  <QueueCard key={item.title} {...item} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações rápidas</CardTitle>
                <CardDescription>Execute as ações mais comuns sem navegar por várias telas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingReservations.slice(0, 4).map((reservation: any) => (
                  <div key={reservation.id} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{reservation.guestName}</div>
                        <div className="text-sm text-slate-500">
                          {reservation.reservationCode} • {reservation.checkInDate} a {reservation.checkOutDate}
                        </div>
                      </div>
                      <Badge variant="outline">{reservation.source ?? 'Reserva'}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => generatePaymentLink.mutate(reservation.id)}>
                        Link de pagamento
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => sendVoucher.mutate(reservation.id)}>
                        Enviar voucher
                      </Button>
                      <Button size="sm" onClick={() => issuePreCheckIn.mutate(reservation.id)}>
                        Pré-check-in
                      </Button>
                    </div>
                  </div>
                ))}

                {!pendingReservations.length && (
                  <EmptyState text="Nenhuma reserva pendente de ação imediata." />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas" className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4">
            <AlertCard
              title="Pré-check-in e FNRH"
              count={pendingPreCheckIns.length}
              icon={UserRound}
              to="/admin/reservations"
              items={pendingPreCheckIns.slice(0, 5).map((item) => ({
                id: item.id,
                label: `${item.reservation?.reservationCode ?? 'Reserva'} • ${item.status}`,
                actionLabel: item.fnrhStatus === 'READY' ? 'Enviar FNRH' : undefined,
                onAction: item.fnrhStatus === 'READY' ? () => sendFNRH.mutate(item.id) : undefined,
              }))}
            />
            <AlertCard
              title="Estoque baixo"
              count={lowStockItems.length}
              icon={Package}
              to="/admin/pos"
              items={lowStockItems.slice(0, 5).map((product) => ({
                id: product.id,
                label: `${product.name} • ${product.stockQuantity}/${product.minStockQuantity}`,
              }))}
            />
            <AlertCard
              title="Manutenção aberta"
              count={openMaintenance.length}
              icon={Wrench}
              to="/admin/maintenance"
              items={openMaintenance.slice(0, 5).map((order) => ({
                id: order.id,
                label: `${order.roomUnit.code} • ${order.title}`,
              }))}
            />
            <AlertCard
              title="Achados e perdidos"
              count={lostFound.length}
              icon={AlertTriangle}
              to="/admin/housekeeping"
              items={lostFound.slice(0, 5).map((item) => ({
                id: item.id,
                label: `${item.title} • ${item.roomUnit?.code ?? 'Sem quarto'}`,
              }))}
            />
          </TabsContent>

          <TabsContent value="comercial" className="grid gap-6 2xl:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comercial e distribuição</CardTitle>
                  <CardDescription>Resumo dos itens que afetam vendas, conversão e ocupação.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <InfoRow label="Orçamentos em aberto" value={String(openQuotes.length)} />
                  <InfoRow label="Conversão do mês" value={`${report?.commercial.conversionRate ?? 0}%`} />
                  <InfoRow label="Contas B2B ativas" value={String(businessAccounts.filter((item) => item.isActive).length)} />
                  <InfoRow label="Canais ativos" value={String(activeChannels.length)} />
                  <InfoRow label="Tarifas ativas" value={String(ratePlans.filter((item) => item.isActive).length)} />
                  <InfoRow label="Bloqueios futuros" value={String(blockedInventory.length)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pendências comerciais</CardTitle>
                  <CardDescription>Itens que exigem acompanhamento do time de reservas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SmallStatCard
                    title="Pré-check-ins prontos para FNRH"
                    value={preCheckInsReadyForFNRH.length}
                    description="Prontos para envio ao Ministério do Turismo"
                    icon={CheckCircle2}
                  />
                  <SmallStatCard
                    title="Feedbacks sem resposta"
                    value={pendingFeedbacks.length}
                    description="Avaliações que ainda não tiveram retorno"
                    icon={Sparkles}
                  />
                  <SmallStatCard
                    title="Reservas pendentes"
                    value={pendingReservations.length}
                    description="Aguardando cobrança, voucher ou confirmação"
                    icon={CalendarClock}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Receita por canal</CardTitle>
                <CardDescription>Distribuição das vendas no período corrente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(report?.commercial.channelSales ?? []).slice(0, 6).map((channel) => (
                  <div key={channel.source} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{channel.source}</span>
                      <span className="text-sm text-slate-500">{channel.reservations} reservas</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{currency.format(channel.revenue)}</div>
                  </div>
                ))}

                {!(report?.commercial.channelSales ?? []).length && (
                  <EmptyState text="Nenhum dado de canal disponível no momento." />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="atalhos" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <ModuleCard title="PDV" description="Caixa, pedidos, faturamento e consumo." icon={ShoppingCart} to="/admin/pos" />
            <ModuleCard title="Recepção" description="Check-in, check-out e hospedagens." icon={CalendarClock} to="/admin/frontdesk" />
            <ModuleCard title="Reservas" description="Reservas do site, manuais e automações." icon={BedDouble} to="/admin/reservations" />
            <ModuleCard title="Mapa de reservas" description="Disponibilidade, bloqueios e visão geral." icon={LayoutGrid} to="/admin/schedule" />
            <ModuleCard title="Governança" description="Limpeza, equipes e achados e perdidos." icon={ClipboardCheck} to="/admin/housekeeping" />
            <ModuleCard title="Manutenção" description="Ordens, bloqueios e indisponibilidade." icon={Wrench} to="/admin/maintenance" />
            <ModuleCard title="Quartos" description="Inventário físico e status operacional." icon={BedDouble} to="/admin/room-units" />
            <ModuleCard title="Relatórios" description="Ocupação, RevPAR, receitas e desempenho." icon={BarChart3} to="/admin/reports" />
            <ModuleCard title="Hóspedes" description="Cadastros, histórico e relacionamento." icon={UserRound} to="/admin/customers" />
            <ModuleCard title="Acomodações" description="Categorias, catálogo e conteúdo comercial." icon={BriefcaseBusiness} to="/admin/accommodations" />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof BarChart3;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
        </div>
        <div className="rounded-full bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function PrimaryAction({
  to,
  label,
  description,
  icon: Icon,
}: {
  to: string;
  label: string;
  description: string;
  icon: typeof ShoppingCart;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-white/10 p-2">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-slate-300" />
      </div>
      <div className="mt-4 font-medium">{label}</div>
      <div className="mt-1 text-sm text-slate-300">{description}</div>
    </Link>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-300">{label}</span>
      <span className={tone ?? 'text-white'}>{value}</span>
    </div>
  );
}

function QueueCard({
  title,
  value,
  description,
  icon: Icon,
  to,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof CalendarClock;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{description}</div>
    </Link>
  );
}

function AlertCard({
  title,
  count,
  icon: Icon,
  to,
  items,
}: {
  title: string;
  count: number;
  icon: typeof UserRound;
  to: string;
  items: Array<{
    id: string;
    label: string;
    actionLabel?: string;
    onAction?: () => void;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{count} item(ns) para atenção</CardDescription>
          </div>
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border p-3 text-sm text-slate-700">
              <div>{item.label}</div>
              {item.actionLabel && item.onAction ? (
                <Button size="sm" variant="outline" className="mt-2" onClick={item.onAction}>
                  {item.actionLabel}
                </Button>
              ) : null}
            </div>
          ))
        ) : (
          <EmptyState text="Nenhuma pendência agora." />
        )}
        <Button asChild variant="outline" className="mt-2 w-full">
          <Link to={to}>
            Abrir módulo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ModuleCard({
  title,
  description,
  icon: Icon,
  to,
}: {
  title: string;
  description: string;
  icon: typeof BedDouble;
  to: string;
}) {
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
          <Link to={to}>Abrir</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SmallStatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof Sparkles;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{description}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">{text}</div>;
}
