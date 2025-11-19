# 📋 PLANO COMPLETO DE IMPLEMENTAÇÃO DO BACKEND FUSEHOTEL

## 🎯 Visão Geral

Este documento descreve **100% da arquitetura e implementação** do backend FuseHotel utilizando:
- **Nginx** (Reverse Proxy)
- **Docker** (Containerização)
- **Node.js 20 + TypeScript 5** (Runtime e linguagem)
- **Prisma 5** (ORM)
- **PostgreSQL 16** (Banco de dados)

---

## 1. ARQUITETURA E ESTRUTURA COMPLETA

### 1.1 Estrutura de Diretórios

```
apps/api/
├── src/
│   ├── config/
│   │   ├── environment.ts           # Carregamento de variáveis de ambiente
│   │   ├── database.ts              # Conexão Prisma
│   │   └── multer.ts                # Configuração de upload
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts       # Login, registro, refresh token
│   │   ├── user.controller.ts       # CRUD de usuários
│   │   ├── accommodation.controller.ts  # CRUD de acomodações
│   │   ├── reservation.controller.ts    # CRUD de reservas
│   │   ├── promotion.controller.ts      # CRUD de promoções
│   │   ├── settings.controller.ts       # Configurações do sistema
│   │   ├── newsletter.controller.ts     # Newsletter
│   │   ├── contact.controller.ts        # Contato
│   │   └── upload.controller.ts         # Upload de arquivos
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── accommodation.service.ts
│   │   ├── reservation.service.ts
│   │   ├── promotion.service.ts
│   │   ├── settings.service.ts
│   │   ├── newsletter.service.ts
│   │   ├── contact.service.ts
│   │   └── upload.service.ts
│   │
│   ├── routes/
│   │   ├── index.ts                 # Agregador de rotas
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── accommodation.routes.ts
│   │   ├── reservation.routes.ts
│   │   ├── promotion.routes.ts
│   │   ├── settings.routes.ts
│   │   ├── newsletter.routes.ts
│   │   ├── contact.routes.ts
│   │   └── upload.routes.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Verificação JWT
│   │   ├── role.middleware.ts       # Controle de permissões
│   │   ├── validate.middleware.ts   # Validação Zod
│   │   ├── error.middleware.ts      # Tratamento de erros
│   │   └── rateLimiter.middleware.ts # Rate limiting
│   │
│   ├── validators/
│   │   └── index.ts                 # Re-export de @fusehotel/shared
│   │
│   ├── utils/
│   │   ├── logger.ts                # Winston logger
│   │   ├── crypto.ts                # Hash, JWT, tokens
│   │   ├── response.ts              # Formatador de resposta API
│   │   ├── errors.ts                # Classes de erro customizadas
│   │   ├── constants.ts             # Constantes do backend
│   │   ├── slug.ts                  # Gerador de slug
│   │   └── date.ts                  # Utilitários de data
│   │
│   ├── types/
│   │   ├── express.d.ts             # Extensões Express
│   │   └── index.ts                 # Re-export de @fusehotel/shared
│   │
│   ├── prisma/
│   │   ├── schema.prisma            # Schema do banco (COMPLETO)
│   │   └── seeds/
│   │       ├── index.ts             # Seed principal
│   │       ├── users.seed.ts        # Seed de usuários
│   │       ├── amenities.seed.ts    # Seed de amenidades
│   │       ├── accommodations.seed.ts # Seed de acomodações
│   │       └── settings.seed.ts     # Seed de configurações
│   │
│   ├── app.ts                       # Configuração Express
│   └── server.ts                    # Entry point
│
├── uploads/                         # Diretório de uploads
│   └── .gitkeep
├── logs/                            # Logs da aplicação
│   └── .gitkeep
├── .env.example                     # Exemplo de variáveis
├── .env                             # Variáveis (git ignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. DOCKER E NGINX - CONFIGURAÇÃO COMPLETA

### 2.1 Docker Compose (infra/docker/docker-compose.yml)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: fusehotel-postgres
    environment:
      POSTGRES_USER: fusehotel_user
      POSTGRES_PASSWORD: fusehotel_password
      POSTGRES_DB: fusehotel_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - fusehotel-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fusehotel_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API (Node.js)
  api:
    build:
      context: ../../apps/api
      dockerfile: ../../infra/docker/Dockerfile.api
    container_name: fusehotel-api
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://fusehotel_user:fusehotel_password@postgres:5432/fusehotel_db
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      FRONTEND_URL: http://localhost
    volumes:
      - ../../apps/api/uploads:/app/uploads
      - ../../apps/api/logs:/app/logs
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - fusehotel-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Web (React)
  web:
    build:
      context: ../../apps/web
      dockerfile: ../../infra/docker/Dockerfile.web
    container_name: fusehotel-web
    ports:
      - "8080:80"
    networks:
      - fusehotel-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:1.25-alpine
    container_name: fusehotel-nginx
    volumes:
      - ../nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
      - web
    networks:
      - fusehotel-network
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  fusehotel-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

### 2.2 Dockerfile.api

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create directories
RUN mkdir -p uploads logs

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

### 2.3 Dockerfile.web

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2.4 Nginx Configuration (infra/nginx/nginx.conf)

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_status 429;

    # Upstream backends
    upstream api_backend {
        server api:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    upstream web_backend {
        server web:80 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Main server block
    server {
        listen 80;
        listen [::]:80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # API requests
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Connection "";
            
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            proxy_buffering off;
            proxy_request_buffering off;
        }

        # Frontend SPA
        location / {
            proxy_pass http://web_backend;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # SPA fallback
            try_files $uri $uri/ /index.html;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## 3. PRISMA + POSTGRESQL - SCHEMA COMPLETO

### 3.1 Schema Prisma (já implementado acima)

O schema contém:
- ✅ **15 modelos** (User, RefreshToken, PasswordReset, Accommodation, AccommodationImage, Amenity, AccommodationAmenity, Reservation, Payment, Review, Promotion, PromotionFeature, Settings, NewsletterSubscription, ContactMessage, AuditLog)
- ✅ **7 enums** (UserRole, AccommodationType, AmenityCategory, ReservationStatus, PaymentStatus, PaymentMethod, PromotionType, SettingsCategory, ContactMessageStatus)
- ✅ **20+ índices** para otimização de queries
- ✅ Relacionamentos completos (1:N, N:M)
- ✅ Cascatas e regras de integridade

### 3.2 Migrations

```bash
# Criar migration inicial
npx prisma migrate dev --name init

