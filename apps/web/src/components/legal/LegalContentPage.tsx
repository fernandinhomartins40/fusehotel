import React from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useContent } from '@/hooks/useSystemSettings';
import { Loader2 } from 'lucide-react';

interface LegalContentPageProps {
  contentKey: string;
  title: string;
  description: string;
  fallbackContent: string;
}

export const LegalContentPage: React.FC<LegalContentPageProps> = ({
  contentKey,
  title,
  description,
  fallbackContent,
}) => {
  const { data, isLoading } = useContent(contentKey);
  const content =
    typeof data === 'string' && data.trim().length > 0 ? data : fallbackContent;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="bg-gradient-to-r from-primary to-secondary py-12 text-white">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h1>
            <p className="max-w-3xl text-xl">{description}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
            {isLoading && !data ? (
              <div className="flex items-center justify-center py-8 text-gray-600">
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Carregando conteudo...
              </div>
            ) : (
              <article className="whitespace-pre-wrap text-gray-700 leading-7">
                {content}
              </article>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
