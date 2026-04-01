import React from 'react';
import { Phone, MessageSquare, Mail, LayoutDashboard, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { useLandingSettings } from '@/hooks/useLanding';
import { defaultFooterConfig } from '@/types/landing-config';
import { hydrateBrandColors } from '@/lib/brand-theme';

export const Footer: React.FC = () => {
  const { data: footerConfig } = useLandingSettings('footer');
  const config = hydrateBrandColors(footerConfig?.config || defaultFooterConfig);

  return (
    <footer
      className="w-full text-white"
      style={{ backgroundColor: config.backgroundColor || '#000000' }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: About */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Link to="/">
                <img
                  src={config.logo || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png'}
                  alt="Logo"
                  className="h-12"
                />
              </Link>
            </div>
            <p className="mb-4" style={{ color: config.textColor || '#9CA3AF' }}>
              {config.aboutText || 'Bem-vindo ao nosso hotel, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem.'}
            </p>
            <div className="flex space-x-4 mt-2">
              {config.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  aria-label="Facebook"
                  className="transition-colors"
                  style={{ color: config.textColor || '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#FFFFFF'}
                >
                  <Facebook size={20} />
                </a>
              )}
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  aria-label="Instagram"
                  className="transition-colors"
                  style={{ color: config.textColor || '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EC4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#FFFFFF'}
                >
                  <Instagram size={20} />
                </a>
              )}
              {config.linkedinUrl && (
                <a
                  href={config.linkedinUrl}
                  aria-label="LinkedIn"
                  className="transition-colors"
                  style={{ color: config.textColor || '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#FFFFFF'}
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Links Rápidos */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl mb-4" style={{ color: config.headingColor || '#FFFFFF' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="transition-colors"
                  style={{ color: config.textColor || '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/acomodacoes"
                  className="transition-colors"
                  style={{ color: config.textColor || '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                >
                  Acomodações
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos"
                  className="transition-colors"
                  style={{ color: config.textColor || '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre-nos"
                  className="transition-colors"
                  style={{ color: config.textColor || '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="transition-colors"
                  style={{ color: config.textColor || '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                >
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="transition-colors"
                  style={{ color: config.textColor || '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contato */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl mb-4" style={{ color: config.headingColor || '#FFFFFF' }}>
              Contato
            </h3>
            <div className="space-y-3">
              {config.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="mt-1 flex-shrink-0" style={{ color: config.textColor || '#9CA3AF' }} />
                  <span style={{ color: config.textColor || '#9CA3AF' }}>{config.address}</span>
                </div>
              )}

              {config.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={18} style={{ color: config.textColor || '#9CA3AF' }} />
                  <a
                    href={`tel:${config.phone.replace(/\D/g, '')}`}
                    className="transition-colors"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {config.phone}
                  </a>
                </div>
              )}

              {config.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} style={{ color: config.textColor || '#9CA3AF' }} />
                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                    className="transition-colors"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {config.whatsapp}
                  </a>
                </div>
              )}

              {config.email && (
                <div className="flex items-center gap-2">
                  <Mail size={18} style={{ color: config.textColor || '#9CA3AF' }} />
                  <a
                    href={`mailto:${config.email}`}
                    className="transition-colors"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {config.email}
                  </a>
                </div>
              )}

              {config.businessHours && (
                <div className="flex items-start gap-2">
                  <Clock size={18} className="mt-1 flex-shrink-0" style={{ color: config.textColor || '#9CA3AF' }} />
                  <div style={{ color: config.textColor || '#9CA3AF' }} dangerouslySetInnerHTML={{ __html: config.businessHours.replace(/\n/g, '<br>') }} />
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Mapa */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl mb-4" style={{ color: config.headingColor || '#FFFFFF' }}>
              Localização
            </h3>
            <MapEmbed
              address={config.address || ''}
              height="192px"
            />
            {/* Admin Access Button */}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="bg-transparent border-white hover:bg-white hover:text-black" style={{ color: config.headingColor || '#FFFFFF' }} asChild>
                <Link to="/admin/login">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Acesso Hoteleiro
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t" style={{ borderColor: config.borderColor || '#1F2937' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm" style={{ color: config.copyrightColor || '#6B7280' }}>
              {config.copyright || `© ${new Date().getFullYear()} - TODOS OS DIREITOS RESERVADOS`}
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm" style={{ color: config.copyrightColor || '#6B7280' }}>
                <li>
                  <Link
                    to="/politicas-de-privacidade"
                    className="transition-colors"
                    style={{ color: config.copyrightColor || '#6B7280' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.copyrightColor || '#6B7280'}
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termos-de-uso"
                    className="transition-colors"
                    style={{ color: config.copyrightColor || '#6B7280' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.copyrightColor || '#6B7280'}
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/politicas-de-privacidade"
                    className="transition-colors"
                    style={{ color: config.copyrightColor || '#6B7280' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.copyrightColor || '#6B7280'}
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
