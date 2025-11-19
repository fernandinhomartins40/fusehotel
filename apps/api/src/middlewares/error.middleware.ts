import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction) {
  logger.error('Error:', err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, (err as any).errors);
  }

  return sendError(res, 'Erro interno do servidor', 500);
}
