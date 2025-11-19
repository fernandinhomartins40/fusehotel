
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', confirmed: 45, pending: 12, canceled: 3 },
  { month: 'Fev', confirmed: 52, pending: 18, canceled: 5 },
  { month: 'Mar', confirmed: 61, pending: 15, canceled: 4 },
  { month: 'Abr', confirmed: 48, pending: 22, canceled: 7 },
  { month: 'Mai', confirmed: 38, pending: 8, canceled: 2 },
  { month: 'Jun', confirmed: 55, pending: 14, canceled: 6 },
];

const chartConfig = {
  confirmed: {
    label: 'Confirmadas',
    color: '#22c55e'
  },
  pending: {
    label: 'Pendentes',
    color: '#f59e0b'
  },
  canceled: {
    label: 'Canceladas',
    color: '#ef4444'
  }
};

export const ReservationsChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservas por Mês</CardTitle>
        <CardDescription>Visão geral das reservas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={4} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
              <Bar dataKey="canceled" fill="var(--color-canceled)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
