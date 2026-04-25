import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallPrompt() {
  const { canInstall, promptInstall } = usePWAInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={promptInstall}>
      <Download className="mr-2 h-4 w-4" />
      Instalar app
    </Button>
  );
}
