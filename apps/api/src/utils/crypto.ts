import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/environment';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function generateRefreshToken(): string {
  return uuidv4();
}

export function generateSecurePassword(length: number = 16): string {
  return randomBytes(length)
    .toString('base64url')
    .slice(0, Math.max(length, 12));
}

export function verifyAccessToken(token: string): any {
  return jwt.verify(token, env.JWT_SECRET);
}
