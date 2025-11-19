import { AccommodationType, AmenityCategory } from '@prisma/client';

/**
 * Accommodation Types
 */

export interface AccommodationLocation {
  floor: string | null;
  view: string | null;
  area: number | null;
}

export interface AccommodationSEO {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
}

export interface AccommodationImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  category: AmenityCategory;
  description: string | null;
}

export interface AccommodationDetails {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  location: AccommodationLocation;
  checkInTime: string;
  checkOutTime: string;
  extraBeds: number;
  maxExtraBeds: number;
  extraBedPrice: number;
  cancellationPolicy: string | null;
  seo: AccommodationSEO;
  images: AccommodationImage[];
  amenities: Amenity[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccommodationInput {
  name: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string;
  floor?: string;
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
  amenityIds?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface UpdateAccommodationInput {
  name?: string;
  type?: AccommodationType;
  capacity?: number;
  pricePerNight?: number;
  description?: string;
  shortDescription?: string;
  floor?: string;
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

export interface AccommodationListQuery {
  page?: number;
  limit?: number;
  type?: AccommodationType;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'price' | 'capacity' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AccommodationAvailabilityQuery {
  checkInDate: Date;
  checkOutDate: Date;
}

export interface AddImagesInput {
  images: Array<{
    url: string;
    alt?: string;
    order: number;
  }>;
}

export interface ReorderImagesInput {
  imageOrders: Array<{
    imageId: string;
    order: number;
  }>;
}

export interface CreateAmenityInput {
  name: string;
  icon?: string;
  category: AmenityCategory;
  description?: string;
}

export interface UpdateAmenityInput {
  name?: string;
  icon?: string;
  category?: AmenityCategory;
  description?: string;
}
