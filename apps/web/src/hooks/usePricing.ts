import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface PricingBreakdown {
  pricePerNight: number;
  extraBedPrice: number;
  numberOfNights: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFeeRate: number;
  serviceFee: number;
  taxRate: number;
  taxes: number;
  discount: number;
  promotionId?: string;
  totalAmount: number;
}

interface PricingPreviewParams {
  accommodationId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfExtraBeds?: number;
  promotionId?: string;
  promotionCode?: string;
}

export function usePricingPreview(params: PricingPreviewParams) {
  const enabled = Boolean(
    params.accommodationId &&
    params.checkInDate &&
    params.checkOutDate
  );

  return useQuery({
    queryKey: ['pricing-preview', params],
    queryFn: async () => {
      const { data } = await apiClient.post('/pricing/preview', params);
      return data.data as PricingBreakdown;
    },
    enabled,
    staleTime: 30_000,
  });
}
