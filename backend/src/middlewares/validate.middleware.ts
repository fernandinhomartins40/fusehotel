import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Validation Middleware Factory
 * Validates request data against Zod schema
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request data
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error); // Let error middleware handle it
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  };
};

/**
 * Validate Body Only
 */
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  };
};

/**
 * Validate Query Parameters Only
 */
export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  };
};

/**
 * Validate Params Only
 */
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.params);
      req.params = validated as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  };
};
