
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
import { hydrateBrandColors } from '@/lib/brand-theme';
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
          className="text-white py-12"
          style={{
            backgroundColor: heroConfig.backgroundColor || 'hsl(var(--primary))',
            height: heroConfig.height || 'auto',
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: heroConfig.titleColor || '#FFFFFF' }}
            >
              {heroConfig.title || 'Perguntas Frequentes'}
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: heroConfig.subtitleColor || '#FFFFFF' }}
            >
              {heroConfig.description || 'Encontre respostas para as dúvidas mais comuns sobre hospedagem, serviços e políticas do Hotel Águas Claras.'}
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div
          className="container mx-auto px-4 py-12"
          style={{ backgroundColor: contentConfig.backgroundColor || '#FFFFFF' }}
        >
          <div className="max-w-4xl mx-auto">
            {/* FAQ Categories and Questions */}
            <div className="space-y-12">
              {categories.map((category: FAQCategory, index: number) => {
                const categoryItems = category.items || [];
                return categoryItems.length > 0 ? (
                  <div key={category.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{ color: contentConfig.categoryTitleColor || 'hsl(var(--primary))' }}
                    >
                      {category.name}
                    </h2>

                    <Accordion type="single" collapsible className="w-full">
                      {categoryItems.map((item: any, qIndex: number) => (
                        <AccordionItem key={item.id} value={`item-${index}-${qIndex}`}>
                          <AccordionTrigger
                            className="text-left"
                            style={{ color: contentConfig.questionColor || '#000000' }}
                          >
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p style={{ color: contentConfig.answerColor || '#374151' }}>
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
              className="mt-16 p-8 rounded-lg border border-gray-200"
              style={{ backgroundColor: contactConfig.backgroundColor || '#F9FAFB' }}
            >
              <h2
                className="text-2xl font-bold mb-4 text-center"
                style={{ color: contactConfig.titleColor || '#000000' }}
              >
                {contactConfig.title || 'Ainda tem dúvidas?'}
              </h2>
              <p
                className="text-center mb-6"
                style={{ color: contactConfig.subtitleColor || '#374151' }}
              >
                {contactConfig.description || 'Se não encontrou a resposta que procura, entre em contato conosco diretamente.'}
              </p>
              <div className="flex justify-center">
                <a
                  href={contactConfig.buttonUrl || '/contato'}
                  className="px-8 py-3 font-medium rounded-full transition-colors"
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
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
