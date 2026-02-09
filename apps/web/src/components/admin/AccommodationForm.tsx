import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { accommodationSchema, AccommodationFormData } from '@/lib/validations/accommodation';
import { AmenitiesSelector } from './AmenitiesSelector';
import { MultiImageUpload } from './MultiImageUpload';
import { Accommodation } from '@/types/accommodation';
import { Badge } from '@/components/ui/badge';

interface AccommodationFormProps {
  accommodation?: Accommodation | null;
  onSubmit: (data: AccommodationFormData) => void;
  isLoading?: boolean;
}

const accommodationTypes = [
  { value: 'ROOM', label: 'Quarto' },
  { value: 'SUITE', label: 'Suíte' },
  { value: 'CHALET', label: 'Chalé' },
  { value: 'VILLA', label: 'Vila' },
  { value: 'APARTMENT', label: 'Apartamento' },
] as const;

export function AccommodationForm({ accommodation, onSubmit, isLoading }: AccommodationFormProps) {
  const form = useForm<AccommodationFormData>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      name: accommodation?.name || '',
      type: accommodation?.type || 'SUITE',
      capacity: accommodation?.capacity || 2,
      pricePerNight: accommodation?.pricePerNight || 0,
      description: accommodation?.description || '',
      shortDescription: accommodation?.shortDescription || '',
      images: accommodation?.images || [],
      amenityIds: accommodation?.amenities?.map(a => a.amenity.id) || [],
      floor: accommodation?.floor || undefined,
      view: accommodation?.view || '',
      area: accommodation?.area || undefined,
      checkInTime: accommodation?.checkInTime || '15:00',
      checkOutTime: accommodation?.checkOutTime || '11:00',
      extraBeds: accommodation?.extraBeds || 0,
      maxExtraBeds: accommodation?.maxExtraBeds || 0,
      extraBedPrice: accommodation?.extraBedPrice || 0,
      cancellationPolicy: accommodation?.cancellationPolicy || '',
      metaTitle: accommodation?.metaTitle || '',
      metaDescription: accommodation?.metaDescription || '',
      keywords: accommodation?.keywords || [],
      isAvailable: accommodation?.isAvailable !== undefined ? accommodation.isAvailable : true,
      isFeatured: accommodation?.isFeatured || false,
    }
  });

  const watchedImages = form.watch('images');
  const watchedAmenityIds = form.watch('amenityIds');

  const handleFormSubmit = (data: AccommodationFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="amenities">Comodidades</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais da acomodação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Acomodação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Chalé de Luxo Vista Mar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accommodationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por noite (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Resumida</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descrição curta para listagem"
                          maxLength={200}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Máximo 200 caracteres - aparece nos cards de listagem
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Disponível para reservas</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Acomodação em destaque</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes Avançados</CardTitle>
                <CardDescription>
                  Informações adicionais sobre a acomodação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Completa</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição detalhada da acomodação..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Andar</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 1, 2, 3..."
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="view"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vista</FormLabel>
                        <FormControl>
                          <Input placeholder="Mar, Montanha, Jardim..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkInTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário Check-in</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOutTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário Check-out</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="extraBeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Camas Extra Atuais</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxExtraBeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máx. Camas Extra</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="extraBedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Cama Extra (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Política de Cancelamento</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva a política de cancelamento..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comodidades</CardTitle>
                <CardDescription>
                  Selecione as comodidades disponíveis na acomodação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="amenityIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AmenitiesSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Imagens</CardTitle>
                <CardDescription>
                  Adicione fotos da acomodação. A primeira imagem será a principal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          maxImages={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO e Marketing</CardTitle>
                <CardDescription>
                  Otimização para mecanismos de busca e marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título SEO</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Título para SEO (máx. 60 caracteres)"
                          maxLength={60}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/60 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição SEO</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição para SEO (máx. 160 caracteres)"
                          maxLength={160}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/160 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palavras-chave</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hospedagem, luxo, vista mar (separadas por vírgula)"
                          {...field}
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => {
                            const keywords = e.target.value
                              .split(',')
                              .map(k => k.trim())
                              .filter(k => k);
                            field.onChange(keywords);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Separe as palavras-chave por vírgula
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary/Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Imagens:</strong> {watchedImages.length} adicionadas
              </div>
              <div>
                <strong>Comodidades:</strong> {watchedAmenityIds.length} selecionadas
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Salvando...' : accommodation ? 'Salvar Alterações' : 'Adicionar Acomodação'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
