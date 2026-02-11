import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ServicesCustomizer } from '@/components/admin/landing/ServicesCustomizer';

export default function ServicesCustomizerPage() {
  const [activeTab, setActiveTab] = useState('services');

  const handlePreviewServicesPage = () => {
    window.open('/servicos', '_blank');
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        {/* Header com título e botão de preview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Página de Serviços</h2>
            <p className="text-muted-foreground">
              Configure todas as seções da página de Serviços
            </p>
          </div>
          <Button onClick={handlePreviewServicesPage} variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visualizar Página
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          <ServicesCustomizer />
        </div>
      </div>
    </AdminLayout>
  );
}
