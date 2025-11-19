import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageCropUpload } from './ImageCropUpload';
import { Plus, X, MoveUp, MoveDown } from 'lucide-react';

interface MultiImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function MultiImageUpload({ value, onChange, maxImages = 10 }: MultiImageUploadProps) {
  const handleImageAdd = (newImage: string) => {
    if (value.length < maxImages) {
      onChange([...value, newImage]);
    }
  };

  const handleImageUpdate = (index: number, updatedImage: string) => {
    const newImages = [...value];
    newImages[index] = updatedImage;
    onChange(newImages);
  };

  const handleImageRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleImageMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }

    const newImages = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Galeria de Imagens ({value.length}/{maxImages})</Label>
        {value.length === 0 && (
          <span className="text-sm text-red-500">Pelo menos uma imagem é obrigatória</span>
        )}
      </div>

      {/* Existing images */}
      <div className="grid gap-4">
        {value.map((image, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">
                Imagem {index + 1} {index === 0 && '(Principal)'}
              </Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleImageMove(index, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleImageMove(index, 'down')}
                  disabled={index === value.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleImageRemove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ImageCropUpload
              value={image}
              onChange={(newImage) => handleImageUpdate(index, newImage)}
              aspectRatio={16/9}
              cropWidth={800}
              cropHeight={450}
            />
          </div>
        ))}
      </div>

      {/* Add new image */}
      {value.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <ImageCropUpload
            value=""
            onChange={handleImageAdd}
            aspectRatio={16/9}
            cropWidth={800}
            cropHeight={450}
            cropDescription="Adicione mais imagens para criar uma galeria completa"
          />
        </div>
      )}

      {value.length >= maxImages && (
        <p className="text-sm text-gray-500">
          Limite máximo de {maxImages} imagens atingido
        </p>
      )}
    </div>
  );
}
