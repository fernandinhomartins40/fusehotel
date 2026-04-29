import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Banknote } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CreateCustomerDialog } from '@/components/admin/customers/CreateCustomerDialog';
import { useAccommodations } from '@/hooks/useAccommodations';
import { useCustomers } from '@/hooks/useCustomers';
import { useAddFolioEntry, useFolio } from '@/hooks/useFolios';
import { useCheckIn, useCheckOut, useFrontdeskDashboard, useWalkInCheckIn } from '@/hooks/useFrontdesk';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type { FolioEntryType, RoomUnit, Stay } from '@/types/pms';
import type { Reservation } from '@/types/reservation';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const entryTypeLabels: Record<FolioEntryType, string> = {
  DAILY_RATE: 'Diária',
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
  const { data: accommodations = [] } = useAccommodations({ adminView: true });
  const { data: customers = [] } = useCustomers({ role: 'CUSTOMER' });
  const checkIn = useCheckIn();
  const walkInCheckIn = useWalkInCheckIn();
  const checkOut = useCheckOut();
  const addFolioEntry = useAddFolioEntry();

  const [selectedRooms, setSelectedRooms] = useState<Record<string, string>>({});
  const [folioStayId, setFólioStayId] = useState<string | null>(null);
  const [accountAction, setAccountAction] = useState<'PAYMENT' | 'ROOM_SERVICE' | 'ADJUSTMENT'>('PAYMENT');
  const [walkInDialogOpen, setWalkInDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [walkInSearch, setWalkInSearch] = useState('');
  const [walkInForm, setWalkInForm] = useState({
    roomUnitId: '',
    customerId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestWhatsApp: '',
    guestCpf: '',
    checkInDate: new Date().toISOString().slice(0, 10),
    checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    adults: '1',
    children: '0',
    notes: '',
  });
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

  const availableWalkInRooms = useMemo(
    () =>
      roomUnits.filter(
        (roomUnit) =>
          roomUnit.isActive &&
          ['AVAILABLE', 'INSPECTED'].includes(roomUnit.status) &&
          ['CLEAN', 'INSPECTED'].includes(roomUnit.housekeepingStatus)
      ),
    [roomUnits]
  );

  const selectedWalkInCustomer = useMemo(
    () => customers.find((customer) => customer.id === walkInForm.customerId),
    [customers, walkInForm.customerId]
  );

  const selectedWalkInRoom = useMemo(
    () => availableWalkInRooms.find((roomUnit) => roomUnit.id === walkInForm.roomUnitId),
    [availableWalkInRooms, walkInForm.roomUnitId]
  );

  const customerSearchResults = useMemo(() => {
    const query = walkInSearch.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return customers.filter((customer) => {
      const haystack = [customer.name, customer.email, customer.phone, customer.whatsapp, customer.cpf]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [customers, walkInSearch]);

  const selectedSearchCustomer = useMemo(
    () => customers.find((customer) => customer.id === walkInForm.customerId),
    [customers, walkInForm.customerId]
  );

  const selectedFolioStay = useMemo(
    () => dashboard?.inHouse.find((stay) => stay.id === folioStayId) ?? null,
    [dashboard?.inHouse, folioStayId]
  );

  const folioSummary = useMemo(() => {
    if (!folio) {
      return {
        charges: 0,
        credits: 0,
      };
    }

    return folio.entries.reduce(
      (summary, entry) => {
        if (Number(entry.amount) >= 0) {
          summary.charges += Number(entry.amount);
        } else {
          summary.credits += Math.abs(Number(entry.amount));
        }

        return summary;
      },
      { charges: 0, credits: 0 }
    );
  }, [folio]);

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

  const handleWalkInCheckIn = () => {
    if (!walkInForm.roomUnitId) {
      return;
    }

    walkInCheckIn.mutate(
      {
        roomUnitId: walkInForm.roomUnitId,
        customerId: walkInForm.customerId || undefined,
        guestName: walkInForm.customerId ? undefined : walkInForm.guestName.trim(),
        guestEmail: walkInForm.customerId ? undefined : walkInForm.guestEmail.trim() || undefined,
        guestPhone: walkInForm.customerId ? undefined : walkInForm.guestPhone.trim() || undefined,
        guestWhatsApp: walkInForm.customerId ? undefined : walkInForm.guestWhatsApp.trim() || undefined,
        guestCpf: walkInForm.customerId ? undefined : walkInForm.guestCpf.trim() || undefined,
        checkInDate: walkInForm.checkInDate,
        checkOutDate: walkInForm.checkOutDate,
        adults: Number(walkInForm.adults),
        children: Number(walkInForm.children || 0),
        notes: walkInForm.notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setWalkInForm({
            roomUnitId: '',
            customerId: '',
            guestName: '',
            guestEmail: '',
            guestPhone: '',
            guestWhatsApp: '',
            guestCpf: '',
            checkInDate: new Date().toISOString().slice(0, 10),
            checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            adults: '1',
            children: '0',
            notes: '',
          });
        },
      }
    );
  };

  const openWalkInDialog = () => {
    const firstMatch = selectedSearchCustomer ?? customerSearchResults[0];

    setWalkInForm((current) => ({
      ...current,
      customerId: firstMatch?.id ?? '',
      guestName: firstMatch ? '' : walkInSearch.trim(),
      guestEmail: firstMatch ? '' : current.guestEmail,
      guestPhone: firstMatch ? '' : current.guestPhone,
      guestWhatsApp: firstMatch ? '' : current.guestWhatsApp,
      guestCpf: firstMatch ? '' : current.guestCpf,
    }));

    setWalkInDialogOpen(true);
  };

  const handleWalkInSearchChange = (value: string) => {
    setWalkInSearch(value);

    if (walkInForm.customerId) {
      setWalkInForm((current) => ({
        ...current,
        customerId: '',
      }));
    }
  };

  const handleSelectCustomerFromSearch = (customerId: string) => {
    const customer = customers.find((item) => item.id === customerId);

    if (!customer) {
      return;
    }

    setWalkInSearch(customer.name);
    setWalkInForm((current) => ({
      ...current,
      customerId: customer.id,
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestWhatsApp: '',
      guestCpf: '',
    }));
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
    setAccountAction('PAYMENT');
  };

  const openAccount = (stayId: string) => {
    setFólioStayId(stayId);
    setAccountAction('PAYMENT');
    setEntryForm({
      type: 'PAYMENT',
      amount: '',
      description: '',
    });
  };

  const selectAccountAction = (action: 'PAYMENT' | 'ROOM_SERVICE' | 'ADJUSTMENT') => {
    setAccountAction(action);
    setEntryForm((current) => ({
      ...current,
      type: action,
      description:
        action === 'PAYMENT'
          ? current.type === 'PAYMENT'
            ? current.description
            : 'Pagamento recebido na recepção'
          : action === 'ROOM_SERVICE'
            ? current.type === 'ROOM_SERVICE'
              ? current.description
              : 'Consumo lançado manualmente pela recepção'
            : current.type === 'ADJUSTMENT'
              ? current.description
              : 'Ajuste manual da conta',
    }));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Recepção</h1>
          <p className="text-gray-600 mt-1">
            Operação do dia conectada diretamente às reservas do site.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Ação rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="walkin-search">Pesquisar cliente</Label>
                  <Input
                    id="walkin-search"
                    value={walkInSearch}
                    onChange={(event) => handleWalkInSearchChange(event.target.value)}
                    placeholder="Nome, WhatsApp, telefone, email ou CPF"
                  />
                  {walkInSearch.trim() ? (
                    <div className="rounded-lg border bg-white">
                      {customerSearchResults.length ? (
                        <div className="max-h-64 overflow-y-auto py-1">
                          {customerSearchResults.slice(0, 8).map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                                walkInForm.customerId === customer.id ? 'bg-sky-50' : ''
                              }`}
                              onClick={() => handleSelectCustomerFromSearch(customer.id)}
                            >
                              <span className="font-medium text-gray-900">{customer.name}</span>
                              <span className="text-gray-500">
                                {customer.whatsapp || customer.phone || customer.email || 'Sem contato'}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Nenhum hóspede encontrado para essa pesquisa.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2 lg:pt-7">
                  <Button onClick={openWalkInDialog}>Fazer check-in</Button>
                  <Button variant="outline" onClick={() => setCustomerDialogOpen(true)}>
                    Cadastrar cliente
                  </Button>
                </div>
              </div>

              {selectedSearchCustomer ? (
                <div className="rounded-lg border px-4 py-3 text-sm text-gray-600">
                  <div className="font-medium text-gray-900">
                    Cliente selecionado: {selectedSearchCustomer.name}
                  </div>
                  <div>
                    {selectedSearchCustomer.whatsapp || selectedSearchCustomer.phone || selectedSearchCustomer.email}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Resumo do turno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CompactMetric label="Chegadas" value={String(dashboard?.arrivals.length ?? 0)} />
              <CompactMetric label="Hospedados" value={String(dashboard?.inHouse.length ?? 0)} />
              <CompactMetric label="Saídas" value={String(dashboard?.departures.length ?? 0)} />
              <CompactMetric label="Quartos livres" value={String(dashboard?.roomStats.available ?? 0)} />
              <CompactMetric label="Quartos sujos" value={String(dashboard?.roomStats.dirty ?? 0)} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="arrivals" className="space-y-4">
          <TabsList className="h-auto flex-wrap rounded-2xl bg-slate-100 p-1">
            <TabsTrigger value="arrivals" className="rounded-xl px-4 py-2">Chegadas</TabsTrigger>
            <TabsTrigger value="in-house" className="rounded-xl px-4 py-2">Hospedados</TabsTrigger>
            <TabsTrigger value="rooms" className="rounded-xl px-4 py-2">Quartos e saídas</TabsTrigger>
          </TabsList>

          <TabsContent value="arrivals" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Chegadas do dia</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserva</TableHead>
                      <TableHead>Hóspede</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Quarto</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6}>Carregando recepção...</TableCell>
                      </TableRow>
                    ) : !dashboard?.arrivals.length ? (
                      <TableRow>
                        <TableCell colSpan={6}>Nenhuma chegada pendente hoje.</TableCell>
                      </TableRow>
                    ) : (
                      dashboard.arrivals.map((reservation) => {
                        const candidateRooms = availableRoomUnitsByAccommodation[reservation.accommodationId] ?? [];

                        return (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-mono">{reservation.reservationCode}</TableCell>
                            <TableCell>{reservation.guestName}</TableCell>
                            <TableCell>{reservation.accommodation?.name}</TableCell>
                            <TableCell>
                              {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} até{' '}
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
          </TabsContent>

          <TabsContent value="in-house" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Hospedagens ativas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserva</TableHead>
                      <TableHead>Hóspede</TableHead>
                      <TableHead>Quarto</TableHead>
                      <TableHead>Saída prevista</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
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
                              <Button variant="outline" onClick={() => openAccount(stay.id)}>
                                <Banknote className="mr-2 h-4 w-4" />
                                Conta
                              </Button>
                              <Button onClick={() => handleCheckOut(stay)} disabled={checkOut.isPending}>
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
          </TabsContent>

          <TabsContent value="rooms" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <Card>
                <CardHeader>
                  <CardTitle>Saídas do dia</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reserva</TableHead>
                        <TableHead>Hóspede</TableHead>
                        <TableHead>Quarto</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!dashboard?.departures.length ? (
                        <TableRow>
                          <TableCell colSpan={4}>Nenhuma saída pendente hoje.</TableCell>
                        </TableRow>
                      ) : (
                        dashboard.departures.map((stay) => (
                          <TableRow key={stay.id}>
                            <TableCell className="font-mono">{stay.reservation.reservationCode}</TableCell>
                            <TableCell>{stay.reservation.guestName}</TableCell>
                            <TableCell>{stay.roomUnit?.code || '-'}</TableCell>
                            <TableCell className="text-right">
                              {currencyFormatter.format(Number(stay.folio?.balance || 0))}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operação de quartos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CompactMetric label="Disponíveis para walk-in" value={String(availableWalkInRooms.length)} />
                  <CompactMetric label="Quartos livres" value={String(dashboard?.roomStats.available ?? 0)} />
                  <CompactMetric label="Quartos sujos" value={String(dashboard?.roomStats.dirty ?? 0)} />
                  <div className="grid gap-2 pt-2">
                    <Button asChild variant="outline"><Link to="/admin/reservations">Calendário operacional</Link></Button>
                    <Button asChild variant="outline"><Link to="/admin/housekeeping">Abrir governança</Link></Button>
                    <Button asChild variant="outline"><Link to="/admin/maintenance">Abrir manutenção</Link></Button>
                    <Button asChild variant="outline"><Link to="/admin/room-units">Abrir quartos</Link></Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={Boolean(folioStayId)} onOpenChange={(open) => !open && setFólioStayId(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Conta da hospedagem</DialogTitle>
            <DialogDescription>
              Recebimentos, consumos extras e ajustes da hospedagem.
            </DialogDescription>
          </DialogHeader>

          {!folio ? (
            <div>Carregando conta...</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <CompactMetric label="Hóspede" value={selectedFolioStay?.reservation.guestName || '-'} />
                  <CompactMetric label="Quarto" value={selectedFolioStay?.roomUnit?.code || '-'} />
                  <CompactMetric label="Saldo atual" value={currencyFormatter.format(Number(folio.balance))} />
                  <CompactMetric
                    label="Saída prevista"
                    value={
                      selectedFolioStay
                        ? new Date(selectedFolioStay.reservation.checkOutDate).toLocaleDateString('pt-BR')
                        : '-'
                    }
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.08em] text-slate-500">Débitos</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">
                      {currencyFormatter.format(folioSummary.charges)}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.08em] text-slate-500">Créditos</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">
                      {currencyFormatter.format(folioSummary.credits)}
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Histórico da conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!folio.entries.length ? (
                      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                        Nenhum lançamento encontrado.
                      </div>
                    ) : (
                      folio.entries.map((entry) => {
                        const isCredit = Number(entry.amount) < 0;

                        return (
                          <div key={entry.id} className="rounded-xl border p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900">{entry.description}</div>
                                <div className="mt-1 text-sm text-slate-500">
                                  {entryTypeLabels[entry.type]} • {new Date(entry.postedAt).toLocaleString('pt-BR')}
                                </div>
                              </div>
                              <div className={`shrink-0 text-right text-sm font-semibold ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {currencyFormatter.format(Number(entry.amount))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ação rápida na conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant={accountAction === 'PAYMENT' ? 'default' : 'outline'}
                      onClick={() => selectAccountAction('PAYMENT')}
                    >
                      Receber pagamento
                    </Button>
                    <Button
                      type="button"
                      variant={accountAction === 'ROOM_SERVICE' ? 'default' : 'outline'}
                      onClick={() => selectAccountAction('ROOM_SERVICE')}
                    >
                      Lançar consumo manual
                    </Button>
                    <Button
                      type="button"
                      variant={accountAction === 'ADJUSTMENT' ? 'default' : 'outline'}
                      onClick={() => selectAccountAction('ADJUSTMENT')}
                    >
                      Fazer ajuste
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {accountAction === 'PAYMENT'
                        ? 'Valor recebido'
                        : accountAction === 'ROOM_SERVICE'
                          ? 'Valor do consumo'
                          : 'Valor do ajuste'}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entryForm.amount}
                      onChange={(event) => setEntryForm((current) => ({ ...current, amount: event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder={
                        accountAction === 'PAYMENT'
                          ? 'Ex.: pagamento em dinheiro na recepção'
                          : accountAction === 'ROOM_SERVICE'
                            ? 'Ex.: consumo extra lançado pela recepção'
                            : 'Ex.: ajuste de tarifa ou correção manual'
                      }
                      value={entryForm.description}
                      onChange={(event) => setEntryForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>

                  <Button className="w-full" onClick={handleAddEntry} disabled={addFolioEntry.isPending}>
                    {accountAction === 'PAYMENT'
                      ? 'Registrar pagamento'
                      : accountAction === 'ROOM_SERVICE'
                        ? 'Registrar consumo'
                        : 'Registrar ajuste'}
                  </Button>

                  <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-600">
                    Use o <strong>PDV</strong> para lançamentos normais de consumo. Esta tela fica para cobrança,
                    consumo manual excepcional e ajustes da recepção.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={walkInDialogOpen} onOpenChange={setWalkInDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Check-in de balcão</DialogTitle>
            <DialogDescription>
              Selecione o hóspede e o quarto disponível para abrir a hospedagem na recepção.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente cadastrado</Label>
                <Select
                  value={walkInForm.customerId || 'none'}
                  onValueChange={(value) =>
                    setWalkInForm((current) => ({
                      ...current,
                      customerId: value === 'none' ? '' : value,
                      guestName: value === 'none' ? current.guestName : '',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente existente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Informar hóspede manualmente</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.whatsapp ? `- ${customer.whatsapp}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedWalkInCustomer ? (
                <div className="rounded-lg border p-4 text-sm text-gray-600">
                  <div className="font-medium text-gray-900">{selectedWalkInCustomer.name}</div>
                  <div>{selectedWalkInCustomer.email}</div>
                  <div>{selectedWalkInCustomer.whatsapp || selectedWalkInCustomer.phone || 'Sem telefone'}</div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="walkin-name">Nome do hóspede</Label>
                    <Input
                      id="walkin-name"
                      value={walkInForm.guestName}
                      onChange={(event) => setWalkInForm((current) => ({ ...current, guestName: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-email">Email</Label>
                    <Input
                      id="walkin-email"
                      type="email"
                      value={walkInForm.guestEmail}
                      onChange={(event) => setWalkInForm((current) => ({ ...current, guestEmail: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-phone">Telefone</Label>
                    <Input
                      id="walkin-phone"
                      value={walkInForm.guestPhone}
                      onChange={(event) => setWalkInForm((current) => ({ ...current, guestPhone: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-whatsapp">WhatsApp</Label>
                    <Input
                      id="walkin-whatsapp"
                      value={walkInForm.guestWhatsApp}
                      onChange={(event) => setWalkInForm((current) => ({ ...current, guestWhatsApp: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-cpf">CPF</Label>
                    <Input
                      id="walkin-cpf"
                      value={walkInForm.guestCpf}
                      onChange={(event) => setWalkInForm((current) => ({ ...current, guestCpf: event.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quarto disponível</Label>
                <Select
                  value={walkInForm.roomUnitId || 'none'}
                  onValueChange={(value) =>
                    setWalkInForm((current) => ({
                      ...current,
                      roomUnitId: value === 'none' ? '' : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar quarto disponível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione</SelectItem>
                    {availableWalkInRooms.map((roomUnit) => (
                      <SelectItem key={roomUnit.id} value={roomUnit.id}>
                        {roomUnit.code} - {roomUnit.name} - {roomUnit.accommodation?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="walkin-checkin">Check-in</Label>
                  <Input
                    id="walkin-checkin"
                    type="date"
                    value={walkInForm.checkInDate}
                    onChange={(event) => setWalkInForm((current) => ({ ...current, checkInDate: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkin-checkout">Check-out</Label>
                  <Input
                    id="walkin-checkout"
                    type="date"
                    value={walkInForm.checkOutDate}
                    onChange={(event) => setWalkInForm((current) => ({ ...current, checkOutDate: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkin-adults">Adultos</Label>
                  <Input
                    id="walkin-adults"
                    type="number"
                    min={1}
                    value={walkInForm.adults}
                    onChange={(event) => setWalkInForm((current) => ({ ...current, adults: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkin-children">Crianças</Label>
                  <Input
                    id="walkin-children"
                    type="number"
                    min={0}
                    value={walkInForm.children}
                    onChange={(event) => setWalkInForm((current) => ({ ...current, children: event.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="walkin-notes">Observações</Label>
                <Textarea
                  id="walkin-notes"
                  value={walkInForm.notes}
                  onChange={(event) => setWalkInForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Preferências, garantia, observações da recepção..."
                />
              </div>

              <div className="rounded-lg border p-4 text-sm text-gray-600">
                <div className="font-medium text-gray-900">
                  {selectedWalkInRoom?.accommodation?.name || 'Selecione um quarto'}
                </div>
                <div>{selectedWalkInRoom ? `${selectedWalkInRoom.code} - ${selectedWalkInRoom.name}` : 'Sem quarto definido'}</div>
                <div>
                  Diária padrão:{' '}
                  {selectedWalkInRoom
                    ? currencyFormatter.format(
                        accommodations.find((item) => item.id === selectedWalkInRoom.accommodationId)?.pricePerNight || 0
                      )
                    : currencyFormatter.format(0)}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleWalkInCheckIn}
                  disabled={!walkInForm.roomUnitId || walkInCheckIn.isPending}
                >
                  Fazer check-in no quarto
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateCustomerDialog
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        hideRoleField
        defaultRole="CUSTOMER"
      />
    </AdminLayout>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}



