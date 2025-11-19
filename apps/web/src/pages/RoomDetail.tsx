
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, ArrowLeft, Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { BookingCard } from "@/components/ui/BookingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock data for room details - in a real app this would come from an API
const roomsData = {
  "suite-paraiso-tropical": {
    title: "Suíte Paraíso Tropical",
    description: "Proporciona uma imersão total na natureza, sendo cercada por palmeiras e jardins tropicais que criam uma atmosfera tranquila e relaxante. A ampla varanda privativa é o local perfeito para desfrutar de um café da manhã ao ar livre, ouvindo os sons suaves da natureza ao redor. A suíte combina o charme tropical com um toque de elegância moderna, oferecendo o equilíbrio perfeito entre conforto e estilo.",
    longDescription: [
      "No interior, a suíte apresenta uma cama king size de alta qualidade e uma decoração tropical, com cores suaves que remetem à natureza ao seu redor. O banheiro espaçoso conta com acabamentos em mármore e inclui um secador de cabelo e roupões macios para seu conforto. A suíte também dispõe de ar-condicionado, garantindo que o ambiente esteja sempre fresco e agradável, independentemente da temperatura externa.",
      "Entre as comodidades, estão inclusas Wi-Fi gratuito, TV a cabo, cofre eletrônico e frigobar. Seja para relaxar na varanda ou aproveitar o conforto interior, a Suíte Paraíso Tropical oferece uma experiência inesquecível de luxo em meio à natureza."
    ],
    price: "R$599/diária",
    capacity: "Até 3 Pessoas",
    area: "40 m²",
    amenities: ["Wi-Fi", "Ar Condicionado", "Frigobar", "Secador de Cabelo", "Cama King Size", "Cofre Eletrônico", "Serviço de Quarto", "Varanda", "Mesa de Trabalho", "Cortinas Blackout"],
    resortFeatures: ["WiFi", "Piscina", "Piscina Aquecida", "Jardim", "Salão de Jogos", "Salão de Festas", "Bar Molhado", "Café da Manhã", "Spa", "Massagem", "Pet Friendly", "Restaurante"],
    additionalInfo: [
      "Checkin 14:00 Checkout 12:00",
      "Av Paulista, 900 - São Paulo"
    ],
    images: [
      "/lovable-uploads/e5ecb0e1-d687-4ba0-bddc-9a5649e7c187.png",
      "/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png", 
      "/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png"
    ]
  },
  "suite-praia-dourada": {
    title: "Suíte Praia Dourada",
    description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
    longDescription: [
      "A Suíte Praia Dourada oferece uma experiência premium com vista direta para o oceano. O amplo espaço de 50m² foi projetado para proporcionar o máximo conforto, com acabamentos de luxo e decoração elegante que combina elementos modernos e toques praeiros.",
      "O destaque da suíte é sua varanda privativa com hidromassagem, onde os hóspedes podem relaxar enquanto apreciam o pôr do sol sobre o mar. O interior espaçoso conta com uma área de estar separada, permitindo momentos de descanso e socialização com total privacidade."
    ],
    price: "R$699/diária",
    capacity: "Até 4 Pessoas",
    area: "50 m²",
    amenities: ["Wi-Fi", "Ar Condicionado", "Frigobar", "Secador de Cabelo", "Cama King Size", "Cofre Eletrônico", "Serviço de Quarto", "Varanda com Hidromassagem", "Smart TV 55\"", "Sistema de Som"],
    resortFeatures: ["WiFi", "Piscina", "Piscina Aquecida", "Jardim", "Salão de Jogos", "Salão de Festas", "Bar Molhado", "Café da Manhã", "Spa", "Massagem", "Pet Friendly", "Restaurante"],
    additionalInfo: [
      "Checkin 14:00 Checkout 12:00",
      "Av Paulista, 900 - São Paulo"
    ],
    images: [
      "/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png", 
      "/lovable-uploads/e5ecb0e1-d687-4ba0-bddc-9a5649e7c187.png",
      "/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png"
    ]
  },
  "suite-oceano-azul": {
    title: "Suíte Oceano Azul",
    description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
    longDescription: [
      "A Suíte Oceano Azul é um refúgio tranquilo inspirado nas cores do mar. Com seus 30m², oferece um espaço aconchegante e perfeitamente estruturado para garantir conforto e privacidade durante sua estadia.",
      "A decoração em tons de azul e detalhes náuticos cria uma atmosfera relaxante, complementada por uma pequena varanda com vista para os jardins do resort. Ideal para casais que buscam um ambiente romântico e sereno."
    ],
    price: "R$499/diária",
    capacity: "Até 2 Pessoas",
    area: "30 m²",
    amenities: ["Wi-Fi", "Ar Condicionado", "Frigobar", "Secador de Cabelo", "Cama Queen Size", "Cofre Eletrônico", "Serviço de Quarto", "Varanda", "TV a Cabo"],
    resortFeatures: ["WiFi", "Piscina", "Piscina Aquecida", "Jardim", "Salão de Jogos", "Salão de Festas", "Bar Molhado", "Café da Manhã", "Spa", "Massagem", "Pet Friendly", "Restaurante"],
    additionalInfo: [
      "Checkin 14:00 Checkout 12:00",
      "Av Paulista, 900 - São Paulo"
    ],
    images: [
      "/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png",
      "/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png", 
      "/lovable-uploads/e5ecb0e1-d687-4ba0-bddc-9a5649e7c187.png"
    ]
  }
};

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  
  console.log('RoomDetail component rendered with roomId:', roomId);
  console.log('Available room keys:', Object.keys(roomsData));
  
  // Verificar se roomId existe e se há dados para essa sala
  if (!roomId || !roomsData[roomId as keyof typeof roomsData]) {
    console.log('Room not found, rendering 404 page');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Acomodação não encontrada</h1>
            <p className="text-lg text-gray-600 mb-6">A acomodação que você está procurando não está disponível.</p>
            <Button className="bg-[#0466C8] hover:bg-[#0355A6]" asChild>
              <Link to="/acomodacoes">Ver todas acomodações</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const room = roomsData[roomId as keyof typeof roomsData];
  const maxGuests = parseInt(room.capacity.match(/\d+/)?.[0] || "2");

  console.log('Rendering room detail page for:', room.title);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Início</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/acomodacoes">Acomodações</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{room.title}</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={room.images} title={room.title} />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room Details - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Room Header */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-[#0466C8] hover:bg-[#0355A6] text-white">
                    Café da Manhã Incluso
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.8 (124 avaliações)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{room.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#0466C8]" />
                    <span>Av Paulista, 900 - São Paulo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-[#0466C8]" />
                    <span>Check-in 14:00 • Check-out 12:00</span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed">{room.description}</p>
              </div>

              <Separator />

              {/* Room Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sobre a acomodação</h2>
                <div className="space-y-4">
                  {room.longDescription.map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Room Amenities */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comodidades do quarto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Check size={18} className="text-[#0466C8] flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Resort Features */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Facilidades do resort</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {room.resortFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Check size={16} className="text-[#0466C8] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card - Right Column */}
            <div className="lg:col-span-1">
              <BookingCard 
                price={room.price}
                capacity={room.capacity}
                area={room.area}
                maxGuests={maxGuests}
              />
            </div>
          </div>
        </div>

        {/* Back to Accommodations */}
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Button variant="outline" asChild className="border-[#0466C8] text-[#0466C8] hover:bg-[#0466C8] hover:text-white">
              <Link to="/acomodacoes" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Ver todas as acomodações
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoomDetail;
