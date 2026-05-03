import React from 'react';
import { useHighlights, useLandingSettings } from '@/hooks/useLanding';
import { defaultHighlightsConfig } from '@/types/landing-config';

interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
}

export const HighlightsSection: React.FC = () => {
  const { data: settingsData } = useLandingSettings('highlights');
  const { data: highlights = [] } = useHighlights();

  const config = settingsData?.config || defaultHighlightsConfig;

  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <section
      id="highlights"
      className="page-section"
      style={{ backgroundColor: config.backgroundColor || '#0A0A0A' }}
    >
      <div className="page-container">
        <div className="text-center mb-16">
          {config.subtitle && (
            <span
              className="page-kicker"
              style={{ color: config.subtitleColor || 'rgba(255,255,255,0.5)' }}
            >
              {config.subtitle}
            </span>
          )}
          {config.title && (
            <h2
              className="section-title"
              style={{ color: config.titleColor || '#FFFFFF' }}
            >
              {config.title}
            </h2>
          )}
          {config.description && (
            <p
              className="text-base leading-relaxed max-w-2xl mx-auto mt-4"
              style={{ color: config.subtitleColor || 'rgba(255,255,255,0.5)' }}
            >
              {config.description}
            </p>
          )}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {highlights.map((highlight: Highlight, index: number) => {
            // First item spans full width on larger layouts if there's an odd number
            const isLarge = index === 0 && highlights.length % 2 !== 0;
            return (
              <div
                key={highlight.id}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                  isLarge ? 'md:col-span-2 h-[400px] md:h-[500px]' : 'h-[350px] md:h-[400px]'
                }`}
              >
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: config.overlayGradient || 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.05) 100%)'
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ color: config.cardTitleColor || '#FFFFFF' }}
                  >
                    {highlight.title}
                  </h4>
                  <p
                    className="text-base md:text-lg opacity-0 group-hover:opacity-80 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                    style={{ color: config.cardSubtitleColor || '#FFFFFF' }}
                  >
                    {highlight.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
