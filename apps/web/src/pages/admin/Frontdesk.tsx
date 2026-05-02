import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CreateCustomerDialog } from '@/components/admin/customers/CreateCustomerDialog';
import { StaysList } from '@/components/admin/frontdesk/StaysList';
import { GuestSheet } from '@/components/admin/frontdesk/GuestSheet';
import { RoomMap } from '@/components/admin/frontdesk/RoomMap';
import { useAccommodations } from '@/hooks/useAccommodations';
import { useCustomers } from '@/hooks/useCustomers';
import { useCheckIn, useFrontdeskDashboard, useRoomMap, useWalkInCheckIn } from '@/hooks/useFrontdesk';
import { usePromotions } from '@/hooks/usePromotions';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type { RoomUnit, Stay } from '@/types/pms';
import type { Reservation } from '@/types/reservation';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Frontdesk() {
  const { data: dashboard, isLoading } = useFrontdeskDashboard();
  const { data: roomMapData, isLoading: isRoomMapLoading } = useRoomMap();
  const { data: roomUnits = [] } = useRoomUnits();
  const { data: accommodations = [] } = useAccommodations({ adminView: true });
  const { data: customers = [] } = useCustomers({ role: 'CUSTOMER' });
  const { data: promotions = [] } = usePromotions({ isActive: true });
  const checkIn = useCheckIn();
  const walkInCheckIn = useWalkInCheckIn();

  // Guest sheet state
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [guestSheetOpen, setGuestSheetOpen] = useState(false);

  // Check-in dialog state (for arrivals)
  const [checkInReservation, setCheckInReservation] = useState<Reservation | null>(null);
  const [checkInRoomId, setCheckInRoomId] = useState('');

  // Walk-in dialog state
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
    promotionId: '',
  });

  const availableRoomUnitsByAccommodation = useMemo(() => {
    return roomUnits.reduce<Record<string, RoomUnit[]>>((acc, ru) => {
      if (!ru.isActive) return acc;
      const ok =
        ['AVAILABLE', 'INSPECTED'].includes(ru.status) &&
        ['CLEAN', 'INSPECTED'].includes(ru.housekeepingStatus);
      if (!ok) return acc;
      if (!acc[ru.accommodationId]) acc[ru.accommodationId] = [];
      acc[ru.accommodationId].push(ru);
      return acc;
    }, {});
  }, [roomUnits]);

  const availableWalkInRooms = useMemo(
    () =>
      roomUnits.filter(
        (ru) =>
          ru.isActive &&
          ['AVAILABLE', 'INSPECTED'].includes(ru.status) &&
          ['CLEAN', 'INSPECTED'].includes(ru.housekeepingStatus)
      ),
    [roomUnits]
  );

  const selectedWalkInCustomer = useMemo(
    () => customers.find((c) => c.id === walkInForm.customerId),
    [customers, walkInForm.customerId]
  );

  const selectedWalkInRoom = useMemo(
    () => availableWalkInRooms.find((ru) => ru.id === walkInForm.roomUnitId),
    [availableWalkInRooms, walkInForm.roomUnitId]
  );

  const customerSearchResults = useMemo(() => {
    const q = walkInSearch.trim().toLowerCase();
    if (!q) return [];
    return customers.filter((c) =>
      [c.name, c.email, c.phone, c.whatsapp, c.cpf].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [customers, walkInSearch]);

  const selectedSearchCustomer = useMemo(
    () => customers.find((c) => c.id === walkInForm.customerId),
    [customers, walkInForm.customerId]
  );

  // Handlers
  const handleSelectStay = (stay: Stay) => {
    setSelectedStay(stay);
    setGuestSheetOpen(true);
  };

  const handleSelectStayById = (stayId: string) => {
    const stay = (dashboard?.inHouse ?? []).find((s) => s.id === stayId);
    if (stay) {
      setSelectedStay(stay);
      setGuestSheetOpen(true);
    }
  };

  const handleSelectArrival = (reservation: Reservation) => {
    setCheckInReservation(reservation);
    setCheckInRoomId('');
  };

  const handleRoomMapCheckIn = (reservationId: string, roomUnitId: string) => {
    checkIn.mutate({ reservationId, roomUnitId });
  };

  const handleConfirmCheckIn = () => {
    if (!checkInReservation || !checkInRoomId) return;
    checkIn.mutate(
      { reservationId: checkInReservation.id, roomUnitId: checkInRoomId },
      {
        onSuccess: () => {
          setCheckInReservation(null);
          setCheckInRoomId('');
        },
      }
    );
  };

  const handleWalkInCheckIn = () => {
    if (!walkInForm.roomUnitId) return;
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
        promotionId: walkInForm.promotionId || undefined,
      },
      {
        onSuccess: () => {
          setWalkInDialogOpen(false);
          setWalkInForm({
            roomUnitId: '', customerId: '', guestName: '', guestEmail: '', guestPhone: '',
            guestWhatsApp: '', guestCpf: '',
            checkInDate: new Date().toISOString().slice(0, 10),
            checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            adults: '1', children: '0', notes: '', promotionId: '',
          });
        },
      }
    );
  };

  const openWalkInDialog = () => {
    const firstMatch = selectedSearchCustomer ?? customerSearchResults[0];
    setWalkInForm((cur) => ({
      ...cur,
      customerId: firstMatch?.id ?? '',
      guestName: firstMatch ? '' : walkInSearch.trim(),
      guestEmail: firstMatch ? '' : cur.guestEmail,
      guestPhone: firstMatch ? '' : cur.guestPhone,
      guestWhatsApp: firstMatch ? '' : cur.guestWhatsApp,
      guestCpf: firstMatch ? '' : cur.guestCpf,
    }));
    setWalkInDialogOpen(true);
  };

  const handleWalkInSearchChange = (value: string) => {
    setWalkInSearch(value);
    if (walkInForm.customerId) {
      setWalkInForm((cur) => ({ ...cur, customerId: '' }));
    }
  };

  const handleSelectCustomerFromSearch = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    setWalkInSearch(customer.name);
    setWalkInForm((cur) => ({
      ...cur, customerId: customer.id,
      guestName: '', guestEmail: '', guestPhone: '', guestWhatsApp: '', guestCpf: '',
    }));
  };

  const checkInCandidateRooms = checkInReservation
    ? availableRoomUnitsByAccommodation[checkInReservation.accommodationId] ?? []
    : [];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hospedagens</h1>
            <p className="text-gray-600 mt-1">
              Visao completa centrada no hospede.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/reservations">Calendario</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/housekeeping">Governanca</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/room-units">Quartos</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Acao rapida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="walkin-search">Pesquisar cliente</Label>
                  <Input
                    id="walkin-search"
                    value={walkInSearch}
                    onChange={(e) => handleWalkInSearchChange(e.target.value)}
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
                          Nenhum hospede encontrado para essa pesquisa.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2 lg:pt-7">
                  <Button onClick={openWalkInDialog}>Walk-in</Button>
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
              <CompactMetric label="Saidas" value={String(dashboard?.departures.length ?? 0)} />
              <CompactMetric label="Quartos livres" value={String(dashboard?.roomStats.available ?? 0)} />
              <CompactMetric label="Quartos sujos" value={String(dashboard?.roomStats.dirty ?? 0)} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="guests" className="w-full">
          <TabsList>
            <TabsTrigger value="guests">Hospedes</TabsTrigger>
            <TabsTrigger value="rooms">Quartos</TabsTrigger>
          </TabsList>
          <TabsContent value="guests">
            <StaysList
              inHouse={dashboard?.inHouse ?? []}
              arrivals={dashboard?.arrivals ?? []}
              departures={dashboard?.departures ?? []}
              isLoading={isLoading}
              onSelectStay={handleSelectStay}
              onSelectArrival={handleSelectArrival}
            />
          </TabsContent>
          <TabsContent value="rooms">
            <RoomMap
              rooms={roomMapData?.rooms ?? []}
              floors={roomMapData?.floors ?? []}
              isLoading={isRoomMapLoading}
              onSelectStay={handleSelectStayById}
              onCheckInArrival={handleRoomMapCheckIn}
            />
          </TabsContent>
        </Tabs>
      </div>

      <GuestSheet
        stay={selectedStay}
        open={guestSheetOpen}
        onOpenChange={setGuestSheetOpen}
      />

      {/* Check-in dialog for arrivals */}
      <Dialog open={Boolean(checkInReservation)} onOpenChange={(open) => !open && setCheckInReservation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Check-in</DialogTitle>
            <DialogDescription>
              {checkInReservation?.guestName} - {checkInReservation?.reservationCode}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selecionar quarto</Label>
              <Select value={checkInRoomId || 'none'} onValueChange={(v) => setCheckInRoomId(v === 'none' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar quarto disponivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione</SelectItem>
                  {checkInCandidateRooms.map((ru) => (
                    <SelectItem key={ru.id} value={ru.id}>
                      {ru.code} - {ru.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!checkInCandidateRooms.length && (
                <p className="text-sm text-amber-600">
                  Nenhum quarto disponivel para esta acomodacao.
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {checkInReservation?.accommodation?.name} &bull;{' '}
              {checkInReservation && new Date(checkInReservation.checkInDate).toLocaleDateString('pt-BR')} -{' '}
              {checkInReservation && new Date(checkInReservation.checkOutDate).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckInReservation(null)}>Cancelar</Button>
            <Button onClick={handleConfirmCheckIn} disabled={!checkInRoomId || checkIn.isPending}>
              Confirmar check-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Walk-in dialog */}
      <Dialog open={walkInDialogOpen} onOpenChange={setWalkInDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Check-in de balcao</DialogTitle>
            <DialogDescription>
              Selecione o hospede e o quarto disponivel para abrir a hospedagem na recepcao.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente cadastrado</Label>
                <Select
                  value={walkInForm.customerId || 'none'}
                  onValueChange={(value) =>
                    setWalkInForm((cur) => ({
                      ...cur,
                      customerId: value === 'none' ? '' : value,
                      guestName: value === 'none' ? cur.guestName : '',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente existente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Informar hospede manualmente</SelectItem>
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
                    <Label htmlFor="walkin-name">Nome do hospede</Label>
                    <Input id="walkin-name" value={walkInForm.guestName} onChange={(e) => setWalkInForm((cur) => ({ ...cur, guestName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-email">Email</Label>
                    <Input id="walkin-email" type="email" value={walkInForm.guestEmail} onChange={(e) => setWalkInForm((cur) => ({ ...cur, guestEmail: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-phone">Telefone</Label>
                    <Input id="walkin-phone" value={walkInForm.guestPhone} onChange={(e) => setWalkInForm((cur) => ({ ...cur, guestPhone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-whatsapp">WhatsApp</Label>
                    <Input id="walkin-whatsapp" value={walkInForm.guestWhatsApp} onChange={(e) => setWalkInForm((cur) => ({ ...cur, guestWhatsApp: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walkin-cpf">CPF</Label>
                    <Input id="walkin-cpf" value={walkInForm.guestCpf} onChange={(e) => setWalkInForm((cur) => ({ ...cur, guestCpf: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quarto disponivel</Label>
                <Select
                  value={walkInForm.roomUnitId || 'none'}
                  onValueChange={(v) => setWalkInForm((cur) => ({ ...cur, roomUnitId: v === 'none' ? '' : v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar quarto disponivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione</SelectItem>
                    {availableWalkInRooms.map((ru) => (
                      <SelectItem key={ru.id} value={ru.id}>
                        {ru.code} - {ru.name} - {ru.accommodation?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="walkin-checkin">Check-in</Label>
                  <Input id="walkin-checkin" type="date" value={walkInForm.checkInDate} onChange={(e) => setWalkInForm((cur) => ({ ...cur, checkInDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkin-checkout">Check-out</Label>
                  <Input id="walkin-checkout" type="date" value={walkInForm.checkOutDate} onChange={(e) => setWalkInForm((cur) => ({ ...cur, checkOutDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkin-adults">Adultos</Label>
                  <Input id="walkin-adults" type="number" min={1} value={walkInForm.adults} onChange={(e) => setWalkInForm((cur) => ({ ...cur, adults: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkin-children">Criancas</Label>
                  <Input id="walkin-children" type="number" min={0} value={walkInForm.children} onChange={(e) => setWalkInForm((cur) => ({ ...cur, children: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Promocao / Pacote</Label>
                <Select
                  value={walkInForm.promotionId || 'none'}
                  onValueChange={(v) => setWalkInForm((cur) => ({ ...cur, promotionId: v === 'none' ? '' : v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhuma promocao" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma promocao</SelectItem>
                    {promotions.map((promo: any) => (
                      <SelectItem key={promo.id} value={promo.id}>
                        {promo.title}
                        {promo.discountPercent ? ` (-${promo.discountPercent}%)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="walkin-notes">Observacoes</Label>
                <Textarea
                  id="walkin-notes"
                  value={walkInForm.notes}
                  onChange={(e) => setWalkInForm((cur) => ({ ...cur, notes: e.target.value }))}
                  placeholder="Preferencias, garantia, observacoes da recepcao..."
                />
              </div>

              <div className="rounded-lg border p-4 text-sm text-gray-600">
                <div className="font-medium text-gray-900">
                  {selectedWalkInRoom?.accommodation?.name || 'Selecione um quarto'}
                </div>
                <div>{selectedWalkInRoom ? `${selectedWalkInRoom.code} - ${selectedWalkInRoom.name}` : 'Sem quarto definido'}</div>
                <div>
                  Diaria padrao:{' '}
                  {selectedWalkInRoom
                    ? currencyFormatter.format(
                        accommodations.find((a) => a.id === selectedWalkInRoom.accommodationId)?.pricePerNight || 0
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
