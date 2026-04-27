import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Plus } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAccommodations } from '@/hooks/useAccommodations';
import { useCreateRoomUnit, useRoomUnits, useUpdateRoomUnit } from '@/hooks/useRoomUnits';
import type { HousekeepingStatus, RoomUnit, RoomUnitStatus } from '@/types/pms';

const roomStatusLabels: Record<RoomUnitStatus, string> = {
  AVAILABLE: 'Disponível',
  OCCUPIED: 'Ocupado',
  DIRTY: 'Sujo',
  CLEANING: 'Em limpeza',
  INSPECTED: 'Inspecionado',
  OUT_OF_ORDER: 'Fora de ordem',
  OUT_OF_SERVICE: 'Fora de serviço',
  BLOCKED: 'Bloqueado',
};

const housekeepingLabels: Record<HousekeepingStatus, string> = {
  CLEAN: 'Limpo',
  DIRTY: 'Sujo',
  IN_PROGRESS: 'Limpando',
  INSPECTED: 'Inspecionado',
};

export default function RoomUnits() {
  const { data: accommodations = [] } = useAccommodations({ adminView: true });
  const { data: roomUnits = [], isLoading } = useRoomUnits();
  const createRoomUnit = useCreateRoomUnit();
  const updateRoomUnit = useUpdateRoomUnit();

  const [form, setForm] = useState({
    accommodationId: '',
    name: '',
    code: '',
    floor: '',
    notes: '',
  });

  const handleCreate = () => {
    if (!form.accommodationId || !form.name || !form.code) {
      return;
    }

    createRoomUnit.mutate({
      accommodationId: form.accommodationId,
      name: form.name,
      code: form.code,
      floor: form.floor ? Number(form.floor) : undefined,
      notes: form.notes || undefined,
    });

    setForm({
      accommodationId: '',
      name: '',
      code: '',
      floor: '',
      notes: '',
    });
  };

  const handleStatusChange = (roomUnit: RoomUnit, status: RoomUnitStatus) => {
    updateRoomUnit.mutate({
      id: roomUnit.id,
      data: { status },
    });
  };

  const handleHousekeepingChange = (roomUnit: RoomUnit, housekeepingStatus: HousekeepingStatus) => {
    updateRoomUnit.mutate({
      id: roomUnit.id,
      data: { housekeepingStatus },
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Quartos físicos</h1>
          <p className="mt-1 text-gray-600">
            Inventário operacional das unidades reais usadas no check-in, na governança e na estadia.
          </p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex flex-col gap-3 p-6 text-blue-950 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="font-medium">Sem duplicidade: site e hotel agora seguem o mesmo fluxo.</div>
              <p className="mt-1 text-sm text-blue-900">
                O site vende o tipo de hospedagem. Esta tela controla os quartos reais vinculados a esse tipo.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/admin/accommodations">Abrir tipos de hospedagem</Link>
            </Button>
          </CardContent>
        </Card>

        {accommodations.length === 0 && !isLoading ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex flex-col gap-3 p-6 text-amber-950">
              <div className="font-medium">Cadastre primeiro um tipo de hospedagem.</div>
              <p className="text-sm text-amber-900">
                Para criar quartos físicos, antes é preciso criar a categoria que será exibida no site e usada nas reservas.
              </p>
              <div>
                <Button asChild variant="outline">
                  <Link to="/admin/accommodations">Criar tipo de hospedagem</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Novo quarto físico
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5">
            <Select
              value={form.accommodationId}
              onValueChange={(value) => setForm((current) => ({ ...current, accommodationId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de hospedagem do site" />
              </SelectTrigger>
              <SelectContent>
                {accommodations.map((accommodation) => (
                  <SelectItem key={accommodation.id} value={accommodation.id}>
                    {accommodation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Nome interno do quarto"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />

            <Input
              placeholder="Código"
              value={form.code}
              onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
            />

            <Input
              placeholder="Andar"
              type="number"
              value={form.floor}
              onChange={(event) => setForm((current) => ({ ...current, floor: event.target.value }))}
            />

            <Button onClick={handleCreate} disabled={createRoomUnit.isPending || accommodations.length === 0}>
              Cadastrar quarto
            </Button>

            <div className="md:col-span-5">
              <Input
                placeholder="Observações operacionais"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Inventário operacional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Tipo no site</TableHead>
                  <TableHead>Andar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Governança</TableHead>
                  <TableHead>Ativo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>Carregando quartos...</TableCell>
                  </TableRow>
                ) : roomUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>Nenhum quarto físico cadastrado.</TableCell>
                  </TableRow>
                ) : (
                  roomUnits.map((roomUnit) => (
                    <TableRow key={roomUnit.id}>
                      <TableCell className="font-mono">{roomUnit.code}</TableCell>
                      <TableCell>{roomUnit.name}</TableCell>
                      <TableCell>{roomUnit.accommodation?.name}</TableCell>
                      <TableCell>{roomUnit.floor ?? '-'}</TableCell>
                      <TableCell>
                        <Select
                          value={roomUnit.status}
                          onValueChange={(value) => handleStatusChange(roomUnit, value as RoomUnitStatus)}
                        >
                          <SelectTrigger className="w-[170px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roomStatusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={roomUnit.housekeepingStatus}
                          onValueChange={(value) => handleHousekeepingChange(roomUnit, value as HousekeepingStatus)}
                        >
                          <SelectTrigger className="w-[170px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(housekeepingLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roomUnit.isActive ? 'default' : 'outline'}>
                          {roomUnit.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
