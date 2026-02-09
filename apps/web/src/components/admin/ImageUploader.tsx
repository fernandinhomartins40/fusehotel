import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  category: string;
  value?: string;
  onChange: (url: string, fileId: string) => void;
  onRemove?: () => void;
  multiple?: false;
  className?: string;
}

interface MultiImageUploaderProps {
  category: string;
  onUploadComplete: (files: Array<{ url: string; id: string }>) => void;
  multiple: true;
  className?: string;
}

type Props = ImageUploaderProps | MultiImageUploaderProps;

export const ImageUploader = (props: Props) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    !props.multiple && props.value ? props.value : null
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();

      if (props.multiple) {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
      } else {
        formData.append('file', files[0]);
      }

      formData.append('category', props.category);

      const endpoint = props.multiple
        ? `/landing/admin/gallery/upload/${props.category}`
        : `/upload/single/${props.category}`;

      const response = await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFile = response.data.data;

      if (!props.multiple && uploadedFile) {
        setPreview(uploadedFile.url);
        props.onChange(uploadedFile.url, uploadedFile.id);
        toast.success('Imagem enviada com sucesso!');
      } else if (props.multiple && Array.isArray(uploadedFile)) {
        props.onUploadComplete(uploadedFile.map((f: any) => ({ url: f.url, id: f.id })));
        toast.success(`${uploadedFile.length} imagem(ns) enviada(s) com sucesso!`);
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (!props.multiple && props.onRemove) {
      props.onRemove();
    }
  };

  if (!props.multiple && preview) {
    return (
      <div className={cn("relative", props.className)}>
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", props.className)}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id={`upload-${props.category}`}
          multiple={props.multiple}
        />
        <label
          htmlFor={`upload-${props.category}`}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          {uploading ? (
            <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-3" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
              <ImageIcon className="h-6 w-6 text-gray-400 mb-2" />
            </div>
          )}
          <p className="mt-2 text-sm font-medium text-gray-700">
            {uploading ? 'Enviando...' : 'Clique para fazer upload'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG ou WEBP (máx. 5MB)
          </p>
          {props.multiple && (
            <p className="text-xs text-blue-600 mt-1">
              Múltiplas imagens permitidas
            </p>
          )}
        </label>
      </div>
    </div>
  );
};
