import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MobileMenu } from './MobileMenu';
import { useLandingSettings } from '@/hooks/useLanding';
import { hydrateBrandColors } from '@/lib/brand-theme';
import { defaultHeaderConfig } from '@/types/landing-config';

export const Header: React.FC = () => {
  const { data: headerConfig } = useLandingSettings('header');
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  // Default values
  const logo = headerTheme.logo || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png';
  const backgroundColor = headerTheme.backgroundColor || '#FFFFFF';
  const textColor = headerTheme.textColor || '#000000';
  const hoverColor = headerTheme.hoverColor || 'hsl(var(--primary))';
  const buttonText = headerConfig?.config?.buttonText || 'Área do cliente';
  const buttonBackground = headerTheme.buttonBackground || 'hsl(var(--primary))';
  const buttonHover = headerTheme.buttonHover || 'hsl(var(--primary-hover))';
  const buttonTextColor = headerTheme.buttonTextColor || 'hsl(var(--primary-foreground))';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'shadow-sm border-b border-gray-200/60'
          : 'border-b border-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? backgroundColor : backgroundColor,
        backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
      }}
    >
      <div className="page-container flex items-center justify-between gap-6 py-4 md:py-5">
        <div className="w-[210px] shrink-0">
          <Link to="/" className="inline-block transition-opacity hover:opacity-80">
            <img
              src={logo}
              alt="Logo"
              className="h-10 md:h-12"
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
                className="relative text-sm font-medium cursor-pointer transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                style={{
                  color: textColor,
                  ['--hover-color' as any]: hoverColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverColor;
                  (e.currentTarget.style as any)['--after-bg'] = hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textColor;
                }}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.to ? 'font-semibold' : ''
                }`}
                style={{ color: location.pathname === item.to ? hoverColor : textColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === item.to ? hoverColor : textColor}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/area-do-cliente">
            <Button
              className="hidden md:flex rounded-full px-5 py-2 items-center gap-2 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonBackground}
            >
              <User size={16} />
              <span className="font-medium">{buttonText}</span>
            </Button>
          </Link>

          <Link to="/area-do-cliente">
            <Button
              className="md:hidden rounded-full p-2 transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonBackground}
            >
              <User size={16} />
            </Button>
          </Link>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
