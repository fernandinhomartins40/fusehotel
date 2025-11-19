import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Acesso negado'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Você não tem permissão para acessar este recurso'));
    }

    next();
  };
}
