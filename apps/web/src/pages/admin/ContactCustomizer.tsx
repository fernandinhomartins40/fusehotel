import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ContactHeroCustomizer } from '@/components/admin/contact/ContactHeroCustomizer';
import { ContactCardsCustomizer } from '@/components/admin/contact/ContactCardsCustomizer';
import { ContactFormCustomizer } from '@/components/admin/contact/ContactFormCustomizer';
import { ContactFAQCTACustomizer } from '@/components/admin/contact/ContactFAQCTACustomizer';

export default function ContactCustomizer() {
  const [activeTab, setActiveTab] = useState('hero');

  const handlePreviewContactPage = () => {
    window.open('/contato', '_blank');
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        {/* Header com título e botão de preview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Página de Contato</h2>
            <p className="text-muted-foreground">
              Configure todas as seções da página de contato
            </p>
          </div>
          <Button onClick={handlePreviewContactPage} variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visualizar Página
          </Button>
        </div>

        {/* Tabs de navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="cards">Cartões</TabsTrigger>
            <TabsTrigger value="form">Formulário</TabsTrigger>
            <TabsTrigger value="faq-cta">CTA FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <ContactHeroCustomizer />
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <ContactCardsCustomizer />
          </TabsContent>

          <TabsContent value="form" className="space-y-4">
            <ContactFormCustomizer />
          </TabsContent>

          <TabsContent value="faq-cta" className="space-y-4">
            <ContactFAQCTACustomizer />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
