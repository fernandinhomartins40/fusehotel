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
          className="text-white page-section-hero"
          style={{
            backgroundColor: resolveHeroColor(heroConfig.backgroundColor),
            height: heroConfig.height || '400px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="page-container text-center">
            <h1
              className="page-title mb-4"
              style={{ color: heroConfig.titleColor || '#FFFFFF' }}
            >
              {heroConfig.title || 'Sobre Nós'}
            </h1>
            <p
              className="page-lead mx-auto max-w-3xl"
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
                className="text-3xl font-bold mb-6"
                style={{ color: historyConfig.titleColor || 'hsl(var(--primary))' }}
              >
                {historyConfig.title || 'Nossa História'}
              </h2>
              <p
                className="mb-4"
                style={{ color: historyConfig.subtitleColor || '#666666' }}
              >
                {historyConfig.paragraph1}
              </p>
              <p
                className="mb-4"
                style={{ color: historyConfig.subtitleColor || '#666666' }}
              >
                {historyConfig.paragraph2}
              </p>
              <p style={{ color: historyConfig.subtitleColor || '#666666' }}>
                {historyConfig.paragraph3}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <img
                src={historyConfig.image || 'https://images.unsplash.com/photo-1472396961693-142e6e269027'} 
                alt="Vista do Hotel Águas Claras" 
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
              className="text-3xl font-bold mb-12 text-center"
              style={{ color: mvvConfig.titleColor || 'hsl(var(--primary))' }}
            >
              {mvvConfig.title || 'Missão, Visão e Valores'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: mvvConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {mvvConfig.missionTitle || 'Missão'}
                </h3>
                <p className="text-gray-700">{mvvConfig.missionText}</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: mvvConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {mvvConfig.visionTitle || 'Visão'}
                </h3>
                <p className="text-gray-700">{mvvConfig.visionText}</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: mvvConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {mvvConfig.valuesTitle || 'Valores'}
                </h3>
                <ul className="text-gray-700 list-disc pl-5 space-y-2">
                  {(mvvConfig.valuesItems || []).map((value, index) => (
                    <li key={index}>{value}</li>
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
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: teamConfig.titleColor || 'hsl(var(--primary))' }}
          >
            {teamConfig.title || 'Nossa Equipe'}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${teamConfig.gridColumns || 3} gap-8`}
          >
            {teamMembers.map((member: TeamMember) => (
              <div key={member.id} className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p
                  className="mb-3"
                  style={{ color: teamConfig.subtitleColor || 'hsl(var(--primary))' }}
                >
                  {member.role}
                </p>
                <p className="text-gray-700 text-center max-w-xs">
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
              className="text-3xl font-bold mb-12 text-center"
              style={{ color: awardsConfig.titleColor || 'hsl(var(--primary))' }}
            >
              {awardsConfig.title || 'Reconhecimentos e Prêmios'}
            </h2>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${awardsConfig.gridColumns || 4} gap-6`}
            >
              {awards.map((award: Award) => (
                <div
                  key={award.id}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                >
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                    style={{ color: awardsConfig.titleColor || 'hsl(var(--primary))' }}
                  >
                    <AwardIcon
                      value={award.icon}
                      className="h-8 w-8"
                      fallbackClassName="text-4xl leading-none"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{award.title}</h3>
                  <p className="text-gray-700">{award.description}</p>
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
