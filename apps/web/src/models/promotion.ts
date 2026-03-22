export interface Promotion {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  startDate: string;
  endDate: string;
  originalPrice: number;
  discountedPrice: number;
  type: 'package' | 'promotion';
  active: boolean;
  featured: boolean;
  features: string[];
}
