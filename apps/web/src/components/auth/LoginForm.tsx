import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForgotPassword, useLogin } from '@/hooks/useAuthMutation';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [stayConnected, setStayConnected] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const loginMutation = useLogin(redirectTo);
  const forgotPasswordMutation = useForgotPassword();

  useEffect(() => {
    const savedEmail = localStorage.getItem('fusehotel_remember_email');
    const savedRememberMe = localStorage.getItem('fusehotel_remember_me');

    if (savedEmail && savedRememberMe === 'true') {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('fusehotel_remember_email', email);
      localStorage.setItem('fusehotel_remember_me', 'true');
    } else {
      localStorage.removeItem('fusehotel_remember_email');
      localStorage.removeItem('fusehotel_remember_me');
    }

    if (stayConnected) {
      localStorage.setItem('fusehotel_stay_connected', 'true');
    } else {
      localStorage.removeItem('fusehotel_stay_connected');
    }

    loginMutation.mutate({ email, password, rememberMe: stayConnected });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error('Informe o email para recuperação');
      return;
    }

    await forgotPasswordMutation.mutateAsync(forgotEmail);
    setForgotPasswordOpen(false);
    setForgotEmail('');
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-[#0466C8]">
            <User size={24} />
            Entrar na Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail ou WhatsApp</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com ou (11) 99999-9999"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Para usuários provisórios, use apenas números do WhatsApp
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  className="text-sm text-[#0466C8] hover:underline"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Lembrar meu email
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stayConnected"
                  checked={stayConnected}
                  onCheckedChange={(checked) => setStayConnected(checked as boolean)}
                />
                <Label
                  htmlFor="stayConnected"
                  className="text-sm font-normal cursor-pointer"
                >
                  Manter conectado
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0466C8] hover:bg-[#0355A6]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock size={18} />
                  Entrar
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar acesso</DialogTitle>
            <DialogDescription>
              Informe seu email para receber o link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgotEmail">Email</Label>
              <Input
                id="forgotEmail"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="voce@hotel.com"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={forgotPasswordMutation.isPending}>
                {forgotPasswordMutation.isPending ? 'Enviando...' : 'Enviar link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
