/**
 * Rate Limiter Middleware
 *
 * Middleware para controle de taxa de requisições
 */

import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../config/environment';
import { RateLimitError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Handler customizado para quando o limite é excedido
 */
const rateLimitHandler = (req: Request, res: Response): void => {
  logger.warn('Rate limit exceeded', {
    ip: req.ip,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
  });

  throw new RateLimitError('Too many requests, please try again later');
};

/**
 * Key generator que considera usuário autenticado
 */
const keyGenerator = (req: Request): string => {
  // Se o usuário está autenticado, usa o userId
  if (req.user?.userId) {
    return `user:${req.user.userId}`;
  }

  // Caso contrário, usa o IP
  return `ip:${req.ip}`;
};

/**
 * Skip function que ignora rate limiting em desenvolvimento
 */
const skipSuccessfulRequests = (req: Request, res: Response): boolean => {
  return res.statusCode < 400;
};

/**
 * Rate limiter padrão (geral)
 */
export const generalRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: rateLimitHandler,
  skip: (req, res) => {
    // Não aplica rate limit em rotas de health check
    return req.url.includes('/health');
  },
});

/**
 * Rate limiter estrito para autenticação
 */
export const authRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.maxRequests,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req: Request) => {
    // Para autenticação, sempre usa IP
    return `auth:${req.ip}`;
  },
  handler: rateLimitHandler,
});

/**
 * Rate limiter para registro de usuários
 */
export const registerRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 3600000, // 1 hora
  max: 5, // 5 tentativas por hora
  message: 'Too many registration attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req: Request) => `register:${req.ip}`,
  handler: rateLimitHandler,
});

/**
 * Rate limiter para reset de senha
 */
export const passwordResetRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 3600000, // 1 hora
  max: 3, // 3 tentativas por hora
  message: 'Too many password reset attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req: Request) => `password-reset:${req.ip}`,
  handler: rateLimitHandler,
});

/**
 * Rate limiter para criação de recursos
 */
export const createResourceRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 10, // 10 criações por minuto
  message: 'Too many resource creation requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator,
  handler: rateLimitHandler,
});

/**
 * Rate limiter para upload de arquivos
 */
export const uploadRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 5, // 5 uploads por minuto
  message: 'Too many file uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator,
  handler: rateLimitHandler,
});

/**
 * Rate limiter para busca/pesquisa
 */
export const searchRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 30, // 30 buscas por minuto
  message: 'Too many search requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: rateLimitHandler,
});

/**
 * Rate limiter para APIs públicas (sem autenticação)
 */
export const publicApiRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 20, // 20 requisições por minuto
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => `public:${req.ip}`,
  handler: rateLimitHandler,
});

/**
 * Rate limiter para newsletter e contato
 */
export const contactRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 3600000, // 1 hora
  max: 5, // 5 mensagens por hora
  message: 'Too many contact messages, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req: Request) => `contact:${req.ip}`,
  handler: rateLimitHandler,
});

/**
 * Rate limiter customizado
 */
export const createCustomRateLimiter = (
  windowMs: number,
  max: number,
  message?: string
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    handler: rateLimitHandler,
  });
};
