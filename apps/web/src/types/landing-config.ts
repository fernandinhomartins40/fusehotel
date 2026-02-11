// Common configuration fields shared across sections
export interface BaseSectionConfig {
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

// Header Section Configuration
export interface HeaderConfig extends BaseSectionConfig {
  logo?: string;
  textColor?: string;
  hoverColor?: string;
  buttonText?: string;
  buttonBackground?: string;
  buttonHover?: string;
  buttonTextColor?: string;
}

// Hero Section Configuration
export interface HeroConfig extends BaseSectionConfig {
  autoplaySpeed?: number; // seconds
  transitionEffect?: 'fade' | 'slide';
  showNavigationArrows?: boolean;
  showDotsIndicator?: boolean;
  height?: string; // Altura universal para todos os slides (ex: 700px, 100vh)
}

// Accommodations Section Configuration
export interface AccommodationsConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  // Card Styling
  cardBadgeBackground?: string;
  cardBadgeText?: string;
  cardBorderColor?: string;
  cardBackground?: string;
  cardTitleColor?: string;
  cardDescriptionColor?: string;
  cardIconColor?: string;
  cardPriceLabelColor?: string;
  cardPriceValueColor?: string;
  cardButtonBorderColor?: string;
  cardButtonTextColor?: string;
  cardButtonHoverBackground?: string;
  cardButtonHoverText?: string;
  cardBorderRadius?: string;
}

// Promotions Section Configuration
export interface PromotionsConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  // Card Styling
  cardBorderColor?: string;
  cardBackground?: string;
  cardBadgeBackground?: string;
  cardBadgeText?: string;
  cardTitleColor?: string;
  cardDateColor?: string;
  cardDescriptionColor?: string;
  cardFeatureBadgeBackground?: string;
  cardFeatureBadgeText?: string;
  cardOriginalPriceColor?: string;
  cardDiscountedPriceColor?: string;
  cardButtonBackground?: string;
  cardButtonTextColor?: string;
  cardBorderRadius?: string;
}

// Highlights Section Configuration
export interface HighlightsConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
}

// Gallery Section Configuration
export interface GalleryConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
}

// Partners Section Configuration
export interface PartnersConfig extends BaseSectionConfig {
  title?: string;
}

// Newsletter Section Configuration
export interface NewsletterConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}

// Footer Section Configuration
export interface FooterConfig extends BaseSectionConfig {
  logo?: string;
  textColor?: string;
  headingColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  copyrightColor?: string;
  borderColor?: string;
  mapBackgroundColor?: string;
  aboutText?: string;
  copyright?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  businessHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

// Default configurations for each section
export const defaultHeaderConfig: HeaderConfig = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  hoverColor: '#0466C8',
  buttonText: 'Reservar Agora',
  buttonBackground: '#0466C8',
  buttonHover: '#0354A8',
  buttonTextColor: '#FFFFFF',
};

export const defaultHeroConfig: HeroConfig = {
  autoplaySpeed: 5,
  transitionEffect: 'slide',
  showNavigationArrows: true,
  showDotsIndicator: true,
  height: '700px',
};

export const defaultAccommodationsConfig: AccommodationsConfig = {
  title: 'ACOMODAÇÕES',
  subtitle: 'Conforto e Elegância',
  description: 'Descubra nossas acomodações luxuosas e confortáveis, projetadas para proporcionar uma experiência inesquecível.',
  backgroundColor: '#F9F9F9',
  titleColor: '#000000',
  subtitleColor: '#666666',
  buttonText: 'Ver Detalhes',
  buttonColor: '#0466C8',
  buttonHoverColor: '#0354A8',
  // Card defaults
  cardBadgeBackground: '#0466C8',
  cardBadgeText: '#FFFFFF',
  cardBorderColor: '#E5E5E5',
  cardBackground: '#FFFFFF',
  cardTitleColor: '#1D1D1F',
  cardDescriptionColor: '#6B7280',
  cardIconColor: '#0466C8',
  cardPriceLabelColor: '#6B7280',
  cardPriceValueColor: '#000000',
  cardButtonBorderColor: '#0466C8',
  cardButtonTextColor: '#0466C8',
  cardButtonHoverBackground: '#0466C8',
  cardButtonHoverText: '#FFFFFF',
  cardBorderRadius: '8px',
};

export const defaultPromotionsConfig: PromotionsConfig = {
  title: 'PROMOÇÕES ESPECIAIS',
  description: 'Aproveite nossas ofertas exclusivas e economize em sua próxima estadia.',
  backgroundColor: '#FFFFFF',
  titleColor: '#000000',
  buttonText: 'Ver Promoção',
  buttonColor: '#0466C8',
  // Card defaults
  cardBorderColor: '#E5E5E5',
  cardBackground: '#FFFFFF',
  cardBadgeBackground: '#0466C8',
  cardBadgeText: '#FFFFFF',
  cardTitleColor: '#000000',
  cardDateColor: '#6B7280',
  cardDescriptionColor: '#6B7280',
  cardFeatureBadgeBackground: '#F3F4F6',
  cardFeatureBadgeText: '#374151',
  cardOriginalPriceColor: '#9CA3AF',
  cardDiscountedPriceColor: '#0466C8',
  cardButtonBackground: '#0466C8',
  cardButtonTextColor: '#FFFFFF',
  cardBorderRadius: '8px',
};

export const defaultHighlightsConfig: HighlightsConfig = {
  title: 'POR QUE ESCOLHER NOSSO HOTEL',
  subtitle: 'Experiência Única',
  description: 'Oferecemos serviços e comodidades que tornarão sua estadia memorável.',
  backgroundColor: '#F5F5F5',
  titleColor: '#000000',
  subtitleColor: '#666666',
};

export const defaultGalleryConfig: GalleryConfig = {
  title: 'GALERIA',
  subtitle: 'Momentos Inesquecíveis',
  description: 'Explore nosso hotel através de imagens que capturam a essência da sua próxima estadia.',
  backgroundColor: '#FFFFFF',
  titleColor: '#000000',
  subtitleColor: '#666666',
};

export const defaultPartnersConfig: PartnersConfig = {
  title: 'NOSSOS PARCEIROS',
  backgroundColor: '#F9F9F9',
  titleColor: '#000000',
};

export const defaultNewsletterConfig: NewsletterConfig = {
  title: 'FIQUE POR DENTRO',
  description: 'Inscreva-se em nossa newsletter e receba ofertas exclusivas e novidades.',
  backgroundColor: '#0466C8',
  titleColor: '#FFFFFF',
  buttonText: 'Inscrever-se',
  buttonColor: '#FFFFFF',
  buttonHoverColor: '#F0F0F0',
};

export const defaultFooterConfig: FooterConfig = {
  backgroundColor: '#1A1A1A',
  textColor: '#9CA3AF',
  headingColor: '#FFFFFF',
  linkColor: '#0466C8',
  linkHoverColor: '#0354A8',
  copyrightColor: '#6B7280',
  borderColor: '#1F2937',
  mapBackgroundColor: '#1F2937',
  aboutText: 'Oferecemos experiências únicas em hospedagem com conforto, elegância e atendimento personalizado.',
  copyright: '© 2024 FuseHotel. Todos os direitos reservados.',
  address: 'Rua Exemplo, 123 - Cidade, Estado',
  phone: '(11) 1234-5678',
  whatsapp: '(11) 98765-4321',
  email: 'contato@fusehotel.com',
  businessHours: 'Recepção 24h\nCheck-in: 14h\nCheck-out: 12h',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  logo: '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png',
};
