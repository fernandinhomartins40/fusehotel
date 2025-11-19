/**
 * Validation Constants
 *
 * Constantes para validação
 */

/**
 * Comprimentos mínimos e máximos
 */
export const LENGTH_CONSTRAINTS = {
  NAME: { MIN: 2, MAX: 100 },
  EMAIL: { MIN: 1, MAX: 255 },
  PASSWORD: { MIN: 8, MAX: 100 },
  PHONE: { MIN: 10, MAX: 15 },
  CPF: { EXACT: 11 },
  DESCRIPTION_SHORT: { MIN: 10, MAX: 200 },
  DESCRIPTION_LONG: { MIN: 50, MAX: 5000 },
  TITLE: { MIN: 3, MAX: 100 },
  META_TITLE: { MAX: 60 },
  META_DESCRIPTION: { MAX: 160 },
  SPECIAL_REQUESTS: { MAX: 500 },
  CANCELLATION_REASON: { MIN: 10, MAX: 500 },
} as const;

/**
 * Regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  PHONE_BR: /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?(9?\d{4}[\s-]?\d{4})$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  TIME: /^([01]\d|2[0-3]):([0-5]\d)$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_CPF: 'CPF inválido',
  INVALID_URL: 'URL inválida',
  INVALID_DATE: 'Data inválida',
  INVALID_TIME: 'Horário inválido',
  PASSWORDS_NOT_MATCH: 'As senhas não coincidem',
  TERMS_NOT_ACCEPTED: 'Você deve aceitar os termos de uso',
  MIN_LENGTH: (field: string, min: number) => `${field} deve ter no mínimo ${min} caracteres`,
  MAX_LENGTH: (field: string, max: number) => `${field} deve ter no máximo ${max} caracteres`,
  MIN_VALUE: (field: string, min: number) => `${field} deve ser no mínimo ${min}`,
  MAX_VALUE: (field: string, max: number) => `${field} deve ser no máximo ${max}`,
  BETWEEN: (field: string, min: number, max: number) =>
    `${field} deve estar entre ${min} e ${max}`,
} as const;
