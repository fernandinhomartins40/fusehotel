# 🏨 FuseHotel - Sistema de Gestão Hoteleira

Sistema completo de gestão hoteleira com arquitetura monorepo, desenvolvido com as melhores práticas e tecnologias modernas.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Build e Deploy](#build-e-deploy)
- [API Endpoints](#api-endpoints)
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
- ✅ Newsletter e contato
- ✅ Upload de imagens
- ✅ SEO otimizado

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
│          http://localhost:8080 (dev)                │
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

## 📦 Instalação

### Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Docker e Docker Compose (opcional, para rodar com containers)

### Instalação Local (Desenvolvimento)

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

### Instalação com Docker (Produção)

```bash
# 1. Clone o repositório
git clone https://github.com/fernandinhomartins40/fusehotel.git
cd fusehotel

# 2. Configure as variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env com suas configurações de produção

# 3. Build e inicie os containers
cd infra/docker
docker-compose up -d

# 4. Execute as migrations
docker-compose exec api npx prisma migrate deploy

# 5. Execute os seeds
docker-compose exec api npm run prisma:seed

# Acesse:
# - Frontend: http://localhost
# - Backend API: http://localhost/api
# - Health Check: http://localhost/api/health
```

## 🛠️ Desenvolvimento

### Rodar todos os projetos

```bash
npm run dev
```

### Rodar apenas o frontend

```bash
npm run dev:web
# Acesse: http://localhost:8080
```

### Rodar apenas o backend

```bash
npm run dev:api
# Acesse: http://localhost:3001/api
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

### Seeds Iniciais

Ao executar `npm run prisma:seed` no backend, os seguintes dados são criados:

**Usuário Admin:**
- Email: `admin@fusehotel.com`
- Senha: `Admin@123`
- Role: ADMIN

**Amenidades:**
- Wi-Fi, Ar Condicionado, TV, Frigobar, Cofre, Secador, Roupa de Cama, Toalhas, Chuveiro, Estacionamento

**Configurações:**
- Nome do site, Descrição, Email de contato, Telefone

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
# - Frontend: http://localhost:8080
# - Backend: http://localhost:3001/api
# - Health: http://localhost:3001/api/health
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.

---

**FuseHotel** - Sistema de Gestão Hoteleira Completo 🏨
