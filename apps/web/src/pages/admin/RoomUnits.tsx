import { useState } from 'react';
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
  AVAILABLE: 'Disponivel',
  OCCUPIED: 'Ocupado',
  DIRTY: 'Sujo',
  CLEANING: 'Em limpeza',
  INSPECTED: 'Inspecionado',
  OUT_OF_ORDER: 'Fora de ordem',
  OUT_OF_SERVICE: 'Fora de servico',
  BLOCKED: 'Bloqueado',
};

const housekeepingLabels: Record<HousekeepingStatus, string> = {
  CLEAN: 'Limpo',
  DIRTY: 'Sujo',
  IN_PROGRESS: 'Limpando',
  INSPECTED: 'Inspecionado',
};

export default function RoomUnits() {
  const { data: accommodations = [] } = useAccommodations();
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
          <h1 className="text-3xl font-bold">Quartos Fisicos</h1>
          <p className="text-gray-600 mt-1">
            Cadastro operacional das unidades reais usadas no check-in, governanca e estadia.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Novo quarto
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5">
            <Select
              value={form.accommodationId}
              onValueChange={(value) => setForm((current) => ({ ...current, accommodationId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
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
              placeholder="Nome do quarto"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />

            <Input
              placeholder="Codigo"
              value={form.code}
              onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
            />

            <Input
              placeholder="Andar"
              type="number"
              value={form.floor}
              onChange={(event) => setForm((current) => ({ ...current, floor: event.target.value }))}
            />

            <Button onClick={handleCreate} disabled={createRoomUnit.isPending}>
              Cadastrar quarto
            </Button>

            <div className="md:col-span-5">
              <Input
                placeholder="Observacoes operacionais"
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
              Inventario operacional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Andar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Governanca</TableHead>
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
                    <TableCell colSpan={7}>Nenhum quarto cadastrado.</TableCell>
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
