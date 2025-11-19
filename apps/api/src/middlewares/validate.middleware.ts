/**
 * Validation Middleware
 *
 * Middleware para validação de dados com Zod
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Tipos de validação
 */
export type ValidationType = 'body' | 'query' | 'params';

/**
 * Formata erros do Zod
 */
const formatZodErrors = (error: ZodError): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });

  return formatted;
};

/**
 * Middleware de validação genérico
 */
export const validate = (
  schema: ZodSchema,
  type: ValidationType = 'body'
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Seleciona a parte do request para validar
      const dataToValidate = req[type];

      // Valida os dados
      const validated = await schema.parseAsync(dataToValidate);

      // Substitui os dados originais pelos validados
      req[type] = validated;

      logger.debug(`Validation passed for ${type}`, {
        data: validated,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);

        logger.warn('Validation failed', {
          type,
          errors: formattedErrors,
        });

        next(
          new ValidationError('Validation failed', formattedErrors)
        );
      } else {
        next(error);
      }
    }
  };
};

/**
 * Middleware de validação para body
 */
export const validateBody = (schema: ZodSchema) => {
  return validate(schema, 'body');
};

/**
 * Middleware de validação para query
 */
export const validateQuery = (schema: ZodSchema) => {
  return validate(schema, 'query');
};

/**
 * Middleware de validação para params
 */
export const validateParams = (schema: ZodSchema) => {
  return validate(schema, 'params');
};

/**
 * Middleware de validação múltipla (body + query + params)
 */
export const validateMultiple = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const errors: Record<string, Record<string, string[]>> = {};

      // Valida body
      if (schemas.body) {
        try {
          req.body = await schemas.body.parseAsync(req.body);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.body = formatZodErrors(error);
          }
        }
      }

      // Valida query
      if (schemas.query) {
        try {
          req.query = await schemas.query.parseAsync(req.query);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.query = formatZodErrors(error);
          }
        }
      }

      // Valida params
      if (schemas.params) {
        try {
          req.params = await schemas.params.parseAsync(req.params);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.params = formatZodErrors(error);
          }
        }
      }

      // Se houver erros, lança ValidationError
      if (Object.keys(errors).length > 0) {
        logger.warn('Multiple validation failed', { errors });
        throw new ValidationError('Validation failed', errors);
      }

      logger.debug('Multiple validation passed');
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Valida ID de parâmetro
 */
import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const validateIdParam = validateParams(idParamSchema);

/**
 * Valida slug de parâmetro
 */
export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const validateSlugParam = validateParams(slugParamSchema);

/**
 * Schema de paginação
 */
export const paginationQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const validatePaginationQuery = validateQuery(paginationQuerySchema);
