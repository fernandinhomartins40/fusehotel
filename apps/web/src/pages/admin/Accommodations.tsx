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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Star, Loader2 } from 'lucide-react';
import { AccommodationForm } from '@/components/admin/AccommodationForm';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Accommodation, AccommodationFormData } from '@/types/accommodation';
import { useAccommodations } from '@/hooks/useAccommodations';
import {
  useCreateAccommodation,
  useUpdateAccommodation,
  useDeleteAccommodation
} from '@/hooks/useAccommodationMutations';

const accommodationTypeLabels: Record<string, string> = {
  ROOM: 'Quarto',
  SUITE: 'Suíte',
  CHALET: 'Chalé',
  VILLA: 'Vila',
  APARTMENT: 'Apartamento',
};

export function Accommodations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: accommodations, isLoading, error } = useAccommodations();
  const createMutation = useCreateAccommodation();
  const updateMutation = useUpdateAccommodation();
  const deleteMutation = useDeleteAccommodation();

  const handleAddEditAccommodation = (data: AccommodationFormData) => {
    if (currentAccommodation?.id) {
      // Edit existing accommodation
      updateMutation.mutate(
        { id: currentAccommodation.id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setCurrentAccommodation(null);
          }
        }
      );
    } else {
      // Add new accommodation
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setCurrentAccommodation(null);
        }
      });
    }
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
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        }
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Erro ao carregar acomodações</h2>
          <p className="text-gray-600">
            {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar as acomodações'}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Acomodações</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Carregando...' : `${accommodations?.length || 0} acomodações cadastradas`}
            </p>
          </div>
          <Button onClick={handleAddClick} size="lg">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Acomodação
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg">Carregando acomodações...</span>
            </CardContent>
          </Card>
        ) : accommodations && accommodations.length > 0 ? (
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
                            {accommodation.images && accommodation.images.length > 0 ? (
                              <img
                                src={accommodation.images[0].url}
                                alt={accommodation.images[0].alt}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                <span className="text-xs text-gray-400">Sem imagem</span>
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {accommodation.name}
                            {accommodation.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {accommodation.shortDescription || 'Sem descrição'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{accommodationTypeLabels[accommodation.type] || accommodation.type}</TableCell>
                      <TableCell>{accommodation.capacity} pessoas</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(Number(accommodation.pricePerNight))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={accommodation.isAvailable ? "default" : "secondary"}>
                          {accommodation.isAvailable ? 'Disponível' : 'Indisponível'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {accommodation.amenities && accommodation.amenities.length > 0 ? (
                            <>
                              {accommodation.amenities.slice(0, 2).map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {item.amenity.name}
                                </Badge>
                              ))}
                              {accommodation.amenities.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{accommodation.amenities.length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">Nenhuma</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                            onClick={() => handleDeleteClick(accommodation.id)}
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
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma acomodação cadastrada</h3>
              <p className="text-gray-600 mb-4">Comece adicionando sua primeira acomodação</p>
              <Button onClick={handleAddClick}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Acomodação
              </Button>
            </CardContent>
          </Card>
        )}

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
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A acomodação será permanentemente removida do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Removendo...' : 'Remover'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

export default Accommodations;
