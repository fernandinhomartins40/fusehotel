export type PromotionType = 'PACKAGE' | 'PROMOTION';

export interface PromotionFeature {
  id: string;
  promotionId: string;
  feature: string;
  order: number;
}

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: string | null;
  startDate: string;
  endDate: string;
  originalPrice: number | null;
  discountedPrice: number | null;
  discountPercent: number | null;
  type: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
  termsAndConditions: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  promotionCode: string | null;
  createdAt: string;
  updatedAt: string;
  features: PromotionFeature[];
}

export interface PromotionFilters {
  isActive?: boolean;
  type?: PromotionType;
  isFeatured?: boolean;
}

export interface CreatePromotionData {
  title: string;
  shortDescription: string;
  longDescription: string;
  image?: string;
  startDate: string;
  endDate: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  type: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  termsAndConditions?: string;
  maxRedemptions?: number;
  promotionCode?: string;
  features?: string[];
}
