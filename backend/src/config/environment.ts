import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvironmentConfig {
  node: {
    env: string;
    port: number;
    apiPrefix: string;
  };
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  frontend: {
    url: string;
  };
  upload: {
    maxFileSize: number;
    path: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  log: {
    level: string;
    file: string;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

const getEnvVarAsNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

export const env: EnvironmentConfig = {
  node: {
    env: getEnvVar('NODE_ENV', 'development'),
    port: getEnvVarAsNumber('PORT', 3001),
    apiPrefix: getEnvVar('API_PREFIX', '/api'),
  },
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  frontend: {
    url: getEnvVar('FRONTEND_URL', 'http://localhost:8080'),
  },
  upload: {
    maxFileSize: getEnvVarAsNumber('MAX_FILE_SIZE', 10485760), // 10MB
    path: getEnvVar('UPLOAD_PATH', './uploads'),
  },
  email: {
    host: getEnvVar('SMTP_HOST', 'smtp.gmail.com'),
    port: getEnvVarAsNumber('SMTP_PORT', 587),
    user: getEnvVar('SMTP_USER', ''),
    password: getEnvVar('SMTP_PASSWORD', ''),
    from: getEnvVar('EMAIL_FROM', 'noreply@fusehotel.com'),
  },
  rateLimit: {
    windowMs: getEnvVarAsNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
    maxRequests: getEnvVarAsNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  },
  log: {
    level: getEnvVar('LOG_LEVEL', 'info'),
    file: getEnvVar('LOG_FILE', './logs/app.log'),
  },
};

export default env;
