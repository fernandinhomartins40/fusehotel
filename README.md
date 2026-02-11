# 🏨 FuseHotel - Sistema Completo de Gerenciamento Hoteleiro

Sistema de gerenciamento hoteleiro completo e moderno, construído como monorepo com arquitetura full-stack TypeScript. Inclui sistema de reservas, gerenciamento de acomodações, painel administrativo completo e sistema de customização visual sem código.

## 🌟 Visão Geral

FuseHotel é uma solução enterprise-ready para gestão hoteleira que oferece:

- ✅ **Sistema de Reservas Completo** - Do checkout até o check-out
- ✅ **Painel Administrativo Avançado** - Controle total sobre todas as funcionalidades
- ✅ **Editor Visual** - Customização completa sem tocar no código
- ✅ **Infraestrutura Production-Ready** - Docker, CI/CD, monitoramento
- ✅ **Stack Moderna** - TypeScript, React, Prisma, PostgreSQL
- ✅ **Segurança First** - JWT, RBAC, rate limiting
- ✅ **Arquitetura Escalável** - Monorepo, microservices-ready

**🌐 Produção**: [perolahotel.com](https://perolahotel.com)
**🖥️ Servidor**: 72.60.10.112

---

## 📋 Índice

- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades](#-funcionalidades-principais)
- [Início Rápido](#-início-rápido)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [Arquitetura](#-arquitetura)
- [API](#-api-endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Customização](#-sistema-de-customização)
- [Scripts](#-scripts-disponíveis)

---

## 📁 Estrutura do Projeto

```
fusehotel/
├── apps/                          # Aplicações
│   ├── api/                      # Backend REST API
│   │   ├── src/
│   │   │   ├── config/          # Configurações (DB, Multer, etc)
│   │   │   ├── controllers/     # Controllers (23 arquivos)
│   │   │   ├── middlewares/     # Middlewares (Auth, Validation, etc)
│   │   │   ├── routes/          # Rotas da API (19 arquivos)
│   │   │   ├── services/        # Business Logic (24 serviços)
│   │   │   ├── types/           # Definições TypeScript
│   │   │   ├── utils/           # Utilidades (Logger, Crypto, etc)
│   │   │   └── server.ts        # Entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Schema do banco (627 linhas)
│   │   │   ├── migrations/      # Migrações do Prisma
│   │   │   └── seeds/           # Seeds do banco (10 arquivos)
│   │   └── uploads/             # Arquivos enviados
│   │
│   └── web/                      # Frontend React SPA
│       ├── src/
│       │   ├── components/      # Componentes React
│       │   │   ├── admin/       # Componentes do Admin (50+ arquivos)
│       │   │   │   ├── about/   # Customizadores About (5 arquivos)
│       │   │   │   ├── contact/ # Customizadores Contact (4 arquivos)
│       │   │   │   ├── faq/     # Customizadores FAQ (3 arquivos)
│       │   │   │   ├── landing/ # Customizadores Landing (10 arquivos)
│       │   │   │   └── ...
│       │   │   ├── auth/        # Autenticação
│       │   │   ├── booking/     # Fluxo de reserva
│       │   │   ├── customer/    # Área do cliente
│       │   │   ├── layout/      # Layout (Header, Footer, etc)
│       │   │   ├── sections/    # Seções públicas (7 seções)
│       │   │   └── ui/          # Componentes UI (57 componentes)
│       │   ├── hooks/           # Custom Hooks (16 hooks)
│       │   ├── lib/             # Utilitários e API client
│       │   ├── pages/           # Páginas da aplicação
│       │   │   ├── admin/       # Páginas admin (13 páginas)
│       │   │   └── [public]     # Páginas públicas (13 páginas)
│       │   ├── types/           # Definições TypeScript (9 arquivos)
│       │   ├── utils/           # Funções auxiliares
│       │   └── App.tsx          # Router principal
│       └── public/              # Assets estáticos
│
├── packages/                     # Packages compartilhados
│   └── shared/                  # Types, validators, utils
│       ├── src/
│       │   ├── types/           # Tipos compartilhados
│       │   ├── validators/      # Validadores Zod
│       │   └── utils/           # Utilidades compartilhadas
│       └── package.json
│
├── infra/                        # Infraestrutura
│   ├── docker/                  # Dockerfiles
│   │   ├── Dockerfile.api.dev
│   │   ├── Dockerfile.api.vps
│   │   ├── Dockerfile.web.dev
│   │   └── Dockerfile.web.vps
│   └── nginx/                   # Configurações Nginx
│       ├── nginx.dev.conf
│       └── nginx.vps.conf
│
├── scripts/                      # Scripts de deploy
│   ├── pre-deploy-check.sh     # Validação pré-deploy
│   ├── auto-backup-uploads.sh  # Backup automático
│   ├── restore-backup.sh       # Restauração de backup
│   ├── health-check.sh         # Health check
│   └── setup-ssl.sh            # Configuração SSL
│
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── deploy-vps.yml      # CI/CD Pipeline
│
├── docker-compose.dev.yml       # Ambiente de desenvolvimento
├── docker-compose.vps.yml       # Deploy VPS produção
└── package.json                 # Configuração do monorepo
```

---

## 🛠 Stack Tecnológica

### Backend (API)
- **Runtime**: Node.js 20+ com TypeScript
- **Framework**: Express.js
- **ORM**: Prisma com PostgreSQL
- **Autenticação**: JWT com refresh tokens (httpOnly cookies)
- **Validação**: Zod schemas
- **Upload**: Multer + Sharp (processamento de imagens)
- **Segurança**: Helmet, CORS, Rate Limiting, bcryptjs
- **Logging**: Winston
- **Arquitetura**: MVC (Controllers, Services, Routes)

### Frontend (Web)
- **Framework**: React 18.3+ com TypeScript
- **Build**: Vite 5
- **Routing**: React Router v6
- **Estado**: TanStack React Query
- **UI**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Rich Text**: React Quill
- **Charts**: Recharts
- **HTTP**: Axios com interceptors
- **Notificações**: Sonner

### Shared Package
- Definições de tipos compartilhadas
- Validadores Zod
- Utilitários (formatação de datas, strings, números)
- Constantes da API

### Infraestrutura
- **Containers**: Docker com multi-stage builds
- **Proxy**: Nginx (configs dev e produção)
- **Database**: PostgreSQL 16 Alpine
- **CI/CD**: GitHub Actions
- **SSL**: Let's Encrypt (Certbot)
- **VPS**: 72.60.10.112
- **Domínio**: perolahotel.com

---

## 🚀 Funcionalidades Principais

### 1. Gerenciamento de Acomodações
- Múltiplos tipos (quartos, suítes, chalés, vilas, apartamentos)
- Galeria de imagens por acomodação
- Sistema de comodidades (amenities)
- Gestão de disponibilidade em tempo real
- Precificação com camas extras

### 2. Sistema de Reservas
- Ciclo completo (pendente → confirmado → checked-in → checked-out)
- Coleta de informações dos hóspedes
- Integração WhatsApp para notificações
- Rastreamento de pagamentos
- Sistema de cancelamento
- Geração de código de reserva

### 3. Gestão de Clientes
- Perfis de usuários (ADMIN, MANAGER, CUSTOMER)
- Histórico completo de reservas
- Sistema de avaliações (com aprovação admin)
- Contas provisórias (reservas WhatsApp)
- Workflow de verificação de e-mail

### 4. Painel Administrativo
- Dashboard com estatísticas e gráficos
- Painel de ações rápidas
- Tabela de reservas recentes
- Visualização em calendário
- Interface de gestão de clientes

### 5. Sistema de Customização Visual
- **Landing Page Completa**
  - Editor de cabeçalho e menu
  - Carrossel de hero com slides personalizados
  - Seção de destaques
  - Galeria de fotos
  - Logotipos de parceiros
  - Newsletter

- **Página Sobre**
  - História do hotel
  - Missão, Visão e Valores
  - Perfis da equipe
  - Prêmios e conquistas

- **Página de Contato**
  - Configuração de formulário
  - Cards de informações
  - FAQ e CTAs

- **FAQ**
  - Categorias personalizáveis
  - Gestão de perguntas e respostas

### 6. Promoções e Marketing
- Sistema de pacotes promocionais
- Gestão de descontos
- Promoções em destaque
- Assinatura de newsletter
- Códigos promocionais

### 7. Gestão de Conteúdo
- Editor WYSIWYG para todas as seções
- Gerenciador de imagens com crop
- Seletor de cores com gradientes
- Editor de texto rico
- Drag & Drop para reordenação
- Preview em tempo real

### 8. Segurança
- Autenticação JWT com refresh tokens
- Controle de acesso baseado em roles
- Rate limiting (geral e auth)
- Validação de input em todos os endpoints
- Hashing seguro de senhas
- Proteção CORS
- Headers de segurança (Helmet)
- Proteção contra SQL injection (Prisma)
- Proteção XSS

---

## 🏁 Início Rápido

### Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose
- PostgreSQL 16 (ou usar via Docker)
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone <repository-url>
cd fusehotel

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie os arquivos .env.example e configure

# API (.env)
cp apps/api/.env.example apps/api/.env

# Web (.env)
cp apps/web/.env.example apps/web/.env

# 4. Inicie o ambiente de desenvolvimento com Docker
docker-compose -f docker-compose.dev.yml up -d

# 5. Execute as migrações do banco
cd apps/api
npm run prisma:migrate

# 6. (Opcional) Popule o banco com dados de exemplo
npm run prisma:seed

# 7. Acesse a aplicação
# Frontend: http://localhost:3090
# API: http://localhost:3090/api
# Postgres: localhost:5432
```

### Desenvolvimento Sem Docker

```bash
# 1. Inicie o PostgreSQL localmente

# 2. Backend
cd apps/api
npm run dev          # Porta 3001

# 3. Frontend (em outro terminal)
cd apps/web
npm run dev          # Porta 3000
```

---

## 💻 Desenvolvimento

### Scripts do Monorepo

```bash
# Desenvolvimento
npm run dev              # Inicia todos os workspaces
npm run dev:web         # Inicia apenas frontend
npm run dev:api         # Inicia apenas backend

# Build
npm run build           # Build de todos os workspaces
npm run build:web       # Build apenas frontend
npm run build:api       # Build apenas backend

# Qualidade
npm run lint            # Lint de todos os workspaces
npm run typecheck       # Type check de todos os workspaces
npm run test            # Testes de todos os workspaces

# Limpeza
npm run clean           # Remove builds e node_modules
```

### Scripts da API

```bash
cd apps/api

npm run dev                # Desenvolvimento com hot-reload
npm run build              # Build TypeScript
npm run start              # Produção
npm run prisma:generate    # Gera Prisma Client
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre Prisma Studio
npm run prisma:seed        # Popula banco com seeds
```

### Scripts do Frontend

```bash
cd apps/web

npm run dev                # Vite dev server
npm run build              # Build de produção
npm run build:dev          # Build de desenvolvimento
npm run preview            # Preview do build
npm run lint               # ESLint check
```

### Estrutura de Desenvolvimento

```bash
# Adicionar nova dependência no workspace específico
npm install <package> -w @fusehotel/api
npm install <package> -w @fusehotel/web
npm install <package> -w @fusehotel/shared

# Adicionar dependência de desenvolvimento global
npm install -D <package>

# Limpar e reinstalar tudo
npm run clean
npm install
```

---

## 🚢 Deploy

### Deploy Automático (CI/CD)

O projeto possui pipeline de CI/CD configurado com GitHub Actions:

```bash
# Deploy automático ao fazer push na branch main
git push origin main

# Ou deploy manual via GitHub Actions
# GitHub → Actions → Deploy to VPS → Run workflow
```

### Pipeline de Deploy

1. ✅ Checkout do código
2. ✅ Setup SSH para o servidor VPS
3. ✅ Sync do código via rsync
4. ✅ Validação pré-deploy
5. ✅ Backup automático
6. ✅ Parada dos containers (preserva volumes)
7. ✅ Build das imagens Docker
8. ✅ Inicialização dos containers
9. ✅ Migrações do Prisma
10. ✅ Seeds (se configurado)
11. ✅ Configuração do Nginx
12. ✅ Health check
13. ✅ Confirmação de deploy

### Deploy Manual

```bash
# 1. Conecte ao servidor VPS
ssh user@72.60.10.112

# 2. Navegue até o projeto
cd /path/to/fusehotel

# 3. Execute o script de pré-deploy
./scripts/pre-deploy-check.sh

# 4. Faça backup
./scripts/auto-backup-uploads.sh

# 5. Build e start
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml build --no-cache
docker-compose -f docker-compose.vps.yml up -d

# 6. Execute migrações
docker-compose -f docker-compose.vps.yml exec api npm run prisma:migrate

# 7. Health check
./scripts/health-check.sh
```

### Configuração SSL

```bash
# No servidor VPS
./scripts/setup-ssl.sh
```

---

## 🏗 Arquitetura

### Arquitetura do Backend (MVC)

```
Request → Router → Middleware → Controller → Service → Prisma → Database
                                                  ↓
                                              Response
```

**Fluxo de Dados**:
1. **Router**: Define endpoints e métodos HTTP
2. **Middleware**: Autenticação, validação, rate limiting
3. **Controller**: Processa requisição, valida dados
4. **Service**: Business logic, operações no banco
5. **Prisma**: ORM, queries type-safe
6. **Database**: PostgreSQL

### Arquitetura do Frontend

```
User → Route → Page → Component → Hook → API Client → Backend
                ↓
              State (React Query)
```

**Camadas**:
1. **Routing**: React Router v6 com proteção de rotas
2. **Pages**: Componentes de página (13 públicas + 13 admin)
3. **Components**: Componentes reutilizáveis
4. **Hooks**: Custom hooks para lógica de negócio
5. **API Client**: Axios com interceptors
6. **State**: TanStack React Query para cache e sincronização

### Banco de Dados

**27 Tabelas** organizadas em módulos:

1. **Autenticação**: User, RefreshToken, PasswordReset
2. **Acomodações**: Accommodation, AccommodationImage, Amenity
3. **Reservas**: Reservation, Payment, Review
4. **Promoções**: Promotion, PromotionFeature
5. **Conteúdo**: Settings, HotelSettings, LandingPageSettings
6. **Marketing**: HeroSlide, HighlightItem, GalleryImage, Partner
7. **Serviços**: ServiceItem, TeamMember, Award
8. **FAQ**: FAQCategory, FAQItem
9. **Contato**: ContactMessage, NewsletterSubscription
10. **Sistema**: UploadedFile, AuditLog

---

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/register      # Registro de usuário
POST   /api/auth/login         # Login
POST   /api/auth/refresh       # Refresh token
POST   /api/auth/logout        # Logout
POST   /api/auth/forgot        # Esqueci a senha
POST   /api/auth/reset         # Resetar senha
```

### Acomodações
```
GET    /api/accommodations                # Listar acomodações
GET    /api/accommodations/:id            # Detalhes da acomodação
POST   /api/accommodations                # Criar (ADMIN)
PUT    /api/accommodations/:id            # Atualizar (ADMIN)
DELETE /api/accommodations/:id            # Deletar (ADMIN)
GET    /api/accommodations/:id/available  # Verificar disponibilidade
```

### Reservas
```
GET    /api/reservations           # Listar reservas
GET    /api/reservations/:id       # Detalhes da reserva
POST   /api/reservations           # Criar reserva
PUT    /api/reservations/:id       # Atualizar reserva
DELETE /api/reservations/:id       # Cancelar reserva
PATCH  /api/reservations/:id/status # Atualizar status (ADMIN)
```

### Usuários
```
GET    /api/users              # Listar usuários (ADMIN)
GET    /api/users/:id          # Detalhes do usuário
PUT    /api/users/:id          # Atualizar usuário
DELETE /api/users/:id          # Deletar usuário (ADMIN)
GET    /api/users/me           # Perfil do usuário logado
```

### Promoções
```
GET    /api/promotions         # Listar promoções
GET    /api/promotions/:id     # Detalhes da promoção
POST   /api/promotions         # Criar (ADMIN)
PUT    /api/promotions/:id     # Atualizar (ADMIN)
DELETE /api/promotions/:id     # Deletar (ADMIN)
```

### Customização (Landing Page)
```
GET    /api/landing            # Obter configurações
PUT    /api/landing            # Atualizar configurações (ADMIN)
POST   /api/landing/hero       # Adicionar slide hero (ADMIN)
PUT    /api/landing/hero/:id   # Atualizar slide hero (ADMIN)
DELETE /api/landing/hero/:id   # Deletar slide hero (ADMIN)
# ... e muitos outros endpoints de customização
```

### Outros Endpoints
```
POST   /api/upload             # Upload de arquivos (ADMIN)
POST   /api/contact            # Enviar mensagem de contato
POST   /api/newsletter         # Assinar newsletter
GET    /api/settings           # Obter configurações gerais
PUT    /api/settings           # Atualizar configurações (ADMIN)
GET    /api/schedule           # Obter calendário de reservas
# ... mais 30+ endpoints
```

---

## 🗄 Banco de Dados

### Schema Prisma (Resumo)

```prisma
// Usuários e Autenticação
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(CUSTOMER)
  // ... relacionamentos
}

// Acomodações
model Accommodation {
  id              String    @id @default(uuid())
  name            String
  type            AccommodationType
  description     String
  pricePerNight   Decimal
  maxGuests       Int
  images          AccommodationImage[]
  amenities       AccommodationAmenity[]
  // ... mais campos
}

// Reservas
model Reservation {
  id              String    @id @default(uuid())
  code            String    @unique
  status          ReservationStatus
  checkIn         DateTime
  checkOut        DateTime
  totalPrice      Decimal
  accommodation   Accommodation @relation(...)
  customer        User @relation(...)
  // ... mais campos
}

// Promoções
model Promotion {
  id              String    @id @default(uuid())
  title           String
  description     String
  price           Decimal
  discount        Decimal?
  validFrom       DateTime
  validUntil      DateTime
  // ... mais campos
}

// Customização da Landing Page
model LandingPageSettings {
  id              String    @id @default(uuid())
  // Hero Section
  heroTitle       String?
  heroSubtitle    String?
  // ... 50+ campos de customização
}

// ... e mais 22 modelos
```

### Migrações

```bash
# Criar nova migração
npm run prisma:migrate -- --name nome_da_migracao

# Aplicar migrações
npm run prisma:migrate

# Resetar banco (CUIDADO!)
npm run prisma:migrate -- reset

# Status das migrações
npm run prisma:migrate -- status
```

### Seeds

O projeto inclui 10 arquivos de seed:

1. **users.seed.ts** - Usuários admin, manager e clientes
2. **amenities.seed.ts** - 10 tipos de comodidades
3. **accommodations.seed.ts** - Acomodações de exemplo
4. **promotions.seed.ts** - Pacotes promocionais
5. **settings.seed.ts** - Configurações gerais do site
6. **hotel-settings.seed.ts** - Informações de contato
7. **landing-page.seed.ts** - Hero, highlights, gallery
8. **services.seed.ts** - Serviços categorizados
9. **about-page.seed.ts** - Equipe e prêmios
10. **faq-contact.seed.ts** - FAQ e configurações de contato

```bash
# Executar todos os seeds
npm run prisma:seed

# Ou executar seed específico
npx tsx prisma/seeds/users.seed.ts
```

---

## 🎨 Sistema de Customização

### Landing Page Customizers (10 Componentes)

1. **HeaderCustomizer** - Logo, navegação, cores
2. **HeroCustomizer** - Hero com carrossel de slides
3. **HighlightsCustomizer** - Destaques do hotel
4. **AccommodationsCustomizer** - Showcase de acomodações
5. **PromotionsCustomizer** - Seção de promoções
6. **GalleryCustomizer** - Galeria de fotos
7. **PartnersCustomizer** - Logos de parceiros
8. **NewsletterCustomizer** - Seção de newsletter
9. **ServicesCustomizer** - Overview de serviços
10. **FooterCustomizer** - Conteúdo e links do rodapé

### About Page Customizers (5 Componentes)

1. **AboutHeroCustomizer** - Hero da página sobre
2. **HistoryCustomizer** - História do hotel
3. **MissionVisionValuesCustomizer** - MVV editor
4. **TeamCustomizer** - Perfis da equipe
5. **AwardsCustomizer** - Conquistas e prêmios

### Contact Page Customizers (4 Componentes)

1. **ContactHeroCustomizer** - Hero de contato
2. **ContactFormCustomizer** - Campos do formulário
3. **ContactCardsCustomizer** - Cards de informações
4. **ContactFAQCTACustomizer** - FAQ e CTAs

### FAQ Customizers (3 Componentes)

1. **FAQHeroCustomizer** - Hero do FAQ
2. **FAQContentCustomizer** - Categorias e itens
3. **FAQContactCustomizer** - CTA de contato no FAQ

### Funcionalidades do Editor

- ✅ Editor WYSIWYG para todas as seções
- ✅ Gerenciamento de imagens com crop
- ✅ Seletor de cores com gradientes
- ✅ Editor de texto rico (React Quill)
- ✅ Drag & Drop para reordenação
- ✅ Preview em tempo real
- ✅ Design responsivo (mobile-first)
- ✅ Upload otimizado de imagens
- ✅ Sistema de categorias
- ✅ Controle de visibilidade de seções

---

## 📊 Estatísticas do Projeto

- **Linhas de Código**: ~60,000+
- **Endpoints da API**: 50+
- **Tabelas do Banco**: 27
- **Schema Prisma**: 627 linhas
- **Componentes React**: 100+
- **Custom Hooks**: 16
- **Componentes UI**: 57
- **Customizadores Admin**: 20+
- **Arquivos de Tipo**: 9
- **Seeds**: 10
- **Serviços da API**: 24
- **Controllers**: 23
- **Rotas**: 19

---

## 🔐 Segurança

### Implementações de Segurança

- ✅ JWT com refresh tokens em httpOnly cookies
- ✅ Controle de acesso baseado em roles (RBAC)
- ✅ Rate limiting (geral e específico para auth)
- ✅ Validação de entrada com Zod em todos os endpoints
- ✅ Hashing seguro de senhas com bcryptjs (salt rounds: 10)
- ✅ Proteção CORS configurável
- ✅ Headers de segurança com Helmet
- ✅ Proteção contra SQL injection (Prisma ORM)
- ✅ Proteção XSS
- ✅ Logs de auditoria para ações críticas
- ✅ Sistema de recuperação de senha seguro
- ✅ Verificação de e-mail

### Variáveis de Ambiente Sensíveis

```bash
# API (.env)
DATABASE_URL=              # String de conexão PostgreSQL
JWT_SECRET=                # Secret para JWT (256+ bits)
JWT_REFRESH_SECRET=        # Secret para refresh token
SMTP_HOST=                 # Servidor SMTP
SMTP_USER=                 # Usuário SMTP
SMTP_PASS=                 # Senha SMTP
STRIPE_SECRET_KEY=         # Chave secreta Stripe

# NUNCA commite esses arquivos!
```

---

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar testes de um workspace específico
npm run test -w @fusehotel/api
npm run test -w @fusehotel/web

# Executar com coverage
npm run test -- --coverage
```

---

## 📝 Logs

### Desenvolvimento
```bash
# Logs do Docker
docker-compose -f docker-compose.dev.yml logs -f

# Logs da API
docker-compose -f docker-compose.dev.yml logs -f api

# Logs do Frontend
docker-compose -f docker-compose.dev.yml logs -f web
```

### Produção
```bash
# Logs salvos em volumes persistentes
docker-compose -f docker-compose.vps.yml logs -f

# Logs no servidor
/var/log/fusehotel/api/
/var/log/fusehotel/nginx/
```

---

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de conexão com o banco**
```bash
# Verifique se o PostgreSQL está rodando
docker-compose -f docker-compose.dev.yml ps

# Recrie o banco
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

**Erro de migração do Prisma**
```bash
# Resete as migrações (CUIDADO: perde dados!)
cd apps/api
npm run prisma:migrate -- reset

# Ou crie uma nova migração
npm run prisma:migrate -- --name fix_migration
```

**Erro de build do frontend**
```bash
# Limpe o cache e rebuilde
cd apps/web
rm -rf node_modules dist .vite
npm install
npm run build
```

**Porta já em uso**
```bash
# Encontre e mate o processo
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🤝 Contribuindo

```bash
# 1. Fork o projeto
# 2. Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# 3. Commit suas mudanças
git commit -m "feat: adiciona nova funcionalidade"

# 4. Push para a branch
git push origin feature/nova-funcionalidade

# 5. Abra um Pull Request
```

### Convenção de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: mudanças na documentação
style: formatação, sem mudança de código
refactor: refatoração de código
test: adição ou correção de testes
chore: mudanças em build, configs, etc
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- **Email**: suporte@fusehotel.com
- **Website**: [perolahotel.com](https://perolahotel.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/fusehotel/issues)

---

## 🎯 Roadmap

### Pronto para Implementação

- 🔄 Integração de email (SMTP configurado)
- 🔄 Gateway de pagamento (Stripe configurado)
- 🔄 Suporte multi-idioma (infraestrutura pronta)
- 🔄 Analytics avançado e relatórios
- 🔄 App mobile (API pronta)
- 🔄 Notificações em tempo real (infraestrutura pronta)

### Futuro

- 📱 Progressive Web App (PWA)
- 🤖 Chatbot de atendimento
- 📊 Dashboard de analytics avançado
- 🔔 Sistema de notificações push
- 📧 Automação de email marketing
- 🌍 SEO avançado e sitemap automático

---

**Desenvolvido com ❤️ pela equipe FuseHotel**

🏨 [perolahotel.com](https://perolahotel.com) | 🖥️ VPS: 72.60.10.112
