
export interface Accommodation {
  id?: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  description: string;
  shortDescription?: string;
  images: string[];
  amenities: string[];
  location?: {
    floor?: string;
    view?: string;
    area?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  isAvailable: boolean;
  featured?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  extraBeds?: number;
  maxExtraBeds?: number;
  extraBedPrice?: number;
}

export interface AccommodationFormData extends Omit<Accommodation, 'id'> {}
