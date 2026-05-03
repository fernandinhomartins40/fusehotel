import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MobileMenu } from './MobileMenu';
import { useLandingSettings } from '@/hooks/useLanding';
import { hydrateBrandColors } from '@/lib/brand-theme';
import { defaultHeaderConfig } from '@/types/landing-config';

interface HeaderProps {
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const { data: headerConfig } = useLandingSettings('header');
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccommodationsClick = () => {
    if (location.pathname === '/') {
      scrollToSection('accommodations');
      return;
    }
    navigate('/acomodacoes');
  };

  const headerTheme = hydrateBrandColors(headerConfig?.config || defaultHeaderConfig);

  const logo = headerTheme.logo || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png';
  const backgroundColor = headerTheme.backgroundColor || '#FFFFFF';
  const textColor = headerTheme.textColor || '#000000';
  const buttonText = headerConfig?.config?.buttonText || 'Área do cliente';
  const buttonBackground = headerTheme.buttonBackground || 'hsl(var(--primary))';
  const buttonHover = headerTheme.buttonHover || 'hsl(var(--primary-hover))';
  const buttonTextColor = headerTheme.buttonTextColor || 'hsl(var(--primary-foreground))';

  // When transparent and not scrolled: white text on transparent bg
  const isTransparentMode = transparent && !scrolled;
  const currentTextColor = isTransparentMode ? '#FFFFFF' : textColor;
  const currentBg = isTransparentMode ? 'transparent' : backgroundColor;

  return (
    <header
      className={`${transparent ? 'absolute inset-x-0 top-0' : 'sticky top-0'} z-50 transition-all duration-500 ${
        scrolled && transparent
          ? '!fixed inset-x-0 top-0 shadow-lg'
          : !transparent
            ? 'shadow-sm border-b border-gray-100'
            : ''
      }`}
      style={{
        backgroundColor: currentBg,
        backdropFilter: scrolled && transparent ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div className="page-container flex items-center justify-between gap-6 py-4 md:py-5">
        <div className="w-[210px] shrink-0">
          <Link to="/" className="inline-block transition-opacity hover:opacity-80">
            <img
              src={logo}
              alt="Logo"
              className={`transition-all duration-500 ${isTransparentMode ? 'h-14 brightness-0 invert' : 'h-11'}`}
            />
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10">
          {[
            { label: 'Acomodações', onClick: handleAccommodationsClick },
            { label: 'Serviços', to: '/servicos' },
            { label: 'Sobre Nós', to: '/sobre-nos' },
            { label: 'FAQ', to: '/faq' },
            { label: 'Contato', to: '/contato' },
          ].map((item) =>
            item.onClick ? (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="text-[13px] font-medium uppercase tracking-[1.5px] cursor-pointer transition-all duration-300 hover:opacity-70"
                style={{ color: currentTextColor }}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className="text-[13px] font-medium uppercase tracking-[1.5px] transition-all duration-300 hover:opacity-70"
                style={{ color: currentTextColor }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/area-do-cliente">
            <Button
              className={`hidden md:flex rounded-full px-6 py-2.5 items-center gap-2 transition-all duration-300 text-[13px] tracking-wide ${
                isTransparentMode
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm'
                  : 'shadow-sm hover:shadow-md'
              }`}
              style={isTransparentMode ? {} : {
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e) => !isTransparentMode && (e.currentTarget.style.backgroundColor = buttonHover)}
              onMouseLeave={(e) => !isTransparentMode && (e.currentTarget.style.backgroundColor = buttonBackground)}
            >
              <User size={15} />
              <span className="font-medium">{buttonText}</span>
            </Button>
          </Link>

          <Link to="/area-do-cliente" className="md:hidden">
            <Button
              className={`rounded-full p-2.5 transition-all duration-300 ${
                isTransparentMode
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                  : ''
              }`}
              style={isTransparentMode ? {} : {
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
            >
              <User size={15} />
            </Button>
          </Link>

          <MobileMenu isTransparent={isTransparentMode} />
        </div>
      </div>
    </header>
  );
};
