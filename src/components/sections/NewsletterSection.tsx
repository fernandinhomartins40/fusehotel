import React, { useState } from 'react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="text-white px-[360px] py-20 rounded-[50px] max-md:px-5 max-md:py-10">
      <h2 className="text-[#383C41] text-[56px] leading-[67.2px] tracking-[0.4px] mb-[13px]">
        NEWSLETTER
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2.5 mt-5 max-sm:flex-col">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[410px] text-lg px-5 py-4 rounded-[5px] border-[none] max-sm:w-full"
          required
        />
        <button
          type="submit"
          className="w-[170px] text-white text-lg cursor-pointer bg-[#1D1D1F] p-5 rounded-[5px] border-[none] max-sm:w-full"
        >
          Enviar
        </button>
      </form>

      <div className="flex items-center gap-[8.5px] text-base mt-5">
        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.8125 6.70508H11.1562V4.73633C11.1562 2.44492 9.29141 0.580078 7 0.580078C4.70859 0.580078 2.84375 2.44492 2.84375 4.73633V6.70508H2.1875C1.46289 6.70508 0.875 7.29297 0.875 8.01758V13.2676C0.875 13.9922 1.46289 14.5801 2.1875 14.5801H11.8125C12.5371 14.5801 13.125 13.9922 13.125 13.2676V8.01758C13.125 7.29297 12.5371 6.70508 11.8125 6.70508Z" fill="white"/>
        </svg>
        <span>Seu email está protegido. Nunca enviaremos SPAM.</span>
      </div>
    </section>
  );
};
