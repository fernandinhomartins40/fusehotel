import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../utils/constants';

/**
 * General API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict Rate Limiter for Authentication Endpoints
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.LOGIN_WINDOW_MS,
  max: RATE_LIMIT.LOGIN_MAX_REQUESTS,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Upload Rate Limiter
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: 'Too many uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
