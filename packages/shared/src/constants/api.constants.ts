/**
 * API Constants
 *
 * Constantes relacionadas à API
 */

/**
 * Prefixo da API
 */
export const API_PREFIX = '/api';

/**
 * Versão da API
 */
export const API_VERSION = 'v1';

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  ACCOMMODATIONS: {
    BASE: '/accommodations',
    BY_ID: (id: string) => `/accommodations/${id}`,
    BY_SLUG: (slug: string) => `/accommodations/slug/${slug}`,
    AVAILABILITY: '/accommodations/availability',
  },
  RESERVATIONS: {
    BASE: '/reservations',
    BY_ID: (id: string) => `/reservations/${id}`,
    BY_CODE: (code: string) => `/reservations/code/${code}`,
    CANCEL: (id: string) => `/reservations/${id}/cancel`,
    CHECK_IN: (id: string) => `/reservations/${id}/check-in`,
    CHECK_OUT: (id: string) => `/reservations/${id}/check-out`,
    MY_RESERVATIONS: '/reservations/my-reservations',
  },
  PROMOTIONS: {
    BASE: '/promotions',
    BY_ID: (id: string) => `/promotions/${id}`,
    BY_SLUG: (slug: string) => `/promotions/slug/${slug}`,
    VALIDATE_CODE: '/promotions/validate-code',
  },
  SETTINGS: {
    BASE: '/settings',
    BY_CATEGORY: (category: string) => `/settings/category/${category}`,
    PUBLIC: '/settings/public',
  },
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
    UNSUBSCRIBE: '/newsletter/unsubscribe',
  },
  CONTACT: {
    SEND_MESSAGE: '/contact/send-message',
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
  },
  HEALTH: {
    BASE: '/health',
    DATABASE: '/health/database',
  },
} as const;

/**
 * Status codes HTTP
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
 * Headers HTTP comuns
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  ACCEPT_LANGUAGE: 'Accept-Language',
  X_REQUEST_ID: 'X-Request-ID',
  X_RATE_LIMIT: 'X-RateLimit-Limit',
  X_RATE_LIMIT_REMAINING: 'X-RateLimit-Remaining',
  X_RATE_LIMIT_RESET: 'X-RateLimit-Reset',
} as const;

/**
 * Content types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const;

/**
 * Configurações de rate limiting
 */
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  MAX_REQUESTS: 100,
  AUTH_WINDOW_MS: 60 * 1000, // 1 minuto
  AUTH_MAX_REQUESTS: 5,
} as const;

/**
 * Configurações de JWT
 */
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ALGORITHM: 'HS256' as const,
} as const;
