import { Link } from 'react-router-dom';
import {
  BarChart3,
  BedDouble,
  CalendarCheck2,
  CalendarClock,
  ClipboardCheck,
  ConciergeBell,
  CreditCard,
  LayoutGrid,
  ShoppingCart,
  Wallet,
  Wrench,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminReservations } from '@/hooks/useAdminReservations';
import { useFinancialEntries } from '@/hooks/useFinance';
import { useFrontdeskDashboard } from '@/hooks/useFrontdesk';
import { useHousekeepingTasks } from '@/hooks/useHousekeeping';
import { useMaintenanceOrders } from '@/hooks/useMaintenance';
import { useActiveCashSession, usePOSOrders } from '@/hooks/usePOS';
import { useOperationsReport } from '@/hooks/useReports';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function PMSCentral() {
  const { data: dashboard } = useFrontdeskDashboard();
  const { data: report } = useOperationsReport();
  const { data: reservations = [] } = useAdminReservations();
  const { data: activeCashSession } = useActiveCashSession();
  const { data: posOrders = [] } = usePOSOrders();
  const { data: housekeepingTasks = [] } = useHousekeepingTasks();
  const { data: maintenanceOrders = [] } = useMaintenanceOrders();
  const { data: finance } = useFinancialEntries();

  const arrivals = dashboard?.arrivals ?? [];
  const departures = dashboard?.departures ?? [];
  const pendingReservations = reservations.filter((reservation: any) => reservation.status === 'PENDING');
  const pendingHousekeeping = housekeepingTasks.filter((task) => task.status !== 'INSPECTED' && task.status !== 'CANCELLED');
  const openMaintenance = maintenanceOrders.filter((order) => order.status !== 'COMPLETED' && order.status !== 'CANCELLED');
  const openPosOrders = posOrders.filter((order) => order.status !== 'CLOSED' && order.status !== 'CANCELLED');

  const priorityItems = [
    {
      title: 'Chegadas do dia',
      value: arrivals.length,
      description: 'Reservas aguardando check-in',
      icon: CalendarClock,
      to: '/admin/frontdesk',
    },
    {
      title: 'Saídas do dia',
      value: departures.length,
      description: 'Hospedagens prontas para check-out',
      icon: CalendarCheck2,
      to: '/admin/frontdesk',
    },
    {
      title: 'Pedidos abertos',
      value: openPosOrders.length,
      description: 'Pedidos de balcão e room service',
      icon: ShoppingCart,
      to: '/admin/pos',
    },
    {
      title: 'Limpeza pendente',
      value: pendingHousekeeping.length,
      description: 'Quartos aguardando liberação',
      icon: ClipboardCheck,
      to: '/admin/housekeeping',
    },
    {
      title: 'Manutenção aberta',
      value: openMaintenance.length,
      description: 'Ordens técnicas em andamento',
      icon: Wrench,
      to: '/admin/maintenance',
    },
    {
      title: 'Reservas pendentes',
      value: pendingReservations.length,
      description: 'Aguardando confirmação ou cobrança',
      icon: BedDouble,
      to: '/admin/reservations',
    },
  ];

  const actionItems = [
    {
      title: 'PDV',
      description: 'Cobrança, pedidos, consumo e caixa.',
      icon: ShoppingCart,
      to: '/admin/pos',
      cta: 'Abrir PDV',
    },
    {
      title: 'Recepção',
      description: 'Check-in, check-out, walk-in e contas.',
      icon: ConciergeBell,
      to: '/admin/frontdesk',
      cta: 'Abrir recepção',
    },
    {
      title: 'Reservas',
      description: 'Fila comercial, aprovações e calendário.',
      icon: CalendarClock,
      to: '/admin/reservations',
      cta: 'Abrir reservas',
    },
    {
      title: 'Calendário operacional',
      description: 'Disponibilidade, quartos e bloqueios.',
      icon: LayoutGrid,
      to: '/admin/reservations',
      cta: 'Abrir calendário',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <section className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Painel do turno</Badge>
                <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Operação diária</Badge>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Triagem rápida do hotel</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Use esta tela para entender prioridades do turno. A operação acontece principalmente no PDV,
                  na recepção e nas reservas.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
              <QuickPulse
                label="Caixa atual"
                value={activeCashSession ? activeCashSession.code : 'Fechado'}
                icon={Wallet}
              />
              <QuickPulse
                label="Receita do dia"
                value={currency.format(report?.finance.posRevenueMonth ?? 0)}
                icon={CreditCard}
              />
              <QuickPulse
                label="Receber"
                value={currency.format(finance?.summary.receivableOpen ?? 0)}
                icon={BarChart3}
              />
              <QuickPulse
                label="Quartos ocupados"
                value={`${report?.rooms.occupied ?? 0} / ${report?.rooms.total ?? 0}`}
                icon={BedDouble}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actionItems.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">{item.cta}</span>
              </div>
              <div className="mt-4 font-semibold text-slate-900">{item.title}</div>
              <div className="mt-1 text-sm text-slate-500">{item.description}</div>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 2xl:grid-cols-[1.3fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Prioridades do turno</CardTitle>
              <CardDescription>O que precisa de atenção imediata sem navegar pela aplicação inteira.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {priorityItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="rounded-2xl border bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{item.title}</span>
                    <item.icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</div>
                  <div className="mt-2 text-sm text-slate-500">{item.description}</div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fila de decisão</CardTitle>
              <CardDescription>Pendências que normalmente travam a operação ou a receita.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <DecisionRow
                label="Reservas sem confirmação"
                value={pendingReservations.length}
                to="/admin/reservations"
              />
              <DecisionRow
                label="Check-ins de hoje"
                value={arrivals.length}
                to="/admin/frontdesk"
              />
              <DecisionRow
                label="Pedidos aguardando fechamento"
                value={openPosOrders.length}
                to="/admin/pos"
              />
              <DecisionRow
                label="Quartos aguardando governança"
                value={pendingHousekeeping.length}
                to="/admin/housekeeping"
              />
              <DecisionRow
                label="Ordens de manutenção"
                value={openMaintenance.length}
                to="/admin/maintenance"
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}

function QuickPulse({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.08em] text-slate-300">{label}</div>
          <div className="mt-1 text-lg font-semibold text-white">{value}</div>
        </div>
        <div className="rounded-xl bg-white/10 p-2">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}

function DecisionRow({
  label,
  value,
  to,
}: {
  label: string;
  value: number;
  to: string;
}) {
  return (
    <Link to={to} className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-slate-50">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-900">{value}</span>
    </Link>
  );
}
