/**
 * App Constants
 *
 * Constantes gerais da aplicação
 */

/**
 * Nome da aplicação
 */
export const APP_NAME = 'FuseHotel';

/**
 * Versão da aplicação
 */
export const APP_VERSION = '1.0.0';

/**
 * Ambiente padrão
 */
export const DEFAULT_ENVIRONMENT = 'development';

/**
 * Idiomas suportados
 */
export const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US', 'es-ES'] as const;

/**
 * Idioma padrão
 */
export const DEFAULT_LANGUAGE = 'pt-BR';

/**
 * Moedas suportadas
 */
export const SUPPORTED_CURRENCIES = ['BRL', 'USD', 'EUR'] as const;

/**
 * Moeda padrão
 */
export const DEFAULT_CURRENCY = 'BRL';

/**
 * Timezone padrão
 */
export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

/**
 * Formato de data padrão
 */
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

/**
 * Formato de data e hora padrão
 */
export const DEFAULT_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

/**
 * Paginação padrão
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Tamanho máximo de upload (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Tipos de arquivo permitidos para upload
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/**
 * Horários padrão
 */
export const DEFAULT_CHECK_IN_TIME = '14:00';
export const DEFAULT_CHECK_OUT_TIME = '12:00';

/**
 * Configurações de reserva
 */
export const MIN_ADVANCE_BOOKING_HOURS = 24;
export const MAX_ADVANCE_BOOKING_DAYS = 365;
export const DEFAULT_CANCELLATION_DEADLINE_HOURS = 48;
export const DEFAULT_REFUND_PERCENTAGE = 100;
