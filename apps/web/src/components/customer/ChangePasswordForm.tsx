import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useChangePassword } from '@/hooks/useProfile';

export function ChangePasswordForm() {
  const changePassword = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string): string[] => {
    const validationErrors: string[] = [];

    if (password.length < 8) {
      validationErrors.push('A senha deve ter no mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      validationErrors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      validationErrors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      validationErrors.push('A senha deve conter pelo menos um número');
    }

    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    const validationErrors: string[] = [];

    if (!formData.currentPassword) {
      validationErrors.push('Senha atual é obrigatória');
    }

    if (!formData.newPassword) {
      validationErrors.push('Nova senha é obrigatória');
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      validationErrors.push(...passwordErrors);
    }

    if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.push('As senhas não coincidem');
    }

    if (formData.currentPassword === formData.newPassword) {
      validationErrors.push('A nova senha deve ser diferente da senha atual');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    changePassword.mutate(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
          setErrors([errorMessage]);
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors([]);
    setSuccess(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Senha alterada com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="flex items-center gap-2">
              <Lock size={16} />
              Senha Atual *
            </Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Digite sua senha atual"
              required
            />
          </div>

          <div>
            <Label htmlFor="newPassword" className="flex items-center gap-2">
              <Lock size={16} />
              Nova Senha *
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Digite sua nova senha"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock size={16} />
              Confirmar Nova Senha *
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua nova senha"
              required
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="bg-[#0466C8] hover:bg-[#0355A6]"
            >
              {changePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
