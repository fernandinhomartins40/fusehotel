import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyToken } from '../utils/crypto';
import { TokenPayload } from '../types/auth.types';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token) as TokenPayload;

    // Attach user to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        next(new UnauthorizedError('Invalid token'));
      } else if (error.name === 'TokenExpiredError') {
        next(new UnauthorizedError('Token has expired'));
      } else {
        next(error);
      }
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't throw error if not
 */
export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token) as TokenPayload;

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch (error) {
    // Silently fail - user remains undefined
    logger.debug('Optional authentication failed:', error);
  }

  next();
};

// Import logger for optional auth
import logger from '../utils/logger';
