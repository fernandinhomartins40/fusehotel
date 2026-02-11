import React, { useState } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { UserPlus, Pencil, Trash2, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  isActive: boolean;
  createdAt: string;
}

interface AdminUserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'MANAGER';
}

export const AdminUsersManager: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: allUsers = [], isLoading } = useCustomers();
  const createUser = useCreateCustomer();
  const updateUser = useUpdateCustomer();
  const deleteUser = useDeleteCustomer();

  // Filter only admin users
  const adminUsers = allUsers.filter(
    (user: any) => user.role === 'ADMIN' || user.role === 'MANAGER'
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminUserFormData>({
    defaultValues: {
      role: 'MANAGER',
    },
  });

  const selectedRole = watch('role');

  const handleCreate = () => {
    reset({ name: '', email: '', password: '', role: 'MANAGER' });
    setEditingUser(null);
    setShowCreateDialog(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
    setShowCreateDialog(true);
  };

  const onSubmit = async (data: AdminUserFormData) => {
    try {
      if (editingUser) {
        // Update existing user
        await updateUser.mutateAsync({
          id: editingUser.id,
          name: data.name,
          email: data.email,
          ...(data.password && { password: data.password }),
        });
      } else {
        // Create new user
        await createUser.mutateAsync({
          ...data,
          role: data.role,
        });
      }
      setShowCreateDialog(false);
      reset();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário administrativo?')) {
      setDeletingUserId(id);
      try {
        await deleteUser.mutateAsync(id);
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') {
      return <Badge variant="destructive"><Shield className="h-3 w-3 mr-1" />Administrador</Badge>;
    }
    return <Badge variant="default"><Shield className="h-3 w-3 mr-1" />Gerente</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Usuários Administrativos</h3>
          <p className="text-sm text-gray-500">
            Gerencie os usuários com acesso ao painel administrativo
          </p>
        </div>
        <Button onClick={handleCreate}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário Admin
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum usuário administrativo encontrado
                </TableCell>
              </TableRow>
            ) : (
              adminUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.isActive ? (
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
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário Admin' : 'Novo Usuário Admin'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Atualize as informações do usuário administrativo'
                : 'Crie um novo usuário com acesso ao painel administrativo'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Nome completo"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Senha {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: editingUser ? false : 'Senha é obrigatória',
                  minLength: {
                    value: 3,
                    message: 'Senha deve ter no mínimo 3 caracteres',
                  },
                })}
                placeholder={editingUser ? 'Deixe em branco para manter' : 'Mínimo 3 caracteres'}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Perfil de Acesso <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setValue('role', value as 'ADMIN' | 'MANAGER')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANAGER">Gerente (Acesso Limitado)</SelectItem>
                  <SelectItem value="ADMIN">Administrador (Acesso Total)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {selectedRole === 'ADMIN'
                  ? 'Acesso total a todas as funcionalidades do sistema'
                  : 'Acesso limitado: pode gerenciar reservas, clientes e acomodações'}
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={createUser.isPending || updateUser.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createUser.isPending || updateUser.isPending}
              >
                {(createUser.isPending || updateUser.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
