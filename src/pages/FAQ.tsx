
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  // FAQ data organized by categories
  const faqData = [
    {
      category: "Reservas e Check-in",
      questions: [
        {
          question: "Como posso fazer uma reserva?",
          answer: "Você pode fazer reservas através do nosso site, por telefone (11) 5555-5555, por e-mail contato@aguasclaras.com ou através das principais plataformas de reserva online."
        },
        {
          question: "Qual é o horário de check-in e check-out?",
          answer: "Nosso horário de check-in é a partir das 14h e o check-out deve ser realizado até as 12h. Caso precise de horários especiais, entre em contato conosco com antecedência."
        },
        {
          question: "Posso fazer check-in antecipado ou check-out tardio?",
          answer: "Sim, mediante disponibilidade e com possível cobrança adicional. Para check-in antecipado (antes das 14h) ou check-out tardio (após 12h), entre em contato com a recepção."
        },
        {
          question: "Quais documentos preciso apresentar no check-in?",
          answer: "É necessário apresentar um documento oficial com foto (RG, CNH ou passaporte) para todos os hóspedes, incluindo crianças. Estrangeiros devem apresentar passaporte válido."
        }
      ]
    },
    {
      category: "Acomodações",
      questions: [
        {
          question: "Quais tipos de quartos vocês oferecem?",
          answer: "Oferecemos diversas categorias de acomodações, desde quartos standard até suítes luxo, além de chalés independentes. Todas as acomodações possuem ar-condicionado, TV, frigobar e Wi-Fi gratuito."
        },
        {
          question: "As acomodações possuem ar-condicionado?",
          answer: "Sim, todas as nossas acomodações são equipadas com ar-condicionado split, garantindo conforto térmico em qualquer estação do ano."
        },
        {
          question: "O Wi-Fi é gratuito?",
          answer: "Sim, oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel, incluindo quartos, áreas comuns e espaços de lazer."
        },
        {
          question: "Os quartos possuem cofre?",
          answer: "Sim, todas as acomodações são equipadas com cofres individuais para sua segurança e conveniência."
        }
      ]
    },
    {
      category: "Serviços e Facilidades",
      questions: [
        {
          question: "O hotel oferece café da manhã?",
          answer: "Sim, o café da manhã está incluso na diária e é servido no restaurante principal das 7h às 10h. Oferecemos um buffet variado com opções regionais e internacionais."
        },
        {
          question: "Há estacionamento disponível?",
          answer: "Sim, dispomos de estacionamento privativo para hóspedes sem custo adicional. O serviço de manobrista está disponível mediante solicitação."
        },
        {
          question: "O hotel possui piscina?",
          answer: "Sim, contamos com duas piscinas: uma ao ar livre com vista panorâmica e uma piscina aquecida coberta. Ambas estão disponíveis para uso dos hóspedes das 8h às 22h."
        },
        {
          question: "Quais refeições são servidas no hotel?",
          answer: "Além do café da manhã incluso, nosso restaurante serve almoço das 12h às 15h e jantar das 19h às 22h30. Também temos um bar que serve petiscos e bebidas ao longo do dia."
        }
      ]
    },
    {
      category: "Pagamentos e Políticas",
      questions: [
        {
          question: "Quais formas de pagamento são aceitas?",
          answer: "Aceitamos pagamentos em dinheiro, PIX, cartões de crédito (Visa, Mastercard, American Express) e débito. Para reservas online, é necessário um cartão de crédito para garantia."
        },
        {
          question: "Qual é a política de cancelamento?",
          answer: "Cancelamentos com até 48 horas de antecedência da data de check-in são reembolsáveis. Após este prazo ou em caso de não comparecimento, será cobrada a primeira diária."
        },
        {
          question: "Posso parcelar o pagamento?",
          answer: "Sim, oferecemos parcelamento em até 3x sem juros para pagamentos com cartão de crédito. Para mais parcelas, consulte as condições disponíveis no momento da reserva."
        },
        {
          question: "O hotel aceita animais de estimação?",
          answer: "Sim, somos pet friendly em determinadas acomodações. Animais de pequeno e médio porte são bem-vindos, mediante taxa adicional e seguindo nossas políticas para pets."
        }
      ]
    },
    {
      category: "Localização e Transporte",
      questions: [
        {
          question: "O hotel oferece serviço de transfer?",
          answer: "Sim, oferecemos serviço de transfer mediante reserva prévia. O serviço está disponível do aeroporto/rodoviária até o hotel e vice-versa, com custo adicional baseado na distância."
        },
        {
          question: "Quais atrações turísticas estão próximas ao hotel?",
          answer: "Estamos localizados próximos a diversas atrações naturais como trilhas ecológicas, cachoeiras e mirantes. O centro histórico da cidade encontra-se a 3km do hotel."
        },
        {
          question: "Como chegar ao hotel usando transporte público?",
          answer: "A partir da rodoviária central, você pode pegar o ônibus linha 102 que passa em frente ao hotel a cada 30 minutos. Do aeroporto, recomendamos táxi ou nosso serviço de transfer."
        },
        {
          question: "Há opções de restaurantes nas proximidades?",
          answer: "Sim, num raio de 2km do hotel há diversos restaurantes com gastronomia regional e internacional. Nossa recepção pode fornecer recomendações e auxiliar com reservas."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#0466C8] text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre hospedagem, serviços e políticas do Hotel Águas Claras.
            </p>
          </div>
        </div>
        
        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Search Input (Visual only, not functional in this example) */}
            <div className="relative mb-12">
              <input
                type="text"
                placeholder="Pesquisar perguntas..."
                className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0466C8] focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-4 top-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* FAQ Categories and Questions */}
            <div className="space-y-12">
              {faqData.map((category, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <h2 className="text-2xl font-bold mb-6 text-[#0466C8]">{category.category}</h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIndex) => (
                      <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-700">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
            
            {/* Contact Section */}
            <div className="mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-center">Ainda tem dúvidas?</h2>
              <p className="text-center text-gray-700 mb-6">
                Se não encontrou a resposta que procura, entre em contato conosco diretamente.
              </p>
              <div className="flex justify-center">
                <a 
                  href="/contato" 
                  className="px-8 py-3 bg-[#0466C8] text-white font-medium rounded-full hover:bg-[#0355A6] transition-colors"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
