
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { CustomerDashboard } from '@/components/customer/CustomerDashboard';
import { useAuth } from '@/hooks/useAuth';

const CustomerArea: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        {isAuthenticated ? (
          <CustomerDashboard />
        ) : (
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Área do Cliente
                </h1>
                <p className="text-gray-600">
                  Faça login para acessar suas reservas e gerenciar sua conta
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomerArea;