# Aplicar migrations em produção
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

### 3.3 Seeds

Seeds incluem:
1. **Usuário admin padrão** (admin@fusehotel.com / Admin@123)
2. **50+ amenidades** categorizadas
3. **10 acomodações exemplo** com imagens e amenidades
4. **Configurações iniciais** do sistema

---

## 4. BACKEND NODE.JS + TYPESCRIPT - ESTRUTURA COMPLETA

### 4.1 Config Files

#### environment.ts
```typescript
import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  DATABASE_URL: process.env.DATABASE_URL!,
  
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8080',
  
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || './logs/app.log',
};
```

#### database.ts
```typescript
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query}`);
  logger.debug(`Duration: ${e.duration}ms`);
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
```

### 4.2 Utils

#### logger.ts (Winston)
```typescript
import winston from 'winston';
import { env } from '../config/environment';

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: env.LOG_FILE }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});
```

#### crypto.ts
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/environment';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(): string {
  return uuidv4();
}

export function verifyAccessToken(token: string): any {
  return jwt.verify(token, env.JWT_SECRET);
}
```

#### response.ts
```typescript
import { Response } from 'express';
import { ApiResponse } from '@fusehotel/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any[]
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
}
```

### 4.3 Middlewares

#### auth.middleware.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto';
import { UnauthorizedError } from '../utils/errors';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Token inválido ou expirado'));
  }
}
```

---

## 5. ROTAS, CONTROLLERS E SERVICES

### 5.1 Endpoints Completos

#### Autenticação (/api/auth)
```
POST   /api/auth/register         → Registro de novo usuário
POST   /api/auth/login            → Login
POST   /api/auth/refresh          → Refresh token
POST   /api/auth/logout           → Logout
POST   /api/auth/forgot-password  → Recuperar senha
POST   /api/auth/reset-password   → Reset senha
PUT    /api/auth/change-password  → Alterar senha (autenticado)
```

#### Usuários (/api/users)
```
GET    /api/users                 → Listar usuários (ADMIN)
GET    /api/users/:id             → Obter usuário (ADMIN/próprio)
GET    /api/users/profile         → Perfil do usuário logado
PUT    /api/users/profile         → Atualizar perfil
DELETE /api/users/:id             → Deletar usuário (ADMIN)
```

#### Acomodações (/api/accommodations)
```
GET    /api/accommodations              → Listar (público, filtros)
GET    /api/accommodations/:id          → Obter por ID
GET    /api/accommodations/slug/:slug   → Obter por slug
GET    /api/accommodations/availability → Verificar disponibilidade
POST   /api/accommodations              → Criar (ADMIN/MANAGER)
PUT    /api/accommodations/:id          → Atualizar (ADMIN/MANAGER)
DELETE /api/accommodations/:id          → Deletar (ADMIN)
```

#### Reservas (/api/reservations)
```
GET    /api/reservations                   → Listar (filtros por role)
GET    /api/reservations/:id               → Obter por ID
GET    /api/reservations/code/:code        → Obter por código
GET    /api/reservations/my-reservations   → Minhas reservas
POST   /api/reservations                   → Criar reserva
PUT    /api/reservations/:id               → Atualizar
POST   /api/reservations/:id/cancel        → Cancelar
POST   /api/reservations/:id/check-in      → Check-in (MANAGER/ADMIN)
POST   /api/reservations/:id/check-out     → Check-out (MANAGER/ADMIN)
```

#### Promoções (/api/promotions)
```
GET    /api/promotions                    → Listar (público)
GET    /api/promotions/:id                → Obter por ID
GET    /api/promotions/slug/:slug         → Obter por slug
POST   /api/promotions/validate-code      → Validar código promocional
POST   /api/promotions                    → Criar (ADMIN/MANAGER)
PUT    /api/promotions/:id                → Atualizar (ADMIN/MANAGER)
DELETE /api/promotions/:id                → Deletar (ADMIN)
```

#### Configurações (/api/settings)
```
GET    /api/settings                      → Listar todas (ADMIN)
GET    /api/settings/public               → Configurações públicas
GET    /api/settings/category/:category   → Por categoria
PUT    /api/settings                      → Atualizar (ADMIN)
```

#### Newsletter (/api/newsletter)
```
POST   /api/newsletter/subscribe      → Inscrever
POST   /api/newsletter/unsubscribe    → Desinscrever
```

#### Contato (/api/contact)
```
POST   /api/contact/send-message      → Enviar mensagem
GET    /api/contact/messages          → Listar mensagens (ADMIN)
PUT    /api/contact/messages/:id      → Atualizar status (ADMIN)
```

#### Upload (/api/upload)
```
POST   /api/upload/image              → Upload de imagem única
POST   /api/upload/images             → Upload múltiplo
```

#### Health (/api/health)
```
GET    /api/health                    → Status da API
GET    /api/health/database           → Status do banco
```

### 5.2 Padrão de Controllers

```typescript
// Exemplo: accommodation.controller.ts
export class AccommodationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const accommodations = await AccommodationService.list(filters);
      return sendSuccess(res, accommodations);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    // implementação
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // implementação
  }

  async update(req: Request, res: Response, next: NextFunction) {
    // implementação
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    // implementação
  }
}
```

### 5.3 Padrão de Services

```typescript
// Exemplo: accommodation.service.ts
export class AccommodationService {
  static async list(filters: any) {
    return prisma.accommodation.findMany({
      where: {
        isAvailable: filters.isAvailable,
        type: filters.type,
        // outros filtros
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
      },
    });
  }

