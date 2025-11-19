import { UserRole } from '@prisma/client';

/**
 * Extend Express Request type to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};
