import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { SettingsImageUpload } from '@/components/admin/SettingsImageUpload';
import { ColorPicker } from '@/components/admin/ColorPicker';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { useVisualIdentity, useUpdateVisualIdentity, useSEO, useUpdateSEO, useContent, useUpdateContent } from '@/hooks/useSystemSettings';
import { Loader2, MessageCircle, Palette, FileText, Users2, Search } from 'lucide-react';
import { AdminUsersManager } from '@/components/admin/settings/AdminUsersManager';

type HotelConfigFormValues = {
  hotelWhatsApp: string;
  hotelName: string;
  hotelEmail: string;
  hotelPhone: string;
  hotelAddress: string;
};

type VisualIdentityFormValues = {
  logo: string;
  footerLogo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

type SEOFormValues = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

const SettingsNew = () => {
  const [activeTab, setActiveTab] = useState('hotel-config');
  const [policyContent, setPolicyContent] = useState('');

  const { data: hotelSettings, isLoading: isLoadingHotel } = useSettings();
  const updateHotelSettings = useUpdateSettings();

  const { data: visualSettings } = useVisualIdentity();
  const updateVisual = useUpdateVisualIdentity();

  const { data: seoSettings } = useSEO();
  const updateSEO = useUpdateSEO();

  const { data: privacyPolicy } = useContent('privacy-policy');
  const { data: termsOfService } = useContent('terms-of-service');
  const updateContent = useUpdateContent();

  const hotelConfigForm = useForm<HotelConfigFormValues>({
    defaultValues: {
      hotelWhatsApp: '',
      hotelName: 'FuseHotel',
      hotelEmail: '',
      hotelPhone: '',
      hotelAddress: '',
    },
  });

  useEffect(() => {
    if (hotelSettings) {
      hotelConfigForm.reset({
        hotelWhatsApp: hotelSettings.hotelWhatsApp || '',
        hotelName: hotelSettings.hotelName || 'FuseHotel',
        hotelEmail: hotelSettings.hotelEmail || '',
        hotelPhone: hotelSettings.hotelPhone || '',
        hotelAddress: hotelSettings.hotelAddress || '',
      });
    }
  }, [hotelSettings]);

  const visualForm = useForm<VisualIdentityFormValues>({
    defaultValues: {
      logo: '',
      footerLogo: '',
      favicon: '',
      primaryColor: '#1A1F2C',
      secondaryColor: '#6E59A5',
      accentColor: '#9b87f5',
    },
  });

  useEffect(() => {
    if (visualSettings) {
      visualForm.reset({
        logo: visualSettings.branding_logo || '',
        footerLogo: visualSettings.branding_footerLogo || '',
        favicon: visualSettings.branding_favicon || '',
        primaryColor: visualSettings.branding_primaryColor || '#1A1F2C',
        secondaryColor: visualSettings.branding_secondaryColor || '#6E59A5',
        accentColor: visualSettings.branding_accentColor || '#9b87f5',
      });
    }
  }, [visualSettings]);

  const seoForm = useForm<SEOFormValues>({
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  useEffect(() => {
    if (seoSettings) {
      seoForm.reset({
        metaTitle: seoSettings.seo_metaTitle || '',
        metaDescription: seoSettings.seo_metaDescription || '',
        keywords: seoSettings.seo_keywords || '',
      });
    }
  }, [seoSettings]);

  const onHotelConfigSubmit = (data: HotelConfigFormValues) => {
    updateHotelSettings.mutate(data);
  };

  const onVisualSubmit = (data: VisualIdentityFormValues) => {
    updateVisual.mutate(data);
  };

  const onSEOSubmit = (data: SEOFormValues) => {
    updateSEO.mutate(data);
  };

  const handleSavePolicy = (key: string, content: string) => {
    updateContent.mutate({ key, content });
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
          <p className="text-muted-foreground">
            Configure as definições gerais e avançadas do sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="hotel-config">
              <MessageCircle className="h-4 w-4 mr-2" />
              Hotel
            </TabsTrigger>
            <TabsTrigger value="admins">
              <Users2 className="h-4 w-4 mr-2" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="visual-identity">
              <Palette className="h-4 w-4 mr-2" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="policies">
              <FileText className="h-4 w-4 mr-2" />
              Políticas
            </TabsTrigger>
          </TabsList>

          {/* Hotel Config */}
          <TabsContent value="hotel-config">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Configurações do Hotel
                </CardTitle>
                <CardDescription>
                  Configure o WhatsApp e informações essenciais do hotel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHotel ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={hotelConfigForm.handleSubmit(onHotelConfigSubmit)}>
                    <div className="space-y-2">
                      <Label htmlFor="hotelWhatsApp" className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp do Hotel *
                      </Label>
                      <Input
                        id="hotelWhatsApp"
                        {...hotelConfigForm.register('hotelWhatsApp')}
                        placeholder="5511999999999"
                      />
                      <p className="text-xs text-gray-500">
                        Formato internacional: código do país + DDD + número
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="hotelName">Nome do Hotel</Label>
                      <Input
                        id="hotelName"
                        {...hotelConfigForm.register('hotelName')}
                        placeholder="FuseHotel"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotelEmail">Email</Label>
                        <Input
                          id="hotelEmail"
                          type="email"
                          {...hotelConfigForm.register('hotelEmail')}
                          placeholder="contato@hotel.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hotelPhone">Telefone</Label>
                        <Input
                          id="hotelPhone"
                          {...hotelConfigForm.register('hotelPhone')}
                          placeholder="(11) 3333-4444"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotelAddress">Endereço</Label>
                      <Textarea
                        id="hotelAddress"
                        {...hotelConfigForm.register('hotelAddress')}
                        placeholder="Endereço completo"
                        rows={3}
                      />
                    </div>

                    <Button type="submit" disabled={updateHotelSettings.isPending}>
                      {updateHotelSettings.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Salvar Configurações
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Users */}
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Usuários Administrativos</CardTitle>
                <CardDescription>
                  Gerencie os usuários com acesso ao painel administrativo (Admins e Gerentes)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUsersManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visual Identity */}
          <TabsContent value="visual-identity">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>
                  Configure logos, cores e elementos visuais do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={visualForm.handleSubmit(onVisualSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <Label>Logo Principal</Label>
                      <SettingsImageUpload
                        value={visualForm.watch('logo')}
                        onChange={(url) => visualForm.setValue('logo', url)}
                      />
                    </div>

                    <div>
                      <Label>Logo do Rodapé</Label>
                      <SettingsImageUpload
                        value={visualForm.watch('footerLogo')}
                        onChange={(url) => visualForm.setValue('footerLogo', url)}
                      />
                    </div>

                    <div>
                      <Label>Favicon (32x32px)</Label>
                      <SettingsImageUpload
                        value={visualForm.watch('favicon')}
                        onChange={(url) => visualForm.setValue('favicon', url)}
                      />
                    </div>
                  </div>

                  <Separator />
                  <h3 className="font-medium">Cores do Site</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPicker
                      label="Cor Primária"
                      value={visualForm.watch('primaryColor')}
                      onChange={(color) => visualForm.setValue('primaryColor', color)}
                    />
                    <ColorPicker
                      label="Cor Secundária"
                      value={visualForm.watch('secondaryColor')}
                      onChange={(color) => visualForm.setValue('secondaryColor', color)}
                    />
                    <ColorPicker
                      label="Cor de Destaque"
                      value={visualForm.watch('accentColor')}
                      onChange={(color) => visualForm.setValue('accentColor', color)}
                    />
                  </div>

                  <Button type="submit" disabled={updateVisual.isPending}>
                    {updateVisual.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Identidade Visual
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de SEO</CardTitle>
                <CardDescription>
                  Otimize seu site para motores de busca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={seoForm.handleSubmit(onSEOSubmit)}>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Título</Label>
                    <Input
                      id="metaTitle"
                      {...seoForm.register('metaTitle')}
                      placeholder="Título exibido nos resultados de busca (máx 60 caracteres)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      {...seoForm.register('metaDescription')}
                      placeholder="Descrição exibida nos resultados de busca (máx 160 caracteres)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input
                      id="keywords"
                      {...seoForm.register('keywords')}
                      placeholder="Separadas por vírgulas"
                    />
                  </div>

                  <Button type="submit" disabled={updateSEO.isPending}>
                    {updateSEO.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Configurações de SEO
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Política de Privacidade</CardTitle>
                  <CardDescription>
                    Edite a política de privacidade do site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={privacyPolicy || ''}
                    onChange={(e) => setPolicyContent(e.target.value)}
                    rows={10}
                    placeholder="Digite a política de privacidade..."
                  />
                  <Button
                    onClick={() => handleSavePolicy('privacy-policy', policyContent || privacyPolicy || '')}
                    disabled={updateContent.isPending}
                  >
                    {updateContent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Política de Privacidade
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Termos de Serviço</CardTitle>
                  <CardDescription>
                    Edite os termos de serviço do site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    defaultValue={termsOfService || ''}
                    onChange={(e) => setPolicyContent(e.target.value)}
                    rows={10}
                    placeholder="Digite os termos de serviço..."
                  />
                  <Button
                    onClick={() => handleSavePolicy('terms-of-service', policyContent || termsOfService || '')}
                    disabled={updateContent.isPending}
                  >
                    {updateContent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Termos de Serviço
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsNew;
