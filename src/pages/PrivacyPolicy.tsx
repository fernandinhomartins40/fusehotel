
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        {/* Hero Section */}
        <div className="bg-[#0466C8] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-xl max-w-3xl">Saiba como coletamos, utilizamos e protegemos suas informações pessoais.</p>
          </div>
        </div>
        
        {/* Policy Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">1. Introdução e Escopo</h2>
              <p className="text-gray-700 mb-4">
                A presente Política de Privacidade tem por finalidade demonstrar o compromisso do Hotel Águas Claras 
                com a privacidade e a proteção dos dados pessoais coletados de seus usuários, estabelecendo as regras
                sobre a coleta, registro, armazenamento, uso, compartilhamento e exclusão dos dados coletados.
              </p>
              <p className="text-gray-700">
                Esta política se aplica a todos os serviços oferecidos pelo Hotel Águas Claras, incluindo nosso site, 
                aplicativo, serviços de hospedagem, eventos e demais atividades relacionadas ao nosso negócio.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">2. Dados Coletados</h2>
              <p className="text-gray-700 mb-4">
                Podemos coletar as seguintes categorias de informações:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">2.1. Dados fornecidos pelo usuário:</h3>
              <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-2">
                <li>Informações de identificação pessoal (nome, RG, CPF, passaporte)</li>
                <li>Informações de contato (endereço, e-mail, telefone)</li>
                <li>Dados de pagamento (número do cartão de crédito, validade)</li>
                <li>Preferências e solicitações especiais durante a hospedagem</li>
                <li>Dados de perfil e preferências</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">2.2. Dados coletados automaticamente:</h3>
              <ul className="list-disc pl-8 text-gray-700 space-y-2">
                <li>Endereço IP e informações do dispositivo</li>
                <li>Dados de navegação e uso do site/aplicativo</li>
                <li>Cookies e tecnologias similares</li>
                <li>Localização geográfica (quando autorizado)</li>
                <li>Registros de acesso a áreas restritas</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">3. Finalidade do Tratamento de Dados</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos seus dados pessoais para as seguintes finalidades:
              </p>
              
              <ul className="list-disc pl-8 text-gray-700 space-y-2">
                <li>Processar reservas e fornecer serviços de hospedagem</li>
                <li>Processar pagamentos e prevenir fraudes</li>
                <li>Personalizar sua experiência durante a estadia</li>
                <li>Enviar comunicações sobre sua reserva ou estadia</li>
                <li>Enviar ofertas e promoções personalizadas (mediante consentimento)</li>
                <li>Melhorar nossos serviços e desenvolver novos produtos</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Responder a solicitações e prestar suporte ao cliente</li>
                <li>Proteger nossos direitos e propriedades</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">4. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 mb-4">
                Nosso site utiliza cookies e outras tecnologias similares para melhorar sua experiência de navegação,
                personalizar conteúdo e anúncios, oferecer recursos de mídia social e analisar o tráfego no site.
              </p>
              
              <p className="text-gray-700 mb-4">
                Os tipos de cookies que utilizamos incluem:
              </p>
              
              <ul className="list-disc pl-8 text-gray-700 space-y-2">
                <li><strong>Cookies essenciais:</strong> necessários para o funcionamento básico do site</li>
                <li><strong>Cookies funcionais:</strong> permitem recursos aprimorados e personalização</li>
                <li><strong>Cookies analíticos:</strong> nos ajudam a entender como os visitantes interagem com o site</li>
                <li><strong>Cookies de marketing:</strong> usados para mostrar anúncios relevantes e medir sua eficácia</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">5. Compartilhamento de Dados</h2>
              <p className="text-gray-700 mb-4">
                Podemos compartilhar seus dados pessoais nas seguintes circunstâncias:
              </p>
              
              <ul className="list-disc pl-8 text-gray-700 space-y-2">
                <li>Com prestadores de serviços que nos auxiliam na operação do hotel</li>
                <li>Com parceiros comerciais para oferta de serviços complementares</li>
                <li>Com autoridades competentes, mediante solicitação legal</li>
                <li>Em caso de reorganização societária, fusão, venda ou transferência de ativos</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                Em todos os casos, asseguramos que os terceiros que recebem seus dados mantenham práticas de segurança
                e privacidade adequadas.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">6. Direitos dos Titulares</h2>
              <p className="text-gray-700 mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              
              <ul className="list-disc pl-8 text-gray-700 space-y-2">
                <li>Confirmação da existência de tratamento de seus dados</li>
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço</li>
                <li>Revogação do consentimento</li>
                <li>Informação sobre entidades com as quais seus dados foram compartilhados</li>
                <li>Oposição ao tratamento em casos de descumprimento da lei</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                Para exercer seus direitos, entre em contato através do e-mail: privacidade@aguasclaras.com
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">7. Segurança de Dados</h2>
              <p className="text-gray-700 mb-4">
                Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acessos não autorizados,
                destruição, perda, alteração, comunicação ou difusão.
              </p>
              
              <p className="text-gray-700">
                Entre as medidas de segurança implementadas estão criptografia, controle de acesso, monitoramento contínuo,
                treinamento de equipe e planos de resposta a incidentes.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">8. Retenção de Dados</h2>
              <p className="text-gray-700">
                Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados,
                incluindo obrigações legais, contratuais, prestação de contas ou solicitação de autoridades competentes.
                Após esse período, seus dados serão excluídos ou anonimizados.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#0466C8]">9. Alterações na Política de Privacidade</h2>
              <p className="text-gray-700 mb-4">
                Esta política pode ser atualizada periodicamente para refletir alterações em nossas práticas de privacidade
                ou mudanças na legislação aplicável. Recomendamos que você revise esta política regularmente.
              </p>
              
              <p className="text-gray-700">
                Data da última atualização: 21 de Maio de 2025.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
