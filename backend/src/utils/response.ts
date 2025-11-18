import { Response } from 'express';

/**
 * API Response Types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Success Response
 */
export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };

  return res.status(statusCode).json(response);
};

/**
 * Paginated Success Response
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message?: string
): Response => {
  return res.status(200).json({
    success: true,
    data,
    pagination,
    message,
  });
};

/**
 * Error Response
 */
export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = 500,
  message?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    message,
  };

  return res.status(statusCode).json(response);
};

/**
 * Created Response (201)
 */
export const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return successResponse(res, data, message, 201);
};

/**
 * No Content Response (204)
 */
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Calculate Pagination Metadata
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
