/**
 * Backend Constants
 *
 * Constantes utilizadas no backend
 */

/**
 * Roles de usuário
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CUSTOMER: 'CUSTOMER',
} as const;

/**
 * Status de reserva
 */
export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const;

/**
 * Status de pagamento
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
} as const;

/**
 * Métodos de pagamento
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  PIX: 'PIX',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
  VOUCHER: 'VOUCHER',
} as const;

/**
 * Tipos de acomodação
 */
export const ACCOMMODATION_TYPES = {
  ROOM: 'ROOM',
  SUITE: 'SUITE',
  CHALET: 'CHALET',
  VILLA: 'VILLA',
  APARTMENT: 'APARTMENT',
} as const;

/**
 * Categorias de amenidades
 */
export const AMENITY_CATEGORIES = {
  BEDROOM: 'BEDROOM',
  BATHROOM: 'BATHROOM',
  ENTERTAINMENT: 'ENTERTAINMENT',
  KITCHEN: 'KITCHEN',
  OUTDOOR: 'OUTDOOR',
  ACCESSIBILITY: 'ACCESSIBILITY',
  GENERAL: 'GENERAL',
} as const;

/**
 * Tipos de promoção
 */
export const PROMOTION_TYPES = {
  PACKAGE: 'PACKAGE',
  DISCOUNT: 'DISCOUNT',
  SEASONAL: 'SEASONAL',
  SPECIAL_OFFER: 'SPECIAL_OFFER',
  EARLY_BIRD: 'EARLY_BIRD',
  LAST_MINUTE: 'LAST_MINUTE',
} as const;

/**
 * Tipos de desconto
 */
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_NIGHTS: 'FREE_NIGHTS',
} as const;

/**
 * Categorias de configurações
 */
export const SETTING_CATEGORIES = {
  GENERAL: 'GENERAL',
  CONTACT: 'CONTACT',
  SOCIAL: 'SOCIAL',
  SEO: 'SEO',
  BOOKING: 'BOOKING',
  PAYMENT: 'PAYMENT',
  EMAIL: 'EMAIL',
  LEGAL: 'LEGAL',
} as const;

/**
 * Limites de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

/**
 * Limites de upload
 */
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

/**
 * Timeouts e durações
 */
export const TIMEOUTS = {
  JWT_ACCESS_TOKEN: '15m',
  JWT_REFRESH_TOKEN: '7d',
  PASSWORD_RESET_TOKEN: 3600000, // 1 hora em ms
  EMAIL_VERIFICATION_TOKEN: 86400000, // 24 horas em ms
  SESSION_DURATION: 86400000, // 24 horas em ms
} as const;

/**
 * Taxas e valores
 */
export const FEES = {
  SERVICE_FEE_PERCENTAGE: 0.1, // 10%
  TAX_PERCENTAGE: 0.05, // 5%
  CANCELLATION_FEE_PERCENTAGE: 0.2, // 20%
  MIN_BOOKING_DAYS: 1,
  MAX_BOOKING_DAYS: 365,
  ADVANCE_BOOKING_DAYS: 365,
} as const;

/**
 * Horários padrão
 */
export const DEFAULT_TIMES = {
  CHECK_IN: '14:00',
  CHECK_OUT: '12:00',
} as const;

