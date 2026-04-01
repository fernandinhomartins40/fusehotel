import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MobileMenu } from './MobileMenu';
import { useLandingSettings } from '@/hooks/useLanding';

export const Header: React.FC = () => {
  const { data: headerConfig } = useLandingSettings('header');
  const location = useLocation();
  const navigate = useNavigate();

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

  // Default values
  const logo = headerConfig?.config?.logo || '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png';
  const backgroundColor = headerConfig?.config?.backgroundColor || '#FFFFFF';
  const textColor = headerConfig?.config?.textColor || '#000000';
  const hoverColor = headerConfig?.config?.hoverColor || '#0466C8';
  const buttonText = headerConfig?.config?.buttonText || 'Área do cliente';
  const buttonBackground = headerConfig?.config?.buttonBackground || '#0466C8';
  const buttonHover = headerConfig?.config?.buttonHover || '#0354A8';
  const buttonTextColor = headerConfig?.config?.buttonTextColor || '#FFFFFF';

  return (
    <header
      className="flex justify-between items-center px-4 md:px-12 lg:px-24 py-8 border-b border-gray-200"
      style={{ backgroundColor }}
    >
      <div className="w-[210px]">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-12"
          />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <button
          type="button"
          onClick={handleAccommodationsClick}
          className="text-base cursor-pointer transition-colors"
          style={{
            color: textColor,
            ['--hover-color' as any]: hoverColor
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
          onMouseLeave={(e) => e.currentTarget.style.color = textColor}
        >
          Acomodações
        </button>
        <Link
          to="/servicos"
          className="text-base transition-colors"
          style={{ color: textColor }}
          onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
          onMouseLeave={(e) => e.currentTarget.style.color = textColor}
        >
          Serviços
        </Link>
        <Link
          to="/sobre-nos"
          className="text-base transition-colors"
          style={{ color: textColor }}
          onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
          onMouseLeave={(e) => e.currentTarget.style.color = textColor}
        >
          Sobre Nós
        </Link>
        <Link
          to="/faq"
          className="text-base transition-colors"
          style={{ color: textColor }}
          onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
          onMouseLeave={(e) => e.currentTarget.style.color = textColor}
        >
          FAQ
        </Link>
        <Link
          to="/contato"
          className="text-base transition-colors"
          style={{ color: textColor }}
          onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
          onMouseLeave={(e) => e.currentTarget.style.color = textColor}
        >
          Contato
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/area-do-cliente">
          <Button
            className="hidden md:flex rounded-full px-6 py-2 items-center gap-2 transition-colors"
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonBackground}
          >
            <User size={18} />
            <span className="uppercase font-medium">{buttonText}</span>
          </Button>
        </Link>

        <Link to="/area-do-cliente">
          <Button
            className="md:hidden rounded-full p-2 transition-colors"
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonBackground}
          >
            <User size={18} />
          </Button>
        </Link>

        <MobileMenu />
      </div>
    </header>
  );
};
