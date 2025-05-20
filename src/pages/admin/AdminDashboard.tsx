
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function AdminDashboard() {
  // Mock stats for the dashboard
  const stats = [
    { name: 'Total de Acomodações', value: '12' },
    { name: 'Reservas Pendentes', value: '8' },
    { name: 'Reservas Confirmadas', value: '24' },
    { name: 'Taxa de Ocupação', value: '78%' },
  ];

  const recentReservations = [
    { guest: 'João Silva', room: 'Suite Premium', checkIn: '15/05/2025', status: 'Confirmada' },
    { guest: 'Maria Oliveira', room: 'Chalé Família', checkIn: '17/05/2025', status: 'Pendente' },
    { guest: 'Pedro Santos', room: 'Suite Standard', checkIn: '16/05/2025', status: 'Confirmada' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Hoteleiro</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel de administração.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div>
          <h2 className="text-xl font-semibold mb-4">Reservas Recentes</h2>
          <div className="rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium">Hóspede</th>
                    <th className="text-left pb-3 font-medium">Acomodação</th>
                    <th className="text-left pb-3 font-medium">Check-in</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((reservation, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">{reservation.guest}</td>
                      <td className="py-3">{reservation.room}</td>
                      <td className="py-3">{reservation.checkIn}</td>
                      <td className="py-3">{reservation.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
