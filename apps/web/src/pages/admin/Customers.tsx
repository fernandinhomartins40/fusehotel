import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  UserPlus,
} from 'lucide-react';
import { useCustomers, useToggleCustomerStatus } from '@/hooks/useCustomers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateCustomerDialog } from '@/components/admin/customers/CreateCustomerDialog';

const Customers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterProvisional, setFilterProvisional] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filters = {
    search: search || undefined,
    isProvisional: filterProvisional === 'all' ? undefined : filterProvisional === 'true',
    isActive: filterActive === 'all' ? undefined : filterActive === 'true',
  };

  const { data: customers, isLoading } = useCustomers(filters);
  const toggleStatus = useToggleCustomerStatus();

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    toggleStatus.mutate({ id, isActive: !currentStatus });
  };

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      'ADMIN': { variant: 'destructive', label: 'Admin' },
      'MANAGER': { variant: 'default', label: 'Gerente' },
      'CUSTOMER': { variant: 'secondary', label: 'Cliente' },
    };
    const config = variants[role] || variants['CUSTOMER'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os clientes cadastrados no sistema
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <UserPlus className="mr-2 h-5 w-5" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers?.length || 0}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {customers?.filter(c => c.isActive).length || 0}
                  </p>
                </div>
                <UserCheck className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Provisórios</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {customers?.filter(c => c.isProvisional).length || 0}
                  </p>
                </div>
                <UserX className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verificados</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {customers?.filter(c => c.emailVerified).length || 0}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou WhatsApp..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterProvisional} onValueChange={setFilterProvisional}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="true">Apenas provisórios</SelectItem>
                  <SelectItem value="false">Apenas cadastrados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterActive} onValueChange={setFilterActive}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="true">Apenas ativos</SelectItem>
                  <SelectItem value="false">Apenas inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : customers && customers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reservas</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{customer.email}</div>
                            {customer.whatsapp && (
                              <div className="text-gray-500">
                                WhatsApp: {customer.whatsapp}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.isProvisional ? (
                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                              Provisório
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              Cadastrado
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getRoleBadge(customer.role)}</TableCell>
                        <TableCell>
                          {customer.isActive ? (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {customer._count?.reservations || 0}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(customer.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                              disabled={toggleStatus.isPending}
                            >
                              {customer.isActive ? (
                                <Ban className="h-4 w-4 text-red-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum cliente encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome</p>
                  <p className="text-base">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Telefone</p>
                  <p className="text-base">{selectedCustomer.phone || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">WhatsApp</p>
                  <p className="text-base">{selectedCustomer.whatsapp || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="text-base">{selectedCustomer.cpf || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Perfil</p>
                  <p className="text-base">{getRoleBadge(selectedCustomer.role)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-base">
                    {selectedCustomer.isActive ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-600">
                        Inativo
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo</p>
                  <p className="text-base">
                    {selectedCustomer.isProvisional ? (
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        Provisório
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Cadastrado
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email Verificado</p>
                  <p className="text-base">{selectedCustomer.emailVerified ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                  <p className="text-base">{selectedCustomer._count?.reservations || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data de Cadastro</p>
                  <p className="text-base">
                    {format(new Date(selectedCustomer.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Último Login</p>
                  <p className="text-base">
                    {selectedCustomer.lastLoginAt
                      ? format(new Date(selectedCustomer.lastLoginAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                      : 'Nunca fez login'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Customer Dialog */}
      <CreateCustomerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </AdminLayout>
  );
};

export default Customers;
