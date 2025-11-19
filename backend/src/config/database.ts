import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });
};

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: unknown) => {
    const event = e as { query: string; duration: number };
    logger.debug(`Query: ${event.query}`);
    logger.debug(`Duration: ${event.duration}ms`);
  });
}

// Log errors
prisma.$on('error' as never, (e: unknown) => {
  const event = e as { message: string };
  logger.error('Prisma Error:', event);
});

// Log warnings
prisma.$on('warn' as never, (e: unknown) => {
  const event = e as { message: string };
  logger.warn('Prisma Warning:', event);
});

// Log info
prisma.$on('info' as never, (e: unknown) => {
  const event = e as { message: string };
  logger.info('Prisma Info:', event);
});

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect database
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};

export { prisma };
export default prisma;
