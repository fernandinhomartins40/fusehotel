import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLandingSettings } from '@/hooks/useLanding';
import { defaultNewsletterConfig } from '@/types/landing-config';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

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
      className="py-20 md:py-28"
      style={{
        backgroundColor: config.backgroundColor,
      }}
    >
      <div className="page-container">
        <div className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 px-8 py-14 md:px-16 md:py-20 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <h3
            className="section-title max-w-xl mx-auto"
            style={{
              color: config.titleColor,
            }}
          >
            {config.title}
          </h3>

          <div className="max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-grow">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-gray-800 h-14 px-5 rounded-full border-0 shadow-lg text-base"
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-14 w-14 rounded-full p-0 transition-all duration-300 hover:shadow-lg hover:scale-105 shrink-0"
                disabled={isSubmitting}
                style={{
                  backgroundColor: config.buttonColor,
                  color: '#FFFFFF',
                }}
              >
                <Send size={20} />
              </Button>
            </form>

            <div
              className="flex items-center justify-center gap-2 text-xs mt-5 opacity-60"
              style={{
                color: config.titleColor,
              }}
            >
              <svg width="12" height="13" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8125 6.70508H11.1562V4.73633C11.1562 2.44492 9.29141 0.580078 7 0.580078C4.70859 0.580078 2.84375 2.44492 2.84375 4.73633V6.70508H2.1875C1.46289 6.70508 0.875 7.29297 0.875 8.01758V13.2676C0.875 13.9922 1.46289 14.5801 2.1875 14.5801H11.8125C12.5371 14.5801 13.125 13.9922 13.125 13.2676V8.01758C13.125 7.29297 12.5371 6.70508 11.8125 6.70508Z" fill="currentColor"/>
              </svg>
              <span>Seu email está protegido. Nunca enviaremos SPAM.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
