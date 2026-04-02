import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  useLandingSettings,
  useUpdateLandingSettings,
  useGalleryImagesAdmin,
  useCreateGalleryImage,
  useDeleteGalleryImage,
  useReorderGalleryImages
} from '@/hooks/useLanding';
import { GalleryConfig, defaultGalleryConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Trash2, GripVertical } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export const GalleryCustomizer = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('gallery');
  const { data: galleryImages = [], isLoading: imagesLoading } = useGalleryImagesAdmin();
  const updateSettings = useUpdateLandingSettings();
  const createImage = useCreateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const reorderImages = useReorderGalleryImages();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImageDescription, setNewImageDescription] = useState('');

  const config = settingsData?.config || defaultGalleryConfig;

  const form = useForm<GalleryConfig>({
    defaultValues: config,
    values: config,
  });

  const watchedValues = form.watch();

  useState(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  });

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  const onSubmit = (data: GalleryConfig) => {
    updateSettings.mutate(
      { section: 'gallery', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações da seção Galeria salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultGalleryConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  const handleUploadComplete = (files: Array<{ url: string; id: string }>) => {
    // Criar múltiplas imagens na galeria
    files.forEach((file) => {
      createImage.mutate({
        url: file.url,
        alt: newImageAlt || 'Imagem da Galeria',
        description: newImageDescription || undefined,
        isActive: true
      });
    });

    // Limpar campos
    setNewImageAlt('');
    setNewImageDescription('');
  };

  const handleDeleteImage = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta imagem da galeria?')) {
      deleteImage.mutate(id);
    }
  };

  if (settingsLoading || imagesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário de configuração */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configurações da Seção Galeria</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              type="button"
            >
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="GALERIA DE FOTOS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                {...form.register('subtitle')}
                placeholder="EXPLORE CADA DETALHE DO NOSSO RESORT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Veja as paisagens deslumbrantes, acomodações luxuosas e experiências incríveis que aguardam você."
                rows={3}
              />
            </div>

            <ColorPickerField
              label="Cor de Fundo"
              value={form.watch('backgroundColor') || '#FFFFFF'}
              onChange={(color) => form.setValue('backgroundColor', color)}
            />

            <ColorPickerField
              label="Cor do Título"
              value={form.watch('titleColor') || '#1D1D1F'}
              onChange={(color) => form.setValue('titleColor', color)}
            />

            <ColorPickerField
              label="Cor do Subtítulo"
              value={form.watch('subtitleColor') || '#676C76'}
              onChange={(color) => form.setValue('subtitleColor', color)}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Gerenciamento de Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens da Galeria</CardTitle>
          <p className="text-sm text-muted-foreground">
            Adicione, remova ou reordene as imagens da galeria
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload de novas imagens */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium">Adicionar Novas Imagens</h3>

            <div className="space-y-2">
              <Label htmlFor="image-alt">Texto Alternativo (Alt)</Label>
              <Input
                id="image-alt"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder="Ex: Vista da piscina do resort"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-description">Descrição (Opcional)</Label>
              <Textarea
                id="image-description"
                value={newImageDescription}
                onChange={(e) => setNewImageDescription(e.target.value)}
                placeholder="Descrição detalhada da imagem"
                rows={2}
              />
            </div>

            <ImageUploader
              category="LANDING_GALLERY"
              multiple={true}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          {/* Lista de imagens existentes */}
          {galleryImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Imagens Atuais ({galleryImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image: GalleryImage) => (
                  <div
                    key={image.id}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <p className="text-white text-xs text-center px-2">
                        {image.alt}
                      </p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deleteImage.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 bg-white/90 rounded px-2 py-1 text-xs font-medium">
                      #{image.order}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {galleryImages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma imagem na galeria. Adicione imagens usando o formulário acima.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview da seção */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Galeria</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real com as imagens atuais
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <section
              className="page-section"
              style={{
                backgroundColor: watchedValues.backgroundColor || '#FFFFFF',
              }}
            >
              <div className="page-container">
                <div className="text-left mb-10">
                  {watchedValues.subtitle && (
                    <h2
                      className="text-[13px] uppercase tracking-[2px] mb-2 font-normal"
                      style={{
                        color: watchedValues.subtitleColor || '#676C76',
                      }}
                    >
                      {watchedValues.subtitle}
                    </h2>
                  )}
                  {watchedValues.title && (
                    <h3
                      className="text-[56px] font-bold mb-4 tracking-tight leading-none uppercase"
                      style={{
                        color: watchedValues.titleColor || '#1D1D1F',
                      }}
                    >
                      {watchedValues.title}
                    </h3>
                  )}
                  {watchedValues.description && (
                    <p
                      className="text-base leading-relaxed max-w-2xl"
                      style={{
                        color: watchedValues.subtitleColor || '#676C76',
                      }}
                    >
                      {watchedValues.description}
                    </p>
                  )}
                </div>

                {galleryImages.length > 0 ? (
                  <div className="mt-10">
                    <Carousel
                      className="w-full"
                      setApi={setApi}
                      opts={{
                        align: "center",
                        loop: true,
                      }}
                    >
                      <CarouselContent>
                        {galleryImages.map((image: GalleryImage, index: number) => (
                          <CarouselItem key={image.id} className="basis-full">
                            <div className="p-1">
                              <div className="overflow-hidden rounded-[20px] shadow-xl">
                                <img
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4 bg-black/40 hover:bg-black/60 text-white border-none transition-all duration-300 hover:scale-110" />
                      <CarouselNext className="right-4 bg-black/40 hover:bg-black/60 text-white border-none transition-all duration-300 hover:scale-110" />
                    </Carousel>

                    {/* Dots Indicator */}
                    <div className="flex justify-center space-x-2 mt-6">
                      {galleryImages.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => scrollToSlide(index)}
                          className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            current === index
                              ? "bg-[#1D1D1F] scale-125"
                              : "bg-[#676C76]/30 hover:bg-[#676C76]/50"
                          )}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Functional Thumbnails */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
                      {galleryImages.map((image: GalleryImage, index: number) => (
                        <button
                          key={`thumb-${image.id}`}
                          onClick={() => scrollToSlide(index)}
                          className={cn(
                            "overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border-2",
                            current === index
                              ? "border-[#1D1D1F] scale-105"
                              : "border-transparent hover:border-[#676C76]/50"
                          )}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Image Counter */}
                    <div className="text-center mt-4">
                      <span
                        className="text-sm"
                        style={{
                          color: watchedValues.subtitleColor || '#676C76',
                        }}
                      >
                        {current + 1} de {galleryImages.length}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    Adicione imagens à galeria para visualizar o preview
                  </div>
                )}
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
