import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateCustomerData,
  Customer,
  useCreateCustomer,
  useUpdateCustomer,
} from '@/hooks/useCustomers';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  onSuccess?: () => void;
  hideRoleField?: boolean;
  defaultRole?: CustomerFormData['role'];
}

type CustomerFormData = CreateCustomerData;

const createDefaultValues = (
  role: CustomerFormData['role'] = 'CUSTOMER'
): CustomerFormData => ({
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  cpf: '',
  password: '',
  role,
});

export const CreateCustomerDialog: React.FC<CreateCustomerDialogProps> = ({
  open,
  onOpenChange,
  customer = null,
  onSuccess,
  hideRoleField = false,
  defaultRole = 'CUSTOMER',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: createDefaultValues(defaultRole),
  });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const role = watch('role');

  useEffect(() => {
    if (!open) {
      return;
    }

    setShowPassword(false);

    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        whatsapp: customer.whatsapp || '',
        cpf: customer.cpf || '',
        password: '',
        role: customer.role as 'CUSTOMER' | 'ADMIN' | 'MANAGER',
      });
      return;
    }

    reset(createDefaultValues(defaultRole));
  }, [customer, defaultRole, open, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    const payload: CustomerFormData = {
      ...data,
      phone: data.phone?.trim() || undefined,
      whatsapp: data.whatsapp?.trim() || undefined,
      cpf: data.cpf?.trim() || undefined,
      password: data.password?.trim() || undefined,
    };

    if (isEditing && customer) {
      await updateCustomer.mutateAsync({
        id: customer.id,
        ...payload,
      });
    } else {
      await createCustomer.mutateAsync(payload);
    }

    reset(createDefaultValues(defaultRole));
    onOpenChange(false);
    onSuccess?.();
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(createDefaultValues(defaultRole));
      setShowPassword(false);
    }

    onOpenChange(nextOpen);
  };

  const isSubmitting = createCustomer.isPending || updateCustomer.isPending;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os dados do cliente no sistema'
              : 'Cadastre um novo cliente manualmente no sistema'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome e obrigatorio' })}
              placeholder="Digite o nome completo"
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
                required: 'Email e obrigatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalido',
                },
              })}
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="(00) 0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...register('whatsapp')}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={
                  isEditing
                    ? 'Deixe em branco para manter a senha atual'
                    : 'Deixe em branco para gerar automaticamente'
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {isEditing
                ? 'Preencha apenas se quiser alterar a senha do cliente'
                : 'Se nao informada, o sistema exigira SMTP configurado para enviar um acesso inicial seguro por email'}
            </p>
          </div>

          {!hideRoleField && (
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select
                value={role}
                onValueChange={(value) =>
                  setValue('role', value as 'CUSTOMER' | 'ADMIN' | 'MANAGER')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Cliente</SelectItem>
                  <SelectItem value="MANAGER">Gerente</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? 'Salvar Alteracoes' : 'Criar Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
