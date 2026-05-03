import React from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAmenities } from '@/hooks/useAmenities';
import { AmenitiesManagerDialog } from './AmenitiesManagerDialog';
import { getAmenityIcon } from '@/lib/amenity-icons';

interface AmenitiesSelectorProps {
  value: string[];
  onChange: (amenityIds: string[]) => void;
}

export function AmenitiesSelector({ value, onChange }: AmenitiesSelectorProps) {
  const { data: amenities, isLoading } = useAmenities();
  const [managerOpen, setManagerOpen] = React.useState(false);

  const handleToggle = (amenityId: string) => {
    const newAmenities = value.includes(amenityId)
      ? value.filter((id) => id !== amenityId)
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
      <>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-gray-500">
          <p>Nenhuma comodidade cadastrada ainda.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => setManagerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar comodidade
          </Button>
        </div>
        <AmenitiesManagerDialog open={managerOpen} onOpenChange={setManagerOpen} amenities={[]} />
      </>
    );
  }

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
    OUTDOOR: '?rea externa',
    ACCESSIBILITY: 'Acessibilidade',
    GENERAL: 'Geral',
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900">Comodidades dispon?veis</div>
            <div className="text-sm text-slate-500">
              {amenities.length} comodidades cadastradas para uso nos quartos.
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => setManagerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Gerenciar comodidades
          </Button>
        </div>

        {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
          <div key={category} className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">
              {categoryLabels[category] || category}
            </Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {categoryAmenities.map((amenity) => {
                const Icon = getAmenityIcon(amenity.icon);

                return (
                  <div
                    key={amenity.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                      value.includes(amenity.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Checkbox
                      id={amenity.id}
                      checked={value.includes(amenity.id)}
                      onCheckedChange={() => handleToggle(amenity.id)}
                      className="mt-1"
                    />
                    <Label htmlFor={amenity.id} className="flex cursor-pointer items-start gap-3 text-sm font-normal">
                      <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="space-y-1">
                        <span className="block font-medium text-slate-900">{amenity.name}</span>
                        {amenity.description && (
                          <span className="block text-xs leading-relaxed text-slate-500">{amenity.description}</span>
                        )}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {value.length > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium">
              {value.length} comodidade{value.length > 1 ? 's' : ''} selecionada{value.length > 1 ? 's' : ''}
            </Label>
          </div>
        )}
      </div>
      <AmenitiesManagerDialog open={managerOpen} onOpenChange={setManagerOpen} amenities={amenities} />
    </>
  );
}
