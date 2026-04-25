import { ClipboardCheck } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHousekeepingTasks, useUpdateHousekeepingStatus } from '@/hooks/useHousekeeping';
import type { HousekeepingTaskStatus } from '@/types/pms';

const statusLabels: Record<HousekeepingTaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluida',
  INSPECTED: 'Inspecionada',
  CANCELLED: 'Cancelada',
};

export default function Housekeeping() {
  const { data: tasks = [], isLoading } = useHousekeepingTasks();
  const updateStatus = useUpdateHousekeepingStatus();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Governanca</h1>
          <p className="text-gray-600 mt-1">
            Controle de limpeza e liberacao operacional dos quartos.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Tarefas de limpeza
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Reserva</TableHead>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criada em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Carregando tarefas...</TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>Nenhuma tarefa de governanca encontrada.</TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.roomUnit.code} - {task.roomUnit.name}
                      </TableCell>
                      <TableCell>{task.reservation?.reservationCode || '-'}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <Badge variant={task.priority === 'URGENT' ? 'destructive' : 'outline'}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            updateStatus.mutate({ id: task.id, status: value as HousekeepingTaskStatus })
                          }
                        >
                          <SelectTrigger className="w-[170px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(task.createdAt).toLocaleString('pt-BR')}</TableCell>
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
