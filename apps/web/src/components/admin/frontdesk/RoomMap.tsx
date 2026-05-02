import { useMemo, useState } from 'react';
import { differenceInDays } from 'date-fns';
import {
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Loader2,
  ShieldAlert,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUpdateHousekeepingStatus } from '@/hooks/useHousekeeping';
import { useCreateMaintenanceOrder } from '@/hooks/useMaintenance';
import type { RoomMapRoom, RoomUnitStatus, Stay } from '@/types/pms';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

type StatusColor = {
  bg: string;
  border: string;
  text: string;
  label: string;
};

const STATUS_COLORS: Record<string, StatusColor> = {
  AVAILABLE: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Disponivel' },
  OCCUPIED: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-700', label: 'Ocupado' },
  DIRTY: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: 'Sujo' },
  CLEANING: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', label: 'Limpando' },
  INSPECTED: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-700', label: 'Inspecionado' },
  OUT_OF_ORDER: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', label: 'Fora de ordem' },
  OUT_OF_SERVICE: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700', label: 'Fora de servico' },
  BLOCKED: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', label: 'Bloqueado' },
};

function getStatusColor(status: RoomUnitStatus): StatusColor {
  return STATUS_COLORS[status] ?? STATUS_COLORS.AVAILABLE;
}

function RoomStatusIcon({ status }: { status: RoomUnitStatus }) {
  const iconClass = 'h-4 w-4';
  switch (status) {
    case 'AVAILABLE':
      return <CheckCircle2 className={`${iconClass} text-emerald-500`} />;
    case 'OCCUPIED':
      return <BedDouble className={`${iconClass} text-sky-500`} />;
    case 'DIRTY':
      return <Droplets className={`${iconClass} text-amber-500`} />;
    case 'CLEANING':
      return <Sparkles className={`${iconClass} text-yellow-500`} />;
    case 'INSPECTED':
      return <ClipboardList className={`${iconClass} text-teal-500`} />;
    case 'OUT_OF_ORDER':
    case 'OUT_OF_SERVICE':
    case 'BLOCKED':
      return <ShieldAlert className={`${iconClass} text-red-500`} />;
    default:
      return null;
  }
}

interface RoomCardProps {
  room: RoomMapRoom;
  onClickOccupied: (stayId: string) => void;
  onClickAvailable: (room: RoomMapRoom) => void;
  onClickDirty: (room: RoomMapRoom) => void;
}

