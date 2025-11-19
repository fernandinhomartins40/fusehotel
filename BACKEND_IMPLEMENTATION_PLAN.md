# PLANO DETALHADO DE IMPLEMENTAÇÃO DO BACKEND
## FUSE HOTEL - Sistema Completo com Docker + Nginx + Node.js + TypeScript + Prisma + PostgreSQL

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Estrutura de Diretórios Completa](#estrutura-de-diretórios-completa)
5. [Schema do Banco de Dados](#schema-do-banco-de-dados)
6. [Tipos TypeScript](#tipos-typescript)
7. [Configuração Docker e Nginx](#configuração-docker-e-nginx)
8. [APIs e Rotas](#apis-e-rotas)
9. [Validações e Regras de Negócio](#validações-e-regras-de-negócio)
10. [Segurança e Autenticação](#segurança-e-autenticação)
11. [Upload de Arquivos](#upload-de-arquivos)
12. [Variáveis de Ambiente](#variáveis-de-ambiente)
13. [Fases de Implementação](#fases-de-implementação)

---

## 1. VISÃO GERAL

### Objetivo
Implementar um backend robusto, escalável e profissional para o sistema Fuse Hotel, utilizando containerização com Docker, proxy reverso com Nginx, e uma arquitetura RESTful completa.

### Características Principais
- **Isolamento**: Backend completamente isolado do frontend
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Segurança**: JWT, bcrypt, validações em camadas
- **Tipo Seguro**: 100% TypeScript sem uso de `any`
- **Consistência**: Nomenclatura padronizada em toda aplicação
- **Profissional**: Seguindo melhores práticas do mercado

---

## 2. ARQUITETURA DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Reverse Proxy)                         │
│  - Porta 80/443                                                  │
│  - SSL/TLS Termination                                           │
│  - Roteamento:                                                   │
│    • /api/* → Backend Container (3001)                           │
│    • /* → Frontend Container (8080)                              │
│  - Load Balancing                                                │
│  - Gzip Compression                                              │
│  - Cache de Assets Estáticos                                     │
└────────────────┬──────────────────────────┬─────────────────────┘
                 │                          │
    ┌────────────▼──────────┐   ┌──────────▼────────────┐
    │  FRONTEND CONTAINER   │   │  BACKEND CONTAINER    │
    │  (React + Vite)       │   │  (Node.js + Express)  │
    │  Porta: 8080          │   │  Porta: 3001          │
    └───────────────────────┘   └──────────┬────────────┘
                                           │
                                ┌──────────▼────────────┐
                                │ POSTGRESQL CONTAINER  │
                                │ Porta: 5432           │
                                │ Volume: pgdata        │
                                └───────────────────────┘
```

### Fluxo de Requisições

1. **Cliente → Nginx**: Requisição HTTP/HTTPS
2. **Nginx**: Analisa URL e roteia
   - `/api/*` → Backend
   - `/*` → Frontend
3. **Backend**: Processa requisição
   - Valida dados (Zod)
   - Autentica/Autoriza (JWT)
   - Executa lógica de negócio (Services)
   - Acessa banco de dados (Prisma)
4. **PostgreSQL**: Retorna dados
5. **Backend → Nginx**: Resposta JSON
6. **Nginx → Cliente**: Resposta final

---

## 3. STACK TECNOLÓGICA

### Infraestrutura
- **Docker**: 24.0+
- **Docker Compose**: 2.0+
- **Nginx**: 1.25+ (alpine)
- **PostgreSQL**: 16+ (alpine)

### Backend
- **Node.js**: 20 LTS (alpine)
- **TypeScript**: 5.3+
- **Express.js**: 4.18+
- **Prisma ORM**: 5.8+

### Bibliotecas Principais
- **Autenticação**: jsonwebtoken, bcryptjs
- **Validação**: zod
- **Upload**: multer, sharp
- **Segurança**: helmet, cors, express-rate-limit
- **Utilitários**: date-fns, uuid

### Desenvolvimento
- **TypeScript**: Tipagem estrita
- **ESLint**: Linting
- **Prettier**: Formatação
- **ts-node-dev**: Hot reload

---

## 4. ESTRUTURA DE DIRETÓRIOS COMPLETA

```
fusehotel/
│
├── backend/                          # Diretório do Backend
│   ├── src/
│   │   ├── config/                   # Configurações
│   │   │   ├── database.ts           # Config Prisma
│   │   │   ├── environment.ts        # Variáveis de ambiente
│   │   │   ├── multer.ts             # Config upload
│   │   │   └── swagger.ts            # Documentação API
│   │   │
│   │   ├── controllers/              # Controllers (Camada de Apresentação)
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── accommodation.controller.ts
│   │   │   ├── reservation.controller.ts
│   │   │   ├── promotion.controller.ts
│   │   │   ├── package.controller.ts
│   │   │   ├── settings.controller.ts
│   │   │   ├── upload.controller.ts
│   │   │   ├── newsletter.controller.ts
│   │   │   └── contact.controller.ts
│   │   │
│   │   ├── services/                 # Services (Lógica de Negócio)
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── accommodation.service.ts
│   │   │   ├── reservation.service.ts
│   │   │   ├── promotion.service.ts
│   │   │   ├── package.service.ts
│   │   │   ├── settings.service.ts
│   │   │   ├── upload.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── payment.service.ts
│   │   │   └── analytics.service.ts
│   │   │
│   │   ├── middlewares/              # Middlewares
│   │   │   ├── auth.middleware.ts    # Verificação JWT
│   │   │   ├── role.middleware.ts    # Verificação de roles
│   │   │   ├── validate.middleware.ts # Validação Zod
│   │   │   ├── error.middleware.ts   # Tratamento de erros
│   │   │   ├── upload.middleware.ts  # Validação uploads
│   │   │   └── rateLimiter.middleware.ts
│   │   │
│   │   ├── routes/                   # Rotas
│   │   │   ├── index.ts              # Agregador de rotas
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── accommodation.routes.ts
│   │   │   ├── reservation.routes.ts
│   │   │   ├── promotion.routes.ts
│   │   │   ├── package.routes.ts
│   │   │   ├── settings.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   ├── newsletter.routes.ts
│   │   │   └── contact.routes.ts
│   │   │
│   │   ├── types/                    # Tipos TypeScript
│   │   │   ├── index.ts              # Re-exports
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── accommodation.types.ts
│   │   │   ├── reservation.types.ts
│   │   │   ├── promotion.types.ts
│   │   │   ├── package.types.ts
│   │   │   ├── settings.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── express.d.ts          # Extensão de tipos Express
│   │   │
│   │   ├── validators/               # Schemas de Validação Zod
│   │   │   ├── auth.validator.ts
│   │   │   ├── user.validator.ts
│   │   │   ├── accommodation.validator.ts
│   │   │   ├── reservation.validator.ts
│   │   │   ├── promotion.validator.ts
│   │   │   ├── package.validator.ts
│   │   │   ├── settings.validator.ts
│   │   │   ├── common.validator.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                    # Utilitários
│   │   │   ├── logger.ts             # Winston logger
│   │   │   ├── errors.ts             # Classes de erro customizadas
│   │   │   ├── response.ts           # Padronização de respostas
│   │   │   ├── crypto.ts             # Funções de criptografia
│   │   │   ├── slug.ts               # Geração de slugs
│   │   │   ├── date.ts               # Manipulação de datas
│   │   │   └── constants.ts          # Constantes da aplicação
│   │   │
│   │   ├── prisma/                   # Prisma ORM
│   │   │   ├── schema.prisma         # Schema do banco
│   │   │   ├── migrations/           # Migrações
│   │   │   └── seeds/                # Seeds
│   │   │       ├── index.ts
│   │   │       ├── users.seed.ts
│   │   │       ├── accommodations.seed.ts
│   │   │       └── promotions.seed.ts
│   │   │
│   │   ├── app.ts                    # Configuração Express
│   │   └── server.ts                 # Entry point
│   │
│   ├── uploads/                      # Arquivos uploadados
│   │   ├── accommodations/
│   │   ├── promotions/
│   │   ├── settings/
│   │   └── temp/
│   │
│   ├── .env.example                  # Exemplo de variáveis
│   ├── .env                          # Variáveis de ambiente
│   ├── .gitignore
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile                    # Dockerfile do backend
│   └── README.md
│
├── nginx/                            # Configuração Nginx
│   ├── nginx.conf                    # Config principal
│   └── Dockerfile                    # Dockerfile do Nginx
│
├── docker-compose.yml                # Orquestração containers
├── .dockerignore
└── README.md                         # Documentação geral
```

---

## 5. SCHEMA DO BANCO DE DADOS

### Tabelas Completas

#### 1. User (Usuários do Sistema)
```prisma
model User {
  id                String         @id @default(uuid())
  email             String         @unique
  password          String
  name              String
  phone             String?
  cpf               String?        @unique
  role              UserRole       @default(CUSTOMER)
  isActive          Boolean        @default(true)
  emailVerified     Boolean        @default(false)
  emailVerifiedAt   DateTime?
  profileImage      String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  // Relações
  reservations      Reservation[]
  refreshTokens     RefreshToken[]
  passwordResets    PasswordReset[]
  newsletterSubs    NewsletterSubscription[]

  @@map("users")
}

enum UserRole {
  ADMIN
  MANAGER
  CUSTOMER
}
```

#### 2. RefreshToken (Tokens de Refresh)
```prisma
model RefreshToken {
  id          String   @id @default(uuid())
  token       String   @unique
  userId      String
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

#### 3. PasswordReset (Reset de Senha)
```prisma
model PasswordReset {
  id          String   @id @default(uuid())
  userId      String
  token       String   @unique
  expiresAt   DateTime
  used        Boolean  @default(false)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("password_resets")
}
```

#### 4. Accommodation (Acomodações)
```prisma
model Accommodation {
  id                  String                    @id @default(uuid())
  name                String
  slug                String                    @unique
  type                AccommodationType
  capacity            Int
  pricePerNight       Decimal                   @db.Decimal(10, 2)
  description         String                    @db.Text
  shortDescription    String?                   @db.VarChar(200)
  isAvailable         Boolean                   @default(true)
  isFeatured          Boolean                   @default(false)

  // Localização e Detalhes
  floor               String?
  view                String?
  area                Decimal?                  @db.Decimal(10, 2)

  // Horários
  checkInTime         String                    @default("14:00")
  checkOutTime        String                    @default("12:00")

  // Camas Extras
  extraBeds           Int                       @default(0)
  maxExtraBeds        Int                       @default(0)
  extraBedPrice       Decimal                   @default(0) @db.Decimal(10, 2)

  // Políticas
  cancellationPolicy  String?                   @db.Text

  // SEO
  metaTitle           String?                   @db.VarChar(60)
  metaDescription     String?                   @db.VarChar(160)
  keywords            String[]

  // Timestamps
  createdAt           DateTime                  @default(now())
  updatedAt           DateTime                  @updatedAt

  // Relações
  images              AccommodationImage[]
  amenities           AccommodationAmenity[]
  reservations        Reservation[]
  reviews             Review[]

  @@map("accommodations")
}

enum AccommodationType {
  ROOM
  SUITE
  CHALET
  VILLA
}
```

#### 5. AccommodationImage (Imagens das Acomodações)
```prisma
model AccommodationImage {
  id              String        @id @default(uuid())
  accommodationId String
  url             String
  alt             String?
  order           Int           @default(0)
  isPrimary       Boolean       @default(false)
  createdAt       DateTime      @default(now())

  accommodation   Accommodation @relation(fields: [accommodationId], references: [id], onDelete: Cascade)

  @@map("accommodation_images")
}
```

#### 6. Amenity (Comodidades Disponíveis)
```prisma
model Amenity {
  id          String                    @id @default(uuid())
  name        String                    @unique
  icon        String?
  category    AmenityCategory
  description String?
  createdAt   DateTime                  @default(now())

  accommodations AccommodationAmenity[]

  @@map("amenities")
}

enum AmenityCategory {
  BEDROOM
  BATHROOM
  ENTERTAINMENT
  KITCHEN
  OUTDOOR
  GENERAL
}
```

#### 7. AccommodationAmenity (Relação N:N)
```prisma
model AccommodationAmenity {
  accommodationId String
  amenityId       String

  accommodation   Accommodation @relation(fields: [accommodationId], references: [id], onDelete: Cascade)
  amenity         Amenity       @relation(fields: [amenityId], references: [id], onDelete: Cascade)

  @@id([accommodationId, amenityId])
  @@map("accommodation_amenities")
}
```

#### 8. Reservation (Reservas)
```prisma
model Reservation {
  id              String            @id @default(uuid())
  reservationCode String            @unique
  accommodationId String
  userId          String

  // Datas
  checkInDate     DateTime
  checkOutDate    DateTime
  numberOfNights  Int

  // Hóspedes
  numberOfGuests  Int
  guestName       String
  guestEmail      String
  guestPhone      String
  guestCpf        String?

  // Valores
  pricePerNight   Decimal           @db.Decimal(10, 2)
  subtotal        Decimal           @db.Decimal(10, 2)
  extraBedsCost   Decimal           @default(0) @db.Decimal(10, 2)
  serviceFee      Decimal           @default(0) @db.Decimal(10, 2)
  taxes           Decimal           @default(0) @db.Decimal(10, 2)
  discount        Decimal           @default(0) @db.Decimal(10, 2)
  totalAmount     Decimal           @db.Decimal(10, 2)

  // Status
  status          ReservationStatus @default(PENDING)
  paymentStatus   PaymentStatus     @default(PENDING)
  paymentMethod   PaymentMethod?

  // Extras
  numberOfExtraBeds Int             @default(0)
  specialRequests   String?         @db.Text

  // Cancelamento
  cancelledAt     DateTime?
  cancellationReason String?        @db.Text

  // Timestamps
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relações
  accommodation   Accommodation     @relation(fields: [accommodationId], references: [id])
  user            User              @relation(fields: [userId], references: [id])
  payments        Payment[]
  review          Review?

  @@map("reservations")
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  PROCESSING
  PAID
  PARTIALLY_PAID
  REFUNDED
  FAILED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PIX
  BANK_TRANSFER
  CASH
  WHATSAPP
}
```

#### 9. Payment (Pagamentos)
```prisma
model Payment {
  id              String        @id @default(uuid())
  reservationId   String
  amount          Decimal       @db.Decimal(10, 2)
  method          PaymentMethod
  status          PaymentStatus
  transactionId   String?       @unique
  gateway         String?
  gatewayResponse Json?
  paidAt          DateTime?
  refundedAt      DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  reservation     Reservation   @relation(fields: [reservationId], references: [id])

  @@map("payments")
}
```

#### 10. Review (Avaliações)
```prisma
model Review {
  id              String        @id @default(uuid())
  reservationId   String        @unique
  accommodationId String
  userId          String
  rating          Int
  title           String?
  comment         String?       @db.Text
  isApproved      Boolean       @default(false)
  approvedAt      DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  reservation     Reservation   @relation(fields: [reservationId], references: [id])
  accommodation   Accommodation @relation(fields: [accommodationId], references: [id])

  @@map("reviews")
}
```

#### 11. Promotion (Promoções)
```prisma
model Promotion {
  id                String    @id @default(uuid())
  title             String
  slug              String    @unique
  shortDescription  String    @db.VarChar(200)
  longDescription   String    @db.Text
  image             String
  startDate         DateTime
  endDate           DateTime
  originalPrice     Decimal   @db.Decimal(10, 2)
  discountedPrice   Decimal   @db.Decimal(10, 2)
  discountPercent   Int
  type              PromotionType
  isActive          Boolean   @default(true)
  isFeatured        Boolean   @default(false)
  termsAndConditions String?  @db.Text
  maxRedemptions    Int?
  currentRedemptions Int      @default(0)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  features          PromotionFeature[]

  @@map("promotions")
}

enum PromotionType {
  PACKAGE
  DISCOUNT
  SEASONAL
  SPECIAL_OFFER
}
```

#### 12. PromotionFeature (Itens da Promoção)
```prisma
model PromotionFeature {
  id          String    @id @default(uuid())
  promotionId String
  feature     String
  order       Int       @default(0)

  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)

  @@map("promotion_features")
}
```

#### 13. Settings (Configurações do Sistema)
```prisma
model Settings {
  id          String   @id @default(uuid())
  key         String   @unique
  value       Json
  category    SettingsCategory
  description String?
  updatedAt   DateTime @updatedAt

  @@map("settings")
}

enum SettingsCategory {
  SITE_INFO
  BRANDING
  CONTENT
  SEO
  EMAIL
  PAYMENT
  GENERAL
}
```

#### 14. NewsletterSubscription (Newsletter)
```prisma
model NewsletterSubscription {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String?
  isActive    Boolean  @default(true)
  userId      String?
  subscribedAt DateTime @default(now())
  unsubscribedAt DateTime?

  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("newsletter_subscriptions")
}
```

#### 15. ContactMessage (Mensagens de Contato)
```prisma
model ContactMessage {
  id        String            @id @default(uuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String            @db.Text
  status    ContactStatus     @default(UNREAD)
  readAt    DateTime?
  repliedAt DateTime?
  createdAt DateTime          @default(now())

  @@map("contact_messages")
}

enum ContactStatus {
  UNREAD
  READ
  REPLIED
  ARCHIVED
}
```

#### 16. AuditLog (Log de Auditoria)
```prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  action      String
  entity      String
  entityId    String?
  changes     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@map("audit_logs")
}
```

---

## 6. TIPOS TYPESCRIPT

### 6.1 Auth Types
```typescript
// auth.types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  cpf?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}
```

### 6.2 User Types
```typescript
// user.types.ts
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CUSTOMER = 'CUSTOMER'
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  cpf: string | null;
  role: UserRole;
  profileImage: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

export interface UpdateUserProfile {
  name?: string;
  phone?: string;
  cpf?: string;
  profileImage?: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}
```

### 6.3 Accommodation Types
```typescript
// accommodation.types.ts
export enum AccommodationType {
  ROOM = 'ROOM',
  SUITE = 'SUITE',
  CHALET = 'CHALET',
  VILLA = 'VILLA'
}

export interface AccommodationLocation {
  floor: string | null;
  view: string | null;
  area: number | null;
}

export interface AccommodationSEO {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
}

export interface AccommodationImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  category: AmenityCategory;
}

export interface AccommodationDetails {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  location: AccommodationLocation;
  checkInTime: string;
  checkOutTime: string;
  extraBeds: number;
  maxExtraBeds: number;
  extraBedPrice: number;
  cancellationPolicy: string | null;
  seo: AccommodationSEO;
  images: AccommodationImage[];
  amenities: Amenity[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccommodationInput {
  name: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string;
  floor?: string;
  view?: string;
  area?: number;
  checkInTime?: string;
  checkOutTime?: string;
  extraBeds?: number;
  maxExtraBeds?: number;
  extraBedPrice?: number;
  cancellationPolicy?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  amenityIds?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface UpdateAccommodationInput extends Partial<CreateAccommodationInput> {}

export interface AccommodationListQuery {
  page?: number;
  limit?: number;
  type?: AccommodationType;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'price' | 'capacity' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
```

### 6.4 Reservation Types
```typescript
// reservation.types.ts
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  WHATSAPP = 'WHATSAPP'
}

export interface CreateReservationInput {
  accommodationId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf?: string;
  numberOfExtraBeds?: number;
  specialRequests?: string;
  paymentMethod?: PaymentMethod;
}

export interface ReservationDetails {
  id: string;
  reservationCode: string;
  accommodation: {
    id: string;
    name: string;
    type: AccommodationType;
    image: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf: string | null;
  pricePerNight: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  numberOfExtraBeds: number;
  specialRequests: string | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationListQuery {
  page?: number;
  limit?: number;
  userId?: string;
  accommodationId?: string;
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'checkInDate' | 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface CancelReservationInput {
  reason?: string;
}
```

### 6.5 Common Types
```typescript
// common.types.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}
```

---

## 7. CONFIGURAÇÃO DOCKER E NGINX

### 7.1 docker-compose.yml
```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: fusehotel-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - fusehotel-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: fusehotel-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      PORT: 3001
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    ports:
      - "3001:3001"
    networks:
      - fusehotel-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend (React + Vite)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: fusehotel-frontend
    restart: unless-stopped
    ports:
      - "8080:8080"
    networks:
      - fusehotel-network

  # Nginx Reverse Proxy
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: fusehotel-nginx
    restart: unless-stopped
    depends_on:
      - backend
      - frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./backend/uploads:/var/www/uploads:ro
    networks:
      - fusehotel-network

networks:
  fusehotel-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

### 7.2 backend/Dockerfile
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY src ./src

# Gerar Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage de produção
FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências de runtime
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos compilados e Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Criar diretórios necessários
RUN mkdir -p uploads logs

# Usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
```

### 7.3 nginx/nginx.conf
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
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
    client_max_body_size 100M;

    # Gzip
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
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    # Upstream backend
    upstream backend {
        least_conn;
        server backend:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Upstream frontend
    upstream frontend {
        server frontend:8080;
        keepalive 32;
    }

    # Redirect HTTP to HTTPS (em produção)
    # server {
    #     listen 80;
    #     server_name yourdomain.com;
    #     return 301 https://$server_name$request_uri;
    # }

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # API Backend
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_cache_bypass $http_upgrade;
            proxy_buffering off;
            proxy_request_buffering off;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Login endpoint - rate limiting mais restritivo
        location /api/auth/login {
            limit_req zone=login_limit burst=3 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Uploads - servir arquivos estáticos
        location /uploads/ {
            alias /var/www/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Frontend - SPA
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Frontend static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://frontend;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### 7.4 nginx/Dockerfile
```dockerfile
FROM nginx:1.25-alpine

# Remover configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuração customizada
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretórios necessários
RUN mkdir -p /var/www/uploads

# Expor portas
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

---

## 8. APIS E ROTAS

### Padrão de URLs
```
Base URL: http://localhost/api
Versão: /v1 (opcional para futuro)
```

### 8.1 Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuário | Não |
| POST | `/api/auth/login` | Login | Não |
| POST | `/api/auth/refresh` | Renovar tokens | Não |
| POST | `/api/auth/logout` | Logout | Sim |
| POST | `/api/auth/forgot-password` | Solicitar reset de senha | Não |
| POST | `/api/auth/reset-password` | Resetar senha | Não |
| GET | `/api/auth/verify-email/:token` | Verificar email | Não |
| POST | `/api/auth/resend-verification` | Reenviar verificação | Sim |

### 8.2 Usuários

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/users/me` | Perfil do usuário atual | Sim | Qualquer |
| PUT | `/api/users/me` | Atualizar perfil | Sim | Qualquer |
| PUT | `/api/users/me/password` | Alterar senha | Sim | Qualquer |
| DELETE | `/api/users/me` | Deletar conta | Sim | Qualquer |
| GET | `/api/users` | Listar usuários | Sim | Admin |
| GET | `/api/users/:id` | Detalhes do usuário | Sim | Admin |
| PUT | `/api/users/:id` | Atualizar usuário | Sim | Admin |
| DELETE | `/api/users/:id` | Deletar usuário | Sim | Admin |

### 8.3 Acomodações

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/accommodations` | Listar acomodações | Não | - |
| GET | `/api/accommodations/featured` | Acomodações em destaque | Não | - |
| GET | `/api/accommodations/:id` | Detalhes da acomodação | Não | - |
| GET | `/api/accommodations/slug/:slug` | Buscar por slug | Não | - |
| POST | `/api/accommodations` | Criar acomodação | Sim | Admin |
| PUT | `/api/accommodations/:id` | Atualizar acomodação | Sim | Admin |
| DELETE | `/api/accommodations/:id` | Deletar acomodação | Sim | Admin |
| POST | `/api/accommodations/:id/images` | Adicionar imagens | Sim | Admin |
| DELETE | `/api/accommodations/:id/images/:imageId` | Remover imagem | Sim | Admin |
| PUT | `/api/accommodations/:id/images/reorder` | Reordenar imagens | Sim | Admin |
| GET | `/api/accommodations/:id/availability` | Verificar disponibilidade | Não | - |

### 8.4 Comodidades (Amenities)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/amenities` | Listar comodidades | Não | - |
| POST | `/api/amenities` | Criar comodidade | Sim | Admin |
| PUT | `/api/amenities/:id` | Atualizar comodidade | Sim | Admin |
| DELETE | `/api/amenities/:id` | Deletar comodidade | Sim | Admin |

### 8.5 Reservas

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/reservations` | Listar reservas | Sim | Customer (suas), Admin (todas) |
| GET | `/api/reservations/:id` | Detalhes da reserva | Sim | Customer (sua), Admin |
| POST | `/api/reservations` | Criar reserva | Sim | Qualquer |
| PUT | `/api/reservations/:id` | Atualizar reserva | Sim | Admin |
| DELETE | `/api/reservations/:id/cancel` | Cancelar reserva | Sim | Customer (sua), Admin |
| PUT | `/api/reservations/:id/status` | Atualizar status | Sim | Admin |
| POST | `/api/reservations/:id/payment` | Processar pagamento | Sim | Customer (sua), Admin |
| GET | `/api/reservations/code/:code` | Buscar por código | Sim | Customer (sua), Admin |

### 8.6 Promoções

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/promotions` | Listar promoções ativas | Não | - |
| GET | `/api/promotions/all` | Listar todas | Sim | Admin |
| GET | `/api/promotions/featured` | Promoções em destaque | Não | - |
| GET | `/api/promotions/:id` | Detalhes da promoção | Não | - |
| GET | `/api/promotions/slug/:slug` | Buscar por slug | Não | - |
| POST | `/api/promotions` | Criar promoção | Sim | Admin |
| PUT | `/api/promotions/:id` | Atualizar promoção | Sim | Admin |
| DELETE | `/api/promotions/:id` | Deletar promoção | Sim | Admin |

### 8.7 Configurações

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/settings` | Listar configurações públicas | Não | - |
| GET | `/api/settings/all` | Todas as configurações | Sim | Admin |
| GET | `/api/settings/:key` | Buscar por chave | Sim | Admin |
| PUT | `/api/settings/:key` | Atualizar configuração | Sim | Admin |
| POST | `/api/settings` | Criar configuração | Sim | Admin |

### 8.8 Upload

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/upload/image` | Upload de imagem única | Sim | Admin |
| POST | `/api/upload/images` | Upload de múltiplas imagens | Sim | Admin |
| DELETE | `/api/upload/:filename` | Deletar arquivo | Sim | Admin |

### 8.9 Newsletter

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/newsletter/subscribe` | Inscrever na newsletter | Não | - |
| POST | `/api/newsletter/unsubscribe` | Cancelar inscrição | Não | - |
| GET | `/api/newsletter/subscriptions` | Listar inscritos | Sim | Admin |

### 8.10 Contato

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/contact` | Enviar mensagem | Não | - |
| GET | `/api/contact/messages` | Listar mensagens | Sim | Admin |
| GET | `/api/contact/messages/:id` | Detalhes da mensagem | Sim | Admin |
| PUT | `/api/contact/messages/:id/status` | Atualizar status | Sim | Admin |

### 8.11 Avaliações

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/reviews/accommodation/:id` | Reviews de acomodação | Não | - |
| POST | `/api/reviews` | Criar review | Sim | Customer |
| PUT | `/api/reviews/:id` | Atualizar review | Sim | Customer (sua) |
| DELETE | `/api/reviews/:id` | Deletar review | Sim | Customer (sua), Admin |
| PUT | `/api/reviews/:id/approve` | Aprovar review | Sim | Admin |

### 8.12 Analytics e Dashboard

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/analytics/dashboard` | Estatísticas do dashboard | Sim | Admin |
| GET | `/api/analytics/reservations-chart` | Dados para gráfico | Sim | Admin |
| GET | `/api/analytics/revenue` | Receita por período | Sim | Admin |
| GET | `/api/analytics/occupancy` | Taxa de ocupação | Sim | Admin |

### 8.13 Health Check

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/health` | Status da API | Não |
| GET | `/api/health/db` | Status do banco | Não |

---

## 9. VALIDAÇÕES E REGRAS DE NEGÓCIO

### 9.1 Validações de Autenticação

#### Registro
- Email: válido, único
- Senha: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
- Nome: mínimo 3 caracteres
- CPF: válido (algoritmo de validação), único
- Telefone: formato brasileiro válido

#### Login
- Email: válido, registrado
- Senha: correta
- Máximo 5 tentativas por 15 minutos

### 9.2 Validações de Reserva

#### Criação de Reserva
- Check-in: não pode ser no passado
- Check-out: deve ser posterior ao check-in
- Número de hóspedes: dentro da capacidade da acomodação
- Acomodação: deve estar disponível nas datas selecionadas
- Email do hóspede: válido
- Telefone: válido
- Camas extras: não exceder máximo permitido

#### Cálculos
```typescript
numberOfNights = diferença em dias entre check-out e check-in
subtotal = numberOfNights * pricePerNight
extraBedsCost = numberOfExtraBeds * extraBedPrice * numberOfNights
serviceFee = subtotal * 0.05 (5%)
taxes = (subtotal + extraBedsCost) * 0.03 (3%)
totalAmount = subtotal + extraBedsCost + serviceFee + taxes - discount
```

#### Disponibilidade
- Não pode haver overlapping de reservas confirmadas
- Check-in e check-out respeitam horários configurados
- Acomodação deve estar marcada como disponível

### 9.3 Validações de Acomodação

#### Criação/Atualização
- Nome: mínimo 3 caracteres, único
- Slug: gerado automaticamente, único
- Tipo: um dos valores do enum
- Capacidade: 1-20 pessoas
- Preço: maior que 0
- Descrição: mínimo 50 caracteres
- Descrição curta: máximo 200 caracteres
- Imagens: mínimo 1, máximo 10
- Área: se fornecida, maior que 0
- Camas extras: não pode exceder capacidade

### 9.4 Regras de Negócio

#### Cancelamento de Reservas
- Gratuito: até 48h antes do check-in
- 50% de multa: entre 48h e 24h antes
- 100% de multa: menos de 24h antes
- Status muda para CANCELLED
- PaymentStatus pode mudar para REFUNDED (se aplicável)

#### Mudança de Status
```
PENDING → CONFIRMED (após pagamento)
CONFIRMED → CHECKED_IN (no dia do check-in)
CHECKED_IN → CHECKED_OUT (no check-out)
CHECKED_OUT → COMPLETED (após 24h)
Qualquer → CANCELLED (se cancelado)
```

#### Promoções
- Não podem ter data de fim anterior à data de início
- Desconto calculado: `((originalPrice - discountedPrice) / originalPrice) * 100`
- Se maxRedemptions definido, verificar antes de aplicar
- Incrementar currentRedemptions ao usar

#### Avaliações
- Usuário só pode avaliar após check-out
- Uma avaliação por reserva
- Rating: 1-5
- Só aparece no site se isApproved = true

---

## 10. SEGURANÇA E AUTENTICAÇÃO

### 10.1 JWT (JSON Web Tokens)

#### Access Token
```typescript
Payload: {
  userId: string
  email: string
  role: UserRole
}
Expiração: 15 minutos
Secret: JWT_SECRET
```

#### Refresh Token
```typescript
Payload: {
  userId: string
  tokenId: string
}
Expiração: 7 dias
Secret: JWT_REFRESH_SECRET
Armazenado: Banco de dados (tabela RefreshToken)
```

### 10.2 Bcrypt

```typescript
// Hash de senha no registro
saltRounds = 10
hashedPassword = await bcrypt.hash(password, saltRounds)

// Verificação no login
isValid = await bcrypt.compare(inputPassword, hashedPassword)
```

### 10.3 Middlewares de Segurança

#### auth.middleware.ts
```typescript
1. Extrai token do header Authorization: Bearer <token>
2. Verifica validade do token
3. Decodifica payload
4. Anexa user ao req.user
5. Next() ou erro 401
```

#### role.middleware.ts
```typescript
1. Verifica se req.user existe
2. Compara req.user.role com roles permitidos
3. Next() ou erro 403
```

### 10.4 Helmet.js

```typescript
Proteções:
- XSS Protection
- Content Security Policy
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- Strict-Transport-Security
```

### 10.5 CORS

```typescript
Configuração:
origin: process.env.FRONTEND_URL || 'http://localhost:8080'
credentials: true
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
allowedHeaders: ['Content-Type', 'Authorization']
```

### 10.6 Rate Limiting

```typescript
// Global
windowMs: 15 * 60 * 1000 (15 minutos)
max: 100 (100 requisições)

// Login
windowMs: 15 * 60 * 1000
max: 5 (5 tentativas)

// Upload
windowMs: 60 * 60 * 1000 (1 hora)
max: 20 (20 uploads)
```

---

## 11. UPLOAD DE ARQUIVOS

### 11.1 Multer Configuration

```typescript
Storage: diskStorage
Destination: ./uploads/{category}/
Filename: {timestamp}-{uuid}-{originalname}
Limits:
  fileSize: 10MB
  files: 10 (múltiplo)
FileFilter: .jpg, .jpeg, .png, .gif, .webp
```

### 11.2 Sharp - Processamento de Imagens

```typescript
// Resize
maxWidth: 1920px
maxHeight: 1080px
fit: 'inside'
withoutEnlargement: true

// Otimização
format: 'webp'
quality: 85
progressive: true

// Thumbnails
width: 400px
height: 300px
fit: 'cover'
```

### 11.3 Estrutura de Diretórios

```
uploads/
├── accommodations/
│   ├── {uuid}-image1.webp
│   └── thumbnails/
│       └── {uuid}-image1-thumb.webp
├── promotions/
├── settings/
│   ├── logos/
│   └── favicons/
└── temp/
```

### 11.4 URL de Acesso

```
http://localhost/uploads/{category}/{filename}
```

---

## 12. VARIÁVEIS DE AMBIENTE

### backend/.env
```bash
# Node Environment
NODE_ENV=development

# Server
PORT=3001
API_PREFIX=/api

# Database
DATABASE_URL=postgresql://fusehotel_user:fusehotel_password@postgres:5432/fusehotel_db
DB_USER=fusehotel_user
DB_PASSWORD=fusehotel_password
DB_NAME=fusehotel_db
DB_HOST=postgres
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:8080

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email (para futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@fusehotel.com

# Payment Gateway (para futuro)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 13. FASES DE IMPLEMENTAÇÃO

### FASE 1: SETUP INICIAL (Dia 1)
- [ ] Criar estrutura de diretórios backend
- [ ] Inicializar package.json
- [ ] Instalar dependências
- [ ] Configurar TypeScript (tsconfig.json)
- [ ] Configurar ESLint e Prettier
- [ ] Criar .gitignore e .env.example

### FASE 2: DOCKER E INFRAESTRUTURA (Dia 1-2)
- [ ] Criar docker-compose.yml
- [ ] Criar Dockerfile do backend
- [ ] Criar Dockerfile do Nginx
- [ ] Configurar nginx.conf
- [ ] Testar containers

### FASE 3: BANCO DE DADOS E PRISMA (Dia 2-3)
- [ ] Criar schema.prisma completo
- [ ] Definir todos os models
- [ ] Definir relações
- [ ] Criar primeira migration
- [ ] Testar conexão com PostgreSQL

### FASE 4: TIPOS E VALIDAÇÕES (Dia 3)
- [ ] Criar todos os arquivos de tipos
- [ ] Criar validators com Zod
- [ ] Criar tipos de extensão do Express

### FASE 5: ESTRUTURA BASE DA API (Dia 4)
- [ ] Criar app.ts (configuração Express)
- [ ] Criar server.ts (entry point)
- [ ] Configurar middlewares globais (helmet, cors, etc)
- [ ] Criar error.middleware.ts
- [ ] Criar logger.ts
- [ ] Criar response.ts (padronização)

### FASE 6: AUTENTICAÇÃO (Dia 4-5)
- [ ] Criar auth.service.ts
- [ ] Criar auth.controller.ts
- [ ] Criar auth.routes.ts
- [ ] Criar auth.middleware.ts
- [ ] Criar role.middleware.ts
- [ ] Implementar JWT
- [ ] Testar endpoints de auth

### FASE 7: USUÁRIOS (Dia 5)
- [ ] Criar user.service.ts
- [ ] Criar user.controller.ts
- [ ] Criar user.routes.ts
- [ ] Testar CRUD de usuários

### FASE 8: ACOMODAÇÕES (Dia 6)
- [ ] Criar accommodation.service.ts
- [ ] Criar accommodation.controller.ts
- [ ] Criar accommodation.routes.ts
- [ ] Implementar lógica de disponibilidade
- [ ] Implementar geração de slug
- [ ] Testar CRUD completo

### FASE 9: UPLOAD DE IMAGENS (Dia 7)
- [ ] Configurar Multer
- [ ] Criar upload.middleware.ts
- [ ] Criar upload.service.ts (Sharp)
- [ ] Criar upload.controller.ts
- [ ] Criar upload.routes.ts
- [ ] Integrar com acomodações
- [ ] Testar uploads

### FASE 10: RESERVAS (Dia 8)
- [ ] Criar reservation.service.ts
- [ ] Criar reservation.controller.ts
- [ ] Criar reservation.routes.ts
- [ ] Implementar cálculos de valores
- [ ] Implementar verificação de disponibilidade
- [ ] Implementar geração de código de reserva
- [ ] Testar fluxo completo

### FASE 11: PROMOÇÕES E PACOTES (Dia 9)
- [ ] Criar promotion.service.ts
- [ ] Criar promotion.controller.ts
- [ ] Criar promotion.routes.ts
- [ ] Implementar lógica de features
- [ ] Testar CRUD

### FASE 12: CONFIGURAÇÕES (Dia 9)
- [ ] Criar settings.service.ts
- [ ] Criar settings.controller.ts
- [ ] Criar settings.routes.ts
- [ ] Implementar sistema de key-value com JSON
- [ ] Testar funcionalidades

### FASE 13: EXTRAS (Dia 10)
- [ ] Criar newsletter.routes.ts e controllers
- [ ] Criar contact.routes.ts e controllers
- [ ] Criar review system
- [ ] Criar analytics.service.ts
- [ ] Implementar dashboard endpoints

### FASE 14: SEEDS E DADOS INICIAIS (Dia 10)
- [ ] Criar seed de usuários (admin)
- [ ] Criar seed de amenities
- [ ] Criar seed de acomodações
- [ ] Criar seed de promoções
- [ ] Criar seed de configurações
- [ ] Popular banco de dados

### FASE 15: TESTES E AJUSTES (Dia 11)
- [ ] Testar todas as rotas
- [ ] Testar autenticação e autorização
- [ ] Testar uploads
- [ ] Testar fluxo de reserva completo
- [ ] Verificar logs
- [ ] Ajustar erros

### FASE 16: DOCUMENTAÇÃO (Dia 11)
- [ ] Criar README.md do backend
- [ ] Documentar variáveis de ambiente
- [ ] Documentar estrutura de pastas
- [ ] Criar coleção Postman/Insomnia
- [ ] Swagger/OpenAPI (opcional)

### FASE 17: BUILD E DEPLOY (Dia 12)
- [ ] Testar build de produção
- [ ] Testar todos os containers juntos
- [ ] Verificar Nginx reverse proxy
- [ ] Testar frontend + backend integrados
- [ ] Otimizar Dockerfiles
- [ ] Documentação de deploy

---

## 14. CHECKLIST FINAL

### Funcionalidades Core
- [ ] Sistema completo de autenticação com JWT
- [ ] CRUD completo de acomodações
- [ ] Sistema de reservas com cálculos
- [ ] Upload e otimização de imagens
- [ ] CRUD de promoções
- [ ] Sistema de configurações
- [ ] Newsletter e contato
- [ ] Avaliações de acomodações
- [ ] Dashboard administrativo

### Segurança
- [ ] JWT implementado corretamente
- [ ] Senhas hasheadas com bcrypt
- [ ] Validações em todas as rotas
- [ ] Rate limiting configurado
- [ ] CORS configurado
- [ ] Helmet.js ativo
- [ ] Inputs sanitizados

### Performance
- [ ] Nginx como reverse proxy
- [ ] Gzip habilitado
- [ ] Cache de assets estáticos
- [ ] Queries otimizadas (Prisma)
- [ ] Imagens otimizadas (Sharp/WebP)
- [ ] Connection pooling

### DevOps
- [ ] Docker Compose funcional
- [ ] Health checks configurados
- [ ] Volumes persistentes
- [ ] Logs estruturados
- [ ] Variáveis de ambiente
- [ ] Multi-stage builds

### Código
- [ ] 100% TypeScript
- [ ] Zero uso de `any`
- [ ] Nomenclatura consistente
- [ ] Código comentado
- [ ] Separação de responsabilidades
- [ ] Tratamento de erros robusto

---

## 15. PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. **Integração com Frontend**
   - Substituir dados mockados por chamadas à API
   - Implementar React Query hooks
   - Adicionar tratamento de erros
   - Loading states

2. **Funcionalidades Futuras**
   - Integração com gateway de pagamento (Stripe/PagSeguro)
   - Sistema de e-mails transacionais
   - Notificações push
   - Chat em tempo real (Socket.io)
   - Multi-idioma (i18n)

3. **Otimizações**
   - Cache com Redis
   - CDN para imagens
   - Search com Elasticsearch
   - Filas com Bull/Redis

4. **Monitoramento**
   - Sentry para tracking de erros
   - Prometheus + Grafana para métricas
   - ELK Stack para logs
   - Uptime monitoring

---

**FIM DO PLANO DETALHADO**

Total estimado: 12 dias de desenvolvimento
Complexidade: Alta
Stack: Produção-ready
Escalabilidade: Preparado para crescimento
Segurança: Seguindo melhores práticas
