// Base configuration interface for sections
export interface BaseSectionConfig {
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

// FAQ Hero Section Configuration
export interface FAQHeroConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  height?: string;
}

export const defaultFAQHeroConfig: FAQHeroConfig = {
  title: 'Perguntas Frequentes',
  description: 'Encontre respostas para as dúvidas mais comuns sobre hospedagem, serviços e políticas do Hotel Águas Claras.',
  backgroundColor: '#0466C8',
  titleColor: '#FFFFFF',
  subtitleColor: '#FFFFFF',
  height: 'auto',
};

// FAQ Search Section Configuration
export interface FAQSearchConfig {
  placeholder?: string;
  backgroundColor?: string;
  borderColor?: string;
  focusColor?: string;
  isEnabled?: boolean;
}

export const defaultFAQSearchConfig: FAQSearchConfig = {
  placeholder: 'Pesquisar perguntas...',
  backgroundColor: '#FFFFFF',
  borderColor: '#D1D5DB',
  focusColor: '#0466C8',
  isEnabled: true,
};

// FAQ Category Interface
export interface FAQCategory {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// FAQ Item Interface
export interface FAQItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// FAQ Content Section Configuration
export interface FAQContentConfig extends BaseSectionConfig {
  categoryTitleColor?: string;
  questionColor?: string;
  answerColor?: string;
  borderColor?: string;
}

export const defaultFAQContentConfig: FAQContentConfig = {
  backgroundColor: '#FFFFFF',
  categoryTitleColor: '#0466C8',
  questionColor: '#000000',
  answerColor: '#374151',
  borderColor: '#E5E7EB',
};

// FAQ Contact CTA Section Configuration
export interface FAQContactConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export const defaultFAQContactConfig: FAQContactConfig = {
  title: 'Ainda tem dúvidas?',
  description: 'Se não encontrou a resposta que procura, entre em contato conosco diretamente.',
  buttonText: 'Fale Conosco',
  buttonUrl: '/contato',
  backgroundColor: '#F9FAFB',
  titleColor: '#000000',
  subtitleColor: '#374151',
  buttonColor: '#0466C8',
  buttonTextColor: '#FFFFFF',
};
