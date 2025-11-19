import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment';
import { errorHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rate-limiter.middleware';
import { logger } from './utils/logger';
import routes from './routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
app.use(apiLimiter);

if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });
}

app.get(`${env.API_PREFIX}/health`, (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '1.0.0'
  });
});

app.get(`${env.API_PREFIX}/health/database`, async (req, res) => {
  try {
    const { prisma } = await import('./config/database');
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;
    
    res.json({
      status: 'connected',
      responseTime: `${responseTime}ms`
    });
  } catch (error) {
    res.status(500).json({
      status: 'disconnected',
      error: 'Database connection failed'
    });
  }
});

app.use(env.API_PREFIX, routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path
  });
});

app.use(errorHandler);
