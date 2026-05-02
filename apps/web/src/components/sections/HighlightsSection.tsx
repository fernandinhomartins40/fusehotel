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
      style={{ backgroundColor: config.backgroundColor || '#FFFFFF' }}
    >
      <div className="page-container">
        <div className="mb-12">
          {config.subtitle && (
            <span
              className="page-kicker"
              style={{ color: config.subtitleColor || '#676C76' }}
            >
              {config.subtitle}
            </span>
          )}
          {config.title && (
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight leading-none"
              style={{ color: config.titleColor || '#1D1D1F' }}
            >
              {config.title}
            </h2>
          )}
          {config.description && (
            <p
              className="text-base leading-relaxed max-w-2xl"
              style={{ color: config.subtitleColor || '#676C76' }}
            >
              {config.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
          {highlights.map((highlight: Highlight) => (
            <div key={highlight.id} className="relative overflow-hidden rounded-xl group cursor-pointer">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-[333px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-7 text-left transition-all duration-300"
                style={{
                  background: config.overlayGradient || 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1) 50%, transparent)'
                }}
              >
                <h4
                  className="text-3xl md:text-4xl font-bold mb-1 transition-transform duration-300 group-hover:translate-y-[-4px]"
                  style={{ color: config.cardTitleColor || '#FFFFFF' }}
                >
                  {highlight.title}
                </h4>
                <p
                  className="text-base opacity-90"
                  style={{ color: config.cardSubtitleColor || '#FFFFFF' }}
                >
                  {highlight.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
