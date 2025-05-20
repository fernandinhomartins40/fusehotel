import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Wifi, Tv, AirVent, Bed, DoorOpen, Utensils, MapPin, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

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
  
  // Find the room data based on the URL parameter
  const room = roomsData[roomId as keyof typeof roomsData];
  
  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Acomodação não encontrada</h1>
            <p className="text-lg text-gray-600 mb-6">A acomodação que você está procurando não está disponível.</p>
            <Button className="bg-[#0466C8] hover:bg-[#0355A6]">
              <a href="#accommodations">Ver todas acomodações</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Room Image Gallery Carousel */}
        <div className="w-full bg-gray-100">
          <Carousel className="max-w-7xl mx-auto">
            <CarouselContent>
              {room.images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="h-[500px] relative">
                    <img 
                      src={image} 
                      alt={`${room.title} - Imagem ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-5 md:-left-10 bg-white/90" />
            <CarouselNext className="-right-5 md:-right-10 bg-white/90" />
          </Carousel>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Room Details - Left Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Room Header with Breakfast Badge */}
              <div className="relative">
                <div className="inline-block bg-[#0466C8] text-white text-sm font-medium uppercase px-4 py-1.5 mb-4">
                  Café da Manhã Incluso
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{room.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{room.description}</p>
              </div>

              {/* Room Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Descrição do quarto</h2>
                {room.longDescription.map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Room Amenities */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informações do quarto</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check size={16} className="text-[#0466C8]" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resort Features */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Diferenciais do resort</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                  {room.resortFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check size={16} className="text-[#0466C8]" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Outras informações</h2>
                <div className="space-y-2">
                  {room.additionalInfo.map((info, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check size={16} className="text-[#0466C8]" />
                      <span className="text-gray-700">{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card - Right Column */}
            <div className="md:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-center mb-6">Reserva online</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-[#0466C8]" />
                    <span className="text-gray-700">A partir de: <span className="font-bold text-black">{room.price}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Bed size={20} className="text-[#0466C8]" />
                    <span className="text-gray-700">{room.capacity}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <AirVent size={20} className="text-[#0466C8]" />
                    <span className="text-gray-700">{room.area}</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">Data de Check-in</label>
                    <Input 
                      type="date" 
                      id="check-in" 
                      className="w-full border-gray-300" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">Data de Check-out</label>
                    <Input 
                      type="date" 
                      id="check-out" 
                      className="w-full border-gray-300" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Número de hóspedes</label>
                    <select 
                      id="guests" 
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="1">1 pessoa</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                    </select>
                  </div>
                </div>
                
                <Button className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white py-3 rounded-md transition-colors font-medium text-lg">
                  Fazer Reserva
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoomDetail;
