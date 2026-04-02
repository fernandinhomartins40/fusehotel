// Base configuration interface for sections
export interface BaseSectionConfig {
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

// Contact Hero Section Configuration
export interface ContactHeroConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  height?: string;
}

export const defaultContactHeroConfig: ContactHeroConfig = {
  title: 'Entre em Contato',
  description: 'Estamos à disposição para responder suas dúvidas, receber sugestões ou ajudar com sua reserva.',
  backgroundColor: '#6E59A5',
  titleColor: '#FFFFFF',
  subtitleColor: '#FFFFFF',
  height: 'auto',
};

// Contact Cards Configuration
export interface ContactCardsConfig extends BaseSectionConfig {
  phoneTitle?: string;
  phoneDescription?: string;
  phoneNumber?: string;
  whatsappTitle?: string;
  whatsappDescription?: string;
  whatsappNumber?: string;
  emailTitle?: string;
  emailDescription?: string;
  emailAddress?: string;
  cardIconColor?: string;
  cardLinkColor?: string;
}

export const defaultContactCardsConfig: ContactCardsConfig = {
  backgroundColor: '#F9FAFB',
  phoneTitle: 'Telefone',
  phoneDescription: 'Estamos disponíveis para atendê-lo por telefone em horário comercial.',
  phoneNumber: '(11) 5555-5555',
  whatsappTitle: 'WhatsApp',
  whatsappDescription: 'Envie mensagens pelo WhatsApp para atendimento rápido.',
  whatsappNumber: '(11) 99999-9999',
  emailTitle: 'E-mail',
  emailDescription: 'Envie um e-mail para nossa equipe e responderemos em até 24 horas.',
  emailAddress: 'contato@aguasclaras.com',
  cardIconColor: '#0466C8',
  cardLinkColor: '#0466C8',
};

// Contact Form Configuration
export interface ContactFormConfig extends BaseSectionConfig {
  formTitle?: string;
  formDescription?: string;
  mapTitle?: string;
  mapDescription?: string;
  addressLabel?: string;
  addressLine1?: string;
  addressLine2?: string;
  hoursLabel?: string;
  hoursLine1?: string;
  hoursLine2?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export const defaultContactFormConfig: ContactFormConfig = {
  backgroundColor: '#FFFFFF',
  titleColor: '#0466C8',
  formTitle: 'Envie uma Mensagem',
  formDescription: 'Preencha o formulário abaixo com suas informações e entraremos em contato o mais breve possível.',
  mapTitle: 'Nossa Localização',
  mapDescription: 'Visite-nos e conheça pessoalmente toda a estrutura do Hotel Águas Claras.',
  addressLabel: 'Endereço:',
  addressLine1: 'Rua das Águas, 123, Centro',
  addressLine2: 'Águas Claras - SP, 12345-678',
  hoursLabel: 'Horário de Funcionamento:',
  hoursLine1: 'Recepção: 24 horas',
  hoursLine2: 'Atendimento telefônico: 8h às 22h',
  buttonText: 'Enviar Mensagem',
  buttonColor: '#0466C8',
  buttonTextColor: '#FFFFFF',
};

// Contact FAQ CTA Configuration
export interface ContactFAQCTAConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export const defaultContactFAQCTAConfig: ContactFAQCTAConfig = {
  title: 'Perguntas Frequentes',
  description: 'Encontre respostas para as perguntas mais comuns sobre nossa hospedagem e serviços.',
  buttonText: 'Ver todas as FAQs',
  buttonUrl: '/faq',
  backgroundColor: '#F9FAFB',
  titleColor: '#000000',
  subtitleColor: '#374151',
  buttonColor: '#0466C8',
  buttonTextColor: '#FFFFFF',
};
