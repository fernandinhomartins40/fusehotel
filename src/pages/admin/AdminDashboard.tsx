
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { ReservationsChart } from '@/components/admin/ReservationsChart';
import { RecentReservationsTable } from '@/components/admin/RecentReservationsTable';
import { QuickActions } from '@/components/admin/QuickActions';
import { Home, Calendar, CheckCircle, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Hoteleiro</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao painel de administração. Aqui você pode acompanhar todas as métricas importantes do seu negócio.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Acomodações"
            value="12"
            icon={Home}
            color="blue"
            trend={{ value: "2", isPositive: true }}
          />
          <StatsCard
            title="Reservas Pendentes"
            value="8"
            icon={Calendar}
            color="orange"
            trend={{ value: "3", isPositive: false }}
          />
          <StatsCard
            title="Reservas Confirmadas"
            value="24"
            icon={CheckCircle}
            color="green"
            trend={{ value: "12%", isPositive: true }}
          />
          <StatsCard
            title="Taxa de Ocupação"
            value="78%"
            icon={TrendingUp}
            color="purple"
            trend={{ value: "5%", isPositive: true }}
          />
        </div>

        {/* Charts and Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReservationsChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Recent Reservations */}
        <div>
          <RecentReservationsTable />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
