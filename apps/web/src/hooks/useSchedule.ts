import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  AccommodationSchedule,
  ScheduleStats,
  ScheduleQueryParams,
  AvailabilityCheckResult,
} from '@/types/schedule';

/**
 * Hook to fetch schedule data for accommodations
 */
export const useSchedule = (params: ScheduleQueryParams) => {
  return useQuery<AccommodationSchedule[]>({
    queryKey: ['schedule', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
        ...(params.accommodationId && { accommodationId: params.accommodationId }),
      });

      const response = await apiClient.get(`/schedule?${queryParams}`);
      return response.data.data;
    },
    enabled: Boolean(params.startDate && params.endDate),
  });
};

/**
 * Hook to fetch schedule statistics
 */
export const useScheduleStats = (startDate: string, endDate: string) => {
  return useQuery<ScheduleStats>({
    queryKey: ['schedule-stats', startDate, endDate],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await apiClient.get(`/schedule/stats?${queryParams}`);
      return response.data.data;
    },
    enabled: Boolean(startDate && endDate),
  });
};

/**
 * Hook to check availability for a specific accommodation
 */
export const useCheckAvailability = (
  accommodationId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery<AvailabilityCheckResult>({
    queryKey: ['availability', accommodationId, startDate, endDate],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await apiClient.get(
        `/schedule/availability/${accommodationId}?${queryParams}`
      );
      return response.data.data;
    },
    enabled: Boolean(accommodationId && startDate && endDate),
  });
};
