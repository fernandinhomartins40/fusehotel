import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { OperationsReport } from '@/types/pms';

export function useOperationsReport(date?: string) {
  return useQuery<OperationsReport>({
    queryKey: ['reports-operations', date],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/operations', {
        params: date ? { date } : undefined,
      });
      return data.data;
    },
  });
}
