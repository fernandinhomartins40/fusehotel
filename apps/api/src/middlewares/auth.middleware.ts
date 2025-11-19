import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto';
import { UnauthorizedError } from '../utils/errors';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    (req as any).user = {
      id: payload.userId,
      role: payload.role,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Token inválido ou expirado'));
  }
}
