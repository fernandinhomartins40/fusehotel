import { BarChart3, BedDouble, Wallet } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOperationsReport } from '@/hooks/useReports';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Reports() {
  const { data, isLoading } = useOperationsReport();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios Operacionais</h1>
          <p className="text-gray-600 mt-1">
            Visão consolidada da operação, recepção, manutenção e receitas.
          </p>
        </div>

        {isLoading || !data ? (
          <Card>
            <CardContent className="p-8">Carregando indicadores...</CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Taxa de ocupação"
                value={`${data.rooms.occupancyRate}%`}
                description={`${data.rooms.occupied} de ${data.rooms.total} quartos ocupados`}
                icon={BedDouble}
              />
              <MetricCard
                title="Receita de reservas no mês"
                value={currencyFormatter.format(data.finance.reservationRevenueMonth)}
                description={`${data.finance.reservationCountMonth} reservas ativas no período`}
                icon={Wallet}
              />
              <MetricCard
                title="Receita POS no mês"
                value={currencyFormatter.format(data.finance.posRevenueMonth)}
                description={`${data.finance.posOrdersMonth} pedidos faturados`}
                icon={BarChart3}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recepção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportLine label="Chegadas hoje" value={String(data.frontdesk.arrivalsToday)} />
                  <ReportLine label="Saídas hoje" value={String(data.frontdesk.departuresToday)} />
                  <ReportLine label="Hospedados" value={String(data.frontdesk.inHouse)} />
                  <ReportLine
                    label="Fólios em aberto"
                    value={currencyFormatter.format(data.finance.outstandingFolios)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportLine label="Governança pendente" value={String(data.operations.pendingHousekeeping)} />
                  <ReportLine label="Manutenções abertas" value={String(data.operations.openMaintenance)} />
                  <ReportLine label="Data de referência" value={data.referenceDate} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof BedDouble;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          <div className="text-sm text-gray-500 mt-2">{description}</div>
        </div>
        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ReportLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}



