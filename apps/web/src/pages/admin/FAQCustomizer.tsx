import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { FAQHeroCustomizer } from '@/components/admin/faq/FAQHeroCustomizer';
import { FAQContentCustomizer } from '@/components/admin/faq/FAQContentCustomizer';
import { FAQContactCustomizer } from '@/components/admin/faq/FAQContactCustomizer';

export default function FAQCustomizer() {
  const [activeTab, setActiveTab] = useState('hero');

  const handlePreviewFAQPage = () => {
    window.open('/faq', '_blank');
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        {/* Header com título e botão de preview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Página FAQ</h2>
            <p className="text-muted-foreground">
              Configure todas as seções da página de Perguntas Frequentes
            </p>
          </div>
          <Button onClick={handlePreviewFAQPage} variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visualizar Página
          </Button>
        </div>

        {/* Tabs de navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <FAQHeroCustomizer />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <FAQContentCustomizer />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <FAQContactCustomizer />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
