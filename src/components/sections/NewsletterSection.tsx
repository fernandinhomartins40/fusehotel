
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="bg-blue-600 px-4 md:px-12 lg:px-24 py-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Title */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-white text-[56px] font-extrabold tracking-tight leading-none uppercase">
            NEWSLETTER
          </h3>
        </div>
        
        {/* Form */}
        <div className="w-full md:max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-gray-800 h-12 px-4"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 h-12 px-6"
            >
              Enviar
            </Button>
          </form>

          <div className="flex items-center gap-2 text-white text-sm mt-3">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8125 6.70508H11.1562V4.73633C11.1562 2.44492 9.29141 0.580078 7 0.580078C4.70859 0.580078 2.84375 2.44492 2.84375 4.73633V6.70508H2.1875C1.46289 6.70508 0.875 7.29297 0.875 8.01758V13.2676C0.875 13.9922 1.46289 14.5801 2.1875 14.5801H11.8125C12.5371 14.5801 13.125 13.9922 13.125 13.2676V8.01758C13.125 7.29297 12.5371 6.70508 11.8125 6.70508Z" fill="white"/>
            </svg>
            <span>Seu email está protegido. Nunca enviaremos SPAM.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
