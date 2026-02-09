import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, MessageCircle, CreditCard, AlertCircle } from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    cpf: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        cpf: profile.cpf || '',
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3">Carregando perfil...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meu Perfil
          </CardTitle>
          {profile?.isProvisional && (
            <Badge variant="outline" className="border-orange-500 text-orange-600">
              Cadastro Provisório
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {profile?.isProvisional && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Complete seu cadastro preenchendo os campos abaixo para ter acesso completo ao sistema.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User size={16} />
                Nome Completo *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
              {profile?.isProvisional && formData.email.includes('@provisional.fusehotel.com') && (
                <p className="text-xs text-orange-600 mt-1">
                  Email provisório - atualize para um email válido
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={16} />
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 1234-5678"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle size={16} />
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="cpf" className="flex items-center gap-2">
                <CreditCard size={16} />
                CPF
              </Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={updateProfile.isPending}
              className="bg-[#0466C8] hover:bg-[#0355A6]"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>

            {!profile?.isProvisional && (
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(profile?.updatedAt || '').toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
