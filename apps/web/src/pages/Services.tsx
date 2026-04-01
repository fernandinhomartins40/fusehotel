import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useLandingSettings,
  useServiceItemsByCategory
} from '@/hooks/useLanding';
import { hydrateBrandColors } from '@/lib/brand-theme';
import {
  defaultServicesHeroConfig,
  defaultAccommodationSectionConfig,
  defaultGastronomySectionConfig,
  defaultRecreationSectionConfig,
  defaultBusinessSectionConfig,
  defaultSpecialSectionConfig,
  defaultCTASectionConfig,
  ServicesHeroConfig,
  AccommodationSectionConfig,
  GastronomySectionConfig,
  RecreationSectionConfig,
  BusinessSectionConfig,
  SpecialSectionConfig,
  CTASectionConfig,
} from '@/types/services-config';

const Services: React.FC = () => {
  // Fetch all section configs
  const { data: heroData } = useLandingSettings('services-hero');
  const { data: accommodationData } = useLandingSettings('services-accommodation');
  const { data: gastronomyData } = useLandingSettings('services-gastronomy');
  const { data: recreationData } = useLandingSettings('services-recreation');
  const { data: businessData } = useLandingSettings('services-business');
  const { data: specialData } = useLandingSettings('services-special');
  const { data: ctaData } = useLandingSettings('services-cta');

  // Fetch service items by category
  const { data: accommodationItems = [] } = useServiceItemsByCategory('ACCOMMODATION');
  const { data: gastronomyItems = [] } = useServiceItemsByCategory('GASTRONOMY');
  const { data: recreationItems = [] } = useServiceItemsByCategory('RECREATION');
  const { data: businessItems = [] } = useServiceItemsByCategory('BUSINESS');
  const { data: specialItems = [] } = useServiceItemsByCategory('SPECIAL');

  // Apply configs with defaults
  const heroConfig = hydrateBrandColors((heroData?.config as ServicesHeroConfig) || defaultServicesHeroConfig);
  const accommodationConfig = hydrateBrandColors((accommodationData?.config as AccommodationSectionConfig) || defaultAccommodationSectionConfig);
  const gastronomyConfig = hydrateBrandColors((gastronomyData?.config as GastronomySectionConfig) || defaultGastronomySectionConfig);
  const recreationConfig = hydrateBrandColors((recreationData?.config as RecreationSectionConfig) || defaultRecreationSectionConfig);
  const businessConfig = hydrateBrandColors((businessData?.config as BusinessSectionConfig) || defaultBusinessSectionConfig);
  const specialConfig = hydrateBrandColors((specialData?.config as SpecialSectionConfig) || defaultSpecialSectionConfig);
  const ctaConfig = hydrateBrandColors((ctaData?.config as CTASectionConfig) || defaultCTASectionConfig);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div
          className="text-white py-16"
          style={{
            backgroundColor: heroConfig.backgroundColor,
            height: heroConfig.height,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: heroConfig.titleColor }}
            >
              {heroConfig.title}
            </h1>
            {heroConfig.subtitle && (
              <p
                className="text-xl max-w-3xl mx-auto"
                style={{ color: heroConfig.subtitleColor }}
              >
                {heroConfig.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Accommodation Services */}
        <section
          className="py-16"
          style={{ backgroundColor: accommodationConfig.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: accommodationConfig.titleColor }}
              >
                {accommodationConfig.title}
              </h2>
              {accommodationConfig.subtitle && (
                <p className="text-lg font-medium mb-2" style={{ color: accommodationConfig.subtitleColor }}>
                  {accommodationConfig.subtitle}
                </p>
              )}
              {accommodationConfig.description && (
                <p className="text-gray-700 max-w-3xl mx-auto">
                  {accommodationConfig.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {accommodationItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500 mb-2">{item.subtitle}</p>
                    )}
                    <p className="text-gray-700 mb-6">{item.description}</p>
                    {item.features && item.features.length > 0 && (
                      <ul className="text-gray-700 mb-6 space-y-2">
                        {item.features.map((feature: string, idx: number) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {accommodationConfig.showButton && accommodationConfig.buttonText && (
              <div className="mt-12 text-center">
                <Button
                  className="rounded-full px-8 py-3"
                  style={{
                    backgroundColor: accommodationConfig.buttonColor,
                    color: '#FFFFFF',
                  }}
                  asChild
                >
                  <a href="/acomodacoes">{accommodationConfig.buttonText}</a>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Gastronomy */}
        <section
          className="py-16"
          style={{ backgroundColor: gastronomyConfig.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: gastronomyConfig.titleColor }}
              >
                {gastronomyConfig.title}
              </h2>
              {gastronomyConfig.subtitle && (
                <p className="text-lg font-medium mb-2" style={{ color: gastronomyConfig.subtitleColor }}>
                  {gastronomyConfig.subtitle}
                </p>
              )}
              {gastronomyConfig.description && (
                <p className="text-gray-700 max-w-3xl mx-auto">
                  {gastronomyConfig.description}
                </p>
              )}
            </div>

            <div className="space-y-8">
              {gastronomyItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {item.image && (
                      <div className="md:col-span-1">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className={item.image ? "md:col-span-2" : "md:col-span-3"}>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-sm text-gray-500 mb-2">{item.subtitle}</p>
                      )}
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recreation and Wellness */}
        <section
          className="py-16"
          style={{ backgroundColor: recreationConfig.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: recreationConfig.titleColor }}
              >
                {recreationConfig.title}
              </h2>
              {recreationConfig.subtitle && (
                <p className="text-lg font-medium mb-2" style={{ color: recreationConfig.subtitleColor }}>
                  {recreationConfig.subtitle}
                </p>
              )}
              {recreationConfig.description && (
                <p className="text-gray-700 max-w-3xl mx-auto">
                  {recreationConfig.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recreationItems.map((item: any) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Business Services */}
        <section
          className="py-16"
          style={{ backgroundColor: businessConfig.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: businessConfig.titleColor }}
              >
                {businessConfig.title}
              </h2>
              {businessConfig.subtitle && (
                <p className="text-lg font-medium mb-2" style={{ color: businessConfig.subtitleColor }}>
                  {businessConfig.subtitle}
                </p>
              )}
              {businessConfig.description && (
                <p className="text-gray-700 max-w-3xl mx-auto mb-8">
                  {businessConfig.description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {businessItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <svg className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: businessConfig.titleColor }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {businessConfig.buttonText && (
              <div className="mt-8 text-center">
                <Button
                  className="rounded-full"
                  style={{
                    backgroundColor: businessConfig.buttonColor,
                    color: '#FFFFFF',
                  }}
                  asChild
                >
                  <a href={businessConfig.buttonUrl || '/contato'}>{businessConfig.buttonText}</a>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Special Services */}
        <section
          className="py-16"
          style={{ backgroundColor: specialConfig.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: specialConfig.titleColor }}
              >
                {specialConfig.title}
              </h2>
              {specialConfig.subtitle && (
                <p className="text-lg font-medium mb-2" style={{ color: specialConfig.subtitleColor }}>
                  {specialConfig.subtitle}
                </p>
              )}
              {specialConfig.description && (
                <p className="text-gray-700 max-w-3xl mx-auto">
                  {specialConfig.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {specialItems.map((item: any) => (
                <div key={item.id} className="text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      backgroundColor: specialConfig.iconBackgroundColor || '#EFF6FF',
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section
          className="py-16"
          style={{ backgroundColor: ctaConfig.backgroundColor }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: ctaConfig.titleColor }}
            >
              {ctaConfig.title}
            </h2>
            {ctaConfig.description && (
              <p
                className="text-xl mb-8 max-w-3xl mx-auto"
                style={{ color: ctaConfig.subtitleColor }}
              >
                {ctaConfig.description}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              {ctaConfig.primaryButtonText && (
                <Button
                  className="rounded-full px-8 py-3 text-lg"
                  style={{
                    backgroundColor: ctaConfig.primaryButtonColor,
                    color: ctaConfig.backgroundColor,
                  }}
                  asChild
                >
                  <a href={ctaConfig.primaryButtonUrl || '#'}>{ctaConfig.primaryButtonText}</a>
                </Button>
              )}

              {ctaConfig.secondaryButtonText && (
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-3 text-lg"
                  style={{
                    borderColor: ctaConfig.secondaryButtonColor,
                    color: ctaConfig.secondaryButtonColor,
                  }}
                  asChild
                >
                  <a href={ctaConfig.secondaryButtonUrl || '/contato'}>{ctaConfig.secondaryButtonText}</a>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
