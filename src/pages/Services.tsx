
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Services: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#0466C8] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossos Serviços</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Descubra todos os serviços e facilidades que tornam sua estadia no Hotel Águas Claras uma experiência inesquecível.
            </p>
          </div>
        </div>
        
        {/* Accommodation Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#0466C8]">Hospedagem</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Oferecemos diversas opções de acomodação para atender às suas necessidades, todas com conforto e elegância.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Standard Room */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop" 
                    alt="Quarto Standard" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-2">Quarto Standard</h3>
                  <p className="text-gray-700 mb-6">
                    Quartos confortáveis com aproximadamente 25m², cama queen-size ou duas camas de solteiro, ar-condicionado, TV e banheiro privativo.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li>• Café da manhã incluso</li>
                    <li>• Wi-Fi gratuito</li>
                    <li>• Frigobar</li>
                    <li>• Secador de cabelo</li>
                  </ul>
                  <a 
                    href="/acomodacoes" 
                    className="text-[#0466C8] font-medium hover:underline inline-flex items-center"
                  >
                    Ver detalhes
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>
              
              {/* Luxury Suite */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop" 
                    alt="Suíte Luxo" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-2">Suíte Luxo</h3>
                  <p className="text-gray-700 mb-6">
                    Suítes espaçosas com 40m², cama king-size, sala de estar, banheira de hidromassagem, varanda com vista privilegiada.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li>• Café da manhã incluso</li>
                    <li>• Wi-Fi de alta velocidade</li>
                    <li>• Serviço de quarto 24h</li>
                    <li>• Amenities premium</li>
                  </ul>
                  <a 
                    href="/acomodacoes" 
                    className="text-[#0466C8] font-medium hover:underline inline-flex items-center"
                  >
                    Ver detalhes
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>
              
              {/* Chalet */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop" 
                    alt="Chalé" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-2">Chalé</h3>
                  <p className="text-gray-700 mb-6">
                    Chalés independentes com 60m², perfeitos para famílias, com 2 quartos, sala de estar, cozinha compacta e deck privativo.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li>• Café da manhã incluso</li>
                    <li>• Lareira</li>
                    <li>• Vista para a mata</li>
                    <li>• Churrasqueira privativa</li>
                  </ul>
                  <a 
                    href="/acomodacoes" 
                    className="text-[#0466C8] font-medium hover:underline inline-flex items-center"
                  >
                    Ver detalhes
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                className="bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full px-8 py-3"
                asChild
              >
                <a href="/acomodacoes">Ver Todas as Acomodações</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Divider */}
        <div className="container mx-auto px-4">
          <hr className="border-gray-200" />
        </div>
        
        {/* Gastronomy */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#0466C8]">Gastronomia</h2>
                <p className="text-gray-700 mb-6">
                  Nossa gastronomia é um dos destaques do hotel, com pratos preparados com ingredientes frescos e regionais, harmonizados com uma cuidadosa seleção de vinhos.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Restaurante Principal</h3>
                    <p className="text-gray-700">
                      O Restaurante Águas Claras serve café da manhã, almoço e jantar com uma rica variedade de pratos da culinária nacional e internacional. Vista panorâmica para as montanhas.
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Horário:</strong> Café da manhã: 7h às 10h | Almoço: 12h às 15h | Jantar: 19h às 22h30
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bar da Piscina</h3>
                    <p className="text-gray-700">
                      Bebidas refrescantes, coquetéis e petiscos servidos à beira da piscina. O local perfeito para relaxar enquanto aprecia o pôr do sol.
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Horário:</strong> 10h às 18h (tempo bom)
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Lobby Bar</h3>
                    <p className="text-gray-700">
                      Ambiente sofisticado para desfrutar de drinques premium e uma carta de vinhos selecionada. Música ao vivo nas sextas e sábados.
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Horário:</strong> 17h às 0h
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop" 
                    alt="Restaurante" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2070&auto=format&fit=crop" 
                    alt="Culinária" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2071&auto=format&fit=crop" 
                    alt="Bar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2127&auto=format&fit=crop" 
                    alt="Bebidas" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recreation and Wellness */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#0466C8]">Lazer e Bem-Estar</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Desfrute de momentos de relaxamento e diversão com nossa completa infraestrutura de lazer e bem-estar.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=2070&auto=format&fit=crop" 
                    alt="Piscinas" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Piscinas</h3>
                  <p className="text-gray-700">
                    Duas piscinas: externa com vista panorâmica e interna aquecida. Serviço de bar na piscina externa e espreguiçadeiras para o seu conforto.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop" 
                    alt="Spa" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Spa</h3>
                  <p className="text-gray-700">
                    Espaço dedicado ao bem-estar com massagens terapêuticas, tratamentos faciais e corporais, sauna seca, sauna a vapor e ofurô.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
                    alt="Academia" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Academia</h3>
                  <p className="text-gray-700">
                    Academia completa com equipamentos modernos de musculação e cardiovascular. Aulas de yoga e alongamento disponíveis mediante agendamento.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1626368175877-79236777e95e?q=80&w=2071&auto=format&fit=crop" 
                    alt="Trilhas" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Trilhas Ecológicas</h3>
                  <p className="text-gray-700">
                    Trilhas de diferentes níveis de dificuldade pela mata nativa, com guias especializados. Observação de pássaros e contato com a natureza.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop" 
                    alt="Esportes" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Esportes</h3>
                  <p className="text-gray-700">
                    Quadras de tênis, vôlei de areia, campo de futebol society e mesa de ping-pong. Equipamentos disponíveis para empréstimo na recepção.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1596461868807-a81baa0d7e3f?q=80&w=2070&auto=format&fit=crop" 
                    alt="Recreação Infantil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Recreação Infantil</h3>
                  <p className="text-gray-700">
                    Espaço kids com monitores especializados, brinquedoteca, atividades ao ar livre e programação especial nas férias e feriados.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Business Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="rounded-lg overflow-hidden h-96">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                    alt="Sala de Reuniões" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6 text-[#0466C8]">Serviços para Negócios</h2>
                <p className="text-gray-700 mb-6">
                  O Hotel Águas Claras oferece espaços versáteis e serviços especializados para eventos corporativos, reuniões e conferências.
                </p>
                
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#0466C8] mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="block">Salas de Reunião</strong>
                      <p>3 salas modulares com capacidade para até 120 pessoas, equipadas com tecnologia audiovisual e internet de alta velocidade.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#0466C8] mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="block">Business Center</strong>
                      <p>Espaço dedicado com computadores, impressora, scanner e serviços de secretariado para atender suas necessidades profissionais.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#0466C8] mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="block">Pacotes Corporativos</strong>
                      <p>Oferecemos pacotes especiais para empresas, incluindo hospedagem, coffee breaks, refeições e atividades de team building.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#0466C8] mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="block">Eventos Sociais</strong>
                      <p>Espaços versáteis para casamentos, aniversários, formaturas e outros eventos sociais, com serviço de buffet personalizado.</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Button 
                    className="bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full"
                    asChild
                  >
                    <a href="/contato">Solicitar Orçamento</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Special Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#0466C8]">Serviços Especiais</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Personalize sua estadia com nossos serviços adicionais de alta qualidade.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-[#0466C8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Decorações Especiais</h3>
                <p className="text-gray-700">
                  Decoração romântica, surpresas para aniversários, flores e outros detalhes personalizados para comemorações.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-[#0466C8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Serviço de Babá</h3>
                <p className="text-gray-700">
                  Profissionais treinados para cuidar das crianças enquanto os pais aproveitam os demais serviços do hotel.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-[#0466C8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Concierge</h3>
                <p className="text-gray-700">
                  Assistência personalizada para reservas em restaurantes, passeios turísticos, transfers e outras solicitações especiais.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-[#0466C8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Transfers</h3>
                <p className="text-gray-700">
                  Serviço de transporte privativo do aeroporto/rodoviária até o hotel e para passeios na região.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-[#0466C8]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Reserve Sua Experiência</h2>
            <p className="text-white text-xl mb-8 max-w-3xl mx-auto">
              Nossos serviços exclusivos estão esperando por você. Reserve agora e garanta uma estadia inesquecível no Hotel Águas Claras.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-white text-[#0466C8] hover:bg-gray-100 rounded-full px-8 py-3 text-lg"
                asChild
              >
                <a href="#">Reservar Agora</a>
              </Button>
              
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-[#0466C8] rounded-full px-8 py-3 text-lg"
                asChild
              >
                <a href="/contato">Contato</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
