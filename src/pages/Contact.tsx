
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
    // Show success message or redirect
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#0466C8] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-xl max-w-3xl">
              Estamos à disposição para responder suas dúvidas, receber sugestões ou ajudar com sua reserva.
            </p>
          </div>
        </div>
        
        {/* Contact Information Cards */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Phone Card */}
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8 text-[#0466C8]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Telefone</h3>
                  <p className="text-gray-600 mb-4">Estamos disponíveis para atendê-lo por telefone em horário comercial.</p>
                  <a href="tel:+551155555555" className="text-[#0466C8] font-medium hover:underline">(11) 5555-5555</a>
                </CardContent>
              </Card>
              
              {/* WhatsApp Card */}
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-[#0466C8]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                  <p className="text-gray-600 mb-4">Envie mensagens pelo WhatsApp para atendimento rápido.</p>
                  <a href="https://wa.me/5511999999999" className="text-[#0466C8] font-medium hover:underline">(11) 99999-9999</a>
                </CardContent>
              </Card>
              
              {/* Email Card */}
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-[#0466C8]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">E-mail</h3>
                  <p className="text-gray-600 mb-4">Envie um e-mail para nossa equipe e responderemos em até 24 horas.</p>
                  <a href="mailto:contato@aguasclaras.com" className="text-[#0466C8] font-medium hover:underline">contato@aguasclaras.com</a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Contact Form and Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#0466C8]">Envie uma Mensagem</h2>
                <p className="text-gray-700 mb-8">
                  Preencha o formulário abaixo com suas informações e entraremos em contato o mais breve possível.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nome*
                      </label>
                      <Input
                        id="nome"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-mail*
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-700">
                      Assunto*
                    </label>
                    <Input
                      id="assunto"
                      type="text"
                      placeholder="O assunto da sua mensagem"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
                      Mensagem*
                    </label>
                    <Textarea
                      id="mensagem"
                      placeholder="Escreva sua mensagem aqui..."
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="termos" required />
                    <label
                      htmlFor="termos"
                      className="text-sm text-gray-600"
                    >
                      Concordo com a <a href="/politicas-de-privacidade" className="text-[#0466C8] hover:underline">Política de Privacidade</a>
                    </label>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full py-3"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </div>
              
              {/* Map and Additional Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-[#0466C8]">Nossa Localização</h2>
                  <p className="text-gray-700 mb-6">
                    Visite-nos e conheça pessoalmente toda a estrutura do Hotel Águas Claras.
                  </p>
                  
                  <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden relative">
                    {/* Placeholder for a real map integration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin size={32} />
                      <span className="ml-2">Mapa disponível em breve</span>
                    </div>
                  </div>
                </div>
                
                {/* Additional Contact Information */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-[#0466C8] mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Endereço:</p>
                        <p className="text-gray-600">Rua das Águas, 123, Centro</p>
                        <p className="text-gray-600">Águas Claras - SP, 12345-678</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-[#0466C8] mr-3" />
                      <div>
                        <p className="font-medium">Horário de Funcionamento:</p>
                        <p className="text-gray-600">Recepção: 24 horas</p>
                        <p className="text-gray-600">Atendimento telefônico: 8h às 22h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-700 mb-8 max-w-3xl mx-auto">
              Encontre respostas para as perguntas mais comuns sobre nossa hospedagem e serviços.
            </p>
            <Button
              className="bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full px-8 py-3"
              asChild
            >
              <a href="/faq">Ver todas as FAQs</a>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