function RoomCard({ room, onClickOccupied, onClickAvailable, onClickDirty }: RoomCardProps) {
  const sc = getStatusColor(room.status);
  const isOccupied = room.status === 'OCCUPIED';
  const isDirty = room.status === 'DIRTY' || room.status === 'CLEANING';
  const isAvailable = room.status === 'AVAILABLE' || room.status === 'INSPECTED';
  const isBlocked = ['OUT_OF_ORDER', 'OUT_OF_SERVICE', 'BLOCKED'].includes(room.status);

  const nightProgress = useMemo(() => {
    if (!room.guest) return null;
    const checkIn = new Date(room.guest.checkInDate);
    const now = new Date();
    const currentNight = Math.max(1, differenceInDays(now, checkIn) + 1);
    return { current: currentNight, total: room.guest.numberOfNights };
  }, [room.guest]);

  const handleClick = () => {
    if (isOccupied && room.guest) {
      onClickOccupied(room.guest.stayId);
    } else if (isDirty) {
      onClickDirty(room);
    } else if (isAvailable) {
      onClickAvailable(room);
    }
  };

  const hasArrivals = room.todayArrivals.length > 0;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className={`relative flex w-full flex-col rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${sc.bg} ${sc.border} ${
              isBlocked ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-bold text-gray-900">{room.code}</span>
              <RoomStatusIcon status={room.status} />
            </div>

            <span className="mt-0.5 truncate text-xs text-gray-500">{room.accommodation.name}</span>

            {isOccupied && room.guest ? (
              <div className="mt-2 space-y-1">
                <div className="truncate text-xs font-medium text-gray-800">
                  {room.guest.guestName}
                </div>
                <div className="flex items-center justify-between">
                  {nightProgress && (
                    <span className="text-[10px] text-gray-500">
                      Noite {nightProgress.current}/{nightProgress.total}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold ${
                      room.guest.folioBalance > 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {currencyFormatter.format(room.guest.folioBalance)}
                  </span>
                </div>
              </div>
            ) : null}

            {isDirty && room.housekeepingTasks.length > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-[10px]">
                  {room.housekeepingTasks[0].status === 'IN_PROGRESS' ? 'Limpando' : 'Pendente'}
                </Badge>
              </div>
            )}

            {isBlocked && room.maintenanceOrders.length > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <Wrench className="h-3 w-3 text-red-500" />
                <span className="truncate text-[10px] text-red-600">
                  {room.maintenanceOrders[0].title}
                </span>
              </div>
            )}

            {isAvailable && hasArrivals && (
              <div className="mt-2">
                <Badge variant="outline" className="border-sky-300 bg-sky-50 text-[10px] text-sky-700">
                  Chegada hoje
                </Badge>
              </div>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1 text-xs">
            <div className="font-semibold">
              {room.code} - {room.name}
            </div>
            <div>{room.accommodation.name}</div>
            <div className={sc.text}>{sc.label}</div>
            {isOccupied && room.guest && (
              <>
                <div>Hospede: {room.guest.guestName}</div>
                <div>Saida: {new Date(room.guest.checkOutDate).toLocaleDateString('pt-BR')}</div>
                <div>Saldo: {currencyFormatter.format(room.guest.folioBalance)}</div>
              </>
            )}
            {hasArrivals && (
              <div>
                {room.todayArrivals.length} chegada(s): {room.todayArrivals.map((a) => a.guestName).join(', ')}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// --- Dialogs ---

interface DirtyRoomDialogProps {
  room: RoomMapRoom | null;
  onClose: () => void;
}

function DirtyRoomDialog({ room, onClose }: DirtyRoomDialogProps) {
  const updateStatus = useUpdateHousekeepingStatus();

  if (!room) return null;

  const pendingTask = room.housekeepingTasks.find((t) => t.status === 'PENDING');
  const inProgressTask = room.housekeepingTasks.find((t) => t.status === 'IN_PROGRESS');

  const handleStart = () => {
    if (!pendingTask) return;
    updateStatus.mutate(
      { id: pendingTask.id, status: 'IN_PROGRESS' },
      { onSuccess: onClose }
    );
  };

  const handleComplete = () => {
    const task = inProgressTask ?? pendingTask;
    if (!task) return;
    updateStatus.mutate(
      { id: task.id, status: 'COMPLETED' },
      { onSuccess: onClose }
    );
  };

  const handleInspect = () => {
    const task = inProgressTask ?? pendingTask;
    if (!task) return;
    updateStatus.mutate(
      { id: task.id, status: 'INSPECTED' },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={Boolean(room)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Quarto {room.code}</DialogTitle>
          <DialogDescription>
            {room.name} - {room.accommodation.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>
            Status: <Badge variant="outline">{getStatusColor(room.status).label}</Badge>
          </div>
          {room.housekeepingTasks.length > 0 && (
            <div>Tarefa: {room.housekeepingTasks[0].title}</div>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {pendingTask && !inProgressTask && (
            <Button onClick={handleStart} disabled={updateStatus.isPending} className="w-full">
              Iniciar limpeza
            </Button>
          )}
          {(inProgressTask || pendingTask) && (
            <Button onClick={handleComplete} disabled={updateStatus.isPending} variant="outline" className="w-full">
              Concluir limpeza
            </Button>
          )}
          {(inProgressTask || pendingTask) && (
            <Button onClick={handleInspect} disabled={updateStatus.isPending} variant="secondary" className="w-full">
              Inspecionar e liberar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AvailableRoomDialogProps {
  room: RoomMapRoom | null;
  onClose: () => void;
  onCheckInArrival: (reservationId: string, roomUnitId: string) => void;
}

function AvailableRoomDialog({ room, onClose, onCheckInArrival }: AvailableRoomDialogProps) {
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({ title: '', description: '', priority: 'MEDIUM' as const });
  const createMaintenance = useCreateMaintenanceOrder();

  if (!room) return null;

  const arrivals = room.todayArrivals;

  const handleCheckInArrival = (reservationId: string) => {
    onCheckInArrival(reservationId, room.id);
    onClose();
  };

  const handleCreateMaintenance = () => {
    if (!maintenanceForm.title.trim()) return;
    createMaintenance.mutate(
      {
        roomUnitId: room.id,
        title: maintenanceForm.title.trim(),
        description: maintenanceForm.description.trim() || undefined,
        priority: maintenanceForm.priority,
        markRoomOutOfOrder: true,
      },
      {
        onSuccess: () => {
          setMaintenanceOpen(false);
          setMaintenanceForm({ title: '', description: '', priority: 'MEDIUM' });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={Boolean(room)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quarto {room.code}</DialogTitle>
          <DialogDescription>
            {room.name} - {room.accommodation.name} - Disponivel
          </DialogDescription>
        </DialogHeader>

        {arrivals.length > 0 && !maintenanceOpen ? (
          <div className="space-y-3">
            <div className="text-sm font-medium">Chegadas previstas para hoje:</div>
            {arrivals.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">{a.guestName}</div>
                  <div className="text-xs text-gray-500">{a.reservationCode}</div>
                </div>
                <Button size="sm" onClick={() => handleCheckInArrival(a.id)}>
                  Check-in
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        {!maintenanceOpen ? (
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceOpen(true)}>
              <Wrench className="mr-2 h-4 w-4" />
              Registrar manutencao
            </Button>
          </DialogFooter>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-medium">Nova ordem de manutencao</div>
            <div className="space-y-2">
              <Label>Titulo</Label>
              <Input
                value={maintenanceForm.title}
                onChange={(e) => setMaintenanceForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Ar-condicionado com defeito"
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={maintenanceForm.priority}
                onValueChange={(v) => setMaintenanceForm((f) => ({ ...f, priority: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descricao</Label>
              <Textarea
                value={maintenanceForm.description}
                onChange={(e) => setMaintenanceForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Detalhes do problema..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMaintenanceOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreateMaintenance} disabled={createMaintenance.isPending} className="flex-1">
                Criar e bloquear quarto
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Main Component ---

interface RoomMapProps {
  rooms: RoomMapRoom[];
  floors: number[];
  isLoading?: boolean;
  onSelectStay: (stayId: string) => void;
  onCheckInArrival: (reservationId: string, roomUnitId: string) => void;
}

type FilterStatus = 'ALL' | RoomUnitStatus;

const FILTER_OPTIONS: Array<{ value: FilterStatus; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'AVAILABLE', label: 'Disponiveis' },
  { value: 'OCCUPIED', label: 'Ocupados' },
  { value: 'DIRTY', label: 'Sujos' },
  { value: 'OUT_OF_ORDER', label: 'Manutencao' },
];

export function RoomMap({ rooms, floors, isLoading, onSelectStay, onCheckInArrival }: RoomMapProps) {
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [dirtyRoom, setDirtyRoom] = useState<RoomMapRoom | null>(null);
  const [availableRoom, setAvailableRoom] = useState<RoomMapRoom | null>(null);

  const filteredRooms = useMemo(() => {
    if (filter === 'ALL') return rooms;
    if (filter === 'OUT_OF_ORDER') {
      return rooms.filter((r) => ['OUT_OF_ORDER', 'OUT_OF_SERVICE', 'BLOCKED'].includes(r.status));
    }
    if (filter === 'DIRTY') {
      return rooms.filter((r) => r.status === 'DIRTY' || r.status === 'CLEANING');
    }
    return rooms.filter((r) => r.status === filter);
  }, [rooms, filter]);

  const roomsByFloor = useMemo(() => {
    const map = new Map<number, RoomMapRoom[]>();
    for (const room of filteredRooms) {
      const floor = room.floor ?? 0;
      const arr = map.get(floor) ?? [];
      arr.push(room);
      map.set(floor, arr);
    }
    return map;
  }, [filteredRooms]);

  const counts = useMemo(() => {
    const c = { ALL: rooms.length, AVAILABLE: 0, OCCUPIED: 0, DIRTY: 0, OUT_OF_ORDER: 0 };
    for (const r of rooms) {
      if (r.status === 'AVAILABLE' || r.status === 'INSPECTED') c.AVAILABLE++;
      else if (r.status === 'OCCUPIED') c.OCCUPIED++;
      else if (r.status === 'DIRTY' || r.status === 'CLEANING') c.DIRTY++;
      else c.OUT_OF_ORDER++;
    }
    return c;
  }, [rooms]);

  const handleClickOccupied = (stayId: string) => {
    onSelectStay(stayId);
  };

  const handleClickAvailable = (room: RoomMapRoom) => {
    setAvailableRoom(room);
  };

  const handleClickDirty = (room: RoomMapRoom) => {
    setDirtyRoom(room);
  };

  const handleCheckInFromDialog = (reservationId: string, roomUnitId: string) => {
    onCheckInArrival(reservationId, roomUnitId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const visibleFloors = floors.filter((f) => roomsByFloor.has(f));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filter === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(opt.value)}
          >
            {opt.label} ({counts[opt.value as keyof typeof counts] ?? 0})
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-380px)]">
        <div className="space-y-6 pr-4">
          {visibleFloors.map((floor) => {
            const floorRooms = roomsByFloor.get(floor) ?? [];
            return (
              <div key={floor}>
                <div className="mb-3 text-sm font-semibold text-gray-600">
                  {floor === 0 ? 'Terreo' : `${floor}o Andar`}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                  {floorRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onClickOccupied={handleClickOccupied}
                      onClickAvailable={handleClickAvailable}
                      onClickDirty={handleClickDirty}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {visibleFloors.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              Nenhum quarto encontrado para este filtro.
            </div>
          )}
        </div>
      </ScrollArea>

      <DirtyRoomDialog room={dirtyRoom} onClose={() => setDirtyRoom(null)} />
      <AvailableRoomDialog
        room={availableRoom}
        onClose={() => setAvailableRoom(null)}
        onCheckInArrival={handleCheckInFromDialog}
      />
    </div>
  );
}
