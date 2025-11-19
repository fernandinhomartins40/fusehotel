import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Hash Password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare Password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT Token
 */
export const generateToken = (
  payload: Record<string, unknown>,
  expiresIn: string = process.env.JWT_EXPIRES_IN || '15m'
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (
  payload: Record<string, unknown>,
  expiresIn: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string): Record<string, unknown> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret) as Record<string, unknown>;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): Record<string, unknown> => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  return jwt.verify(token, secret) as Record<string, unknown>;
};

/**
 * Generate Random Token (for password reset, email verification, etc.)
 */
export const generateRandomToken = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generate Reservation Code
 * Format: FHXXXXX (FH + 5 random uppercase alphanumeric)
 */
export const generateReservationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FH';

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};
