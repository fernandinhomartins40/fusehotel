# 🏨 FuseHotel - Sistema de Gestão Hoteleira

Sistema completo de gestão hoteleira com arquitetura monorepo, desenvolvido com as melhores práticas e tecnologias modernas.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [🚀 Quick Start](#-quick-start)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [🐳 Desenvolvimento com Docker](#-desenvolvimento-com-docker)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Build e Deploy](#build-e-deploy)
- [Documentação](#documentação)

## 🎯 Visão Geral

FuseHotel é uma plataforma completa para gerenciamento de hotel, incluindo:

- ✅ **Frontend Web**: Interface moderna e responsiva para clientes e administradores
- ✅ **Backend API**: API RESTful robusta com Node.js, TypeScript e Prisma
- ✅ **Infraestrutura**: Docker, Nginx, PostgreSQL para deploy profissional
- ✅ **Monorepo**: Organização profissional com workspaces npm

### Funcionalidades Principais

- ✅ Gestão de acomodações (quartos, suítes, chalés)
- ✅ Sistema de reservas online com cálculo automático
- ✅ Promoções e pacotes especiais
- ✅ Área do cliente com histórico de reservas
- ✅ Painel administrativo completo
- ✅ Sistema de autenticação JWT com refresh token
- ✅ **Proteção de rotas por roles (ADMIN, MANAGER, CUSTOMER)**
- ✅ Newsletter e contato
- ✅ Upload de imagens
- ✅ SEO otimizado

## 🚀 Quick Start

**Quer começar rapidamente?** Veja o [QUICK_START.md](./QUICK_START.md)!

### Início Rápido com Docker (5 minutos)

```bash
# 1. Iniciar ambiente
docker-compose -f docker-compose.dev.yml up --build

# 2. Em outro terminal, executar migrations e seeds
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev
docker-compose -f docker-compose.dev.yml exec api npm run prisma:seed

# 3. Acessar a aplicação
# 🎉 Abra: http://localhost:3090
```

**Login de teste:**
- **Admin**: admin@fusehotel.com / Admin@123
- **Manager**: gerente@fusehotel.com / Manager@123
- **Cliente**: joao.silva@email.com / Customer@123

## 🏗️ Arquitetura

### Estrutura Monorepo

```
fusehotel/
├── apps/
│   ├── web/              # Frontend React + Vite
│   └── api/              # Backend Node.js + Express
├── packages/
│   └── shared/           # Tipos e utilitários compartilhados
├── infra/
│   ├── docker/           # Docker Compose + Dockerfiles
│   └── nginx/            # Configuração Nginx
├── package.json          # Root package.json (workspaces)
└── README.md
```

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│               Frontend (React + Vite)               │
│          http://localhost:3000 (dev)                │
│          http://localhost (prod)                    │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│           Nginx Reverse Proxy (Port 80)             │
│         /api/* → Backend    /* → Frontend           │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│  Backend API     │   │   Frontend SPA   │
│  (Node.js)       │   │   (React Build)  │
│  Port 3001       │   │                  │
└────────┬─────────┘   └──────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  PostgreSQL 16               │
│  Port 5432                   │
└──────────────────────────────┘
```

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Vite 5** - Build tool moderno
- **Tailwind CSS 3** - Estilização
- **ShadcnUI** - Componentes UI (55+ componentes)
- **React Router 6** - Roteamento
- **TanStack Query** - State management assíncrono
- **React Hook Form + Zod** - Formulários e validação
- **Axios** - Cliente HTTP com interceptors

### Backend
- **Node.js 20 LTS** - Runtime
- **TypeScript 5** - Tipagem estática
- **Express.js 4** - Framework web
- **Prisma 5** - ORM
- **PostgreSQL 16** - Banco de dados
- **JWT** - Autenticação com refresh tokens
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Winston** - Logging
- **Multer** - Upload de arquivos

### Shared (@fusehotel/shared)
- **8 tipos TypeScript completos** (User, Auth, Accommodation, Reservation, etc)
- **7 validadores Zod** (Auth, User, Accommodation, Reservation, etc)
- **3 arquivos de constantes** (App, Validation, API)
- **4 utilitários** (String, Date, Number, Validation)

### DevOps
- **Docker & Docker Compose** - Containerização
- **Nginx 1.25** - Reverse proxy
- **npm Workspaces** - Gerenciamento monorepo

## 🐳 Desenvolvimento com Docker

**🎯 Recomendado para desenvolvimento local que simula produção!**

### Por que usar Docker?

✅ **Porta única (3090)**: Elimina problemas de CORS
✅ **Ambiente idêntico**: Dev = Produção
✅ **Nginx incluído**: Reverse proxy configurado
✅ **Isolamento**: Containers não interferem no sistema
✅ **Setup rápido**: Tudo configurado e pronto

### Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose v2+

### Iniciar Ambiente Completo

```bash
# 1. Iniciar todos os containers (primeira vez pode demorar ~5min)
docker-compose -f docker-compose.dev.yml up --build

# 2. Em outro terminal, executar migrations
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev

# 3. Executar seeds (usuários de teste)
docker-compose -f docker-compose.dev.yml exec api npm run prisma:seed

# 4. Acessar aplicação
# 🎉 http://localhost:3090
```

### Containers Incluídos

| Container | Descrição | Porta Interna |
|-----------|-----------|---------------|
| `nginx` | Reverse Proxy | 80 (→ 3090) |
| `web` | Frontend React | 80 |
| `api` | Backend Node.js | 3001 |
| `postgres` | PostgreSQL 16 | 5432 |

### Comandos Úteis

```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar ambiente
docker-compose -f docker-compose.dev.yml down

# Rebuild após mudanças
docker-compose -f docker-compose.dev.yml up --build

# Acessar shell do container
docker-compose -f docker-compose.dev.yml exec api sh
docker-compose -f docker-compose.dev.yml exec web sh

# Executar Prisma Studio
docker-compose -f docker-compose.dev.yml exec api npx prisma studio
```

**📖 Documentação completa:** [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

## 💻 Desenvolvimento Local

### Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- PostgreSQL 16 rodando em localhost:5432

### Instalação Local (Sem Docker)

```bash
# 1. Clone o repositório
git clone https://github.com/fernandinhomartins40/fusehotel.git
cd fusehotel

# 2. Instale as dependências do monorepo
npm install

# 3. Configure as variáveis de ambiente do backend
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env com suas configurações

# 4. Configure as variáveis de ambiente do frontend
cp apps/web/.env.example apps/web/.env
# Edite apps/web/.env com suas configurações

# 5. Gere o Prisma Client
cd apps/api
npx prisma generate
cd ../..

# 6. Execute as migrations do banco (necessário PostgreSQL rodando)
cd apps/api
npx prisma migrate dev
cd ../..

# 7. Execute os seeds (dados iniciais)
cd apps/api
npm run prisma:seed
cd ../..
```

### Configurar .env para desenvolvimento local

```bash
# apps/api/.env
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://fusehotel_user:fusehotel_password@localhost:5432/fusehotel_db

# apps/web/.env
VITE_API_URL=http://localhost:3001/api
```

### Rodar a aplicação

```bash
# Terminal 1 - Backend
cd apps/api
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

**Acesse:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev              # Inicia frontend + backend
npm run dev:web          # Apenas frontend
npm run dev:api          # Apenas backend
```

### Build

```bash
npm run build            # Build completo
npm run build:web        # Build frontend
npm run build:api        # Build backend
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia todos os projetos em modo dev
npm run dev:web          # Inicia apenas o frontend
npm run dev:api          # Inicia apenas o backend

# Build
npm run build            # Build de todos os projetos
npm run build:web        # Build do frontend
npm run build:api        # Build do backend

# Linting e type checking
npm run lint             # Lint em todos os projetos
npm run typecheck        # Type check em todos os projetos

# Database (Prisma)
cd apps/api
npx prisma generate      # Gerar Prisma Client
npx prisma migrate dev   # Criar/aplicar migrations
npx prisma studio        # Abrir Prisma Studio (GUI)
npm run prisma:seed      # Executar seeds

# Limpeza
npm run clean            # Remove node_modules e builds
```

## 📊 API Endpoints

### Autenticação (`/api/auth`)

```
POST   /api/auth/register            # Registrar novo usuário
POST   /api/auth/login               # Login
POST   /api/auth/refresh             # Refresh token
POST   /api/auth/logout              # Logout
POST   /api/auth/forgot-password     # Recuperar senha
POST   /api/auth/reset-password      # Reset senha
PUT    /api/auth/change-password     # Alterar senha (auth)
```

### Usuários (`/api/users`)

```
GET    /api/users/profile            # Perfil do usuário logado
PUT    /api/users/profile            # Atualizar perfil
GET    /api/users                    # Listar usuários (ADMIN)
GET    /api/users/:id                # Obter usuário (auth)
DELETE /api/users/:id                # Deletar usuário (ADMIN)
```

### Acomodações (`/api/accommodations`)

```
GET    /api/accommodations           # Listar (público, com filtros)
GET    /api/accommodations/:id       # Obter por ID
GET    /api/accommodations/slug/:slug # Obter por slug
POST   /api/accommodations           # Criar (ADMIN/MANAGER)
PUT    /api/accommodations/:id       # Atualizar (ADMIN/MANAGER)
DELETE /api/accommodations/:id       # Deletar (ADMIN)
```

### Reservas (`/api/reservations`)

```
GET    /api/reservations             # Listar (ADMIN/MANAGER)
GET    /api/reservations/my-reservations # Minhas reservas (auth)
GET    /api/reservations/:id         # Obter por ID (auth)
GET    /api/reservations/code/:code  # Obter por código
POST   /api/reservations             # Criar reserva
POST   /api/reservations/:id/cancel  # Cancelar reserva (auth)
```

### Promoções (`/api/promotions`)

```
GET    /api/promotions               # Listar (público)
GET    /api/promotions/:id           # Obter por ID
GET    /api/promotions/slug/:slug    # Obter por slug
POST   /api/promotions               # Criar (ADMIN/MANAGER)
```

### Configurações (`/api/settings`)

```
GET    /api/settings/public          # Configurações públicas
GET    /api/settings                 # Todas as configurações (ADMIN)
```

### Newsletter (`/api/newsletter`)

```
POST   /api/newsletter/subscribe     # Inscrever newsletter
```

### Contato (`/api/contact`)

```
POST   /api/contact/send-message     # Enviar mensagem
```

### Upload (`/api/upload`)

```
POST   /api/upload/image             # Upload de imagem (auth)
```

### Health (`/api/health`)

```
GET    /api/health                   # Status da API
GET    /api/health/database          # Status do banco
```

## 📖 Documentação

### Estrutura Detalhada do Backend

**Controllers (apps/api/src/controllers/):**
- `auth.controller.ts` - Autenticação e autorização
- `users.controller.ts` - Gerenciamento de usuários
- `accommodations.controller.ts` - Acomodações/quartos
- `reservations.controller.ts` - Reservas
- `promotions.controller.ts` - Promoções e pacotes
- `settings.controller.ts` - Configurações do sistema
- `newsletter.controller.ts` - Newsletter
- `contact.controller.ts` - Mensagens de contato
- `upload.controller.ts` - Upload de imagens

**Services (apps/api/src/services/):**
- Cada controller possui seu service correspondente
- Lógica de negócio separada das rotas
- Integração com Prisma ORM

**Middlewares (apps/api/src/middlewares/):**
- `auth.middleware.ts` - Validação JWT
- `role.middleware.ts` - Validação de permissões (ADMIN, MANAGER)
- `error.middleware.ts` - Tratamento de erros global
- `rate-limiter.middleware.ts` - Rate limiting
- `validate.middleware.ts` - Validação de dados com Zod

### Estrutura Detalhada do Frontend

**Componentes (apps/web/src/components/):**
- `admin/` - Componentes do painel administrativo (13 componentes)
- `auth/` - Componentes de autenticação
- `customer/` - Componentes da área do cliente (4 componentes)
- `layout/` - Header, Footer, MobileMenu
- `sections/` - Seções da home (7 seções)
- `ui/` - 55+ componentes ShadcnUI (Radix UI)

**Páginas (apps/web/src/pages/):**
- `Index.tsx` - Home page
- `Accommodations.tsx`, `RoomDetail.tsx` - Acomodações
- `Promotions.tsx`, `PromotionDetail.tsx` - Promoções
- `CustomerArea.tsx` - Área do cliente
- `Contact.tsx`, `AboutUs.tsx`, `Services.tsx`, `FAQ.tsx`
- `admin/` - 5 páginas administrativas

**Hooks Customizados (apps/web/src/hooks/):**
- `useAuth.tsx` - Contexto de autenticação
- `useAuthMutation.ts` - Mutations de autenticação
- `useAccommodations.ts` - Queries de acomodações
- `usePromotions.ts` - Queries de promoções
- `useReservations.ts` - Queries de reservas
- `use-mobile.tsx`, `use-toast.ts` - Utilitários

### Modelos do Banco de Dados (Prisma)

O schema Prisma define 14 modelos principais:

**User** - Usuários do sistema
- Roles: `ADMIN`, `MANAGER`, `CUSTOMER`
- Relacionamentos: RefreshToken, PasswordReset, Reservation, Review

**Accommodation** - Acomodações (quartos, suítes, chalés)
- Types: `ROOM`, `SUITE`, `CHALET`, `VILLA`, `APARTMENT`
- Relacionamentos: Images, Amenities, Reservations, Reviews

**Amenity** - Comodidades disponíveis
- Categories: `BEDROOM`, `BATHROOM`, `ENTERTAINMENT`, `KITCHEN`, `OUTDOOR`, `ACCESSIBILITY`, `GENERAL`

**Reservation** - Reservas
- Status: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`, `COMPLETED`, `NO_SHOW`
- PaymentStatus: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`
- PaymentMethod: `CREDIT_CARD`, `DEBIT_CARD`, `PIX`, `BANK_TRANSFER`, `CASH`, `VOUCHER`

**Promotion** - Promoções e pacotes
- Types: `PACKAGE`, `DISCOUNT`, `SEASONAL`, `SPECIAL_OFFER`, `EARLY_BIRD`, `LAST_MINUTE`

**Settings** - Configurações globais
- Categories: `SITE_INFO`, `BRANDING`, `CONTENT`, `SEO`, `EMAIL`, `PAYMENT`, `BOOKING`, `NOTIFICATIONS`, `SOCIAL_MEDIA`, `GENERAL`

**Outros modelos:**
- `Payment` - Pagamentos
- `Review` - Avaliações
- `NewsletterSubscription` - Newsletter
- `ContactMessage` - Mensagens de contato
- `AuditLog` - Log de auditoria
- `RefreshToken` - Tokens de refresh
- `PasswordReset` - Reset de senha
- `AccommodationImage`, `AccommodationAmenity`, `PromotionFeature` - Tabelas de relacionamento

### Package @fusehotel/shared

**Tipos TypeScript (packages/shared/src/types/):**
- `common.types.ts` - BaseEntity, timestamps, pagination
- `user.types.ts` - User, UserRole, UserProfile
- `accommodation.types.ts` - Accommodation, AccommodationType
- `reservation.types.ts` - Reservation, ReservationStatus, PaymentStatus
- `promotion.types.ts` - Promotion, PromotionType
- `settings.types.ts` - Settings, SettingsCategory
- `auth.types.ts` - LoginRequest, RegisterRequest, TokenResponse
- `api.types.ts` - ApiResponse, ApiError, PaginatedResponse

**Validadores Zod (packages/shared/src/validators/):**
- `auth.validators.ts` - Login, Register, ChangePassword
- `user.validators.ts` - CreateUser, UpdateUser, UpdateProfile
- `accommodation.validators.ts` - CreateAccommodation, UpdateAccommodation
- `reservation.validators.ts` - CreateReservation, UpdateReservation
- `promotion.validators.ts` - CreatePromotion, UpdatePromotion
- `common.validators.ts` - Email, CPF, Phone, Date, Pagination

**Constantes (packages/shared/src/constants/):**
- `app.constants.ts` - USER_ROLES, ACCOMMODATION_TYPES, RESERVATION_STATUS
- `validation.constants.ts` - Regex patterns, min/max lengths
- `api.constants.ts` - Endpoints, HTTP status codes, headers

**Utilitários (packages/shared/src/utils/):**
- `date.utils.ts` - formatDate, parseDate, calculateDays
- `number.utils.ts` - formatCurrency, formatPercentage
- `string.utils.ts` - slugify, capitalize, truncate
- `validation.utils.ts` - validateCPF, validatePhone, validateEmail

### Seeds Iniciais

Ao executar `npm run prisma:seed` no backend, os seguintes dados são criados:

**Usuário Admin:**
- Email: `admin@fusehotel.com`
- Senha: `Admin@123`
- Role: ADMIN

**Amenidades (10 comodidades):**
- Wi-Fi Grátis (GENERAL)
- Ar Condicionado (BEDROOM)
- TV a Cabo (ENTERTAINMENT)
- Frigobar (KITCHEN)
- Cofre (BEDROOM)
- Secador de Cabelo (BATHROOM)
- Roupa de Cama Premium (BEDROOM)
- Toalhas (BATHROOM)
- Chuveiro Elétrico (BATHROOM)
- Estacionamento Grátis (OUTDOOR)

**Configurações do Sistema:**
- Nome do site: FuseHotel
- Descrição: Sistema de Gestão Hoteleira
- Email de contato: contato@fusehotel.com
- Telefone: (11) 1234-5678
- Logo, favicon, cores do tema
- Configurações de SEO, email, pagamento

### Roles e Permissões

- **ADMIN**: Acesso total (CRUD de todos os recursos)
- **MANAGER**: Gerencia acomodações, reservas e promoções
- **CUSTOMER**: Visualiza e cria reservas próprias

### Autenticação

O sistema usa JWT (JSON Web Tokens) com refresh tokens:

1. Login retorna `accessToken` (15min) e `refreshToken` (7 dias)
2. `accessToken` é enviado em todas as requisições autenticadas
3. Quando `accessToken` expira, o cliente usa `/auth/refresh` automaticamente
4. Frontend possui interceptors Axios que renovam o token automaticamente

### Validação

Todas as requisições são validadas com Zod schemas do package `@fusehotel/shared`:

- Validação de email, CPF, telefone
- Validação de senhas fortes
- Validação de datas, números, enums
- Mensagens de erro em português

### Estrutura de Resposta

Todas as respostas da API seguem o padrão:

```typescript
{
  success: boolean,
  data?: T,
  message?: string,
  errors?: ValidationError[],
  meta?: {
    timestamp: string
  }
}
```

### Variáveis de Ambiente

**Backend (apps/api/.env):**

```bash
# Ambiente
NODE_ENV=development                    # development | production | test
PORT=3001                               # Porta do servidor

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fusehotel

# JWT
JWT_SECRET=your-super-secret-jwt-key                    # Obrigatório
JWT_REFRESH_SECRET=your-super-secret-refresh-key        # Obrigatório
JWT_EXPIRES_IN=15m                                       # Padrão: 15 minutos
JWT_REFRESH_EXPIRES_IN=7d                                # Padrão: 7 dias

# CORS
FRONTEND_URL=http://localhost:3000                       # URL do frontend

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000                              # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100                              # 100 requisições

# Upload
MAX_FILE_SIZE=5242880                                    # 5MB em bytes
UPLOAD_PATH=./uploads                                    # Pasta de uploads

# Email (opcional - para produção)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# Stripe (opcional - para pagamentos)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Frontend (apps/web/.env):**

```bash
# API URL
VITE_API_URL=http://localhost:3001/api   # URL da API backend
```

## 🔒 Segurança

- ✅ Helmet.js (security headers)
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min API, 5 req/min auth)
- ✅ JWT com refresh tokens
- ✅ Bcrypt para senhas (10 rounds)
- ✅ Validação Zod em todas as entradas
- ✅ SQL Injection protection (Prisma)
- ✅ XSS protection
- ✅ Upload de imagens validado (tipo, tamanho)

## 🐳 Docker

### Containers

- **postgres**: PostgreSQL 16 (porta 5432)
- **api**: Backend Node.js (porta 3001)
- **web**: Frontend Nginx (porta 8080)
- **nginx**: Reverse proxy (porta 80/443)

### Volumes

- `postgres_data`: Dados do PostgreSQL
- `uploads`: Arquivos uploaded
- `logs`: Logs da aplicação

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/fernandinhomartins40/fusehotel.git
cd fusehotel

# Instale dependências
npm install

# Configure .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Backend (em um terminal)
cd apps/api
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev

# Frontend (em outro terminal)
cd apps/web
npm run dev

# Acesse:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001/api
# - Health: http://localhost:3001/api/health
```

## 📂 Documentação Adicional

- [BACKEND_IMPLEMENTATION_PLAN.md](BACKEND_IMPLEMENTATION_PLAN.md) - Plano de implementação do backend
- [CONSOLIDATION_REPORT.md](CONSOLIDATION_REPORT.md) - Relatório de consolidação do projeto
- [FINAL_STATUS.md](FINAL_STATUS.md) - Status final e conclusão do projeto
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.

---

**FuseHotel** - Sistema de Gestão Hoteleira Completo 🏨
