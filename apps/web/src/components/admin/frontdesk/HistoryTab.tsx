import { CalendarDays, Home, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStayHistory } from '@/hooks/useCustomers';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const statusLabels: Record<string, string> = {
  IN_HOUSE: 'Em casa',
  CHECKED_OUT: 'Finalizada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No-show',
  RESERVED: 'Reservada',
};

const sourceLabels: Record<string, string> = {
  WEBSITE: 'Site',
  PHONE: 'Telefone',
  EMAIL: 'Email',
  WHATSAPP: 'WhatsApp',
  WALK_IN: 'Walk-in',
  BOOKING: 'Booking',
  AIRBNB: 'Airbnb',
  EXPEDIA: 'Expedia',
  CORPORATE: 'Corporativo',
  OTHER: 'Outro',
};

interface HistoryTabProps {
  userId?: string;
  currentStayId?: string;
}

export function HistoryTab({ userId, currentStayId }: HistoryTabProps) {
  const { data, isLoading } = useStayHistory(userId);

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        Hospede sem cadastro vinculado. Historico indisponivel.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) return null;

  const { stays, summary } = data;
  const pastStays = stays.filter((s) => s.id !== currentStayId);

  return (
    <ScrollArea className="h-full mt-3">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Estadias</div>
            <div className="mt-1 text-lg font-semibold">{summary.totalStays}</div>
          </div>
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Total gasto</div>
            <div className="mt-1 text-lg font-semibold">{currencyFormatter.format(summary.totalSpent)}</div>
          </div>
        </div>

        {pastStays.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
            {summary.totalStays > 0
              ? 'Esta e a primeira estadia deste hospede.'
              : 'Nenhuma estadia registrada para este hospede.'}
          </div>
        ) : (
          <div className="space-y-3">
            {pastStays.map((stay) => {
              const isActive = stay.status === 'IN_HOUSE';
              return (
                <div
                  key={stay.id}
                  className={`rounded-xl border p-3 ${isActive ? 'border-sky-200 bg-sky-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {stay.reservation.accommodation.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            isActive
                              ? 'border-sky-300 text-sky-700'
                              : stay.status === 'CHECKED_OUT'
                                ? 'border-green-300 text-green-700'
                                : 'border-gray-300 text-gray-500'
                          }`}
                        >
                          {statusLabels[stay.status] ?? stay.status}
                        </Badge>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(stay.reservation.checkInDate).toLocaleDateString('pt-BR')} -{' '}
                          {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span>{stay.reservation.numberOfNights} noite(s)</span>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        {stay.roomUnit && (
                          <span className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Quarto {stay.roomUnit.code}
                          </span>
                        )}
                        <span className="font-mono">{stay.reservation.reservationCode}</span>
                        <span>{sourceLabels[stay.reservation.source] ?? stay.reservation.source}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {currencyFormatter.format(Number(stay.reservation.totalAmount))}
                      </div>
                      {stay.folio && !stay.folio.isClosed && Number(stay.folio.balance) > 0 && (
                        <div className="text-[10px] text-red-600">
                          Saldo: {currencyFormatter.format(Number(stay.folio.balance))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
