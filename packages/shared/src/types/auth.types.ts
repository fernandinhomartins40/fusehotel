/**
 * Auth Types
 *
 * Tipos relacionados a autenticação e autorização
 */

import { UserRole, PublicUser } from './user.types';

/**
 * Credenciais de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Dados de registro
 */
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  cpf?: string;
  acceptTerms: boolean;
}

/**
 * Tokens de autenticação
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * Resposta de autenticação
 */
export interface AuthResponse {
  user: PublicUser;
  tokens: AuthTokens;
}

/**
 * Payload do JWT
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Contexto de autenticação (para middleware)
 */
export interface AuthContext {
  userId: string;
  role: UserRole;
  email: string;
}

/**
 * Requisição de reset de senha
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Confirmação de reset de senha
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Requisição de verificação de email
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Requisição de refresh token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Sessão do usuário
 */
export interface UserSession {
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: string;
  createdAt: string;
}
