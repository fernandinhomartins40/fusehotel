import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAmenities } from '@/hooks/useAmenities';
import { Loader2 } from 'lucide-react';

interface AmenitiesSelectorProps {
  value: string[];
  onChange: (amenityIds: string[]) => void;
}

export function AmenitiesSelector({ value, onChange }: AmenitiesSelectorProps) {
  const { data: amenities, isLoading } = useAmenities();

  const handleToggle = (amenityId: string) => {
    const newAmenities = value.includes(amenityId)
      ? value.filter(id => id !== amenityId)
      : [...value, amenityId];
    onChange(newAmenities);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2">Carregando comodidades...</span>
      </div>
    );
  }

  if (!amenities || amenities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma comodidade disponível. Entre em contato com o administrador.
      </div>
    );
  }

  // Group amenities by category
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, typeof amenities>);

  const categoryLabels: Record<string, string> = {
    BEDROOM: 'Quarto',
    BATHROOM: 'Banheiro',
    ENTERTAINMENT: 'Entretenimento',
    KITCHEN: 'Cozinha',
    OUTDOOR: 'Área Externa',
    ACCESSIBILITY: 'Acessibilidade',
    GENERAL: 'Geral',
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
        <div key={category} className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">
            {categoryLabels[category] || category}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoryAmenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={value.includes(amenity.id)}
                  onCheckedChange={() => handleToggle(amenity.id)}
                />
                <Label
                  htmlFor={amenity.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                  {amenity.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {value.length > 0 && (
        <div className="pt-4 border-t">
          <Label className="text-sm font-medium">
            {value.length} comodidade{value.length > 1 ? 's' : ''} selecionada{value.length > 1 ? 's' : ''}
          </Label>
        </div>
      )}
    </div>
  );
}
