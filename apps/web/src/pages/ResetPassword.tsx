import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/hooks/useAuthMutation';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get('token') || '';
  const hasValidToken = token.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasValidToken) {
      toast.error('Token de redefinicao ausente.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error('Preencha os dois campos de senha.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas nao coincidem.');
      return;
    }

    await resetPasswordMutation.mutateAsync({
      token,
      newPassword,
      confirmPassword,
    });

    setIsCompleted(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Redefinir senha</CardTitle>
            <CardDescription>
              Defina uma nova senha para recuperar o acesso a sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasValidToken ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-red-600">
                  O link de redefinicao esta incompleto ou invalido.
                </p>
                <Button asChild className="w-full">
                  <Link to="/area-do-cliente">Voltar para o login</Link>
                </Button>
              </div>
            ) : isCompleted ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  Sua senha foi atualizada. Voce ja pode entrar novamente.
                </p>
                <Button asChild className="w-full">
                  <Link to="/area-do-cliente">Ir para a area do cliente</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Digite sua nova senha"
                    minLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirme sua nova senha"
                    minLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending
                    ? 'Atualizando...'
                    : 'Redefinir senha'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
