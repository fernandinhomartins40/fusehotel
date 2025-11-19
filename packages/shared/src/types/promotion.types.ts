/**
 * Promotion Types
 *
 * Tipos relacionados a promoções e pacotes
 */

import { BaseEntity } from './common.types';

/**
 * Tipos de promoção
 */
export enum PromotionType {
  PACKAGE = 'PACKAGE',
  DISCOUNT = 'DISCOUNT',
  SEASONAL = 'SEASONAL',
  SPECIAL_OFFER = 'SPECIAL_OFFER',
  EARLY_BIRD = 'EARLY_BIRD',
  LAST_MINUTE = 'LAST_MINUTE',
}

/**
 * Tipo de desconto
 */
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_NIGHTS = 'FREE_NIGHTS',
}

/**
 * Feature de promoção
 */
export interface PromotionFeature {
  id: string;
  feature: string;
  order: number;
}

/**
 * Regras de aplicação da promoção
 */
export interface PromotionRules {
  minNights?: number;
  maxNights?: number;
  minGuests?: number;
  maxGuests?: number;
  applicableDays?: number[];
  blackoutDates?: string[];
  accommodationTypes?: string[];
  accommodationIds?: string[];
}

/**
 * Interface completa de promoção
 */
export interface Promotion extends BaseEntity {
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
  discountType: DiscountType;
  type: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
  features: PromotionFeature[];
  rules: PromotionRules | null;
  termsAndConditions: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  promotionCode: string | null;
}

/**
 * Dados para criação de promoção
 */
export interface CreatePromotionDto {
  title: string;
  shortDescription: string;
  longDescription: string;
  image?: string;
  startDate: string;
  endDate: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  discountType: DiscountType;
  type: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  features?: string[];
  rules?: PromotionRules;
  termsAndConditions?: string;
  maxRedemptions?: number;
  promotionCode?: string;
}

/**
 * Dados para atualização de promoção
 */
export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {}

/**
 * Filtros de busca de promoções
 */
export interface PromotionFilters {
  type?: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  minDiscount?: number;
  maxDiscount?: number;
}

/**
 * Promoção resumida (para listagens)
 */
export interface PromotionSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string | null;
  startDate: string;
  endDate: string;
  discountPercent: number | null;
  type: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
}

/**
 * Validação de código promocional
 */
export interface PromotionCodeValidation {
  isValid: boolean;
  promotion: Promotion | null;
  discountAmount: number;
  message: string;
}
