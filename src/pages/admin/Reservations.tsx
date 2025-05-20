
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { Eye, Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReservationDetails } from '@/components/admin/ReservationDetails';

// Mock data for reservations
const initialReservations = [
  {
    id: 'RES001',
    guestName: 'João Silva',
    guestEmail: 'joao.silva@email.com',
    guestPhone: '(11) 98765-4321',
    accommodation: {
      id: '1',
      name: 'Chalé de Luxo',
    },
    checkInDate: '2025-05-15',
    checkOutDate: '2025-05-18',
    adults: 2,
    children: 1,
    totalPrice: 1350, // 3 nights * R$450
    status: 'confirmed',
    paymentMethod: 'credit_card',
    specialRequests: 'Vista para o lago, se possível.'
  },
  {
    id: 'RES002',
    guestName: 'Maria Oliveira',
    guestEmail: 'maria.oliveira@email.com',
    guestPhone: '(21) 99876-5432',
    accommodation: {
      id: '2',
      name: 'Suite Master',
    },
    checkInDate: '2025-05-17',
    checkOutDate: '2025-05-19',
    adults: 2,
    children: 0,
    totalPrice: 640, // 2 nights * R$320
    status: 'pending',
    paymentMethod: 'bank_transfer',
    specialRequests: ''
  },
  {
    id: 'RES003',
    guestName: 'Pedro Santos',
    guestEmail: 'pedro.santos@email.com',
    guestPhone: '(31) 97654-3210',
    accommodation: {
      id: '3',
      name: 'Chalé Família',
    },
    checkInDate: '2025-06-10',
    checkOutDate: '2025-06-15',
    adults: 4,
    children: 2,
    totalPrice: 3400, // 5 nights * R$680
    status: 'confirmed',
    paymentMethod: 'pix',
    specialRequests: 'Cama extra para criança.'
  },
  {
    id: 'RES004',
    guestName: 'Ana Costa',
    guestEmail: 'ana.costa@email.com',
    guestPhone: '(11) 91234-5678',
    accommodation: {
      id: '1',
      name: 'Chalé de Luxo',
    },
    checkInDate: '2025-05-25',
    checkOutDate: '2025-05-28',
    adults: 2,
    children: 0,
    totalPrice: 1350, // 3 nights * R$450
    status: 'canceled',
    paymentMethod: 'credit_card',
    specialRequests: ''
  },
];

export function Reservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [filteredReservations, setFilteredReservations] = useState(initialReservations);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const isMobile = useIsMobile();
  
  // Handle status filter change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    
    if (value === "all") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter(res => res.status === value));
    }
  };
  
  // View reservation details
  const handleViewReservation = (reservation: any) => {
    setSelectedReservation(reservation);
    setDetailsOpen(true);
  };
  
  // Update reservation status
  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updatedReservations = reservations.map(res => {
      if (res.id === id) {
        return { ...res, status: newStatus };
      }
      return res;
    });
    
    setReservations(updatedReservations);
    
    // Also update filtered list
    if (statusFilter === "all" || statusFilter === newStatus) {
      setFilteredReservations(filteredReservations.map(res => {
        if (res.id === id) {
          return { ...res, status: newStatus };
        }
        return res;
      }));
    } else {
      // Remove from filtered view if it no longer matches filter
      setFilteredReservations(filteredReservations.filter(res => res.id !== id));
    }
    
    setDetailsOpen(false);
    toast.success(`Status da reserva atualizado para: ${newStatus}`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Status display helpers
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'confirmed': 'Confirmada',
      'checked_in': 'Check-in feito',
      'checked_out': 'Check-out feito',
      'canceled': 'Cancelada',
    };
    return statusMap[status] || status;
  };
  
  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'checked_in': 'bg-blue-100 text-blue-800',
      'checked_out': 'bg-purple-100 text-purple-800',
      'canceled': 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded text-xs font-medium ${statusClassMap[status] || ''}`;
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const ReservationDetailsWrapper = () => {
    if (!selectedReservation) return null;
    
    const content = (
      <ReservationDetails
        reservation={selectedReservation}
        onUpdateStatus={handleUpdateStatus}
      />
    );
    
    if (isMobile) {
      return (
        <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Detalhes da Reserva</DrawerTitle>
              <DrawerDescription>Reserva #{selectedReservation.id}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              {content}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }
    
    return (
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
            <DialogDescription>Reserva #{selectedReservation.id}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gerenciar Reservas</h1>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select
              value={statusFilter}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="checked_in">Check-in feito</SelectItem>
                <SelectItem value="checked_out">Check-out feito</SelectItem>
                <SelectItem value="canceled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hóspede</TableHead>
                  <TableHead>Acomodação</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell className="font-medium">{reservation.guestName}</TableCell>
                      <TableCell>{reservation.accommodation.name}</TableCell>
                      <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                      <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                      <TableCell>{formatCurrency(reservation.totalPrice)}</TableCell>
                      <TableCell>
                        <span className={getStatusClass(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReservation(reservation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma reserva encontrada para o filtro selecionado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <ReservationDetailsWrapper />
      </div>
    </AdminLayout>
  );
}

export default Reservations;
