import { useCallback, useRef, useState } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ImageCropUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  category?: string;
  aspect?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  className?: string;
  placeholder?: string;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function cropAndCompress(
  image: HTMLImageElement,
  crop: PixelCrop,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const srcW = crop.width * scaleX;
  const srcH = crop.height * scaleY;

  let outW = srcW;
  let outH = srcH;
  if (outW > maxWidth) {
    outH = (maxWidth / outW) * outH;
    outW = maxWidth;
  }
  if (outH > maxHeight) {
    outW = (maxHeight / outH) * outW;
    outH = maxHeight;
  }

  canvas.width = Math.round(outW);
  canvas.height = Math.round(outH);

  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    srcW,
    srcH,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvasToBlob(canvas, 'image/webp', quality);
}

export function ImageCropUploader({
  value,
  onChange,
  category = 'GENERAL',
  aspect = 1,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.82,
  className,
  placeholder = 'Clique para enviar imagem',
}: ImageCropUploaderProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result as string);
      setIsCropOpen(true);
      setCrop(undefined);
      setCompletedCrop(undefined);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const size = Math.min(width, height);
      const x = (width - size) / 2;
      const y = (height - size) / 2;
      const initialCrop: Crop = {
        unit: 'px',
        x,
        y,
        width: aspect >= 1 ? size : size * aspect,
        height: aspect >= 1 ? size / aspect : size,
      };
      setCrop(initialCrop);
    },
    [aspect],
  );

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) {
      toast.error('Selecione a área de corte');
      return;
    }

    setUploading(true);
    try {
      const blob = await cropAndCompress(imgRef.current, completedCrop, maxWidth, maxHeight, quality);
      if (!blob) {
        toast.error('Erro ao processar imagem');
        return;
      }

      const formData = new FormData();
      formData.append('file', blob, 'product.webp');
      formData.append('category', category);

      const response = await apiClient.post(`/upload/single/${category}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = response.data.data;
      onChange(uploaded.url);
      setIsCropOpen(false);
      setImgSrc('');
      toast.success('Imagem enviada com sucesso');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className={cn('relative', className)}>
          <div className="relative overflow-hidden rounded-lg border-2 border-slate-200">
            <img src={value} alt="Produto" className="h-40 w-full object-cover" />
            <div className="absolute right-1 top-1 flex gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-7 w-7"
                onClick={handleRemove}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-slate-400 hover:bg-slate-100',
            className,
          )}
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm">{placeholder}</span>
          <span className="text-xs text-slate-400">PNG, JPG ou WEBP</span>
        </button>
      )}

      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recortar imagem</DialogTitle>
            <DialogDescription>
              Ajuste a área de corte. A imagem será comprimida automaticamente em formato leve (WebP).
            </DialogDescription>
          </DialogHeader>

          {imgSrc && (
            <div className="flex flex-col items-center gap-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Cortar"
                  onLoad={onImageLoad}
                  className="max-h-[60vh]"
                />
              </ReactCrop>

              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCropOpen(false)} disabled={uploading}>
                  Cancelar
                </Button>
                <Button onClick={handleCropConfirm} disabled={uploading || !completedCrop}>
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmar e enviar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
