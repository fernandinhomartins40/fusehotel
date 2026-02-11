
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Home, Settings, Tag, Users, Palette, FileText, HelpCircle, Mail, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 bg-white">
            <div className="flex items-center px-2 py-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="text-gray-900">Painel do Hoteleiro</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-white">
            {/* Gestão Principal */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">Gestão</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin')} className="data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600">
                      <Link to="/admin">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/reservations')} className="data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700 data-[active=true]:border-r-2 data-[active=true]:border-purple-600">
                      <Link to="/admin/reservations">
                        <Calendar />
                        <span>Reservas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/schedule')} className="data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 data-[active=true]:border-r-2 data-[active=true]:border-indigo-600">
                      <Link to="/admin/schedule">
                        <CalendarDays />
                        <span>Agenda</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/customers')} className="data-[active=true]:bg-cyan-50 data-[active=true]:text-cyan-700 data-[active=true]:border-r-2 data-[active=true]:border-cyan-600">
                      <Link to="/admin/customers">
                        <Users />
                        <span>Clientes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Conteúdo do Hotel */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">Conteúdo do Hotel</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/accommodations')} className="data-[active=true]:bg-green-50 data-[active=true]:text-green-700 data-[active=true]:border-r-2 data-[active=true]:border-green-600">
                      <Link to="/admin/accommodations">
                        <Home />
                        <span>Acomodações</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/packages-promotions')} className="data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 data-[active=true]:border-r-2 data-[active=true]:border-orange-600">
                      <Link to="/admin/packages-promotions">
                        <Tag />
                        <span>Pacotes e Promoções</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Customização do Site */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">Customização do Site</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/landing-customizer')} className="data-[active=true]:bg-pink-50 data-[active=true]:text-pink-700 data-[active=true]:border-r-2 data-[active=true]:border-pink-600">
                      <Link to="/admin/landing-customizer">
                        <Home className="h-4 w-4" />
                        <span>Página Inicial</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/about-customizer')} className="data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700 data-[active=true]:border-r-2 data-[active=true]:border-purple-600">
                      <Link to="/admin/about-customizer">
                        <FileText className="h-4 w-4" />
                        <span>Sobre Nós</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/services-customizer')} className="data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 data-[active=true]:border-r-2 data-[active=true]:border-indigo-600">
                      <Link to="/admin/services-customizer">
                        <Palette className="h-4 w-4" />
                        <span>Serviços</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/faq-customizer')} className="data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-700 data-[active=true]:border-r-2 data-[active=true]:border-yellow-600">
                      <Link to="/admin/faq-customizer">
                        <HelpCircle className="h-4 w-4" />
                        <span>FAQ</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/contact-customizer')} className="data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700 data-[active=true]:border-r-2 data-[active=true]:border-teal-600">
                      <Link to="/admin/contact-customizer">
                        <Mail className="h-4 w-4" />
                        <span>Contato</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Configurações */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/settings')} className="data-[active=true]:bg-gray-50 data-[active=true]:text-gray-700 data-[active=true]:border-r-2 data-[active=true]:border-gray-600">
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
          <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6 shadow-sm">
            <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
            <div className="flex-1" />
            <Button variant="outline" size="sm" asChild className="border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao site
              </Link>
            </Button>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
