import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  meta?: { timestamp: string };
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta: { timestamp: new Date().toISOString() },
  };
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode: number = 500, errors?: any[]): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    meta: { timestamp: new Date().toISOString() },
  };
  return res.status(statusCode).json(response);
}
