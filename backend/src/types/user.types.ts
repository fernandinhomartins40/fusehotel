import { UserRole } from '@prisma/client';

/**
 * User Types
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  cpf: string | null;
  role: UserRole;
  profileImage: string | null;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface UpdateUserProfile {
  name?: string;
  phone?: string;
  cpf?: string;
  profileImage?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  cpf?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  cpf?: string;
  profileImage?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
