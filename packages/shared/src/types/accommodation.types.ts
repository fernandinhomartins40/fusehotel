/**
 * Accommodation Types
 *
 * Tipos relacionados a acomodações (quartos, suítes, chalés)
 */

import { BaseEntity } from './common.types';

/**
 * Tipos de acomodação
 */
export enum AccommodationType {
  ROOM = 'ROOM',
  SUITE = 'SUITE',
  CHALET = 'CHALET',
  VILLA = 'VILLA',
  APARTMENT = 'APARTMENT',
}

/**
 * Categorias de amenidades
 */
export enum AmenityCategory {
  BEDROOM = 'BEDROOM',
  BATHROOM = 'BATHROOM',
  ENTERTAINMENT = 'ENTERTAINMENT',
  KITCHEN = 'KITCHEN',
  OUTDOOR = 'OUTDOOR',
  ACCESSIBILITY = 'ACCESSIBILITY',
  GENERAL = 'GENERAL',
}

/**
 * Interface de amenidade
 */
export interface Amenity extends BaseEntity {
  name: string;
  icon: string;
  category: AmenityCategory;
  description: string | null;
}

/**
 * Imagem de acomodação
 */
export interface AccommodationImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

/**
 * Localização da acomodação
 */
export interface AccommodationLocation {
  floor: number | null;
  view: string | null;
  area: number | null;
}

/**
 * Política de cancelamento
 */
export interface CancellationPolicy {
  description: string;
  refundable: boolean;
  refundPercentage: number;
  deadlineHours: number;
}

/**
 * Informações SEO
 */
export interface SeoInfo {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
}

/**
 * Interface completa de acomodação
 */
export interface Accommodation extends BaseEntity {
  name: string;
  slug: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription: string | null;
  images: AccommodationImage[];
  amenities: Amenity[];
  location: AccommodationLocation;
  checkInTime: string;
  checkOutTime: string;
  extraBeds: number;
  maxExtraBeds: number;
  extraBedPrice: number;
  cancellationPolicy: CancellationPolicy | null;
  seo: SeoInfo;
  isAvailable: boolean;
  isFeatured: boolean;
}

/**
 * Dados para criação de acomodação
 */
export interface CreateAccommodationDto {
  name: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string;
  images: Array<{ url: string; alt: string; order: number; isPrimary: boolean }>;
  amenityIds: string[];
  floor?: number;
  view?: string;
  area?: number;
  checkInTime?: string;
  checkOutTime?: string;
  extraBeds?: number;
  maxExtraBeds?: number;
  extraBedPrice?: number;
  cancellationPolicy?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
}

/**
 * Dados para atualização de acomodação
 */
export interface UpdateAccommodationDto extends Partial<CreateAccommodationDto> {}

/**
 * Filtros de busca de acomodação
 */
export interface AccommodationFilters {
  type?: AccommodationType;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenityIds?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  checkInDate?: string;
  checkOutDate?: string;
}

/**
 * Acomodação resumida (para listagens)
 */
export interface AccommodationSummary {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  shortDescription: string | null;
  primaryImage: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}

/**
 * Disponibilidade de acomodação
 */
export interface AccommodationAvailability {
  accommodationId: string;
  date: string;
  isAvailable: boolean;
  pricePerNight: number;
  bookedBy?: string;
}
