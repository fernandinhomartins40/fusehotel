import { useMemo, useState } from 'react';
import { differenceInDays } from 'date-fns';
import { Banknote, LogOut, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Stay } from '@/types/pms';
import type { Reservation } from '@/types/reservation';

type StayFilter = 'all' | 'in-house' | 'arrivals' | 'departures';

interface StaysListProps {
  inHouse: Stay[];
  arrivals: Reservation[];
  departures: Stay[];
  isLoading: boolean;
  onSelectStay: (stay: Stay) => void;
  onSelectArrival: (reservation: Reservation) => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function getCurrentNight(checkInDate: string): number {
  return Math.max(differenceInDays(new Date(), new Date(checkInDate)), 0) + 1;
}

export function StaysList({
  inHouse,
  arrivals,
  departures,
  isLoading,
  onSelectStay,
  onSelectArrival,
}: StaysListProps) {
  const [filter, setFilter] = useState<StayFilter>('all');
  const [search, setSearch] = useState('');

  const departureIds = useMemo(
    () => new Set(departures.map((s) => s.id)),
    [departures]
  );

  const filteredInHouse = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = inHouse;

    if (query) {
      list = list.filter((stay) => {
        const haystack = [
          stay.reservation.guestName,
          stay.reservation.reservationCode,
          stay.roomUnit?.code,
          stay.roomUnit?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    return list;
  }, [inHouse, search]);

  const filteredArrivals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return arrivals;

    return arrivals.filter((reservation) => {
      const haystack = [
        reservation.guestName,
        reservation.reservationCode,
        reservation.accommodation?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [arrivals, search]);

  const filteredDepartures = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return departures;

    return departures.filter((stay) => {
      const haystack = [
        stay.reservation.guestName,
        stay.reservation.reservationCode,
        stay.roomUnit?.code,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [departures, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Carregando recepção...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as StayFilter)}>
          <TabsList className="h-auto flex-wrap rounded-2xl bg-slate-100 p-1">
            <TabsTrigger value="all" className="rounded-xl px-4 py-2">
              Todos
            </TabsTrigger>
            <TabsTrigger value="in-house" className="rounded-xl px-4 py-2">
              Em casa ({inHouse.length})
            </TabsTrigger>
            <TabsTrigger value="arrivals" className="rounded-xl px-4 py-2">
              Chegadas ({arrivals.length})
            </TabsTrigger>
            <TabsTrigger value="departures" className="rounded-xl px-4 py-2">
              Saidas ({departures.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar hospede, reserva, quarto..."
            className="pl-9"
          />
        </div>
      </div>

      {(filter === 'all' || filter === 'arrivals') && filteredArrivals.length > 0 && (
        <div className="space-y-2">
          {filter === 'all' && (
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Chegadas do dia
            </h3>
          )}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospede</TableHead>
                  <TableHead>Reserva</TableHead>
                  <TableHead>Acomodacao</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead className="text-right">Acao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArrivals.map((reservation) => (
                  <TableRow
                    key={reservation.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => onSelectArrival(reservation)}
                  >
                    <TableCell className="font-medium">{reservation.guestName}</TableCell>
                    <TableCell className="font-mono text-sm">{reservation.reservationCode}</TableCell>
                    <TableCell>{reservation.accommodation?.name}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} -{' '}
                      {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        Aguardando check-in
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'in-house') && filteredInHouse.length > 0 && (
        <div className="space-y-2">
          {filter === 'all' && (
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Hospedados
            </h3>
          )}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospede</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Noites</TableHead>
                  <TableHead>Saida prevista</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInHouse.map((stay) => {
                  const isDeparture = departureIds.has(stay.id);
                  const balance = Number(stay.folio?.balance || 0);
                  const currentNight = getCurrentNight(stay.reservation.checkInDate);
                  const totalNights = stay.reservation.numberOfNights ?? 0;

                  return (
                    <TableRow
                      key={stay.id}
                      className={`cursor-pointer hover:bg-slate-50 ${isDeparture ? 'bg-amber-50/50' : ''}`}
                      onClick={() => onSelectStay(stay)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{stay.reservation.guestName}</div>
                          <div className="text-xs text-gray-500 font-mono">{stay.reservation.reservationCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{stay.roomUnit?.code || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {currentNight}/{totalNights}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                          {isDeparture && (
                            <LogOut className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={balance > 0 ? 'destructive' : 'default'}>
                          {currencyFormatter.format(balance)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'departures') && filteredDepartures.length > 0 && (
        <div className="space-y-2">
          {filter === 'all' && (
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Saidas do dia
            </h3>
          )}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospede</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Reserva</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartures.map((stay) => {
                  const balance = Number(stay.folio?.balance || 0);

                  return (
                    <TableRow
                      key={stay.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => onSelectStay(stay)}
                    >
                      <TableCell className="font-medium">{stay.reservation.guestName}</TableCell>
                      <TableCell className="font-mono">{stay.roomUnit?.code || '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{stay.reservation.reservationCode}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={balance > 0 ? 'destructive' : 'default'}>
                          {currencyFormatter.format(balance)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {filter === 'all' && !inHouse.length && !arrivals.length && !departures.length && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Nenhuma movimentacao para hoje.
        </div>
      )}

      {filter === 'in-house' && !filteredInHouse.length && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Nenhuma hospedagem ativa.
        </div>
      )}

      {filter === 'arrivals' && !filteredArrivals.length && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Nenhuma chegada pendente.
        </div>
      )}

      {filter === 'departures' && !filteredDepartures.length && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Nenhuma saida pendente.
        </div>
      )}
    </div>
  );
}
