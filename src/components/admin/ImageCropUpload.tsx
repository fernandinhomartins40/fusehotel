
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Image, Crop, UploadCloud } from 'lucide-react';
import ReactCrop, { Crop as CropType } from 'react-image-crop';
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
}

export function ImageCropUpload({
  value,
  onChange,
  label,
  className,
  aspectRatio,
  cropWidth,
  cropHeight,
  cropDescription,
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 90,
    height: aspectRatio ? 90 / aspectRatio : 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<CropType | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCurrentImage(result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

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

  // Generate crop preview
  const getCroppedImg = useCallback(async () => {
    if (!imageRef.current || !completedCrop) return;

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Set output canvas dimensions to match desired crop size if specified
    canvas.width = cropWidth || completedCrop.width * scaleX;
    canvas.height = cropHeight || completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // As a blog
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg', 0.92);
    });
  }, [completedCrop, cropWidth, cropHeight]);

  const applyImageCrop = async () => {
    try {
      const croppedImage = await getCroppedImg();
      if (croppedImage) {
        setPreview(croppedImage);
        onChange(croppedImage);
      }
    } catch (e) {
      console.error('Error applying crop:', e);
    }
    setCropDialogOpen(false);
  };

  const dimensionsText = cropWidth && cropHeight 
    ? `Dimensões recomendadas: ${cropWidth}x${cropHeight}px` 
    : aspectRatio 
      ? `Proporção: ${aspectRatio}:1` 
      : 'Sem restrições de dimensão';

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md transition-colors cursor-pointer",
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
              className="max-h-40 mx-auto object-contain p-2"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCropDialogOpen(true);
                    setCurrentImage(preview);
                  }}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                >
                  Recortar
                </button>
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-muted-foreground text-sm">
            <UploadCloud className="h-10 w-10 mb-2" />
            <p className="font-medium">Arraste uma imagem ou clique para selecionar</p>
            <p className="text-xs">{dimensionsText}</p>
            {cropDescription && <p className="text-xs text-muted-foreground mt-1">{cropDescription}</p>}
          </div>
        )}
      </div>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recortar Imagem</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">{dimensionsText}</p>
            {currentImage && (
              <ReactCrop 
                crop={crop} 
                onChange={(c) => setCrop(c)} 
                onComplete={(c) => setCompletedCrop(c)}
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
            <Button variant="outline" onClick={() => setCropDialogOpen(false)}>Cancelar</Button>
            <Button onClick={applyImageCrop}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
