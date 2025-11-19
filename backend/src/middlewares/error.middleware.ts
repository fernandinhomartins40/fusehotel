import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';

/**
 * Error Handling Middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Zod Validation Error
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    errorResponse(res, errors, 400, 'Validation error');
    return;
  }

  // Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.[0] || 'field';
      errorResponse(res, `${field} already exists`, 409, 'Conflict');
      return;
    }

    // Foreign key constraint violation
    if (err.code === 'P2003') {
      errorResponse(res, 'Related resource not found', 400, 'Invalid reference');
      return;
    }

    // Record not found
    if (err.code === 'P2025') {
      errorResponse(res, 'Resource not found', 404, 'Not found');
      return;
    }
  }

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    errorResponse(res, 'Invalid data provided', 400, 'Validation error');
    return;
  }

  // Custom App Error
  if (err instanceof AppError) {
    errorResponse(res, err.message, err.statusCode);
    return;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse(res, 'Invalid token', 401, 'Unauthorized');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse(res, 'Token has expired', 401, 'Unauthorized');
    return;
  }

  // Multer Errors
  if (err.name === 'MulterError') {
    if (err.message.includes('File too large')) {
      errorResponse(res, 'File size exceeds limit', 400, 'Upload error');
      return;
    }
    errorResponse(res, err.message, 400, 'Upload error');
    return;
  }

  // Default Internal Server Error
  errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An internal error occurred'
      : err.message,
    500,
    'Internal server error'
  );
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route ${req.originalUrl} not found`, 404, 'Not found');
};

/**
 * Async Handler Wrapper
 * Catches async errors and passes them to error middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
