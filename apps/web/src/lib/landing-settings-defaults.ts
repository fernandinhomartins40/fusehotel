import {
  defaultAccommodationsConfig,
  defaultFooterConfig,
  defaultGalleryConfig,
  defaultHeaderConfig,
  defaultHeroConfig,
  defaultHighlightsConfig,
  defaultNewsletterConfig,
  defaultPartnersConfig,
  defaultPromotionsConfig,
} from '@/types/landing-config';
import {
  defaultServicesHeroConfig,
  defaultAccommodationSectionConfig,
  defaultGastronomySectionConfig,
  defaultRecreationSectionConfig,
  defaultBusinessSectionConfig,
  defaultSpecialSectionConfig,
  defaultCTASectionConfig,
} from '@/types/services-config';
import {
  defaultAboutHeroConfig,
  defaultAwardsSectionConfig,
  defaultHistorySectionConfig,
  defaultMissionVisionValuesConfig,
  defaultTeamSectionConfig,
} from '@/types/about-config';
import {
  defaultFAQContentConfig,
  defaultFAQContactConfig,
  defaultFAQHeroConfig,
} from '@/types/faq-config';
import {
  defaultContactCardsConfig,
  defaultContactFAQCTAConfig,
  defaultContactFormConfig,
  defaultContactHeroConfig,
} from '@/types/contact-config';

const landingSettingsDefaults = {
  header: defaultHeaderConfig,
  hero: defaultHeroConfig,
  accommodations: defaultAccommodationsConfig,
  promotions: defaultPromotionsConfig,
  highlights: defaultHighlightsConfig,
  gallery: defaultGalleryConfig,
  partners: defaultPartnersConfig,
  newsletter: defaultNewsletterConfig,
  footer: defaultFooterConfig,
  'services-hero': defaultServicesHeroConfig,
  'services-accommodation': defaultAccommodationSectionConfig,
  'services-gastronomy': defaultGastronomySectionConfig,
  'services-recreation': defaultRecreationSectionConfig,
  'services-business': defaultBusinessSectionConfig,
  'services-special': defaultSpecialSectionConfig,
  'services-cta': defaultCTASectionConfig,
  'about-hero': defaultAboutHeroConfig,
  'about-history': defaultHistorySectionConfig,
  'about-mission-vision-values': defaultMissionVisionValuesConfig,
  'about-team': defaultTeamSectionConfig,
  'about-awards': defaultAwardsSectionConfig,
  'faq-hero': defaultFAQHeroConfig,
  'faq-content': defaultFAQContentConfig,
  'faq-contact': defaultFAQContactConfig,
  'contact-hero': defaultContactHeroConfig,
  'contact-cards': defaultContactCardsConfig,
  'contact-form': defaultContactFormConfig,
  'contact-faq-cta': defaultContactFAQCTAConfig,
} satisfies Record<string, Record<string, unknown>>;

export const mergeLandingSettingsConfig = <T>(
  section: string,
  config?: T | null
): T => {
  const defaults = landingSettingsDefaults[section];

  if (!defaults) {
    return (config ?? {}) as T;
  }

  return {
    ...defaults,
    ...((config as Record<string, unknown> | null | undefined) ?? {}),
  } as T;
};
