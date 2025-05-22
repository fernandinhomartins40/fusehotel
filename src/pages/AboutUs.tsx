
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const AboutUs: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        {/* Hero Section */}
        <div className="bg-[#0466C8] text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nós</h1>
            <p className="text-xl max-w-3xl">Conheça a história e a equipe por trás do Hotel Águas Claras, onde tradição e hospitalidade se encontram para proporcionar a melhor experiência aos nossos hóspedes.</p>
          </div>
        </div>
        
        {/* History Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#0466C8]">Nossa História</h2>
              <p className="text-gray-700 mb-4">
                Fundado em 1985, o Hotel Águas Claras começou como um pequeno estabelecimento familiar com apenas 10 quartos. Com o passar dos anos, crescemos e nos transformamos em um dos hotéis mais respeitados da região, mantendo sempre o acolhimento e o atendimento personalizado que nos caracteriza.
              </p>
              <p className="text-gray-700 mb-4">
                Localizado em uma área privilegiada, entre montanhas e próximo a nascentes naturais, nosso hotel foi construído com o compromisso de preservar o meio ambiente e oferecer aos nossos hóspedes uma experiência autêntica de contato com a natureza.
              </p>
              <p className="text-gray-700">
                Hoje, contamos com 45 acomodações de alto padrão, divididas entre apartamentos, chalés e suítes, todas equipadas com infraestrutura moderna e decoração que remete à natureza exuberante da região.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <img 
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
                alt="Vista do Hotel Águas Claras" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        
        {/* Mission and Values */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#0466C8]">Missão, Visão e Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-[#0466C8]">Missão</h3>
                <p className="text-gray-700">
                  Proporcionar aos nossos hóspedes uma experiência única de hospedagem, combinando conforto, hospitalidade e contato com a natureza, superando suas expectativas e criando momentos memoráveis.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-[#0466C8]">Visão</h3>
                <p className="text-gray-700">
                  Ser reconhecido como referência em hotelaria sustentável na região, aliando qualidade de serviços, respeito ao meio ambiente e promoção do turismo local.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-[#0466C8]">Valores</h3>
                <ul className="text-gray-700 list-disc pl-5 space-y-2">
                  <li>Excelência no atendimento</li>
                  <li>Sustentabilidade ambiental</li>
                  <li>Valorização da cultura local</li>
                  <li>Inovação e melhoria contínua</li>
                  <li>Ética e transparência</li>
                  <li>Trabalho em equipe</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#0466C8]">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY4MzczNzY1MQ&ixlib=rb-4.0.3&q=80&w=300" 
                  alt="Ana Oliveira" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Ana Oliveira</h3>
              <p className="text-[#0466C8] mb-3">Diretora Geral</p>
              <p className="text-gray-700 text-center max-w-xs">
                Com mais de 20 anos de experiência em hotelaria, Ana lidera nossa equipe com dedicação e visão inovadora.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFufHx8fHx8MTY4MzczNzY5NA&ixlib=rb-4.0.3&q=80&w=300" 
                  alt="Carlos Santos" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Carlos Santos</h3>
              <p className="text-[#0466C8] mb-3">Chef Executivo</p>
              <p className="text-gray-700 text-center max-w-xs">
                Formado na França, Carlos traz para nossa cozinha o melhor da gastronomia internacional com toques regionais.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tYW58fHx8fHwxNjgzNzM3NzQy&ixlib=rb-4.0.3&q=80&w=300" 
                  alt="Mariana Lima" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Mariana Lima</h3>
              <p className="text-[#0466C8] mb-3">Gerente de Hospitalidade</p>
              <p className="text-gray-700 text-center max-w-xs">
                Especialista em atendimento ao cliente, Mariana garante que cada hóspede tenha uma experiência memorável.
              </p>
            </div>
          </div>
        </section>
        
        {/* Awards Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#0466C8]">Reconhecimentos e Prêmios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="text-[#0466C8] text-5xl mb-4">🏆</div>
                <h3 className="text-lg font-bold mb-2">Melhor Hotel Sustentável</h3>
                <p className="text-gray-700">Prêmio Verde - 2023</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="text-[#0466C8] text-5xl mb-4">🌟</div>
                <h3 className="text-lg font-bold mb-2">Excelência em Hospitalidade</h3>
                <p className="text-gray-700">Guia 5 Estrelas - 2022</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="text-[#0466C8] text-5xl mb-4">🍽️</div>
                <h3 className="text-lg font-bold mb-2">Gastronomia Regional</h3>
                <p className="text-gray-700">Festival Sabores - 2021</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="text-[#0466C8] text-5xl mb-4">💼</div>
                <h3 className="text-lg font-bold mb-2">Melhor para Eventos</h3>
                <p className="text-gray-700">Associação de Turismo - 2020</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
