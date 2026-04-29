import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  BedDouble,
  Calendar,
  ClipboardCheck,
  ConciergeBell,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  Mail,
  Palette,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  activeClassName: string;
}

const primaryItems: MenuItem[] = [
  {
    path: '/admin',
    label: 'Painel do turno',
    icon: LayoutDashboard,
    activeClassName:
      'data-[active=true]:bg-lime-50 data-[active=true]:text-lime-700 data-[active=true]:border-r-2 data-[active=true]:border-lime-600',
  },
  {
    path: '/admin/pos',
    label: 'PDV',
    icon: ShoppingCart,
    activeClassName:
      'data-[active=true]:bg-cyan-50 data-[active=true]:text-cyan-700 data-[active=true]:border-r-2 data-[active=true]:border-cyan-600',
  },
  {
    path: '/admin/frontdesk',
    label: 'Recepção',
    icon: ConciergeBell,
    activeClassName:
      'data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-r-2 data-[active=true]:border-emerald-600',
  },
  {
    path: '/admin/reservations',
    label: 'Reservas',
    icon: Calendar,
    activeClassName:
      'data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700 data-[active=true]:border-r-2 data-[active=true]:border-purple-600',
  },
];

const hotelItems: MenuItem[] = [
  {
    path: '/admin/room-units',
    label: 'Quartos',
    icon: BedDouble,
    activeClassName:
      'data-[active=true]:bg-sky-50 data-[active=true]:text-sky-700 data-[active=true]:border-r-2 data-[active=true]:border-sky-600',
  },
  {
    path: '/admin/housekeeping',
    label: 'Governança',
    icon: ClipboardCheck,
    activeClassName:
      'data-[active=true]:bg-amber-50 data-[active=true]:text-amber-700 data-[active=true]:border-r-2 data-[active=true]:border-amber-600',
  },
  {
    path: '/admin/maintenance',
    label: 'Manutenção',
    icon: Wrench,
    activeClassName:
      'data-[active=true]:bg-rose-50 data-[active=true]:text-rose-700 data-[active=true]:border-r-2 data-[active=true]:border-rose-600',
  },
  {
    path: '/admin/customers',
    label: 'Hóspedes',
    icon: Users,
    activeClassName:
      'data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 data-[active=true]:border-r-2 data-[active=true]:border-orange-600',
  },
];

const backofficeItems: MenuItem[] = [
  {
    path: '/admin/dashboard',
    label: 'Indicadores',
    icon: LayoutDashboard,
    activeClassName:
      'data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600',
  },
  {
    path: '/admin/reports',
    label: 'Relatórios',
    icon: BarChart3,
    activeClassName:
      'data-[active=true]:bg-fuchsia-50 data-[active=true]:text-fuchsia-700 data-[active=true]:border-r-2 data-[active=true]:border-fuchsia-600',
  },
];

const catalogItems: MenuItem[] = [
  {
    path: '/admin/accommodations',
    label: 'Tipos de hospedagem',
    icon: Home,
    activeClassName:
      'data-[active=true]:bg-green-50 data-[active=true]:text-green-700 data-[active=true]:border-r-2 data-[active=true]:border-green-600',
  },
  {
    path: '/admin/packages-promotions',
    label: 'Pacotes e promoções',
    icon: Tag,
    activeClassName:
      'data-[active=true]:bg-pink-50 data-[active=true]:text-pink-700 data-[active=true]:border-r-2 data-[active=true]:border-pink-600',
  },
];

const siteItems: MenuItem[] = [
  {
    path: '/admin/landing-customizer',
    label: 'Página inicial',
    icon: Home,
    activeClassName:
      'data-[active=true]:bg-pink-50 data-[active=true]:text-pink-700 data-[active=true]:border-r-2 data-[active=true]:border-pink-600',
  },
  {
    path: '/admin/about-customizer',
    label: 'Sobre nós',
    icon: FileText,
    activeClassName:
      'data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700 data-[active=true]:border-r-2 data-[active=true]:border-purple-600',
  },
  {
    path: '/admin/services-customizer',
    label: 'Serviços',
    icon: Palette,
    activeClassName:
      'data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 data-[active=true]:border-r-2 data-[active=true]:border-indigo-600',
  },
  {
    path: '/admin/faq-customizer',
    label: 'FAQ',
    icon: HelpCircle,
    activeClassName:
      'data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-700 data-[active=true]:border-r-2 data-[active=true]:border-yellow-600',
  },
  {
    path: '/admin/contact-customizer',
    label: 'Contato',
    icon: Mail,
    activeClassName:
      'data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700 data-[active=true]:border-r-2 data-[active=true]:border-teal-600',
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderMenuItems = (items: MenuItem[], variant: 'default' | 'primary' = 'default') =>
    items.map((item) => {
      const Icon = item.icon;

      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.path)}
            className={`${item.activeClassName} ${
              variant === 'primary'
                ? 'h-11 rounded-xl bg-slate-50 font-medium text-slate-800 hover:bg-slate-100'
                : 'rounded-lg'
            }`}
          >
            <Link to={item.path}>
              <Icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 bg-white">
            <div className="space-y-3 px-3 py-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="rounded-lg bg-slate-900 p-2 text-white">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="text-slate-900">FuseHotel PMS</span>
              </div>
              <div className="rounded-xl bg-slate-950 px-3 py-2 text-sm text-white">
                Operação diária do hotel
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-slate-500">Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderMenuItems(primaryItems, 'primary')}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-slate-500">Hotel</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderMenuItems(hotelItems)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-slate-500">Backoffice</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderMenuItems(backofficeItems)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-slate-500">Cadastros</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderMenuItems(catalogItems)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-slate-500">Site</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderMenuItems(siteItems)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="font-medium text-slate-500">Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin/settings')}
                      className="data-[active=true]:border-r-2 data-[active=true]:border-slate-600 data-[active=true]:bg-slate-50 data-[active=true]:text-slate-700"
                    >
                      <Link to="/admin/settings">
                        <Settings />
                        <span>Configurações</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-hidden">
          <header className="flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm lg:px-6">
            <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
            <div className="flex-1" />
            <PWAInstallPrompt />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao site
              </Link>
            </Button>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;