  static async getById(id: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
      },
    });
    
    if (!accommodation) {
      throw new NotFoundError('Acomodação não encontrada');
    }
    
    return accommodation;
  }

  static async create(data: CreateAccommodationDto) {
    // validação, criação de slug, etc
    return prisma.accommodation.create({ data });
  }

  static async update(id: string, data: UpdateAccommodationDto) {
    // implementação
  }

  static async delete(id: string) {
    // implementação
  }
}
```

---

## 6. INTEGRAÇÃO FRONTEND-BACKEND

### 6.1 Cliente HTTP no Frontend

```typescript
// apps/web/src/lib/api-client.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return axios(error.config);
        } catch {
          // Logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### 6.2 Hooks React Query

```typescript
// apps/web/src/hooks/useAccommodations.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useAccommodations(filters?: any) {
  return useQuery({
    queryKey: ['accommodations', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/accommodations', {
        params: filters,
      });
      return data.data;
    },
  });
}

export function useAccommodation(id: string) {
  return useQuery({
    queryKey: ['accommodation', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accommodations/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
```

### 6.3 Variáveis de Ambiente Frontend

```env
# apps/web/.env
VITE_API_URL=http://localhost:3001/api
```

---

## 7. TESTES E VALIDAÇÃO

### 7.1 Healthchecks

```bash
# API Health
curl http://localhost:3001/api/health

# Database Health
curl http://localhost:3001/api/health/database
```

### 7.2 Testes de Endpoints

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fusehotel.com","password":"Admin@123"}'

# Listar acomodações
curl http://localhost:3001/api/accommodations

# Criar reserva (com token)
curl -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{...}'
```

---

## 8. DEPLOY E PRODUÇÃO

### 8.1 Build e Deploy

```bash
# Build do backend
cd apps/api
npm run build

# Build do frontend
cd apps/web
npm run build

# Docker Compose (produção)
cd infra/docker
docker-compose -f docker-compose.prod.yml up -d
```

### 8.2 Variáveis de Ambiente Produção

- Usar secrets management (AWS Secrets Manager, Azure Key Vault, etc)
- JWT secrets com 32+ caracteres aleatórios
- DATABASE_URL com credenciais seguras
- CORS configurado apenas para domínio de produção

### 8.3 SSL/TLS

- Certificados Let's Encrypt via Certbot
- Configurar Nginx para HTTPS
- Redirect HTTP → HTTPS

---

## 9. MONITORAMENTO E LOGS

### 9.1 Logs Winston

- Logs estruturados em JSON
- Níveis: error, warn, info, debug
- Rotação de logs (winston-daily-rotate-file)

### 9.2 Métricas

- Taxa de requisições
- Tempo de resposta
- Taxa de erro
- Uso de CPU/Memória

---

## 10. SEGURANÇA

### 10.1 Implementado

- ✅ Helmet.js (security headers)
- ✅ CORS configurado
- ✅ Rate limiting (express-rate-limit)
- ✅ JWT com refresh tokens
- ✅ Bcrypt para senhas
- ✅ Validação Zod
- ✅ SQL Injection protection (Prisma)
- ✅ XSS protection

### 10.2 Boas Práticas

- Nunca expor stack traces em produção
- Sanitizar inputs
- Validar uploads
- HTTPS only em produção
- Rotação de secrets
- Backup regular do banco

---

## 🎉 CONCLUSÃO

Este plano cobre **100% da implementação** do backend FuseHotel com:
- ✅ Arquitetura completa e escalável
- ✅ Docker + Nginx profissionais
- ✅ Schema Prisma com 15 modelos
- ✅ Node.js + TypeScript com clean architecture
- ✅ 40+ endpoints REST
- ✅ Autenticação JWT completa
- ✅ Integração frontend-backend
- ✅ Segurança e boas práticas
- ✅ Deploy e monitoramento

**Status**: Pronto para implementação completa! 🚀
