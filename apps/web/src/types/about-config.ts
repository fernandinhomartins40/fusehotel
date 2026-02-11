import { BaseSectionConfig } from './landing-config';

// Team Member Interface
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

// Award Interface
export interface Award {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

// Hero Section Configuration
export interface AboutHeroConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  height?: string;
}

// History Section Configuration
export interface HistorySectionConfig extends BaseSectionConfig {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  image?: string;
  imageAlt?: string;
}

// Mission/Vision/Values Section Configuration
export interface MissionVisionValuesConfig extends BaseSectionConfig {
  title?: string;
  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;
  valuesTitle?: string;
  valuesItems?: string[];
}

// Team Section Configuration
export interface TeamSectionConfig extends BaseSectionConfig {
  title?: string;
  gridColumns?: number;
}

// Awards Section Configuration
export interface AwardsSectionConfig extends BaseSectionConfig {
  title?: string;
  gridColumns?: number;
}

// Complete About Us Page Configuration
export interface AboutPageConfig {
  hero: AboutHeroConfig;
  history: HistorySectionConfig;
  missionVisionValues: MissionVisionValuesConfig;
  team: TeamSectionConfig;
  awards: AwardsSectionConfig;
}

// Default Configurations
export const defaultAboutHeroConfig: AboutHeroConfig = {
  backgroundColor: '#0466C8',
  titleColor: '#FFFFFF',
  subtitleColor: '#FFFFFF',
  title: 'Sobre Nós',
  description: 'Conheça a história e a equipe por trás do Hotel Águas Claras, onde tradição e hospitalidade se encontram para proporcionar a melhor experiência aos nossos hóspedes.',
  height: '400px',
};

export const defaultHistorySectionConfig: HistorySectionConfig = {
  backgroundColor: '#FFFFFF',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Nossa História',
  paragraph1: 'Fundado em 1985, o Hotel Águas Claras começou como um pequeno estabelecimento familiar com apenas 10 quartos. Com o passar dos anos, crescemos e nos transformamos em um dos hotéis mais respeitados da região, mantendo sempre o acolhimento e o atendimento personalizado que nos caracteriza.',
  paragraph2: 'Localizado em uma área privilegiada, entre montanhas e próximo a nascentes naturais, nosso hotel foi construído com o compromisso de preservar o meio ambiente e oferecer aos nossos hóspedes uma experiência autêntica de contato com a natureza.',
  paragraph3: 'Hoje, contamos com 45 acomodações de alto padrão, divididas entre apartamentos, chalés e suítes, todas equipadas com infraestrutura moderna e decoração que remete à natureza exuberante da região.',
  image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
  imageAlt: 'Vista do Hotel Águas Claras',
};

export const defaultMissionVisionValuesConfig: MissionVisionValuesConfig = {
  backgroundColor: '#F9F9F9',
  titleColor: '#0466C8',
  subtitleColor: '#0466C8',
  title: 'Missão, Visão e Valores',
  missionTitle: 'Missão',
  missionText: 'Proporcionar aos nossos hóspedes uma experiência única de hospedagem, combinando conforto, hospitalidade e contato com a natureza, superando suas expectativas e criando momentos memoráveis.',
  visionTitle: 'Visão',
  visionText: 'Ser reconhecido como referência em hotelaria sustentável na região, aliando qualidade de serviços, respeito ao meio ambiente e promoção do turismo local.',
  valuesTitle: 'Valores',
  valuesItems: [
    'Excelência no atendimento',
    'Sustentabilidade ambiental',
    'Valorização da cultura local',
    'Inovação e melhoria contínua',
    'Ética e transparência',
    'Trabalho em equipe',
  ],
};

export const defaultTeamSectionConfig: TeamSectionConfig = {
  backgroundColor: '#FFFFFF',
  titleColor: '#0466C8',
  subtitleColor: '#0466C8',
  title: 'Nossa Equipe',
  gridColumns: 3,
};

export const defaultAwardsSectionConfig: AwardsSectionConfig = {
  backgroundColor: '#F9F9F9',
  titleColor: '#0466C8',
  subtitleColor: '#666666',
  title: 'Reconhecimentos e Prêmios',
  gridColumns: 4,
};

export const defaultAboutPageConfig: AboutPageConfig = {
  hero: defaultAboutHeroConfig,
  history: defaultHistorySectionConfig,
  missionVisionValues: defaultMissionVisionValuesConfig,
  team: defaultTeamSectionConfig,
  awards: defaultAwardsSectionConfig,
};
