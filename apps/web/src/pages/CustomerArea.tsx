import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { CustomerDashboard } from '@/components/customer/CustomerDashboard';
import { useAuth } from '@/hooks/useAuth';

const CustomerArea: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const safeRedirectTo = redirectTo && redirectTo.startsWith('/') ? redirectTo : undefined;

  useEffect(() => {
    if (isAuthenticated && safeRedirectTo) {
      window.location.href = safeRedirectTo;
    }
  }, [isAuthenticated, safeRedirectTo]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-br from-background to-primary/5">
        {isAuthenticated ? (
          <CustomerDashboard />
        ) : (
          <div className="page-container page-section-hero">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="page-title text-foreground mb-4">Area do Cliente</h1>
                <p className="text-gray-600">
                  {safeRedirectTo
                    ? 'Faca login para retomar o checkout sem perder os dados da reserva'
                    : 'Faca login para acessar suas reservas e gerenciar sua conta'}
                </p>
              </div>
              <LoginForm redirectTo={safeRedirectTo} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CustomerArea;
