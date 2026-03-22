import React from 'react';
import { LegalContentPage } from '@/components/legal/LegalContentPage';

const fallbackContent = `Esta Politica de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos os dados pessoais tratados durante a navegacao no site, contato com a equipe e contratacao de hospedagem.

Podemos coletar dados de identificacao, contato, reserva, pagamento, navegacao e preferencias de atendimento sempre que isso for necessario para prestar os servicos do hotel, cumprir obrigacoes legais, prevenir fraudes e melhorar a experiencia do cliente.

Os dados podem ser compartilhados com operadores essenciais para a execucao da reserva, meios de pagamento, parceiros operacionais e autoridades competentes, sempre dentro dos limites legais e contratuais aplicaveis.

O site pode utilizar cookies e tecnologias similares para autenticacao, seguranca, medicao de uso e personalizacao basica. Voce pode gerenciar cookies diretamente nas configuracoes do seu navegador.

O titular pode solicitar informacoes, atualizacao ou revisao de seus dados pelos canais oficiais de atendimento informados no site.`;

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalContentPage
      contentKey="privacy-policy"
      title="Politica de Privacidade"
      description="Saiba como coletamos, utilizamos e protegemos suas informacoes pessoais."
      fallbackContent={fallbackContent}
    />
  );
};

export default PrivacyPolicy;
