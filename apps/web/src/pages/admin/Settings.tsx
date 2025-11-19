
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SiteInfoFormValues = {
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
};

type VisualIdentityFormValues = {
  logo: string;
  footerLogo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontHeading: string;
  fontBody: string;
};

type ContentFormValues = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImage: string;
  highlightsTitle: string;
};

type SEOFormValues = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

type PageContentValues = {
  selectedPage: string;
  pageContent: string;
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("site-info");
  const [selectedPage, setSelectedPage] = useState("home");
  const [pageContent, setPageContent] = useState("<p>Conteúdo da página inicial</p>");
  
  const siteInfoForm = useForm<SiteInfoFormValues>({
    defaultValues: {
      companyName: "Águas Claras",
      tagline: "Seu refúgio natural",
      address: "Rua das Águas, 123, Bonito - MS",
      phone: "(67) 3255-1234",
      email: "contato@aguasclaras.com.br",
      facebook: "aguasclarashotel",
      instagram: "aguasclaras_hotel",
      whatsapp: "5567991234567",
    },
  });
  
  const visualForm = useForm<VisualIdentityFormValues>({
    defaultValues: {
      logo: "",
      footerLogo: "",
      favicon: "",
      primaryColor: "#1A1F2C",
      secondaryColor: "#6E59A5",
      accentColor: "#9b87f5",
      textColor: "#333333",
      backgroundColor: "#FFFFFF",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
    },
  });
  
  const contentForm = useForm<ContentFormValues>({
    defaultValues: {
      heroTitle: "Bem-vindo ao Águas Claras",
      heroSubtitle: "Uma experiência única em meio à natureza",
      heroImage: "",
      aboutTitle: "Sobre nós",
      aboutContent: "O Hotel Águas Claras é um refúgio natural localizado em Bonito, MS. Oferecemos acomodações confortáveis em meio à natureza exuberante.",
      aboutImage: "",
      highlightsTitle: "Nossos diferenciais",
    },
  });
  
  const seoForm = useForm<SEOFormValues>({
    defaultValues: {
      metaTitle: "Águas Claras - Hotel em Bonito, MS",
      metaDescription: "Hotel Águas Claras em Bonito, MS. Hospedagem confortável em meio à natureza.",
      keywords: "hotel, bonito, águas claras, ecoturismo, natureza",
    },
  });

  const pageContentForm = useForm<PageContentValues>({
    defaultValues: {
      selectedPage: "home",
      pageContent: "<p>Conteúdo da página inicial</p>",
    }
  });

  const pageOptions = [
    { value: "home", label: "Página Inicial" },
    { value: "about", label: "Sobre Nós" },
    { value: "services", label: "Serviços" },
    { value: "faq", label: "FAQ" },
    { value: "contact", label: "Contato" },
    { value: "privacy", label: "Política de Privacidade" },
  ];

  const handlePageChange = (value: string) => {
    // In a real application, you would fetch page content from a database
    setSelectedPage(value);
    const demoContent = {
      home: "<p>Conteúdo da página inicial</p>",
      about: "<p>Conteúdo da página Sobre Nós</p>",
      services: "<p>Conteúdo da página Serviços</p>",
      faq: "<p>Conteúdo da página FAQ</p>",
      contact: "<p>Conteúdo da página Contato</p>",
      privacy: "<p>Conteúdo da página Política de Privacidade</p>",
    };
    
    setPageContent(demoContent[value as keyof typeof demoContent]);
    pageContentForm.setValue("selectedPage", value);
    pageContentForm.setValue("pageContent", demoContent[value as keyof typeof demoContent]);
  };

  const onSiteInfoSubmit = (data: SiteInfoFormValues) => {
    console.log("Site info saved:", data);
    // In a real app, you would save this to a database or API
    toast.success("Informações do site salvas com sucesso!");
  };

  const onVisualSubmit = (data: VisualIdentityFormValues) => {
    console.log("Visual identity saved:", data);
    // Update favicon in index.html
    if (data.favicon) {
      // In a real app, you would save favicon reference to a database and update on page load
      console.log("Favicon would be updated to:", data.favicon);
    }
    toast.success("Identidade visual salva com sucesso!");
  };

  const onContentSubmit = (data: ContentFormValues) => {
    console.log("Content saved:", data);
    // In a real app, you would save this to a database or API
    toast.success("Conteúdo salvo com sucesso!");
  };

  const onSEOSubmit = (data: SEOFormValues) => {
    console.log("SEO saved:", data);
    // In a real app, you would save this to a database or API
    toast.success("Configurações de SEO salvas com sucesso!");
  };

  const onPageContentSubmit = (data: PageContentValues) => {
    console.log("Page content saved:", data);
    // In a real app, you would save this to a database or API
    toast.success(`Conteúdo da página ${data.selectedPage} salvo com sucesso!`);
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Personalize as informações e aparência do seu site.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="site-info">Informações do Site</TabsTrigger>
            <TabsTrigger value="visual-identity">Identidade Visual</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="pages">Páginas</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="site-info">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Site</CardTitle>
                <CardDescription>
                  Configure os dados básicos da sua empresa que serão exibidos no site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-4"
                  onSubmit={siteInfoForm.handleSubmit(onSiteInfoSubmit)}
                >
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input 
                      id="companyName" 
                      {...siteInfoForm.register("companyName")} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Slogan</Label>
                    <Input 
                      id="tagline" 
                      {...siteInfoForm.register("tagline")} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input 
                      id="address" 
                      {...siteInfoForm.register("address")} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        {...siteInfoForm.register("phone")} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...siteInfoForm.register("email")} 
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Redes Sociais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input 
                        id="facebook" 
                        {...siteInfoForm.register("facebook")} 
                        placeholder="username" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input 
                        id="instagram" 
                        {...siteInfoForm.register("instagram")} 
                        placeholder="username" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input 
                        id="whatsapp" 
                        {...siteInfoForm.register("whatsapp")} 
                        placeholder="5567991234567" 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Salvar Informações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visual-identity">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>
                  Configure as cores, fontes e outros elementos visuais do seu site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-4"
                  onSubmit={visualForm.handleSubmit(onVisualSubmit)}
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo Principal</Label>
                      <SettingsImageUpload
                        value={visualForm.watch("logo")}
                        onChange={(url) => visualForm.setValue("logo", url)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footerLogo">Logo do Rodapé</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Esta logo será exibida no rodapé do site. Se não for definida, será usada a logo principal.
                      </p>
                      <SettingsImageUpload
                        value={visualForm.watch("footerLogo")}
                        onChange={(url) => visualForm.setValue("footerLogo", url)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ícone que aparece na aba do navegador. Recomendado: imagem PNG quadrada (32x32 pixels).
                      </p>
                      <SettingsImageUpload
                        value={visualForm.watch("favicon")}
                        onChange={(url) => visualForm.setValue("favicon", url)}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Cores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorPicker
                      label="Cor Primária"
                      value={visualForm.watch("primaryColor")}
                      onChange={(color) => visualForm.setValue("primaryColor", color)}
                    />
                    
                    <ColorPicker
                      label="Cor Secundária"
                      value={visualForm.watch("secondaryColor")}
                      onChange={(color) => visualForm.setValue("secondaryColor", color)}
                    />
                    
                    <ColorPicker
                      label="Cor de Destaque"
                      value={visualForm.watch("accentColor")}
                      onChange={(color) => visualForm.setValue("accentColor", color)}
                    />
                    
                    <ColorPicker
                      label="Cor do Texto"
                      value={visualForm.watch("textColor")}
                      onChange={(color) => visualForm.setValue("textColor", color)}
                    />
                    
                    <ColorPicker
                      label="Cor de Fundo"
                      value={visualForm.watch("backgroundColor")}
                      onChange={(color) => visualForm.setValue("backgroundColor", color)}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Fontes</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fontHeading">Fonte para Títulos</Label>
                      <Input 
                        id="fontHeading" 
                        {...visualForm.register("fontHeading")} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontBody">Fonte para Textos</Label>
                      <Input 
                        id="fontBody" 
                        {...visualForm.register("fontBody")} 
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Visualização</h4>
                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: visualForm.watch("backgroundColor"),
                        color: visualForm.watch("textColor"),
                      }}
                    >
                      {visualForm.watch("logo") && (
                        <div className="mb-4 flex justify-center">
                          <img 
                            src={visualForm.watch("logo")} 
                            alt="Logo" 
                            className="h-10 object-contain" 
                          />
                        </div>
                      )}
                      <h3 
                        style={{ 
                          color: visualForm.watch("primaryColor"),
                          fontFamily: visualForm.watch("fontHeading"), 
                        }}
                        className="text-xl font-bold mb-2"
                      >
                        Exemplo de Título
                      </h3>
                      <p 
                        style={{ 
                          fontFamily: visualForm.watch("fontBody"),
                        }}
                      >
                        Este é um exemplo de texto para visualização das cores e fontes selecionadas.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button
                          className="px-4 py-2 rounded-md text-white"
                          style={{ backgroundColor: visualForm.watch("accentColor") }}
                          type="button"
                        >
                          Botão Principal
                        </button>
                        <button
                          className="px-4 py-2 rounded-md text-white"
                          style={{ backgroundColor: visualForm.watch("secondaryColor") }}
                          type="button"
                        >
                          Botão Secundário
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Salvar Identidade Visual
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Site</CardTitle>
                <CardDescription>
                  Configure os textos e conteúdos exibidos nas principais seções do site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-4"
                  onSubmit={contentForm.handleSubmit(onContentSubmit)}
                >
                  <h3 className="text-lg font-medium">Seção Hero (Banner Principal)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="heroTitle">Título Principal</Label>
                      <Input 
                        id="heroTitle" 
                        {...contentForm.register("heroTitle")} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="heroSubtitle">Subtítulo</Label>
                      <Input 
                        id="heroSubtitle" 
                        {...contentForm.register("heroSubtitle")} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="heroImage">Imagem de Fundo</Label>
                      <SettingsImageUpload
                        value={contentForm.watch("heroImage")}
                        onChange={(url) => contentForm.setValue("heroImage", url)}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Seção Sobre</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aboutTitle">Título da Seção</Label>
                      <Input 
                        id="aboutTitle" 
                        {...contentForm.register("aboutTitle")} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aboutContent">Conteúdo</Label>
                      <Textarea 
                        id="aboutContent" 
                        {...contentForm.register("aboutContent")} 
                        rows={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aboutImage">Imagem</Label>
                      <SettingsImageUpload
                        value={contentForm.watch("aboutImage")}
                        onChange={(url) => contentForm.setValue("aboutImage", url)}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Seção de Diferenciais</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="highlightsTitle">Título da Seção</Label>
                      <Input 
                        id="highlightsTitle" 
                        {...contentForm.register("highlightsTitle")} 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Salvar Conteúdo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Editor de Páginas</CardTitle>
                <CardDescription>
                  Edite o conteúdo das páginas do seu site usando o editor rico abaixo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-4"
                  onSubmit={pageContentForm.handleSubmit(onPageContentSubmit)}
                >
                  <div className="space-y-2">
                    <Label htmlFor="selectedPage">Selecione a Página</Label>
                    <Select 
                      value={selectedPage} 
                      onValueChange={handlePageChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma página" />
                      </SelectTrigger>
                      <SelectContent>
                        {pageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Conteúdo da Página</Label>
                    <RichTextEditor
                      value={pageContent}
                      onChange={(content) => {
                        setPageContent(content);
                        pageContentForm.setValue("pageContent", content);
                      }}
                      className="min-h-[400px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Salvar Página
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de SEO</CardTitle>
                <CardDescription>
                  Configure as informações para otimização em motores de busca.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-4"
                  onSubmit={seoForm.handleSubmit(onSEOSubmit)}
                >
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Título</Label>
                    <Input 
                      id="metaTitle" 
                      {...seoForm.register("metaTitle")} 
                    />
                    <p className="text-sm text-muted-foreground">
                      O título exibido em resultados de pesquisa (recomendado: até 60 caracteres)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea 
                      id="metaDescription" 
                      {...seoForm.register("metaDescription")} 
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      A descrição exibida em resultados de pesquisa (recomendado: até 160 caracteres)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input 
                      id="keywords" 
                      {...seoForm.register("keywords")} 
                    />
                    <p className="text-sm text-muted-foreground">
                      Palavras-chave separadas por vírgulas
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Salvar Configurações de SEO
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
