import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLandingSettings } from '@/hooks/useLanding';
import { defaultNewsletterConfig } from '@/types/landing-config';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: settingsData } = useLandingSettings('newsletter');
  const config = settingsData?.config || defaultNewsletterConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post('/newsletter/subscribe', { email });
      toast.success('Inscrição realizada com sucesso!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao inscrever email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="page-section-tight"
      style={{
        backgroundColor: config.backgroundColor,
      }}
    >
      <div className="page-container flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="mb-4 md:mb-0 shrink-0">
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-none"
            style={{
              color: config.titleColor,
            }}
          >
            {config.title}
          </h3>
        </div>

        <div className="w-full md:max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-gray-800 h-12 px-4 rounded-lg border-gray-200 focus:ring-2 focus:ring-offset-0"
                required
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 rounded-lg transition-all duration-300 hover:shadow-md"
              disabled={isSubmitting}
              style={{
                backgroundColor: config.buttonColor,
                color: '#FFFFFF',
              }}
            >
              {isSubmitting ? 'Enviando...' : config.buttonText}
            </Button>
          </form>

          <div
            className="flex items-center gap-2 text-sm mt-3 opacity-75"
            style={{
              color: config.titleColor,
            }}
          >
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8125 6.70508H11.1562V4.73633C11.1562 2.44492 9.29141 0.580078 7 0.580078C4.70859 0.580078 2.84375 2.44492 2.84375 4.73633V6.70508H2.1875C1.46289 6.70508 0.875 7.29297 0.875 8.01758V13.2676C0.875 13.9922 1.46289 14.5801 2.1875 14.5801H11.8125C12.5371 14.5801 13.125 13.9922 13.125 13.2676V8.01758C13.125 7.29297 12.5371 6.70508 11.8125 6.70508Z" fill="currentColor"/>
            </svg>
            <span>Seu email está protegido. Nunca enviaremos SPAM.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
