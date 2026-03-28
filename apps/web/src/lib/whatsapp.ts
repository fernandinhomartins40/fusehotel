const BRAZIL_COUNTRY_CODE = '55';

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith(BRAZIL_COUNTRY_CODE) && digits.length >= 12) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `${BRAZIL_COUNTRY_CODE}${digits}`;
  }

  return digits;
}

export function formatWhatsAppInput(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11);

  if (numbers.length <= 2) {
    return numbers ? `(${numbers}` : '';
  }

  if (numbers.length <= 7) {
    return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
  }

  return numbers
    .replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
    .slice(0, 15);
}

export function buildWhatsAppUrl(number: string, message: string) {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
