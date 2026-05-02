import React from 'react';
import { usePartners, useLandingSettings } from '@/hooks/useLanding';
import { defaultPartnersConfig } from '@/types/landing-config';

interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
  isActive: boolean;
}

export const PartnersSection: React.FC = () => {
  const { data: settingsData } = useLandingSettings('partners');
  const { data: partners = [] } = usePartners();

  const config = settingsData?.config || defaultPartnersConfig;

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section
      className="page-section-tight"
      style={{
        background: config.backgroundGradient || 'linear-gradient(148deg, #05111D 0%, #0C3864 100%)'
      }}
    >
      <div className="page-container">
        {config.title && (
          <div className="text-center mb-10">
            <h2
              className="text-sm md:text-base uppercase tracking-[3px] font-medium"
              style={{ color: config.titleColor || '#FFFFFF' }}
            >
              {config.title}
            </h2>
          </div>
        )}
        <div className="flex justify-center items-center flex-wrap gap-8 md:gap-12 lg:gap-16">
          {partners.map((partner: Partner) => (
            <div key={partner.id} className="flex items-center justify-center">
              {partner.url ? (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-8 md:h-10 max-w-[170px] object-contain"
                    style={{
                      filter: config.logoFilter || 'none'
                    }}
                  />
                </a>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-8 md:h-10 max-w-[170px] object-contain"
                  style={{
                    filter: config.logoFilter || 'none'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
