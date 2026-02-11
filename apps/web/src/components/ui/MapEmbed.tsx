import React from 'react';
import { MapPin } from 'lucide-react';

interface MapEmbedProps {
  address: string;
  className?: string;
  height?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({
  address,
  className = '',
  height = '192px'
}) => {
  console.log('MapEmbed - Endereço recebido:', address);

  if (!address || address.trim() === '') {
    console.log('MapEmbed - Endereço vazio');
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 rounded-md ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-400">
          <MapPin size={32} className="mx-auto mb-2" />
          <span className="text-sm">Endereço não configurado</span>
        </div>
      </div>
    );
  }

  // Criar URL do Google Maps em modo embed (funciona sem API key)
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  console.log('MapEmbed - URL do Google Maps:', mapUrl);

  return (
    <div className={`rounded-md overflow-hidden ${className}`} style={{ height }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title="Mapa de Localização"
      />
    </div>
  );
};
