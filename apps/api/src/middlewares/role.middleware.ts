/**
 * Role Middleware
 *
 * Middleware para verificação de permissões baseadas em roles
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Hierarquia de roles (maior valor = maior permissão)
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  MANAGER: 2,
  ADMIN: 3,
};

/**
 * Verifica se um usuário tem uma role específica
 */
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Middleware para exigir uma role específica
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Verifica se o usuário está autenticado
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      // Verifica se o usuário tem uma das roles permitidas
      const userRole = req.user.role;
      const hasPermission = allowedRoles.some((role) => hasRole(userRole, role));

      if (!hasPermission) {
        logger.warn('Access denied due to insufficient permissions', {
          userId: req.user.userId,
          userRole,
          requiredRoles: allowedRoles,
        });

        throw new ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        );
      }

      logger.debug('Role check passed', {
        userId: req.user.userId,
        userRole,
        allowedRoles,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware para exigir role de ADMIN
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware para exigir role de MANAGER ou superior
 */
export const requireManager = requireRole(UserRole.MANAGER);

/**
 * Middleware para exigir qualquer usuário autenticado
 */
export const requireCustomer = requireRole(UserRole.CUSTOMER);

/**
 * Middleware para verificar se o usuário é o dono do recurso OU tem permissão administrativa
 */
export const requireOwnerOrAdmin = (getUserIdFromParams: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const resourceUserId = getUserIdFromParams(req);
      const isOwner = req.user.userId === resourceUserId;
      const isAdmin = hasRole(req.user.role, UserRole.ADMIN);

      if (!isOwner && !isAdmin) {
        logger.warn('Access denied: not owner and not admin', {
          userId: req.user.userId,
          resourceUserId,
        });

        throw new ForbiddenError('Access denied. You can only access your own resources');
      }

      logger.debug('Owner or admin check passed', {
        userId: req.user.userId,
        isOwner,
        isAdmin,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Verifica se o usuário autenticado é ADMIN
 */
export const isAdmin = (req: Request): boolean => {
  return req.user?.role === UserRole.ADMIN;
};

/**
 * Verifica se o usuário autenticado é MANAGER ou superior
 */
export const isManager = (req: Request): boolean => {
  return req.user ? hasRole(req.user.role, UserRole.MANAGER) : false;
};

/**
 * Verifica se o usuário é dono do recurso
 */
export const isOwner = (req: Request, resourceUserId: string): boolean => {
  return req.user?.userId === resourceUserId;
};

/**
 * Verifica se o usuário pode acessar o recurso (é dono OU é admin)
 */
export const canAccess = (req: Request, resourceUserId: string): boolean => {
  if (!req.user) return false;
  return isOwner(req, resourceUserId) || isAdmin(req);
};
