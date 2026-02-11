import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { AboutHeroCustomizer } from '@/components/admin/about/AboutHeroCustomizer';
import { HistoryCustomizer } from '@/components/admin/about/HistoryCustomizer';
import { MissionVisionValuesCustomizer } from '@/components/admin/about/MissionVisionValuesCustomizer';
import { TeamCustomizer } from '@/components/admin/about/TeamCustomizer';
import { AwardsCustomizer } from '@/components/admin/about/AwardsCustomizer';

export default function AboutCustomizer() {
  const [activeTab, setActiveTab] = useState('hero');

  const handlePreviewAboutPage = () => {
    window.open('/sobre-nos', '_blank');
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        {/* Header com título e botão de preview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Página Sobre Nós</h2>
            <p className="text-muted-foreground">
              Configure todas as seções da página Sobre Nós
            </p>
          </div>
          <Button onClick={handlePreviewAboutPage} variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visualizar Página
          </Button>
        </div>

        {/* Tabs de navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="history">História</TabsTrigger>
            <TabsTrigger value="mvv">Missão/Visão/Valores</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="awards">Prêmios</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <AboutHeroCustomizer />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryCustomizer />
          </TabsContent>

          <TabsContent value="mvv" className="space-y-4">
            <MissionVisionValuesCustomizer />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <TeamCustomizer />
          </TabsContent>

          <TabsContent value="awards" className="space-y-4">
            <AwardsCustomizer />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
