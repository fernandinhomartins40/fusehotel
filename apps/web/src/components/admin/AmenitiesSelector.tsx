
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface AmenitiesSelectorProps {
  value: string[];
  onChange: (amenities: string[]) => void;
}

const COMMON_AMENITIES = [
  'Wi-Fi gratuito',
  'Ar condicionado',
  'TV',
  'Frigobar',
  'Cofre',
  'Varanda',
  'Vista para o mar',
  'Vista para a montanha',
  'Banheira',
  'Chuveiro',
  'Secador de cabelo',
  'Roupões',
  'Chinelos',
  'Produtos de banho',
  'Serviço de quarto',
  'Café da manhã incluído',
  'Estacionamento gratuito',
  'Academia',
  'Piscina',
  'Spa',
  'Restaurante',
  'Bar'
];

export function AmenitiesSelector({ value, onChange }: AmenitiesSelectorProps) {
  const [customAmenity, setCustomAmenity] = React.useState('');

  const handleToggle = (amenity: string) => {
    const newAmenities = value.includes(amenity)
      ? value.filter(a => a !== amenity)
      : [...value, amenity];
    onChange(newAmenities);
  };

  const handleAddCustom = () => {
    if (customAmenity.trim() && !value.includes(customAmenity.trim())) {
      onChange([...value, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleRemove = (amenity: string) => {
    onChange(value.filter(a => a !== amenity));
  };

  return (
    <div className="space-y-4">
      <Label>Comodidades</Label>
      
      {/* Common amenities grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {COMMON_AMENITIES.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={amenity}
              checked={value.includes(amenity)}
              onCheckedChange={() => handleToggle(amenity)}
            />
            <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
          </div>
        ))}
      </div>

      {/* Custom amenity input */}
      <div className="flex gap-2">
        <Input
          placeholder="Adicionar comodidade personalizada"
          value={customAmenity}
          onChange={(e) => setCustomAmenity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
        />
        <Button type="button" variant="outline" onClick={handleAddCustom}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected amenities (custom ones with remove option) */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Comodidades selecionadas:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((amenity) => (
              <div
                key={amenity}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {amenity}
                {!COMMON_AMENITIES.includes(amenity) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => handleRemove(amenity)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
