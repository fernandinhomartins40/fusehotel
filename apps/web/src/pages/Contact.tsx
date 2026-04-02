import axios from 'axios';
import React, { useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLandingSettings } from '@/hooks/useLanding';
import { apiClient } from '@/lib/api-client';
import { colorWithAlpha, hydrateBrandColors } from '@/lib/brand-theme';
import {
  defaultContactCardsConfig,
  defaultContactFAQCTAConfig,
  defaultContactFormConfig,
  defaultContactHeroConfig,
} from '@/types/contact-config';
import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'sonner';

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: heroData } = useLandingSettings('contact-hero');
  const { data: cardsData } = useLandingSettings('contact-cards');
  const { data: formData } = useLandingSettings('contact-form');
  const { data: faqCtaData } = useLandingSettings('contact-faq-cta');

  const heroConfig = hydrateBrandColors(heroData?.config || defaultContactHeroConfig);
  const cardsConfig = hydrateBrandColors(cardsData?.config || defaultContactCardsConfig);
  const formConfig = hydrateBrandColors(formData?.config || defaultContactFormConfig);
  const faqCtaConfig = hydrateBrandColors(faqCtaData?.config || defaultContactFAQCTAConfig);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;

    setForm((current) => ({
      ...current,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!acceptedPolicy) {
      toast.error('Voce precisa aceitar a politica de privacidade.');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/contact/send-message', form);
      toast.success('Mensagem enviada com sucesso!');
      setForm(initialFormState);
      setAcceptedPolicy(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;

      toast.error(message || 'Nao foi possivel enviar sua mensagem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div
          className="page-section-hero text-white"
          style={{
            backgroundColor: heroConfig.backgroundColor || 'hsl(var(--primary))',
            height: heroConfig.height || 'auto',
          }}
        >
          <div className="page-container text-center">
            <h1
              className="mb-4 text-3xl font-bold md:text-4xl"
              style={{ color: heroConfig.titleColor || '#FFFFFF' }}
            >
              {heroConfig.title || 'Entre em Contato'}
            </h1>
            <p
              className="mx-auto max-w-3xl text-xl"
              style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}
            >
              {heroConfig.description ||
                'Estamos a disposicao para responder suas duvidas, receber sugestoes ou ajudar com sua reserva.'}
            </p>
          </div>
        </div>

        <section
          className="page-section-tight"
          style={{ backgroundColor: cardsConfig.backgroundColor || '#F9FAFB' }}
        >
          <div className="page-container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colorWithAlpha(cardsConfig.cardIconColor, 0.12),
                    }}
                  >
                    <Phone
                      className="h-8 w-8"
                      style={{ color: cardsConfig.cardIconColor || 'hsl(var(--primary))' }}
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">
                    {cardsConfig.phoneTitle || 'Telefone'}
                  </h3>
                  <p className="mb-4 text-gray-600">
                    {cardsConfig.phoneDescription}
                  </p>
                  <a
                    href={`tel:+55${cardsConfig.phoneNumber?.replace(/\D/g, '')}`}
                    className="font-medium hover:underline"
                    style={{ color: cardsConfig.cardLinkColor || 'hsl(var(--primary))' }}
                  >
                    {cardsConfig.phoneNumber || '(11) 5555-5555'}
                  </a>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colorWithAlpha(cardsConfig.cardIconColor, 0.12),
                    }}
                  >
                    <MessageSquare
                      className="h-8 w-8"
                      style={{ color: cardsConfig.cardIconColor || 'hsl(var(--primary))' }}
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">
                    {cardsConfig.whatsappTitle || 'WhatsApp'}
                  </h3>
                  <p className="mb-4 text-gray-600">
                    {cardsConfig.whatsappDescription}
                  </p>
                  <a
                    href={`https://wa.me/55${cardsConfig.whatsappNumber?.replace(/\D/g, '')}`}
                    className="font-medium hover:underline"
                    style={{ color: cardsConfig.cardLinkColor || 'hsl(var(--primary))' }}
                  >
                    {cardsConfig.whatsappNumber || '(11) 99999-9999'}
                  </a>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colorWithAlpha(cardsConfig.cardIconColor, 0.12),
                    }}
                  >
                    <Mail
                      className="h-8 w-8"
                      style={{ color: cardsConfig.cardIconColor || 'hsl(var(--primary))' }}
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">
                    {cardsConfig.emailTitle || 'E-mail'}
                  </h3>
                  <p className="mb-4 text-gray-600">
                    {cardsConfig.emailDescription}
                  </p>
                  <a
                    href={`mailto:${cardsConfig.emailAddress}`}
                    className="font-medium hover:underline"
                    style={{ color: cardsConfig.cardLinkColor || 'hsl(var(--primary))' }}
                  >
                    {cardsConfig.emailAddress || 'contato@hotel.com'}
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          className="page-section"
          style={{ backgroundColor: formConfig.backgroundColor || '#FFFFFF' }}
        >
          <div className="page-container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2
                  className="mb-6 text-3xl font-bold"
                  style={{ color: formConfig.titleColor || 'hsl(var(--primary))' }}
                >
                  {formConfig.formTitle || 'Envie uma Mensagem'}
                </h2>
                <p className="mb-8 text-gray-700">
                  {formConfig.formDescription ||
                    'Preencha o formulario abaixo com suas informacoes e entraremos em contato o mais breve possivel.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome*
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        value={form.name}
                        onChange={handleChange}
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
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Assunto*
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="O assunto da sua mensagem"
                      required
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Mensagem*
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Escreva sua mensagem aqui..."
                      rows={6}
                      required
                      className="resize-none"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedPolicy}
                      onCheckedChange={(checked) => setAcceptedPolicy(checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Concordo com a{' '}
                      <a
                        href="/politicas-de-privacidade"
                        className="text-primary hover:underline"
                      >
                        Politica de Privacidade
                      </a>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full py-3"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: formConfig.buttonColor || 'hsl(var(--primary))',
                      color: formConfig.buttonTextColor || '#FFFFFF',
                    }}
                  >
                    {isSubmitting
                      ? 'Enviando...'
                      : formConfig.buttonText || 'Enviar Mensagem'}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <h2
                    className="mb-6 text-3xl font-bold"
                    style={{ color: formConfig.titleColor || 'hsl(var(--primary))' }}
                  >
                    {formConfig.mapTitle || 'Nossa Localizacao'}
                  </h2>
                  <p className="mb-6 text-gray-700">
                    {formConfig.mapDescription ||
                      'Visite-nos e conheca pessoalmente toda a estrutura do hotel.'}
                  </p>

                  <div className="h-[400px] overflow-hidden rounded-lg">
                    <MapEmbed
                      address={`${formConfig.addressLine1}, ${formConfig.addressLine2}`}
                      height="400px"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
                  <h3 className="mb-4 text-xl font-bold">Informacoes de Contato</h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin
                        className="mr-3 mt-0.5 h-6 w-6"
                        style={{ color: formConfig.titleColor || 'hsl(var(--primary))' }}
                      />
                      <div>
                        <p className="font-medium">
                          {formConfig.addressLabel || 'Endereco:'}
                        </p>
                        <p className="text-gray-600">{formConfig.addressLine1}</p>
                        <p className="text-gray-600">{formConfig.addressLine2}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock
                        className="mr-3 h-6 w-6"
                        style={{ color: formConfig.titleColor || 'hsl(var(--primary))' }}
                      />
                      <div>
                        <p className="font-medium">
                          {formConfig.hoursLabel || 'Horario de Funcionamento:'}
                        </p>
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

        <section
          className="page-section-tight"
          style={{ backgroundColor: faqCtaConfig.backgroundColor || '#F9FAFB' }}
        >
          <div className="page-container text-center">
            <h2
              className="mb-4 text-3xl font-bold"
              style={{ color: faqCtaConfig.titleColor || '#000000' }}
            >
              {faqCtaConfig.title || 'Perguntas Frequentes'}
            </h2>
            <p
              className="mx-auto mb-8 max-w-3xl"
              style={{ color: faqCtaConfig.subtitleColor || '#374151' }}
            >
              {faqCtaConfig.description ||
                'Encontre respostas para as perguntas mais comuns sobre nossa hospedagem e servicos.'}
            </p>
            <Button
              className="rounded-full px-8 py-3"
              style={{
                backgroundColor: faqCtaConfig.buttonColor || 'hsl(var(--primary))',
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
