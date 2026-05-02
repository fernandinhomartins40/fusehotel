import React, { useMemo, useState } from 'react';
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
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BedDouble, Edit, Loader2, Plus, Star, Trash } from 'lucide-react';
import { AccommodationForm } from '@/components/admin/AccommodationForm';
import { Accommodation, AccommodationFormData } from '@/types/accommodation';
import { useAccommodations } from '@/hooks/useAccommodations';
import {
  useCreateAccommodation,
  useDeleteAccommodation,
  useUpdateAccommodation,
} from '@/hooks/useAccommodationMutations';
import { useCreateRoomUnit, useRoomUnits, useUpdateRoomUnit } from '@/hooks/useRoomUnits';
import type { HousekeepingStatus, RoomUnit, RoomUnitStatus } from '@/types/pms';

const accommodationTypeLabels: Record<string, string> = {
  ROOM: 'Quarto',
  SUITE: 'Su?te',
  CHALET: 'Chal?',
  VILLA: 'Vila',
  APARTMENT: 'Apartamento',
};

const roomStatusLabels: Record<RoomUnitStatus, string> = {
  AVAILABLE: 'Dispon?vel',
  OCCUPIED: 'Ocupado',
  DIRTY: 'Sujo',
  CLEANING: 'Em limpeza',
  INSPECTED: 'Inspecionado',
  OUT_OF_ORDER: 'Fora de ordem',
  OUT_OF_SERVICE: 'Fora de servi?o',
  BLOCKED: 'Bloqueado',
};

const housekeepingLabels: Record<HousekeepingStatus, string> = {
  CLEAN: 'Limpo',
  DIRTY: 'Sujo',
  IN_PROGRESS: 'Limpando',
  INSPECTED: 'Inspecionado',
};

