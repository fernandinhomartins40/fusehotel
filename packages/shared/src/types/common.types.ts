/**
 * Common Types
 *
 * Tipos comuns utilizados em toda a aplicação
 */

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

/**
 * Resposta de erro da API
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  code?: string;
  statusCode: number;
}

/**
 * Erro de validação
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Metadados de resposta
 */
export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  version?: string;
}

/**
 * Paginação
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros de busca
 */
export interface SearchFilters {
  query?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Timestamps padrão
 */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

/**
 * Entidade base
 */
export interface BaseEntity extends Timestamps {
  id: string;
}

/**
 * Opção de select
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Resultado de upload de arquivo
 */
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * Coordenadas geográficas
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

/**
 * Período de datas
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Status genérico
 */
export type GenericStatus = 'active' | 'inactive' | 'pending' | 'archived';
