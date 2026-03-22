import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function SettingsImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'GENERAL');

      const response = await apiClient.post('/upload/single/GENERAL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFile = response.data.data;
      setPreview(uploadedFile.url);
      onChange(uploadedFile.url);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const removeImage = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium">{label}</p>}

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-md p-4 transition-colors cursor-pointer',
          isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isUploading && 'cursor-wait opacity-70'
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-4 text-muted-foreground text-sm">
            <Loader2 className="h-10 w-10 mb-2 animate-spin" />
            <p className="font-medium">Enviando imagem...</p>
          </div>
        ) : preview ? (
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
