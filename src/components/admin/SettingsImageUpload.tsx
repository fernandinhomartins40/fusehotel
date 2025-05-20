
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function SettingsImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // In a real application, you would upload this file to a server
      // For now, we'll just create a local preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  const removeImage = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-4 transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-muted" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 mx-auto object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-muted-foreground text-sm">
            <UploadCloud className="h-10 w-10 mb-2" />
            <p className="font-medium">Arraste uma imagem ou clique para selecionar</p>
            <p className="text-xs">PNG, JPG, GIF até 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
