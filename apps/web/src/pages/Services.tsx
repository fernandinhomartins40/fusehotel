import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useLandingSettings,
  useServiceItemsByCategory
} from '@/hooks/useLanding';
import { hydrateBrandColors, resolveHeroColor } from '@/lib/brand-theme';
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
  const { data: heroData } = useLandingSettings('services-hero');
  const { data: accommodationData } = useLandingSettings('services-accommodation');
  const { data: gastronomyData } = useLandingSettings('services-gastronomy');
  const { data: recreationData } = useLandingSettings('services-recreation');
  const { data: businessData } = useLandingSettings('services-business');
  const { data: specialData } = useLandingSettings('services-special');
  const { data: ctaData } = useLandingSettings('services-cta');

  const { data: accommodationItems = [] } = useServiceItemsByCategory('ACCOMMODATION');
  const { data: gastronomyItems = [] } = useServiceItemsByCategory('GASTRONOMY');
  const { data: recreationItems = [] } = useServiceItemsByCategory('RECREATION');
  const { data: businessItems = [] } = useServiceItemsByCategory('BUSINESS');
  const { data: specialItems = [] } = useServiceItemsByCategory('SPECIAL');

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
          className="text-white page-section-hero relative overflow-hidden"
          style={{
            backgroundColor: resolveHeroColor(heroConfig.backgroundColor),
            height: heroConfig.height,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
          <div className="page-container text-center relative">
            <span className="page-kicker opacity-80" style={{ color: heroConfig.subtitleColor }}>
              O que oferecemos
            </span>
            <h1
              className="page-title mb-5"
              style={{ color: heroConfig.titleColor }}
            >
              {heroConfig.title}
            </h1>
            {heroConfig.subtitle && (
              <p
                className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto opacity-90"
                style={{ color: heroConfig.subtitleColor }}
              >
                {heroConfig.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Accommodation Services */}
        <section
          className="page-section"
          style={{ backgroundColor: accommodationConfig.backgroundColor }}
        >
          <div className="page-container">
            <div className="text-center mb-14">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: accommodationConfig.titleColor }}
              >
                {accommodationConfig.title}
              </h2>
              {accommodationConfig.subtitle && (
                <p className="text-base font-medium mb-2" style={{ color: accommodationConfig.subtitleColor }}>
                  {accommodationConfig.subtitle}
                </p>
              )}
              {accommodationConfig.description && (
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {accommodationConfig.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
              {accommodationItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden card-hover border-0 shadow-sm">
                  <div className="h-56 img-zoom">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-7">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.description}</p>
                    {item.features && item.features.length > 0 && (
                      <ul className="text-gray-600 text-sm space-y-1.5">
                        {item.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                            {feature}
                          </li>
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
                  className="rounded-full px-8 py-3 transition-all duration-300 hover:shadow-md"
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
          className="page-section"
          style={{ backgroundColor: gastronomyConfig.backgroundColor }}
        >
          <div className="page-container">
            <div className="text-center mb-12">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: gastronomyConfig.titleColor }}
              >
                {gastronomyConfig.title}
              </h2>
              {gastronomyConfig.subtitle && (
                <p className="text-base font-medium mb-2" style={{ color: gastronomyConfig.subtitleColor }}>
                  {gastronomyConfig.subtitle}
                </p>
              )}
              {gastronomyConfig.description && (
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {gastronomyConfig.description}
                </p>
              )}
            </div>

            <div className="space-y-5">
              {gastronomyItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm card-hover">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {item.image && (
                      <div className="md:col-span-1 img-zoom rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className={item.image ? "md:col-span-2 flex flex-col justify-center" : "md:col-span-3"}>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recreation and Wellness */}
        <section
          className="page-section"
          style={{ backgroundColor: recreationConfig.backgroundColor }}
        >
          <div className="page-container">
            <div className="text-center mb-14">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: recreationConfig.titleColor }}
              >
                {recreationConfig.title}
              </h2>
              {recreationConfig.subtitle && (
                <p className="text-base font-medium mb-2" style={{ color: recreationConfig.subtitleColor }}>
                  {recreationConfig.subtitle}
                </p>
              )}
              {recreationConfig.description && (
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {recreationConfig.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {recreationItems.map((item: any) => (
                <Card key={item.id} className="card-hover border-0 shadow-sm overflow-hidden">
                  <div className="h-48 img-zoom">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Business Services */}
        <section
          className="page-section"
          style={{ backgroundColor: businessConfig.backgroundColor }}
        >
          <div className="page-container">
            <div className="text-center mb-12">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: businessConfig.titleColor }}
              >
                {businessConfig.title}
              </h2>
              {businessConfig.subtitle && (
                <p className="text-base font-medium mb-2" style={{ color: businessConfig.subtitleColor }}>
                  {businessConfig.subtitle}
                </p>
              )}
              {businessConfig.description && (
                <p className="text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                  {businessConfig.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {businessItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm card-hover">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center">
                      <svg className="h-4 w-4" style={{ color: businessConfig.titleColor }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {businessConfig.buttonText && (
              <div className="mt-10 text-center">
                <Button
                  className="rounded-full transition-all duration-300 hover:shadow-md"
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
          className="page-section"
          style={{ backgroundColor: specialConfig.backgroundColor }}
        >
          <div className="page-container">
            <div className="text-center mb-14">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: specialConfig.titleColor }}
              >
                {specialConfig.title}
              </h2>
              {specialConfig.subtitle && (
                <p className="text-base font-medium mb-2" style={{ color: specialConfig.subtitleColor }}>
                  {specialConfig.subtitle}
                </p>
              )}
              {specialConfig.description && (
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {specialConfig.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
              {specialItems.map((item: any) => (
                <div key={item.id} className="text-center group">
                  <div
                    className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: specialConfig.iconBackgroundColor || '#EFF6FF',
                      width: '72px',
                      height: '72px',
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-9 h-9 object-contain"
                      />
                    )}
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section
          className="page-section-tight"
          style={{ backgroundColor: ctaConfig.backgroundColor }}
        >
          <div className="page-container text-center">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: ctaConfig.titleColor }}
            >
              {ctaConfig.title}
            </h2>
            {ctaConfig.description && (
              <p
                className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed"
                style={{ color: ctaConfig.subtitleColor }}
              >
                {ctaConfig.description}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              {ctaConfig.primaryButtonText && (
                <Button
                  className="rounded-full px-8 py-3 text-base transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
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
                  className="rounded-full px-8 py-3 text-base transition-all duration-300"
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
