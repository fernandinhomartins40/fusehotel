
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';
import { AccommodationForm } from '@/components/admin/AccommodationForm';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Mock data for accommodations
const initialAccommodations = [
  {
    id: '1',
    name: 'Chalé de Luxo',
    type: 'Chalé',
    capacity: 4,
    price: 450,
    description: 'Chalé espaçoso com vista para o lago',
    image: '/lovable-uploads/1e861110-a179-4f1f-aa1a-caeb85c10609.png',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Suite Master',
    type: 'Suite',
    capacity: 2,
    price: 320,
    description: 'Suite com varanda e jacuzzi privativa',
    image: '/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Chalé Família',
    type: 'Chalé',
    capacity: 6,
    price: 680,
    description: 'Espaçoso chalé ideal para famílias',
    image: '/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png',
    isAvailable: false
  },
];

export function Accommodations() {
  const [accommodations, setAccommodations] = useState(initialAccommodations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<any>(null);

  const handleAddEditAccommodation = (accommodation: any) => {
    if (accommodation.id) {
      // Edit existing accommodation
      setAccommodations(accommodations.map(acc => 
        acc.id === accommodation.id ? accommodation : acc
      ));
      toast.success("Acomodação atualizada com sucesso!");
    } else {
      // Add new accommodation
      const newAccommodation = {
        ...accommodation,
        id: String(accommodations.length + 1),
      };
      setAccommodations([...accommodations, newAccommodation]);
      toast.success("Nova acomodação adicionada com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleEditClick = (accommodation: any) => {
    setCurrentAccommodation(accommodation);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentAccommodation(null);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAccommodations(accommodations.filter(acc => acc.id !== id));
    toast.success("Acomodação removida com sucesso!");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gerenciar Acomodações</h1>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Acomodação
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accommodations.map((accommodation) => (
                  <TableRow key={accommodation.id}>
                    <TableCell>
                      <div className="w-20 h-12 relative overflow-hidden rounded">
                        <AspectRatio ratio={16/9} className="bg-muted">
                          <img 
                            src={accommodation.image} 
                            alt={accommodation.name} 
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{accommodation.name}</TableCell>
                    <TableCell>{accommodation.type}</TableCell>
                    <TableCell>{accommodation.capacity} pessoas</TableCell>
                    <TableCell>{formatCurrency(accommodation.price)}</TableCell>
                    <TableCell>{accommodation.isAvailable ? 'Sim' : 'Não'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(accommodation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteClick(accommodation.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentAccommodation ? 'Editar Acomodação' : 'Adicionar Acomodação'}
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes da acomodação abaixo.
              </DialogDescription>
            </DialogHeader>
            <AccommodationForm 
              accommodation={currentAccommodation}
              onSubmit={handleAddEditAccommodation}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default Accommodations;
