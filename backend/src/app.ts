import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import logger from './utils/logger';

// Initialize Express app
const app: Application = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security Headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.frontend.url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (apply to all routes)
app.use(apiLimiter);

// Request Logging
if (env.node.env !== 'production') {
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });
}

// ============================================================================
// ROUTES
// ============================================================================

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: env.node.env,
  });
});

// Database Health Check
app.get('/api/health/db', async (_req: Request, res: Response) => {
  try {
    const { prisma } = await import('./config/database');
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'Database is healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database is not healthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API Routes
import authRoutes from './routes/auth.routes';

app.use('/api/auth', authRoutes);

// TODO: Add more routes
// app.use('/api/users', userRoutes);
// app.use('/api/accommodations', accommodationRoutes);
// app.use('/api/reservations', reservationRoutes);
// app.use('/api/promotions', promotionRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/newsletter', newsletterRoutes);
// app.use('/api/contact', contactRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
