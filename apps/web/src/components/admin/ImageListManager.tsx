import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Trash2, GripVertical } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface ImageItem {
  id?: string;
  url: string;
  title?: string;
  subtitle?: string;
  alt?: string;
  order: number;
}

interface ImageListManagerProps {
  items: ImageItem[];
  onChange: (items: ImageItem[]) => void;
  category: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showAlt?: boolean;
}

export const ImageListManager = ({
  items,
  onChange,
  category,
  showTitle,
  showSubtitle,
  showAlt
}: ImageListManagerProps) => {
  const [adding, setAdding] = useState(false);

  const handleAddItem = () => {
    setAdding(true);
  };

  const handleImageUploaded = (url: string, fileId: string) => {
    const newItem: ImageItem = {
      id: fileId,
      url,
      title: '',
      subtitle: '',
      alt: '',
      order: items.length + 1
    };
    onChange([...items, newItem]);
    setAdding(false);
  };

  const handleUpdateItem = (index: number, field: keyof ImageItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    // Reordenar
    updated.forEach((item, i) => {
      item.order = i + 1;
    });
    onChange(updated);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }

    const updated = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    // Reordenar
    updated.forEach((item, i) => {
      item.order = i + 1;
    });

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Itens ({items.length})</h3>
        <Button type="button" onClick={handleAddItem} disabled={adding}>
          Adicionar Item
        </Button>
      </div>

      {adding && (
        <Card className="p-4">
          <Label>Upload de Imagem</Label>
          <ImageUploader
            category={category}
            onChange={handleImageUploaded}
            onRemove={() => setAdding(false)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setAdding(false)}
            className="mt-2"
          >
            Cancelar
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex gap-4">
              <div className="flex flex-col justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveItem(index, 'up')}
                  disabled={index === 0}
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-500 text-center">{index + 1}</span>
              </div>

              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.url}
                  alt={item.alt || item.title || 'Preview'}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="flex-1 space-y-2">
                {showTitle && (
                  <div>
                    <Label className="text-xs">Título</Label>
                    <Input
                      value={item.title || ''}
                      onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                      placeholder="Título do item"
                    />
                  </div>
                )}

                {showSubtitle && (
                  <div>
                    <Label className="text-xs">Subtítulo</Label>
                    <Input
                      value={item.subtitle || ''}
                      onChange={(e) => handleUpdateItem(index, 'subtitle', e.target.value)}
                      placeholder="Subtítulo do item"
                    />
                  </div>
                )}

                {showAlt && (
                  <div>
                    <Label className="text-xs">Texto Alternativo</Label>
                    <Input
                      value={item.alt || ''}
                      onChange={(e) => handleUpdateItem(index, 'alt', e.target.value)}
                      placeholder="Descrição da imagem"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {items.length === 0 && !adding && (
        <div className="text-center py-8 text-gray-500">
          Nenhum item adicionado. Clique em "Adicionar Item" para começar.
        </div>
      )}
    </div>
  );
};
