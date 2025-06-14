
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Eye } from 'lucide-react';

interface Reservation {
  guest: string;
  room: string;
  checkIn: string;
  status: 'confirmed' | 'pending' | 'canceled';
  value: number;
}

const recentReservations: Reservation[] = [
  { guest: 'João Silva', room: 'Suite Premium', checkIn: '15/05/2025', status: 'confirmed', value: 1350 },
  { guest: 'Maria Oliveira', room: 'Chalé Família', checkIn: '17/05/2025', status: 'pending', value: 2040 },
  { guest: 'Pedro Santos', room: 'Suite Standard', checkIn: '16/05/2025', status: 'confirmed', value: 960 },
  { guest: 'Ana Costa', room: 'Chalé de Luxo', checkIn: '20/05/2025', status: 'pending', value: 1800 },
];

const getStatusBadge = (status: string) => {
  const variants = {
    confirmed: { variant: 'default' as const, label: 'Confirmada', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    pending: { variant: 'secondary' as const, label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    canceled: { variant: 'destructive' as const, label: 'Cancelada', className: 'bg-red-100 text-red-800 hover:bg-red-100' }
  };
  
  const config = variants[status as keyof typeof variants];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const RecentReservationsTable: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reservas Recentes</CardTitle>
        <Button variant="outline" size="sm">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hóspede</TableHead>
              <TableHead>Acomodação</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReservations.map((reservation, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{reservation.guest}</TableCell>
                <TableCell>{reservation.room}</TableCell>
                <TableCell>{reservation.checkIn}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(reservation.value)}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
