/**
 * Application Constants
 */

// Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CUSTOMER: 'CUSTOMER',
} as const;

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  REFUNDED: 'REFUNDED',
  FAILED: 'FAILED',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  PIX: 'PIX',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
  WHATSAPP: 'WHATSAPP',
} as const;

// Accommodation Types
export const ACCOMMODATION_TYPES = {
  ROOM: 'ROOM',
  SUITE: 'SUITE',
  CHALET: 'CHALET',
  VILLA: 'VILLA',
} as const;

// Promotion Types
export const PROMOTION_TYPES = {
  PACKAGE: 'PACKAGE',
  DISCOUNT: 'DISCOUNT',
  SEASONAL: 'SEASONAL',
  SPECIAL_OFFER: 'SPECIAL_OFFER',
} as const;

// Settings Categories
export const SETTINGS_CATEGORIES = {
  SITE_INFO: 'SITE_INFO',
  BRANDING: 'BRANDING',
  CONTENT: 'CONTENT',
  SEO: 'SEO',
  EMAIL: 'EMAIL',
  PAYMENT: 'PAYMENT',
  GENERAL: 'GENERAL',
} as const;

// Contact Message Status
export const CONTACT_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  REPLIED: 'REPLIED',
  ARCHIVED: 'ARCHIVED',
} as const;

// Amenity Categories
export const AMENITY_CATEGORIES = {
  BEDROOM: 'BEDROOM',
  BATHROOM: 'BATHROOM',
  ENTERTAINMENT: 'ENTERTAINMENT',
  KITCHEN: 'KITCHEN',
  OUTDOOR: 'OUTDOOR',
  GENERAL: 'GENERAL',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGES_PER_ACCOMMODATION: 10,
} as const;

// Image Processing
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  THUMBNAIL_WIDTH: 400,
  THUMBNAIL_HEIGHT: 300,
  QUALITY: 85,
  FORMAT: 'webp' as const,
} as const;

// Fees and Taxes
export const FEES = {
  SERVICE_FEE_PERCENT: 5, // 5%
  TAX_PERCENT: 3, // 3%
} as const;

// Cancellation Policy (hours before check-in)
export const CANCELLATION_POLICY = {
  FREE_CANCELLATION_HOURS: 48, // 48 hours
  PARTIAL_REFUND_HOURS: 24, // 24 hours
  PARTIAL_REFUND_PERCENT: 50, // 50%
} as const;

// JWT
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES: '15m',
  REFRESH_TOKEN_EXPIRES: '7d',
  EMAIL_VERIFICATION_EXPIRES_HOURS: 24,
  PASSWORD_RESET_EXPIRES_HOURS: 1,
} as const;

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  LOGIN_MAX_REQUESTS: 5,
  LOGIN_WINDOW_MS: 15 * 60 * 1000,
} as const;

// Default Times
export const DEFAULT_TIMES = {
  CHECK_IN: '14:00',
  CHECK_OUT: '12:00',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_BR: /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  TIME: /^([01]\d|2[0-3]):([0-5]\d)$/,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'An internal error occurred',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  REGISTER: 'Registration successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  EMAIL_SENT: 'Email sent successfully',
  PASSWORD_RESET: 'Password reset successful',
} as const;
