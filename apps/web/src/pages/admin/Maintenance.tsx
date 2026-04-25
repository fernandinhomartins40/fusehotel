import { useState } from 'react';
import { Wrench } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMaintenanceOrder, useMaintenanceOrders, useUpdateMaintenanceOrder } from '@/hooks/useMaintenance';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type { MaintenanceOrderPriority, MaintenanceOrderStatus } from '@/types/pms';

export default function Maintenance() {
  const { data: roomUnits = [] } = useRoomUnits();
  const { data: orders = [], isLoading } = useMaintenanceOrders();
  const createOrder = useCreateMaintenanceOrder();
  const updateOrder = useUpdateMaintenanceOrder();

  const [form, setForm] = useState({
    roomUnitId: '',
    title: '',
    description: '',
    priority: 'MEDIUM' as MaintenanceOrderPriority,
    estimatedCost: '',
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Manutenção</h1>
          <p className="text-gray-600 mt-1">
            Controle de ocorrências técnicas e indisponibilidade de quartos.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Nova ordem
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <Select
              value={form.roomUnitId}
              onValueChange={(value) => setForm((current) => ({ ...current, roomUnitId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quarto" />
              </SelectTrigger>
              <SelectContent>
                {roomUnits.map((roomUnit) => (
                  <SelectItem key={roomUnit.id} value={roomUnit.id}>
                    {roomUnit.code} - {roomUnit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Título"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />

            <Select
              value={form.priority}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, priority: value as MaintenanceOrderPriority }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as MaintenanceOrderPriority[]).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Custo estimado"
              value={form.estimatedCost}
              onChange={(event) => setForm((current) => ({ ...current, estimatedCost: event.target.value }))}
            />

            <div className="md:col-span-3">
              <Textarea
                placeholder="Descrição"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </div>

            <Button
              disabled={createOrder.isPending}
              onClick={() =>
                createOrder.mutate({
                  roomUnitId: form.roomUnitId,
                  title: form.title,
                  description: form.description || undefined,
                  priority: form.priority,
                  estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
                  markRoomOutOfOrder: true,
                })
              }
            >
              Criar ordem
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordens de manutenção</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Custo real</TableHead>
                  <TableHead>Abertura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Carregando manutenção...</TableCell>
                  </TableRow>
                ) : !orders.length ? (
                  <TableRow>
                    <TableCell colSpan={6}>Nenhuma ordem cadastrada.</TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.roomUnit.code}</TableCell>
                      <TableCell>{order.title}</TableCell>
                      <TableCell>
                        <Badge variant={order.priority === 'URGENT' ? 'destructive' : 'outline'}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrder.mutate({
                              id: order.id,
                              data: { status: value as MaintenanceOrderStatus },
                            })
                          }
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as MaintenanceOrderStatus[]).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {order.actualCost ? order.actualCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </TableCell>
                      <TableCell>{new Date(order.openedAt).toLocaleString('pt-BR')}</TableCell>
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

