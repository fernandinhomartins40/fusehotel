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

      <main className="flex-1">
        <div className="bg-secondary page-section-hero text-secondary-foreground">
          <div className="page-container">
            <h1 className="page-title mb-4">{title}</h1>
            <p className="page-lead max-w-3xl">{description}</p>
          </div>
        </div>

        <div className="page-container page-section">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md sm:p-8">
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
