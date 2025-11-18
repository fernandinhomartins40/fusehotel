import { PromotionType } from '@prisma/client';

/**
 * Promotion Types
 */

export interface PromotionFeature {
  id: string;
  feature: string;
  order: number;
}

export interface PromotionDetails {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  startDate: Date;
  endDate: Date;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  type: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
  termsAndConditions: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  features: PromotionFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromotionInput {
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  startDate: Date;
  endDate: Date;
  originalPrice: number;
  discountedPrice: number;
  type: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  termsAndConditions?: string;
  maxRedemptions?: number;
  features?: string[];
}

export interface UpdatePromotionInput {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  image?: string;
  startDate?: Date;
  endDate?: Date;
  originalPrice?: number;
  discountedPrice?: number;
  type?: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  termsAndConditions?: string;
  maxRedemptions?: number;
  features?: string[];
}

export interface PromotionListQuery {
  page?: number;
  limit?: number;
  type?: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'startDate' | 'endDate' | 'discountPercent' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
