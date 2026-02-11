import { BaseSectionConfig } from './landing-config';

// Service Categories
export type ServiceCategory = 'ACCOMMODATION' | 'GASTRONOMY' | 'RECREATION' | 'BUSINESS' | 'SPECIAL';

// Service Item Interface
export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  icon?: string;
  features: string[];
  order: number;
  isActive: boolean;
}

// Hero Section Configuration
export interface ServicesHeroConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  height?: string;
}

// Accommodation Section Configuration
export interface AccommodationSectionConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  showButton?: boolean;
}

// Gastronomy Section Configuration
export interface GastronomySectionConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  showGallery?: boolean;
  galleryImages?: string[];
}

// Recreation Section Configuration
export interface RecreationSectionConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  gridColumns?: number;
}

// Business Section Configuration
export interface BusinessSectionConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonUrl?: string;
}

// Special Services Section Configuration
export interface SpecialSectionConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  iconBackgroundColor?: string;
  iconColor?: string;
}

// CTA Section Configuration
export interface CTASectionConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonColor?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonColor?: string;
  secondaryButtonUrl?: string;
}

// Complete Services Page Configuration
export interface ServicesPageConfig {
  hero: ServicesHeroConfig;
  accommodation: AccommodationSectionConfig;
  gastronomy: GastronomySectionConfig;
  recreation: RecreationSectionConfig;
  business: BusinessSectionConfig;
  special: SpecialSectionConfig;
  cta: CTASectionConfig;
}

// Default Configurations
export const defaultServicesHeroConfig: ServicesHeroConfig = {
  backgroundColor: '#0466C8',
  titleColor: '#FFFFFF',
  subtitleColor: '#FFFFFF',
  title: 'Nossos Serviços',
  subtitle: 'Explore todas as comodidades e serviços que preparamos especialmente para você',
  height: '400px',
};

export const defaultAccommodationSectionConfig: AccommodationSectionConfig = {
  backgroundColor: '#FFFFFF',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Hospedagem',
  subtitle: 'Acomodações',
  description: 'Conheça nossas opções de hospedagem projetadas para proporcionar conforto e bem-estar.',
  buttonText: 'Ver Todas as Acomodações',
  buttonColor: '#0466C8',
  buttonHoverColor: '#0355A6',
  showButton: true,
};

export const defaultGastronomySectionConfig: GastronomySectionConfig = {
  backgroundColor: '#F9F9F9',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Gastronomia',
  subtitle: 'Experiências Culinárias',
  description: 'Saboreie pratos excepcionais em nossos restaurantes e bares.',
  showGallery: true,
  galleryImages: [],
};

export const defaultRecreationSectionConfig: RecreationSectionConfig = {
  backgroundColor: '#FFFFFF',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Lazer e Bem-Estar',
  subtitle: 'Atividades',
  description: 'Aproveite uma variedade de atividades de lazer e bem-estar.',
  gridColumns: 3,
};

export const defaultBusinessSectionConfig: BusinessSectionConfig = {
  backgroundColor: '#F9F9F9',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Serviços Empresariais',
  subtitle: 'Eventos Corporativos',
  description: 'Estrutura completa para seus eventos e reuniões de negócios.',
  image: '',
  buttonText: 'Solicitar Orçamento',
  buttonColor: '#0466C8',
  buttonHoverColor: '#0355A6',
  buttonUrl: '/contato',
};

export const defaultSpecialSectionConfig: SpecialSectionConfig = {
  backgroundColor: '#FFFFFF',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Serviços Especiais',
  subtitle: 'Comodidades Exclusivas',
  description: 'Serviços adicionais para tornar sua estadia ainda mais especial.',
  iconBackgroundColor: '#0466C8',
  iconColor: '#FFFFFF',
};

export const defaultCTASectionConfig: CTASectionConfig = {
  backgroundColor: '#0466C8',
  titleColor: '#FFFFFF',
  subtitleColor: '#FFFFFF',
  title: 'Reserve Sua Experiência',
  description: 'Entre em contato conosco e planeje sua próxima estadia com todos esses serviços incríveis.',
  primaryButtonText: 'Reservar Agora',
  primaryButtonColor: '#FFFFFF',
  primaryButtonUrl: '#',
  secondaryButtonText: 'Contato',
  secondaryButtonColor: 'transparent',
  secondaryButtonUrl: '/contato',
};

export const defaultServicesPageConfig: ServicesPageConfig = {
  hero: defaultServicesHeroConfig,
  accommodation: defaultAccommodationSectionConfig,
  gastronomy: defaultGastronomySectionConfig,
  recreation: defaultRecreationSectionConfig,
  business: defaultBusinessSectionConfig,
  special: defaultSpecialSectionConfig,
  cta: defaultCTASectionConfig,
};
