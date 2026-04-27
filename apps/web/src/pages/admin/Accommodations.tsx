import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { ArrowRight, BedDouble, Edit, Loader2, Plus, Star, Trash } from 'lucide-react';
import { AccommodationForm } from '@/components/admin/AccommodationForm';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Accommodation, AccommodationFormData } from '@/types/accommodation';
import { useAccommodations } from '@/hooks/useAccommodations';
import {
  useCreateAccommodation,
  useDeleteAccommodation,
  useUpdateAccommodation,
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

  const { data: accommodations, isLoading, error } = useAccommodations({ adminView: true });
  const createMutation = useCreateAccommodation();
  const updateMutation = useUpdateAccommodation();
  const deleteMutation = useDeleteAccommodation();

  const publishedCount = useMemo(
    () => (accommodations || []).filter((item) => item.isPublishedOnSite).length,
    [accommodations]
  );

  const handleAddEditAccommodation = (data: AccommodationFormData) => {
    if (currentAccommodation?.id) {
      updateMutation.mutate(
        { id: currentAccommodation.id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setCurrentAccommodation(null);
          },
        }
      );
      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setCurrentAccommodation(null);
      },
    });
  };

  const handleEditClick = (accommodation: Accommodation) => {
    setCurrentAccommodation(accommodation);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 text-red-600">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold">Erro ao carregar tipos de hospedagem</h2>
          <p className="text-gray-600">
            {(error as any)?.response?.data?.message ||
              'Ocorreu um erro ao carregar os tipos de hospedagem.'}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tipos de hospedagem do site</h1>
            <p className="mt-1 text-gray-600">
              Catálogo comercial usado no site, nas reservas e no inventário operacional.
            </p>
          </div>
          <Button onClick={() => {
            setCurrentAccommodation(null);
            setIsDialogOpen(true);
          }} size="lg">
            <Plus className="mr-2 h-4 w-4" /> Novo tipo de hospedagem
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total cadastrado</CardDescription>
              <CardTitle>{isLoading ? '...' : accommodations?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Publicado no site</CardDescription>
              <CardTitle>{isLoading ? '...' : publishedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Regra de publicação</CardDescription>
              <CardTitle className="text-base text-blue-950">
                Só aparece no site quando o tipo está disponível e possui ao menos 1 quarto físico ativo.
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg">Carregando tipos de hospedagem...</span>
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
                    <TableHead>Site</TableHead>
                    <TableHead>Quartos físicos</TableHead>
                    <TableHead>Comodidades</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accommodations.map((accommodation) => (
                    <TableRow key={accommodation.id}>
                      <TableCell>
                        <div className="relative h-12 w-20 overflow-hidden rounded">
                          <AspectRatio ratio={16 / 9} className="bg-muted">
                            {accommodation.images && accommodation.images.length > 0 ? (
                              <img
                                src={accommodation.images[0].url}
                                alt={accommodation.images[0].alt}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                <span className="text-xs text-gray-400">Sem imagem</span>
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-medium">
                            {accommodation.name}
                            {accommodation.isFeatured && (
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
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
                        {accommodation.isPublishedOnSite ? (
                          <Badge variant="default">Publicado</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="secondary">Fora do site</Badge>
                            <div className="text-xs text-muted-foreground">
                              {!accommodation.isAvailable ? 'Tipo indisponível' : 'Sem quarto físico ativo'}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{accommodation.activeRoomUnitCount || 0} ativos</div>
                          <div className="text-xs text-muted-foreground">
                            {accommodation.totalRoomUnitCount || 0} cadastrados
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-40 flex-wrap gap-1">
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
                          <Button asChild variant="outline" size="sm">
                            <Link to="/admin/room-units">
                              <BedDouble className="mr-2 h-4 w-4" /> Quartos
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(accommodation)} title="Editar">
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
              <div className="mb-4 text-gray-400">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Nenhum tipo de hospedagem cadastrado</h3>
              <p className="mb-4 text-gray-600">Comece criando a categoria que será vendida no site.</p>
              <Button onClick={() => {
                setCurrentAccommodation(null);
                setIsDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Criar primeiro tipo de hospedagem
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Fluxo unificado</CardTitle>
            <CardDescription>
              O site vende tipos de hospedagem. A operação usa quartos físicos vinculados a esses tipos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4">
              <div className="font-medium">1. Cadastre o tipo</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Nome, preço, capacidade, imagens e descrição que serão exibidos no site.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">2. Vincule quartos físicos</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Cada quarto real deve apontar para um tipo de hospedagem desta tela.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">3. Publicação automática</div>
              <p className="mt-2 text-sm text-muted-foreground">
                O site só oferece tipos com pelo menos um quarto ativo e disponibilidade comercial.
              </p>
            </div>
            <div className="md:col-span-3">
              <Button asChild variant="outline">
                <Link to="/admin/room-units">
                  Vincular quartos físicos agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {currentAccommodation ? 'Editar tipo de hospedagem' : 'Novo tipo de hospedagem'}
              </DialogTitle>
              <DialogDescription>
                {currentAccommodation
                  ? 'Modifique o produto que será vendido no site e usado nas reservas.'
                  : 'Cadastre a categoria comercial que será exibida no site.'}
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
                Esta ação não pode ser desfeita. O tipo de hospedagem será removido do sistema.
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
