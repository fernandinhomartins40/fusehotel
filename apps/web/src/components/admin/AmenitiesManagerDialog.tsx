import React from 'react';
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { type Amenity, type AmenityCategory } from '@/types/accommodation';
import { amenityIconOptions, getAmenityIcon } from '@/lib/amenity-icons';
import { useCreateAmenity, useDeleteAmenity, useUpdateAmenity } from '@/hooks/useAmenityMutations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const categoryLabels: Record<AmenityCategory, string> = {
  BEDROOM: 'Quarto',
  BATHROOM: 'Banheiro',
  ENTERTAINMENT: 'Entretenimento',
  KITCHEN: 'Cozinha',
  OUTDOOR: '?rea externa',
  ACCESSIBILITY: 'Acessibilidade',
  GENERAL: 'Geral',
};

const initialFormState = {
  name: '',
  icon: 'sparkles',
  category: 'GENERAL' as AmenityCategory,
  description: '',
};

interface AmenitiesManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amenities: Amenity[];
}

export function AmenitiesManagerDialog({
  open,
  onOpenChange,
  amenities,
}: AmenitiesManagerDialogProps) {
  const [editingAmenityId, setEditingAmenityId] = React.useState<string | null>(null);
  const [formState, setFormState] = React.useState(initialFormState);

  const createAmenity = useCreateAmenity();
  const updateAmenity = useUpdateAmenity();
  const deleteAmenity = useDeleteAmenity();

  const SelectedIcon = getAmenityIcon(formState.icon);

  const resetForm = React.useCallback(() => {
    setEditingAmenityId(null);
    setFormState(initialFormState);
  }, []);

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const startEditing = (amenity: Amenity) => {
    setEditingAmenityId(amenity.id);
    setFormState({
      name: amenity.name,
      icon: amenity.icon,
      category: amenity.category,
      description: amenity.description || '',
    });
  };

  const handleSave = async () => {
    const payload = {
      name: formState.name.trim(),
      icon: formState.icon,
      category: formState.category,
      description: formState.description.trim() || undefined,
    };

    if (!payload.name) {
      return;
    }

    if (editingAmenityId) {
      await updateAmenity.mutateAsync({ id: editingAmenityId, payload });
    } else {
      await createAmenity.mutateAsync(payload);
    }

    resetForm();
  };

  const isSaving = createAmenity.isPending || updateAmenity.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Gerenciar comodidades</DialogTitle>
          <DialogDescription>
            Cadastre, edite e escolha o ?cone de cada comodidade usada nos quartos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingAmenityId ? 'Editar comodidade' : 'Nova comodidade'}
                </h3>
                <p className="text-xs text-slate-500">
                  Defina nome, categoria e ?cone exibido no cadastro.
                </p>
              </div>
              {editingAmenityId && (
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amenity-name">Nome</Label>
                <Input
                  id="amenity-name"
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ex: Ar-condicionado"
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) =>
                    setFormState((prev) => ({ ...prev, category: value as AmenityCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenity-description">Descri??o</Label>
                <Textarea
                  id="amenity-description"
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Opcional"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>?cone</Label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                    <SelectedIcon className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-slate-600">
                    {amenityIconOptions.find((option) => option.value === formState.icon)?.label || 'Selecione um ?cone'}
                  </div>
                </div>
                <ScrollArea className="h-56 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {amenityIconOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formState.icon === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormState((prev) => ({ ...prev, icon: option.value }))}
                          className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-xs leading-tight">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex gap-2">
                <Button type="button" onClick={handleSave} disabled={isSaving || !formState.name.trim()}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingAmenityId ? 'Salvar altera??es' : 'Criar comodidade'}
                </Button>
                {editingAmenityId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={async () => {
                      await deleteAmenity.mutateAsync(editingAmenityId);
                      resetForm();
                    }}
                    disabled={deleteAmenity.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Comodidades cadastradas</h3>
                <p className="text-xs text-slate-500">{amenities.length} itens dispon?veis para sele??o.</p>
              </div>
            </div>

            <ScrollArea className="h-[64vh] rounded-2xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-100">
                {amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity.icon);

                  return (
                    <div key={amenity.id} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-900">{amenity.name}</div>
                          <div className="truncate text-xs text-slate-500">
                            {categoryLabels[amenity.category]} ? {amenity.description || amenity.icon}
                          </div>
                        </div>
                      </div>

                      <Button type="button" variant="ghost" size="sm" onClick={() => startEditing(amenity)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