/**
 * Códigos de erro HTTP
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Mensagens de erro comuns
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  CPF_ALREADY_EXISTS: 'CPF already registered',
  ACCOUNT_INACTIVE: 'Account is inactive',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_EXPIRED: 'Token has expired',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  ACCOMMODATION_NOT_FOUND: 'Accommodation not found',
  ACCOMMODATION_UNAVAILABLE: 'Accommodation not available for selected dates',
  RESERVATION_NOT_FOUND: 'Reservation not found',
  RESERVATION_ALREADY_CANCELLED: 'Reservation already cancelled',
  CANCELLATION_NOT_ALLOWED: 'Cancellation not allowed for this reservation',
  INVALID_PROMOTION_CODE: 'Invalid or expired promotion code',
  PROMOTION_NOT_FOUND: 'Promotion not found',
  PROMOTION_EXPIRED: 'Promotion has expired',
  PROMOTION_MAX_REDEMPTIONS: 'Promotion has reached maximum redemptions',
  PAYMENT_FAILED: 'Payment processing failed',
  INSUFFICIENT_CAPACITY: 'Number of guests exceeds accommodation capacity',
  INVALID_DATE_RANGE: 'Invalid date range',
  PAST_DATE_NOT_ALLOWED: 'Cannot make reservation for past dates',
} as const;

/**
 * Mensagens de sucesso comuns
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  RESERVATION_CREATED: 'Reservation created successfully',
  RESERVATION_UPDATED: 'Reservation updated successfully',
  RESERVATION_CANCELLED: 'Reservation cancelled successfully',
  CHECK_IN_SUCCESS: 'Check-in successful',
  CHECK_OUT_SUCCESS: 'Check-out successful',
  PAYMENT_SUCCESS: 'Payment processed successfully',
  NEWSLETTER_SUBSCRIBED: 'Newsletter subscription successful',
  NEWSLETTER_UNSUBSCRIBED: 'Newsletter unsubscription successful',
  CONTACT_MESSAGE_SENT: 'Message sent successfully',
} as const;

/**
 * Regex patterns
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

/**
 * Headers customizados
 */
export const CUSTOM_HEADERS = {
  CORRELATION_ID: 'X-Correlation-ID',
  REQUEST_ID: 'X-Request-ID',
  API_VERSION: 'X-API-Version',
  RATE_LIMIT: 'X-RateLimit-Limit',
  RATE_LIMIT_REMAINING: 'X-RateLimit-Remaining',
  RATE_LIMIT_RESET: 'X-RateLimit-Reset',
} as const;

/**
 * Eventos do sistema
 */
export const EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  RESERVATION_CREATED: 'reservation.created',
  RESERVATION_UPDATED: 'reservation.updated',
  RESERVATION_CANCELLED: 'reservation.cancelled',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  EMAIL_SENT: 'email.sent',
  ERROR_OCCURRED: 'error.occurred',
} as const;

/**
 * Tipos de notificação
 */
export const NOTIFICATION_TYPES = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
  IN_APP: 'IN_APP',
} as const;

/**
 * Templates de email
 */
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_RESET: 'password-reset',
  RESERVATION_CONFIRMATION: 'reservation-confirmation',
  RESERVATION_CANCELLED: 'reservation-cancelled',
  CHECK_IN_REMINDER: 'check-in-reminder',
  PAYMENT_RECEIPT: 'payment-receipt',
  NEWSLETTER: 'newsletter',
  CONTACT_CONFIRMATION: 'contact-confirmation',
} as const;

/**
 * Cache keys
 */
export const CACHE_KEYS = {
  ACCOMMODATIONS: 'accommodations',
  ACCOMMODATION: (id: string) => `accommodation:${id}`,
  PROMOTIONS: 'promotions',
  PROMOTION: (id: string) => `promotion:${id}`,
  SETTINGS: 'settings',
  AMENITIES: 'amenities',
} as const;

/**
 * Cache TTL (em segundos)
 */
export const CACHE_TTL = {
  SHORT: 300, // 5 minutos
  MEDIUM: 1800, // 30 minutos
  LONG: 3600, // 1 hora
  VERY_LONG: 86400, // 24 horas
} as const;

/**
 * Prefixos de logs
 */
export const LOG_PREFIXES = {
  AUTH: '[AUTH]',
  DB: '[DATABASE]',
  API: '[API]',
  SERVICE: '[SERVICE]',
  CONTROLLER: '[CONTROLLER]',
  MIDDLEWARE: '[MIDDLEWARE]',
  ERROR: '[ERROR]',
  SYSTEM: '[SYSTEM]',
} as const;
