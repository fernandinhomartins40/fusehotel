
export interface WhatsAppBookingData {
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: string;
  specialRequests?: string;
}

export const formatWhatsAppMessage = (data: WhatsAppBookingData): string => {
  const message = `🏨 *SOLICITAÇÃO DE RESERVA*

📋 *Detalhes da Reserva:*
🛏️ Acomodação: ${data.roomTitle}
📅 Check-in: ${new Date(data.checkIn).toLocaleDateString('pt-BR')}
📅 Check-out: ${new Date(data.checkOut).toLocaleDateString('pt-BR')}
🌙 ${data.nights} ${data.nights === 1 ? 'diária' : 'diárias'}
👥 ${data.guests} ${data.guests === 1 ? 'hóspede' : 'hóspedes'}

💰 *Valor Total: R$ ${data.total}*

${data.specialRequests ? `📝 *Observações:*\n${data.specialRequests}\n\n` : ''}Olá! Gostaria de fazer uma reserva com os detalhes acima. Podem me ajudar com a disponibilidade e formas de pagamento?`;

  return encodeURIComponent(message);
};

export const generateWhatsAppURL = (phoneNumber: string, message: string): string => {
  // Remove all non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present (assuming Brazil +55)
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  return `https://wa.me/${fullPhone}?text=${message}`;
};

export const openWhatsApp = (data: WhatsAppBookingData, phoneNumber: string = '5567991234567') => {
  const message = formatWhatsAppMessage(data);
  const url = generateWhatsAppURL(phoneNumber, message);
  window.open(url, '_blank');
};
