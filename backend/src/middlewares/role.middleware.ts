import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * Role-based Authorization Middleware
 * Checks if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.user) {
      throw new UnauthorizedError('You must be logged in to access this resource');
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to access this resource');
    }

    next();
  };
};

/**
 * Admin Only Middleware
 */
export const adminOnly = authorize(UserRole.ADMIN);

/**
 * Admin or Manager Middleware
 */
export const adminOrManager = authorize(UserRole.ADMIN, UserRole.MANAGER);

/**
 * Resource Owner or Admin Middleware
 * Allows access if user is the owner of the resource or an admin
 */
export const ownerOrAdmin = (getUserIdFromResource: (req: Request) => string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('You must be logged in to access this resource');
    }

    const resourceUserId = getUserIdFromResource(req);

    // Allow if user is admin or owner of resource
    if (req.user.role === UserRole.ADMIN || req.user.userId === resourceUserId) {
      next();
    } else {
      throw new ForbiddenError('You do not have permission to access this resource');
    }
  };
};
