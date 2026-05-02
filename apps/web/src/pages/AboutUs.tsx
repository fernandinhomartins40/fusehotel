import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AwardIcon } from '@/lib/award-icons';
import { useLandingSettings, useTeamMembers, useAwards } from '@/hooks/useLanding';
import { hydrateBrandColors, resolveHeroColor } from '@/lib/brand-theme';
import {
  defaultAboutHeroConfig,
  defaultHistorySectionConfig,
  defaultMissionVisionValuesConfig,
  defaultTeamSectionConfig,
  defaultAwardsSectionConfig,
  TeamMember,
  Award,
} from '@/types/about-config';

const AboutUs: React.FC = () => {
  const { data: heroData } = useLandingSettings('about-hero');
  const { data: historyData } = useLandingSettings('about-history');
  const { data: mvvData } = useLandingSettings('about-mission-vision-values');
  const { data: teamData } = useLandingSettings('about-team');
  const { data: awardsData } = useLandingSettings('about-awards');

  const { data: teamMembers = [] } = useTeamMembers();
  const { data: awards = [] } = useAwards();

  const heroConfig = hydrateBrandColors(heroData?.config || defaultAboutHeroConfig);
  const historyConfig = hydrateBrandColors(historyData?.config || defaultHistorySectionConfig);
  const mvvConfig = hydrateBrandColors(mvvData?.config || defaultMissionVisionValuesConfig);
  const teamConfig = hydrateBrandColors(teamData?.config || defaultTeamSectionConfig);
  const awardsConfig = hydrateBrandColors(awardsData?.config || defaultAwardsSectionConfig);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div
          className="text-white page-section-hero relative overflow-hidden"
          style={{
            backgroundColor: resolveHeroColor(heroConfig.backgroundColor),
            height: heroConfig.height || '400px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
          <div className="page-container text-center relative">
            <span className="page-kicker opacity-80" style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}>
              Nossa história
            </span>
            <h1
              className="page-title mb-4"
              style={{ color: heroConfig.titleColor || '#FFFFFF' }}
            >
              {heroConfig.title || 'Sobre Nós'}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mx-auto max-w-3xl opacity-90"
              style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}
            >
              {heroConfig.description || 'Descrição'}
            </p>
          </div>
        </div>

        {/* History Section */}
        <section
          className="page-container page-section"
          style={{ backgroundColor: historyConfig.backgroundColor || '#FFFFFF' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: historyConfig.titleColor || 'hsl(var(--primary))' }}
              >
                {historyConfig.title || 'Nossa História'}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed" style={{ color: historyConfig.subtitleColor || '#666666' }}>
                  {historyConfig.paragraph1}
                </p>
                <p className="leading-relaxed" style={{ color: historyConfig.subtitleColor || '#666666' }}>
                  {historyConfig.paragraph2}
                </p>
                <p className="leading-relaxed" style={{ color: historyConfig.subtitleColor || '#666666' }}>
                  {historyConfig.paragraph3}
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg h-96 img-zoom">
              <img
                src={historyConfig.image || 'https://images.unsplash.com/photo-1472396961693-142e6e269027'}
                alt="Vista do Hotel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section
          className="page-section"
          style={{ backgroundColor: mvvConfig.backgroundColor || '#F9F9F9' }}
        >
          <div className="page-container">
            <h2
              className="text-2xl md:text-3xl font-bold mb-12 text-center"
              style={{ color: mvvConfig.titleColor || 'hsl(var(--primary))' }}
            >
              {mvvConfig.title || 'Missão, Visão e Valores'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
              <div className="bg-white p-8 rounded-xl shadow-sm card-hover">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: mvvConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {mvvConfig.missionTitle || 'Missão'}
                </h3>
                <p className="text-gray-600 leading-relaxed">{mvvConfig.missionText}</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm card-hover">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: mvvConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {mvvConfig.visionTitle || 'Visão'}
                </h3>
                <p className="text-gray-600 leading-relaxed">{mvvConfig.visionText}</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm card-hover">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: mvvConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {mvvConfig.valuesTitle || 'Valores'}
                </h3>
                <ul className="text-gray-600 space-y-2">
                  {(mvvConfig.valuesItems || []).map((value, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: mvvConfig.subtitleColor || 'hsl(var(--primary))' }} />
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section
          className="page-container page-section"
          style={{ backgroundColor: teamConfig.backgroundColor || '#FFFFFF' }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold mb-12 text-center"
            style={{ color: teamConfig.titleColor || 'hsl(var(--primary))' }}
          >
            {teamConfig.title || 'Nossa Equipe'}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${teamConfig.gridColumns || 3} gap-8 stagger-children`}
          >
            {teamMembers.map((member: TeamMember) => (
              <div key={member.id} className="flex flex-col items-center group">
                <div className="w-44 h-44 rounded-full overflow-hidden mb-5 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: teamConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {member.role}
                </p>
                <p className="text-gray-600 text-center text-sm max-w-xs leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards Section */}
        <section
          className="page-section"
          style={{ backgroundColor: awardsConfig.backgroundColor || '#F9F9F9' }}
        >
          <div className="page-container">
            <h2
              className="text-2xl md:text-3xl font-bold mb-12 text-center"
              style={{ color: awardsConfig.titleColor || 'hsl(var(--primary))' }}
            >
              {awardsConfig.title || 'Reconhecimentos e Prêmios'}
            </h2>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${awardsConfig.gridColumns || 4} gap-6 stagger-children`}
            >
              {awards.map((award: Award) => (
                <div
                  key={award.id}
                  className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center card-hover"
                >
                  <div
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/8"
                    style={{ color: awardsConfig.titleColor || 'hsl(var(--primary))' }}
                  >
                    <AwardIcon
                      value={award.icon}
                      className="h-7 w-7"
                      fallbackClassName="text-3xl leading-none"
                    />
                  </div>
                  <h3 className="text-base font-bold mb-2">{award.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
