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

  // Se não houver highlights, não renderizar a seção
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
        <div className="text-left">
          {config.subtitle && (
            <h2
              className="text-[13px] uppercase tracking-[2px] mb-2 font-normal"
              style={{ color: config.subtitleColor || '#676C76' }}
            >
              {config.subtitle}
            </h2>
          )}
          {config.title && (
            <h3
              className="text-[56px] font-bold mb-4 tracking-tight leading-none uppercase"
              style={{ color: config.titleColor || '#1D1D1F' }}
            >
              {config.title}
            </h3>
          )}
          {config.description && (
            <p
              className="text-base leading-relaxed mb-10 max-w-2xl"
              style={{ color: config.subtitleColor || '#676C76' }}
            >
              {config.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {highlights.map((highlight: Highlight) => (
            <div key={highlight.id} className="relative overflow-hidden rounded-[5px]">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-[333px] object-cover"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-6 text-left"
                style={{
                  background: config.overlayGradient || 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                }}
              >
                <h4
                  className="text-4xl font-bold mb-1"
                  style={{ color: config.cardTitleColor || '#FFFFFF' }}
                >
                  {highlight.title}
                </h4>
                <p
                  className="text-lg"
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
