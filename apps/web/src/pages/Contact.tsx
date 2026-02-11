
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useLandingSettings } from '@/hooks/useLanding';
import { MapEmbed } from '@/components/ui/MapEmbed';
import {
  defaultContactHeroConfig,
  defaultContactCardsConfig,
  defaultContactFormConfig,
  defaultContactFAQCTAConfig,
} from '@/types/contact-config';

const Contact: React.FC = () => {
  const { data: heroData } = useLandingSettings('contact-hero');
  const { data: cardsData } = useLandingSettings('contact-cards');
  const { data: formData } = useLandingSettings('contact-form');
  const { data: faqCtaData } = useLandingSettings('contact-faq-cta');

  const heroConfig = heroData?.config || defaultContactHeroConfig;
  const cardsConfig = cardsData?.config || defaultContactCardsConfig;
  const formConfig = formData?.config || defaultContactFormConfig;
  const faqCtaConfig = faqCtaData?.config || defaultContactFAQCTAConfig;

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
        <div
          className="text-white py-12"
          style={{
            backgroundColor: heroConfig.backgroundColor || '#0466C8',
            height: heroConfig.height || 'auto',
          }}
        >
          <div className="container mx-auto px-4">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: heroConfig.titleColor || '#FFFFFF' }}
            >
              {heroConfig.title || 'Entre em Contato'}
            </h1>
            <p
              className="text-xl max-w-3xl"
              style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}
            >
              {heroConfig.description || 'Estamos à disposição para responder suas dúvidas, receber sugestões ou ajudar com sua reserva.'}
            </p>
          </div>
        </div>
        
        {/* Contact Information Cards */}
        <section className="py-12" style={{ backgroundColor: cardsConfig.backgroundColor || '#F9FAFB' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Phone Card */}
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${cardsConfig.cardIconColor || '#0466C8'}20` }}
                  >
                    <Phone className="h-8 w-8" style={{ color: cardsConfig.cardIconColor || '#0466C8' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cardsConfig.phoneTitle || 'Telefone'}</h3>
                  <p className="text-gray-600 mb-4">{cardsConfig.phoneDescription}</p>
                  <a
                    href={`tel:+55${cardsConfig.phoneNumber?.replace(/\D/g, '')}`}
                    className="font-medium hover:underline"
                    style={{ color: cardsConfig.cardLinkColor || '#0466C8' }}
                  >
                    {cardsConfig.phoneNumber || '(11) 5555-5555'}
                  </a>
                </CardContent>
              </Card>

              {/* WhatsApp Card */}
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${cardsConfig.cardIconColor || '#0466C8'}20` }}
                  >
                    <MessageSquare className="h-8 w-8" style={{ color: cardsConfig.cardIconColor || '#0466C8' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cardsConfig.whatsappTitle || 'WhatsApp'}</h3>
                  <p className="text-gray-600 mb-4">{cardsConfig.whatsappDescription}</p>
                  <a
                    href={`https://wa.me/55${cardsConfig.whatsappNumber?.replace(/\D/g, '')}`}
                    className="font-medium hover:underline"
                    style={{ color: cardsConfig.cardLinkColor || '#0466C8' }}
                  >
                    {cardsConfig.whatsappNumber || '(11) 99999-9999'}
                  </a>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${cardsConfig.cardIconColor || '#0466C8'}20` }}
                  >
                    <Mail className="h-8 w-8" style={{ color: cardsConfig.cardIconColor || '#0466C8' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cardsConfig.emailTitle || 'E-mail'}</h3>
                  <p className="text-gray-600 mb-4">{cardsConfig.emailDescription}</p>
                  <a
                    href={`mailto:${cardsConfig.emailAddress}`}
                    className="font-medium hover:underline"
                    style={{ color: cardsConfig.cardLinkColor || '#0466C8' }}
                  >
                    {cardsConfig.emailAddress || 'contato@hotel.com'}
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Contact Form and Map */}
        <section className="py-16" style={{ backgroundColor: formConfig.backgroundColor || '#FFFFFF' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: formConfig.titleColor || '#0466C8' }}
                >
                  {formConfig.formTitle || 'Envie uma Mensagem'}
                </h2>
                <p className="text-gray-700 mb-8">
                  {formConfig.formDescription || 'Preencha o formulário abaixo com suas informações e entraremos em contato o mais breve possível.'}
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
                    className="w-full rounded-full py-3"
                    style={{
                      backgroundColor: formConfig.buttonColor || '#0466C8',
                      color: formConfig.buttonTextColor || '#FFFFFF',
                    }}
                  >
                    {formConfig.buttonText || 'Enviar Mensagem'}
                  </Button>
                </form>
              </div>
              
              {/* Map and Additional Information */}
              <div className="space-y-8">
                <div>
                  <h2
                    className="text-3xl font-bold mb-6"
                    style={{ color: formConfig.titleColor || '#0466C8' }}
                  >
                    {formConfig.mapTitle || 'Nossa Localização'}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {formConfig.mapDescription || 'Visite-nos e conheça pessoalmente toda a estrutura do Hotel Águas Claras.'}
                  </p>

                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <MapEmbed
                      address={`${formConfig.addressLine1}, ${formConfig.addressLine2}`}
                      height="400px"
                    />
                  </div>
                </div>
                
                {/* Additional Contact Information */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin
                        className="h-6 w-6 mr-3 mt-0.5"
                        style={{ color: formConfig.titleColor || '#0466C8' }}
                      />
                      <div>
                        <p className="font-medium">{formConfig.addressLabel || 'Endereço:'}</p>
                        <p className="text-gray-600">{formConfig.addressLine1}</p>
                        <p className="text-gray-600">{formConfig.addressLine2}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock
                        className="h-6 w-6 mr-3"
                        style={{ color: formConfig.titleColor || '#0466C8' }}
                      />
                      <div>
                        <p className="font-medium">{formConfig.hoursLabel || 'Horário de Funcionamento:'}</p>
                        <p className="text-gray-600">{formConfig.hoursLine1}</p>
                        <p className="text-gray-600">{formConfig.hoursLine2}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs Section */}
        <section className="py-12" style={{ backgroundColor: faqCtaConfig.backgroundColor || '#F9FAFB' }}>
          <div className="container mx-auto px-4 text-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: faqCtaConfig.titleColor || '#000000' }}
            >
              {faqCtaConfig.title || 'Perguntas Frequentes'}
            </h2>
            <p
              className="mb-8 max-w-3xl mx-auto"
              style={{ color: faqCtaConfig.subtitleColor || '#374151' }}
            >
              {faqCtaConfig.description || 'Encontre respostas para as perguntas mais comuns sobre nossa hospedagem e serviços.'}
            </p>
            <Button
              className="rounded-full px-8 py-3"
              style={{
                backgroundColor: faqCtaConfig.buttonColor || '#0466C8',
                color: faqCtaConfig.buttonTextColor || '#FFFFFF',
              }}
              asChild
            >
              <a href={faqCtaConfig.buttonUrl || '/faq'}>
                {faqCtaConfig.buttonText || 'Ver todas as FAQs'}
              </a>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
