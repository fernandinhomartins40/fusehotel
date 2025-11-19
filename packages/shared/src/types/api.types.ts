/**
 * API Types
 *
 * Tipos relacionados a endpoints e rotas da API
 */

import { UserRole } from './user.types';

/**
 * Métodos HTTP
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Headers HTTP comuns
 */
export interface ApiHeaders {
  'Content-Type'?: string;
  'Authorization'?: string;
  'Accept'?: string;
  'Accept-Language'?: string;
  [key: string]: string | undefined;
}

/**
 * Configuração de requisição
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  headers?: ApiHeaders;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
}

/**
 * Resposta de saúde da API
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
}

/**
 * Endpoint da API
 */
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  requiresAuth: boolean;
  requiredRoles?: UserRole[];
  description: string;
}

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Erro HTTP
 */
export interface HttpError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}

/**
 * Upload de arquivo
 */
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * Resultado de upload
 */
export interface UploadResponse {
  success: boolean;
  files: Array<{
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
}

/**
 * Webhook payload
 */
export interface WebhookPayload<T = unknown> {
  event: string;
  timestamp: string;
  data: T;
  signature?: string;
}

/**
 * Batch operation request
 */
export interface BatchOperationRequest<T = unknown> {
  operation: 'create' | 'update' | 'delete';
  items: T[];
}

/**
 * Batch operation response
 */
export interface BatchOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    index: number;
    message: string;
  }>;
}
