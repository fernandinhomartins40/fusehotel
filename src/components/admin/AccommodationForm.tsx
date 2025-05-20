
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface AccommodationFormProps {
  accommodation?: any;
  onSubmit: (data: any) => void;
}

export function AccommodationForm({ accommodation, onSubmit }: AccommodationFormProps) {
  // Default values
  const defaultValues = {
    id: accommodation?.id || '',
    name: accommodation?.name || '',
    type: accommodation?.type || '',
    capacity: accommodation?.capacity || 2,
    price: accommodation?.price || 0,
    description: accommodation?.description || '',
    image: accommodation?.image || '/placeholder.svg',
    isAvailable: accommodation?.isAvailable !== undefined ? accommodation.isAvailable : true,
  };
  
  // RHF setup
  const form = useForm({
    defaultValues
  });

  // Mock image options (in a real app, this would be from file upload)
  const imageOptions = [
    '/lovable-uploads/1e861110-a179-4f1f-aa1a-caeb85c10609.png',
    '/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png',
    '/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png',
    '/lovable-uploads/6cff717e-9bcc-4de2-8466-11400c267a66.png',
  ];

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Acomodação</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
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
                <FormControl>
                  <Input placeholder="Chalé, Suite, etc." {...field} />
                </FormControl>
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
                    placeholder="Quantidade de pessoas" 
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço por noite (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Valor em reais" 
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva a acomodação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                {imageOptions.map((image) => (
                  <div 
                    key={image}
                    className={`border-2 rounded cursor-pointer p-2 ${field.value === image ? 'border-primary' : 'border-muted'}`}
                    onClick={() => field.onChange(image)}
                  >
                    <img 
                      src={image} 
                      alt="Option" 
                      className="h-20 w-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Disponível para reservas</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit">
            {accommodation ? 'Salvar Alterações' : 'Adicionar Acomodação'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
