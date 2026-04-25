import { useMemo, useState } from 'react';
import { ArrowRightLeft, Banknote, BedDouble, ClipboardList, DoorClosed, Hotel } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useAddFolioEntry, useFolio } from '@/hooks/useFolios';
import { useCheckIn, useCheckOut, useFrontdeskDashboard } from '@/hooks/useFrontdesk';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type { FolioEntryType, RoomUnit, Stay } from '@/types/pms';
import type { Reservation } from '@/types/reservation';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const entryTypeLabels: Record<FolioEntryType, string> = {
  DAILY_RATE: 'Diaria',
  EXTRA_BED: 'Cama extra',
  SERVICE_FEE: 'Taxa',
  TAX: 'Imposto',
  DISCOUNT: 'Desconto',
  PAYMENT: 'Pagamento',
  REFUND: 'Reembolso',
  ROOM_SERVICE: 'Room service',
  POS: 'PDV',
  ADJUSTMENT: 'Ajuste',
};

export default function Frontdesk() {
  const { data: dashboard, isLoading } = useFrontdeskDashboard();
  const { data: roomUnits = [] } = useRoomUnits();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const addFolioEntry = useAddFolioEntry();

  const [selectedRooms, setSelectedRooms] = useState<Record<string, string>>({});
  const [folioStayId, setFolioStayId] = useState<string | null>(null);
  const [entryForm, setEntryForm] = useState({
    type: 'PAYMENT' as FolioEntryType,
    amount: '',
    description: '',
  });

  const { data: folio } = useFolio(folioStayId ?? undefined);

  const availableRoomUnitsByAccommodation = useMemo(() => {
    return roomUnits.reduce<Record<string, RoomUnit[]>>((accumulator, roomUnit) => {
      if (!roomUnit.isActive) {
        return accumulator;
      }

      const isAvailable =
        ['AVAILABLE', 'INSPECTED'].includes(roomUnit.status) &&
        ['CLEAN', 'INSPECTED'].includes(roomUnit.housekeepingStatus);

      if (!isAvailable) {
        return accumulator;
      }

      if (!accumulator[roomUnit.accommodationId]) {
        accumulator[roomUnit.accommodationId] = [];
      }

      accumulator[roomUnit.accommodationId].push(roomUnit);
      return accumulator;
    }, {});
  }, [roomUnits]);

  const handleCheckIn = (reservation: Reservation) => {
    const roomUnitId = selectedRooms[reservation.id];

    if (!roomUnitId) {
      return;
    }

    checkIn.mutate({
      reservationId: reservation.id,
      roomUnitId,
    });
  };

  const handleCheckOut = (stay: Stay) => {
    checkOut.mutate({
      stayId: stay.id,
    });
  };

  const handleAddEntry = () => {
    if (!folio || !entryForm.amount || !entryForm.description) {
      return;
    }

    addFolioEntry.mutate({
      folioId: folio.id,
      payload: {
        type: entryForm.type,
        source: 'MANUAL',
        description: entryForm.description,
        amount: Number(entryForm.amount),
      },
    });

    setEntryForm({
      type: 'PAYMENT',
      amount: '',
      description: '',
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Recepcao</h1>
          <p className="text-gray-600 mt-1">
            Operacao do dia conectada diretamente as reservas do site.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <StatCard title="Chegadas" value={dashboard?.arrivals.length ?? 0} icon={Hotel} />
          <StatCard title="Hospedados" value={dashboard?.inHouse.length ?? 0} icon={BedDouble} />
          <StatCard title="Saidas" value={dashboard?.departures.length ?? 0} icon={DoorClosed} />
          <StatCard title="Quartos livres" value={dashboard?.roomStats.available ?? 0} icon={ClipboardList} />
          <StatCard title="Quartos sujos" value={dashboard?.roomStats.dirty ?? 0} icon={ArrowRightLeft} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chegadas do dia</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reserva</TableHead>
                  <TableHead>Hospede</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead className="text-right">Acao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Carregando recepcao...</TableCell>
                  </TableRow>
                ) : !dashboard?.arrivals.length ? (
                  <TableRow>
                    <TableCell colSpan={6}>Nenhuma chegada pendente hoje.</TableCell>
                  </TableRow>
                ) : (
                  dashboard.arrivals.map((reservation) => {
                    const candidateRooms =
                      availableRoomUnitsByAccommodation[reservation.accommodationId] ?? [];

                    return (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-mono">{reservation.reservationCode}</TableCell>
                        <TableCell>{reservation.guestName}</TableCell>
                        <TableCell>{reservation.accommodation?.name}</TableCell>
                        <TableCell>
                          {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} ate{' '}
                          {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={selectedRooms[reservation.id] ?? ''}
                            onValueChange={(value) =>
                              setSelectedRooms((current) => ({ ...current, [reservation.id]: value }))
                            }
                          >
                            <SelectTrigger className="w-[220px]">
                              <SelectValue placeholder="Selecionar quarto" />
                            </SelectTrigger>
                            <SelectContent>
                              {candidateRooms.map((roomUnit) => (
                                <SelectItem key={roomUnit.id} value={roomUnit.id}>
                                  {roomUnit.code} - {roomUnit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleCheckIn(reservation)}
                            disabled={!selectedRooms[reservation.id] || checkIn.isPending}
                          >
                            Fazer check-in
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hospedagens ativas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reserva</TableHead>
                  <TableHead>Hospede</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Saida prevista</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!dashboard?.inHouse.length ? (
                  <TableRow>
                    <TableCell colSpan={6}>Nenhuma hospedagem ativa.</TableCell>
                  </TableRow>
                ) : (
                  dashboard.inHouse.map((stay) => (
                    <TableRow key={stay.id}>
                      <TableCell className="font-mono">{stay.reservation.reservationCode}</TableCell>
                      <TableCell>{stay.reservation.guestName}</TableCell>
                      <TableCell>{stay.roomUnit?.code || '-'}</TableCell>
                      <TableCell>
                        {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={Number(stay.folio?.balance || 0) > 0 ? 'destructive' : 'default'}>
                          {currencyFormatter.format(Number(stay.folio?.balance || 0))}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setFolioStayId(stay.id)}>
                            <Banknote className="mr-2 h-4 w-4" />
                            Folio
                          </Button>
                          <Button
                            onClick={() => handleCheckOut(stay)}
                            disabled={checkOut.isPending}
                          >
                            Check-out
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

      <Dialog open={Boolean(folioStayId)} onOpenChange={(open) => !open && setFolioStayId(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Folio da hospedagem</DialogTitle>
            <DialogDescription>
              Lançamentos financeiros da estadia e liquidação para check-out.
            </DialogDescription>
          </DialogHeader>

          {!folio ? (
            <div>Carregando folio...</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-gray-500">Saldo atual</div>
                  <div className="text-2xl font-semibold">
                    {currencyFormatter.format(Number(folio.balance))}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descricao</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {folio.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.postedAt).toLocaleString('pt-BR')}</TableCell>
                        <TableCell>{entryTypeLabels[entry.type]}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-right">
                          {currencyFormatter.format(Number(entry.amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lancar movimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={entryForm.type}
                      onValueChange={(value) => setEntryForm((current) => ({ ...current, type: value as FolioEntryType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['PAYMENT', 'ROOM_SERVICE', 'POS', 'ADJUSTMENT'] as FolioEntryType[]).map((type) => (
                          <SelectItem key={type} value={type}>
                            {entryTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entryForm.amount}
                      onChange={(event) => setEntryForm((current) => ({ ...current, amount: event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descricao</Label>
                    <Textarea
                      value={entryForm.description}
                      onChange={(event) => setEntryForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>

                  <Button className="w-full" onClick={handleAddEntry} disabled={addFolioEntry.isPending}>
                    Registrar no folio
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Hotel;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
