import React from 'react';
import { LegalContentPage } from '@/components/legal/LegalContentPage';

const fallbackContent = `Ao utilizar este site e os servicos do hotel, voce concorda com as regras de uso, reserva, cancelamento, pagamento e convivencia estabelecidas pela administracao.

Reservas e pagamentos podem estar sujeitos a validacao de disponibilidade e confirmacao financeira. Cancelamentos, no-show, alteracoes de datas e solicitacoes especiais seguem as politicas operacionais definidas pelo hotel no momento da contratacao.

O uso indevido da plataforma, tentativas de fraude, envio de informacoes falsas ou qualquer violacao legal podera resultar em bloqueio de acesso, cancelamento da reserva e adocao das medidas cabiveis.

Para esclarecer duvidas sobre estes termos, entre em contato com a equipe de atendimento do hotel pelos canais oficiais informados no site.`;

const TermsOfService: React.FC = () => {
  return (
    <LegalContentPage
      contentKey="terms-of-service"
      title="Termos de Uso"
      description="Consulte as regras aplicaveis ao uso da plataforma e aos servicos disponibilizados pelo hotel."
      fallbackContent={fallbackContent}
    />
  );
};

export default TermsOfService;
