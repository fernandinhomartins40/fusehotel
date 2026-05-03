
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useLandingSettings, useFAQCategories } from '@/hooks/useLanding';
import { hydrateBrandColors, resolveHeroColor } from '@/lib/brand-theme';
import {
  defaultFAQHeroConfig,
  defaultFAQContentConfig,
  defaultFAQContactConfig,
  FAQCategory,
} from '@/types/faq-config';

const FAQ: React.FC = () => {
  const { data: heroData } = useLandingSettings('faq-hero');
  const { data: contentData } = useLandingSettings('faq-content');
  const { data: contactData } = useLandingSettings('faq-contact');
  const { data: categories = [] } = useFAQCategories();

  const heroConfig = hydrateBrandColors(heroData?.config || defaultFAQHeroConfig);
  const contentConfig = hydrateBrandColors(contentData?.config || defaultFAQContentConfig);
  const contactConfig = hydrateBrandColors(contactData?.config || defaultFAQContactConfig);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div
          className="text-white relative overflow-hidden"
          style={{
            backgroundColor: resolveHeroColor(heroConfig.backgroundColor),
            height: heroConfig.height || 'auto',
            minHeight: '350px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
          <div className="page-container text-center relative py-20 md:py-28">
            <div className="line-accent mx-auto mb-6" />
            <span className="page-kicker opacity-70" style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}>
              Tire suas dúvidas
            </span>
            <h1
              className="section-title mb-4"
              style={{ color: heroConfig.titleColor || '#FFFFFF' }}
            >
              {heroConfig.title || 'Perguntas Frequentes'}
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto opacity-80 leading-relaxed"
              style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}
            >
              {heroConfig.description || 'Encontre respostas para as dúvidas mais comuns sobre hospedagem, serviços e políticas do Hotel Águas Claras.'}
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div
          className="page-section"
          style={{ backgroundColor: contentConfig.backgroundColor || '#FFFFFF' }}
        >
          <div className="page-container">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-10">
                {categories.map((category: FAQCategory, index: number) => {
                  const categoryItems = category.items || [];
                  return categoryItems.length > 0 ? (
                    <div key={category.id} className="border-b border-gray-100 pb-8 last:border-b-0">
                      <h2
                        className="text-xl font-bold mb-5"
                        style={{ color: contentConfig.categoryTitleColor || 'hsl(var(--primary))' }}
                      >
                        {category.name}
                      </h2>

                      <Accordion type="single" collapsible className="w-full space-y-1">
                        {categoryItems.map((item: any, qIndex: number) => (
                          <AccordionItem key={item.id} value={`item-${index}-${qIndex}`} className="border-b-0">
                            <AccordionTrigger
                              className="text-left py-3.5 hover:no-underline"
                              style={{ color: contentConfig.questionColor || '#000000' }}
                            >
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="leading-relaxed pb-2" style={{ color: contentConfig.answerColor || '#374151' }}>
                                {item.answer}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Contact Section */}
              <div
                className="mt-14 card-modern p-8 md:p-10 text-center"
                style={{ backgroundColor: contactConfig.backgroundColor || '#F9FAFB' }}
              >
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: contactConfig.titleColor || '#000000' }}
                >
                  {contactConfig.title || 'Ainda tem dúvidas?'}
                </h2>
                <p
                  className="mb-6 text-muted-foreground"
                  style={{ color: contactConfig.subtitleColor || '#374151' }}
                >
                  {contactConfig.description || 'Se não encontrou a resposta que procura, entre em contato conosco diretamente.'}
                </p>
                <div className="flex justify-center">
                  <a
                    href={contactConfig.buttonUrl || '/contato'}
                    className="px-8 py-3 font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      backgroundColor: contactConfig.buttonColor || 'hsl(var(--primary))',
                      color: contactConfig.buttonTextColor || '#FFFFFF',
                    }}
                  >
                    {contactConfig.buttonText || 'Fale Conosco'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
