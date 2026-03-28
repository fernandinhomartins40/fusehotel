import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, UploadCloud } from 'lucide-react';
import ReactCrop, { Crop as CropType } from 'react-image-crop';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspectRatio?: number;
  cropWidth?: number;
  cropHeight?: number;
  cropDescription?: string;
  uploadCategory?: string;
}

const getInitialCrop = (aspectRatio?: number): CropType => ({
  unit: '%',
  width: 90,
  height: aspectRatio ? 90 / aspectRatio : 90,
  x: 5,
  y: 5,
});

export function ImageCropUpload({
  value,
  onChange,
  label,
  className,
  aspectRatio,
  cropWidth,
  cropHeight,
  cropDescription,
  uploadCategory = 'GENERAL',
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>(getInitialCrop(aspectRatio));
  const [completedCrop, setCompletedCrop] = useState<CropType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCurrentImage(result);
      setCrop(getInitialCrop(aspectRatio));
      setCompletedCrop(null);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  }, [aspectRatio]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
    noClick: true,
    noKeyboard: true,
  });

  const removeImage = () => {
    setPreview(null);
    onChange('');
  };

  const getCroppedBlob = useCallback(async (): Promise<Blob> => {
    if (!imageRef.current || !completedCrop) {
      throw new Error('Selecione uma area valida para recorte.');
    }

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = cropWidth || completedCrop.width * scaleX;
    canvas.height = cropHeight || completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Nao foi possivel processar a imagem.');
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Nao foi possivel gerar a imagem recortada.'));
          return;
        }

        resolve(blob);
      }, 'image/jpeg', 0.85);
    });
  }, [completedCrop, cropHeight, cropWidth]);

  const uploadCroppedImage = useCallback(async (blob: Blob) => {
    const formData = new FormData();
    formData.append(
      'file',
      new File([blob], `${uploadCategory.toLowerCase()}-${Date.now()}.jpg`, { type: 'image/jpeg' })
    );
    formData.append('category', uploadCategory);

    const response = await apiClient.post(`/upload/single/${uploadCategory}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data as { url: string };
  }, [uploadCategory]);

  const applyImageCrop = async () => {
    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedBlob();
      const uploadedFile = await uploadCroppedImage(croppedBlob);

      setPreview(uploadedFile.url);
      onChange(uploadedFile.url);
      toast.success('Imagem enviada com sucesso!');
      setCropDialogOpen(false);
      setCurrentImage(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Erro ao processar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const dimensionsText = cropWidth && cropHeight
    ? `Dimensoes recomendadas: ${cropWidth}x${cropHeight}px`
    : aspectRatio
      ? `Proporcao: ${aspectRatio}:1`
      : 'Sem restricoes de dimensao';

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 mx-auto object-contain p-2 border-2 border-dashed rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentImage(preview);
                  setCrop(getInitialCrop(aspectRatio));
                  setCompletedCrop(null);
                  setCropDialogOpen(true);
                }}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                disabled={isUploading}
              >
                Recortar
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  open();
                }}
                className="bg-slate-700 text-white px-2 py-1 rounded text-xs"
                disabled={isUploading}
              >
                Substituir
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage();
                }}
                className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs"
                disabled={isUploading}
              >
                Remover
              </button>
            </div>
          </div>
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          onClick={open}
          className={cn(
            'border-2 border-dashed rounded-md transition-colors cursor-pointer',
            isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isUploading && 'cursor-wait opacity-70'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center p-4 text-muted-foreground text-sm">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 mb-2 animate-spin" />
                <p className="font-medium">Enviando imagem...</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 mb-2" />
                <p className="font-medium">Arraste uma imagem ou clique para selecionar</p>
                <p className="text-xs">{dimensionsText}</p>
                {cropDescription && <p className="text-xs text-muted-foreground mt-1">{cropDescription}</p>}
              </>
            )}
          </div>
        </div>
      )}

      <Dialog
        open={cropDialogOpen}
        onOpenChange={(openState) => {
          if (!isUploading) {
            setCropDialogOpen(openState);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recortar Imagem</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">{dimensionsText}</p>
            {currentImage && (
              <ReactCrop
                crop={crop}
                onChange={(nextCrop) => setCrop(nextCrop)}
                onComplete={(nextCrop) => setCompletedCrop(nextCrop)}
                aspect={aspectRatio}
                className="max-h-[60vh] overflow-auto"
              >
                <img
                  ref={imageRef}
                  src={currentImage}
                  alt="Imagem para recorte"
                  className="max-w-full"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropDialogOpen(false)} disabled={isUploading}>
              Cancelar
            </Button>
            <Button onClick={applyImageCrop} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Aplicar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
