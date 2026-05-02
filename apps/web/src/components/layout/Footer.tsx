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
      <div className="page-container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: About */}
          <div className="flex flex-col">
            <div className="mb-5">
              <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                <img
                  src={config.logo || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png'}
                  alt="Logo"
                  className="h-10"
                />
              </Link>
            </div>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: config.textColor || '#9CA3AF' }}>
              {config.aboutText || 'Bem-vindo ao nosso hotel, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem.'}
            </p>
            <div className="flex space-x-4">
              {config.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  aria-label="Facebook"
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: config.textColor || '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#FFFFFF'}
                >
                  <Facebook size={18} />
                </a>
              )}
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  aria-label="Instagram"
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: config.textColor || '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EC4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#FFFFFF'}
                >
                  <Instagram size={18} />
                </a>
              )}
              {config.linkedinUrl && (
                <a
                  href={config.linkedinUrl}
                  aria-label="LinkedIn"
                  className="transition-all duration-300 hover:scale-110"
                  style={{ color: config.textColor || '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#FFFFFF'}
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Links Rápidos */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-base mb-5 uppercase tracking-wider" style={{ color: config.headingColor || '#FFFFFF' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Início' },
                { to: '/acomodacoes', label: 'Acomodações' },
                { to: '/servicos', label: 'Serviços' },
                { to: '/sobre-nos', label: 'Sobre Nós' },
                { to: '/faq', label: 'Perguntas Frequentes' },
                { to: '/contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contato */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-base mb-5 uppercase tracking-wider" style={{ color: config.headingColor || '#FFFFFF' }}>
              Contato
            </h3>
            <div className="space-y-3.5">
              {config.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 opacity-60" style={{ color: config.textColor || '#9CA3AF' }} />
                  <span className="text-sm" style={{ color: config.textColor || '#9CA3AF' }}>{config.address}</span>
                </div>
              )}

              {config.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="opacity-60" style={{ color: config.textColor || '#9CA3AF' }} />
                  <a
                    href={`tel:${config.phone.replace(/\D/g, '')}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {config.phone}
                  </a>
                </div>
              )}

              {config.whatsapp && (
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={16} className="opacity-60" style={{ color: config.textColor || '#9CA3AF' }} />
                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {config.whatsapp}
                  </a>
                </div>
              )}

              {config.email && (
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="opacity-60" style={{ color: config.textColor || '#9CA3AF' }} />
                  <a
                    href={`mailto:${config.email}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {config.email}
                  </a>
                </div>
              )}

              {config.businessHours && (
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="mt-0.5 flex-shrink-0 opacity-60" style={{ color: config.textColor || '#9CA3AF' }} />
                  <div className="text-sm" style={{ color: config.textColor || '#9CA3AF' }} dangerouslySetInnerHTML={{ __html: config.businessHours.replace(/\n/g, '<br>') }} />
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Mapa */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-base mb-5 uppercase tracking-wider" style={{ color: config.headingColor || '#FFFFFF' }}>
              Localização
            </h3>
            <div className="rounded-xl overflow-hidden">
              <MapEmbed
                address={config.address || ''}
                height="180px"
              />
            </div>
            {/* Admin Access Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 hover:bg-white hover:text-black text-sm transition-all duration-300 rounded-lg"
                style={{ color: config.headingColor || '#FFFFFF' }}
                asChild
              >
                <Link to="/admin/login">
                  <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                  Acesso Hoteleiro
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t" style={{ borderColor: config.borderColor || 'rgba(255,255,255,0.08)' }}>
        <div className="page-container py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs" style={{ color: config.copyrightColor || '#6B7280' }}>
              {config.copyright || `© ${new Date().getFullYear()} - TODOS OS DIREITOS RESERVADOS`}
            </p>
            <ul className="flex space-x-5 text-xs" style={{ color: config.copyrightColor || '#6B7280' }}>
              {[
                { to: '/politicas-de-privacidade', label: 'Privacidade' },
                { to: '/termos-de-uso', label: 'Termos de Uso' },
                { to: '/politicas-de-privacidade', label: 'Cookies' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition-colors duration-200"
                    style={{ color: config.copyrightColor || '#6B7280' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.headingColor || '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.copyrightColor || '#6B7280'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