export function Accommodations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roomUnitForm, setRoomUnitForm] = useState({
    accommodationId: '',
    name: '',
    code: '',
    floor: '',
    notes: '',
  });

  const { data: accommodations, isLoading, error } = useAccommodations({ adminView: true });
  const { data: roomUnits = [], isLoading: loadingRoomUnits } = useRoomUnits();
  const createMutation = useCreateAccommodation();
  const updateMutation = useUpdateAccommodation();
  const deleteMutation = useDeleteAccommodation();
  const createRoomUnit = useCreateRoomUnit();
  const updateRoomUnit = useUpdateRoomUnit();

  const publishedCount = useMemo(
    () => (accommodations || []).filter((item) => item.isPublishedOnSite).length,
    [accommodations]
  );

  const activeRoomUnitsCount = useMemo(
    () => roomUnits.filter((item) => item.isActive).length,
    [roomUnits]
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

  const handleCreateRoomUnit = () => {
    if (!roomUnitForm.accommodationId || !roomUnitForm.name || !roomUnitForm.code) {
      return;
    }

    createRoomUnit.mutate(
      {
        accommodationId: roomUnitForm.accommodationId,
        name: roomUnitForm.name,
        code: roomUnitForm.code,
        floor: roomUnitForm.floor ? Number(roomUnitForm.floor) : undefined,
        notes: roomUnitForm.notes || undefined,
      },
      {
        onSuccess: () => {
          setRoomUnitForm({
            accommodationId: '',
            name: '',
            code: '',
            floor: '',
            notes: '',
          });
        },
      }
    );
  };

  const handleRoomUnitStatusChange = (roomUnit: RoomUnit, status: RoomUnitStatus) => {
    updateRoomUnit.mutate({
      id: roomUnit.id,
      data: { status },
    });
  };

  const handleHousekeepingChange = (roomUnit: RoomUnit, housekeepingStatus: HousekeepingStatus) => {
    updateRoomUnit.mutate({
      id: roomUnit.id,
      data: { housekeepingStatus },
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
          <h2 className="mb-2 text-xl font-bold">Erro ao carregar hospedagens</h2>
          <p className="text-gray-600">
            {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar os tipos de hospedagem.'}
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
            <h1 className="text-3xl font-bold">Hospedagens e unidades</h1>
            <p className="mt-1 text-gray-600">
              Cadastre o que o site vende e as unidades f?sicas usadas na opera??o do hotel em um ?nico lugar.
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentAccommodation(null);
              setIsDialogOpen(true);
            }}
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo tipo de hospedagem
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tipos cadastrados</CardDescription>
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
              <CardDescription className="text-blue-700">Unidades f?sicas ativas</CardDescription>
              <CardTitle className="text-base text-blue-950">
                {loadingRoomUnits ? '...' : activeRoomUnitsCount}
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
                    <TableHead>Pre?o</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Unidades</TableHead>
                    <TableHead>Comodidades</TableHead>
                    <TableHead className="text-right">A??es</TableHead>
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
                            {accommodation.isFeatured && <Star className="h-4 w-4 fill-current text-yellow-500" />}
                          </div>
                          <div className="text-sm text-gray-500">{accommodation.shortDescription || 'Sem descri??o'}</div>
                        </div>
                      </TableCell>
                      <TableCell>{accommodationTypeLabels[accommodation.type] || accommodation.type}</TableCell>
                      <TableCell>{accommodation.capacity} pessoas</TableCell>
                      <TableCell className="font-medium">{formatCurrency(Number(accommodation.pricePerNight))}</TableCell>
                      <TableCell>
                        {accommodation.isPublishedOnSite ? (
                          <Badge variant="default">Publicado</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="secondary">Fora do site</Badge>
                            <div className="text-xs text-muted-foreground">
                              {!accommodation.isAvailable ? 'Tipo indispon?vel' : 'Sem unidade ativa'}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{accommodation.activeRoomUnitCount || 0} ativas</div>
                          <div className="text-xs text-muted-foreground">{accommodation.totalRoomUnitCount || 0} cadastradas</div>
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
              <p className="mb-4 text-gray-600">Comece criando a categoria que ser? vendida no site.</p>
              <Button
                onClick={() => {
                  setCurrentAccommodation(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Criar primeiro tipo de hospedagem
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Fluxo unificado</CardTitle>
            <CardDescription>
              O site vende o tipo de hospedagem. A opera??o usa unidades f?sicas vinculadas ao mesmo cadastro.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4">
              <div className="font-medium">1. Cadastre o tipo</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Nome, pre?o, capacidade, imagens e descri??o que ser?o exibidos no site.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">2. Vincule unidades reais</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Cada unidade real aponta para um tipo desta mesma tela e passa a valer na opera??o.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">3. Publica??o autom?tica</div>
              <p className="mt-2 text-sm text-muted-foreground">
                O site s? oferece tipos com pelo menos uma unidade ativa e disponibilidade comercial.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Unidades f?sicas do hotel
            </CardTitle>
            <CardDescription>Cadastre e atualize os quartos reais sem sair desta tela.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
              <Select
                value={roomUnitForm.accommodationId}
                onValueChange={(value) => setRoomUnitForm((current) => ({ ...current, accommodationId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de hospedagem" />
                </SelectTrigger>
                <SelectContent>
                  {(accommodations || []).map((accommodation) => (
                    <SelectItem key={accommodation.id} value={accommodation.id}>
                      {accommodation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Nome interno do quarto"
                value={roomUnitForm.name}
                onChange={(event) => setRoomUnitForm((current) => ({ ...current, name: event.target.value }))}
              />
              <Input
                placeholder="C?digo"
                value={roomUnitForm.code}
                onChange={(event) => setRoomUnitForm((current) => ({ ...current, code: event.target.value }))}
              />
              <Input
                placeholder="Andar"
                type="number"
                value={roomUnitForm.floor}
                onChange={(event) => setRoomUnitForm((current) => ({ ...current, floor: event.target.value }))}
              />
              <Button onClick={handleCreateRoomUnit} disabled={createRoomUnit.isPending || !(accommodations || []).length}>
                Cadastrar unidade
              </Button>
              <div className="md:col-span-5">
                <Input
                  placeholder="Observa??es operacionais"
                  value={roomUnitForm.notes}
                  onChange={(event) => setRoomUnitForm((current) => ({ ...current, notes: event.target.value }))}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>C?digo</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Tipo vendido</TableHead>
                    <TableHead>Andar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Governan?a</TableHead>
                    <TableHead>Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRoomUnits ? (
                    <TableRow>
                      <TableCell colSpan={7}>Carregando unidades...</TableCell>
                    </TableRow>
                  ) : roomUnits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>Nenhuma unidade f?sica cadastrada.</TableCell>
                    </TableRow>
                  ) : (
                    roomUnits.map((roomUnit) => (
                      <TableRow key={roomUnit.id}>
                        <TableCell className="font-mono">{roomUnit.code}</TableCell>
                        <TableCell>{roomUnit.name}</TableCell>
                        <TableCell>{roomUnit.accommodation?.name}</TableCell>
                        <TableCell>{roomUnit.floor ?? '-'}</TableCell>
                        <TableCell>
                          <Select
                            value={roomUnit.status}
                            onValueChange={(value) => handleRoomUnitStatusChange(roomUnit, value as RoomUnitStatus)}
                          >
                            <SelectTrigger className="w-[170px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(roomStatusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={roomUnit.housekeepingStatus}
                            onValueChange={(value) => handleHousekeepingChange(roomUnit, value as HousekeepingStatus)}
                          >
                            <SelectTrigger className="w-[170px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(housekeepingLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={roomUnit.isActive ? 'default' : 'outline'}>
                            {roomUnit.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{currentAccommodation ? 'Editar tipo de hospedagem' : 'Novo tipo de hospedagem'}</DialogTitle>
              <DialogDescription>
                {currentAccommodation
                  ? 'Modifique o produto que ser? vendido no site e usado nas reservas.'
                  : 'Cadastre a categoria comercial que ser? exibida no site.'}
              </DialogDescription>
            </DialogHeader>
            <AccommodationForm
              accommodation={currentAccommodation}
              onSubmit={handleAddEditAccommodation}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir tipo de hospedagem?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa a??o remove o tipo de hospedagem. Use com cuidado para n?o afetar reservas ou unidades j? vinculadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

export default Accommodations;
