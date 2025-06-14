
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Star, Eye } from 'lucide-react';
import { AccommodationForm } from '@/components/admin/AccommodationForm';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Accommodation } from '@/types/accommodation';
import { AccommodationFormData } from '@/lib/validations/accommodation';

// Mock data atualizado
const initialAccommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Chalé de Luxo',
    type: 'Chalé',
    capacity: 4,
    price: 450,
    description: 'Chalé espaçoso com vista para o lago',
    shortDescription: 'Chalé espaçoso com vista para o lago',
    images: ['/lovable-uploads/1e861110-a179-4f1f-aa1a-caeb85c10609.png'],
    amenities: ['Wi-Fi gratuito', 'Ar condicionado', 'Vista para o mar'],
    isAvailable: true,
    featured: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    location: {
      floor: 'Térreo',
      view: 'Lago',
      area: 45
    }
  },
  {
    id: '2',
    name: 'Suite Master',
    type: 'Suite',
    capacity: 2,
    price: 320,
    description: 'Suite com varanda e jacuzzi privativa',
    shortDescription: 'Suite com varanda e jacuzzi',
    images: ['/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png'],
    amenities: ['Wi-Fi gratuito', 'Banheira', 'Varanda'],
    isAvailable: true,
    featured: false,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    location: {
      floor: '1º andar',
      view: 'Jardim',
      area: 32
    }
  },
  {
    id: '3',
    name: 'Chalé Família',
    type: 'Chalé',
    capacity: 6,
    price: 680,
    description: 'Espaçoso chalé ideal para famílias',
    shortDescription: 'Espaçoso chalé ideal para famílias',
    images: ['/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png'],
    amenities: ['Wi-Fi gratuito', 'Ar condicionado', 'Cozinha completa'],
    isAvailable: false,
    featured: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    location: {
      floor: 'Térreo',
      view: 'Montanha',
      area: 65
    }
  },
];

export function Accommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>(initialAccommodations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);

  const handleAddEditAccommodation = (data: AccommodationFormData) => {
    if (currentAccommodation?.id) {
      // Edit existing accommodation
      const updatedAccommodation: Accommodation = {
        id: currentAccommodation.id,
        ...data,
      };
      setAccommodations(accommodations.map(acc => 
        acc.id === currentAccommodation.id ? updatedAccommodation : acc
      ));
      toast.success("Acomodação atualizada com sucesso!");
    } else {
      // Add new accommodation
      const newAccommodation: Accommodation = {
        id: String(accommodations.length + 1),
        ...data,
      };
      setAccommodations([...accommodations, newAccommodation]);
      toast.success("Nova acomodação adicionada com sucesso!");
    }
    setIsDialogOpen(false);
    setCurrentAccommodation(null);
  };

  const handleEditClick = (accommodation: Accommodation) => {
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
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Acomodações</h1>
            <p className="text-gray-600 mt-1">
              {accommodations.length} acomodações cadastradas
            </p>
          </div>
          <Button onClick={handleAddClick} size="lg">
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
                  <TableHead>Status</TableHead>
                  <TableHead>Comodidades</TableHead>
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
                            src={accommodation.images[0]} 
                            alt={accommodation.name} 
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {accommodation.name}
                          {accommodation.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {accommodation.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{accommodation.type}</TableCell>
                    <TableCell>{accommodation.capacity} pessoas</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(accommodation.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={accommodation.isAvailable ? "default" : "secondary"}>
                        {accommodation.isAvailable ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {accommodation.amenities.slice(0, 2).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {accommodation.amenities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{accommodation.amenities.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {/* View details */}}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(accommodation)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteClick(accommodation.id!)}
                          className="text-red-600 hover:text-red-700"
                          title="Excluir"
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
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentAccommodation ? 'Editar Acomodação' : 'Adicionar Acomodação'}
              </DialogTitle>
              <DialogDescription>
                {currentAccommodation 
                  ? 'Modifique os detalhes da acomodação abaixo.'
                  : 'Preencha os detalhes da nova acomodação.'
                }
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
