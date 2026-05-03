import React from 'react';
import { Phone, MessageSquare, Mail, LayoutDashboard, MapPin, Clock, Facebook, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { useLandingSettings } from '@/hooks/useLanding';
import { defaultFooterConfig } from '@/types/landing-config';
import { hydrateBrandColors } from '@/lib/brand-theme';

export const Footer: React.FC = () => {
  const { data: footerConfig } = useLandingSettings('footer');
  const config = hydrateBrandColors(footerConfig?.config || defaultFooterConfig);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="w-full text-white relative"
      style={{ backgroundColor: config.backgroundColor || '#0A0A0A' }}
    >
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Main Footer Content */}
      <div className="page-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: About */}
          <div className="flex flex-col lg:col-span-1">
            <div className="mb-6">
              <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                <img
                  src={config.logo || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png'}
                  alt="Logo"
                  className="h-12 brightness-0 invert"
                />
              </Link>
            </div>
            <p className="mb-6 text-sm leading-[1.8]" style={{ color: config.textColor || '#9CA3AF' }}>
              {config.aboutText || 'Bem-vindo ao nosso hotel, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem.'}
            </p>
            <div className="flex gap-3">
              {config.facebookUrl && (
                <a href={config.facebookUrl} aria-label="Facebook"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                  style={{ color: config.textColor || '#9CA3AF' }}
                >
                  <Facebook size={16} />
                </a>
              )}
              {config.instagramUrl && (
                <a href={config.instagramUrl} aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                  style={{ color: config.textColor || '#9CA3AF' }}
                >
                  <Instagram size={16} />
                </a>
              )}
              {config.linkedinUrl && (
                <a href={config.linkedinUrl} aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                  style={{ color: config.textColor || '#9CA3AF' }}
                >
                  <Linkedin size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold mb-6 uppercase tracking-[3px]" style={{ color: config.headingColor || '#FFFFFF' }}>
              Navegação
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Início' },
                { to: '/acomodacoes', label: 'Acomodações' },
                { to: '/servicos', label: 'Serviços' },
                { to: '/sobre-nos', label: 'Sobre Nós' },
                { to: '/faq', label: 'FAQ' },
                { to: '/contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group text-sm transition-all duration-300 flex items-center gap-1 hover:gap-2"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold mb-6 uppercase tracking-[3px]" style={{ color: config.headingColor || '#FFFFFF' }}>
              Contato
            </h3>
            <div className="space-y-4">
              {config.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 opacity-40" />
                  <span className="text-sm leading-relaxed" style={{ color: config.textColor || '#9CA3AF' }}>{config.address}</span>
                </div>
              )}
              {config.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="opacity-40" />
                  <a href={`tel:${config.phone.replace(/\D/g, '')}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >{config.phone}</a>
                </div>
              )}
              {config.whatsapp && (
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="opacity-40" />
                  <a href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >{config.whatsapp}</a>
                </div>
              )}
              {config.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="opacity-40" />
                  <a href={`mailto:${config.email}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: config.textColor || '#9CA3AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.textColor || '#9CA3AF'}
                  >{config.email}</a>
                </div>
              )}
              {config.businessHours && (
                <div className="flex items-start gap-3">
                  <Clock size={16} className="mt-0.5 flex-shrink-0 opacity-40" />
                  <div className="text-sm leading-relaxed" style={{ color: config.textColor || '#9CA3AF' }} dangerouslySetInnerHTML={{ __html: config.businessHours.replace(/\n/g, '<br>') }} />
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Map */}
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold mb-6 uppercase tracking-[3px]" style={{ color: config.headingColor || '#FFFFFF' }}>
              Localização
            </h3>
            <div className="rounded-2xl overflow-hidden">
              <MapEmbed address={config.address || ''} height="180px" />
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/15 hover:bg-white hover:text-black text-xs transition-all duration-300 rounded-full"
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

      {/* Copyright */}
      <div className="border-t border-white/5">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] tracking-wide" style={{ color: config.copyrightColor || '#4B5563' }}>
              {config.copyright || `© ${new Date().getFullYear()} — TODOS OS DIREITOS RESERVADOS`}
            </p>
            <div className="flex items-center gap-6">
              <ul className="flex gap-6 text-[11px] tracking-wide">
                {[
                  { to: '/politicas-de-privacidade', label: 'Privacidade' },
                  { to: '/termos-de-uso', label: 'Termos' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition-colors duration-200"
                      style={{ color: config.copyrightColor || '#4B5563' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = config.copyrightColor || '#4B5563'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Back to top */}
              <button
                onClick={scrollToTop}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
