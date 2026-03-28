import React from 'react';
import { Card } from '@/components/ui/card';
import { Home, Calendar, CheckCircle, TrendingUp, DoorOpen } from 'lucide-react';
import type { ScheduleStats } from '@/types/schedule';

interface ScheduleStatsProps {
  stats: ScheduleStats;
  isLoading?: boolean;
}

export const ScheduleStatsCard: React.FC<ScheduleStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-8 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      label: 'Total de Acomodações',
      value: stats.totalAccommodations,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Reservas no Período',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Check-ins Ativos',
      value: stats.activeReservations,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Taxa de Ocupação',
      value: `${stats.occupancyRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Livres no Período',
      value: stats.availableAccommodations,
      icon: DoorOpen,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
