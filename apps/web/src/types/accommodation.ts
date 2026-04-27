export type AccommodationType = 'ROOM' | 'SUITE' | 'CHALET' | 'VILLA' | 'APARTMENT';

export interface AccommodationImage {
  id?: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: string;
  description?: string;
}

export interface AccommodationAmenity {
  amenity: Amenity;
}

export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string | null;
  images: AccommodationImage[];
  amenities: AccommodationAmenity[];
  floor?: number | null;
  view?: string | null;
  area?: number | null;
  checkInTime: string;
  checkOutTime: string;
  extraBeds: number;
  maxExtraBeds: number;
  extraBedPrice: number;
  cancellationPolicy?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  totalRoomUnitCount?: number;
  activeRoomUnitCount?: number;
  isPublishedOnSite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccommodationFormData {
  name: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string;
  images: AccommodationImage[];
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
  isAvailable: boolean;
  isFeatured?: boolean;
}
