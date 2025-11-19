# Fuse Hotel - Backend API

Backend completo para o sistema de gerenciamento do Fuse Hotel, construído com Node.js, TypeScript, Express, Prisma e PostgreSQL, rodando em containers Docker com Nginx como reverse proxy.

## 🚀 Stack Tecnológica

- **Runtime**: Node.js 20 LTS
- **Linguagem**: TypeScript 5.3+
- **Framework**: Express.js 4.18+
- **ORM**: Prisma 5.8+
- **Banco de Dados**: PostgreSQL 16+
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: Zod
- **Upload**: Multer + Sharp
- **Segurança**: Helmet, CORS, Rate Limiting
- **Logs**: Winston
- **Containerização**: Docker + Docker Compose
- **Proxy Reverso**: Nginx

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (database, environment, multer)
│   ├── controllers/      # Controllers (lógica de requisições)
│   ├── services/         # Services (lógica de negócio)
│   ├── middlewares/      # Middlewares (auth, validation, error handling)
│   ├── routes/           # Definição de rotas
│   ├── types/            # Tipos TypeScript
│   ├── validators/       # Schemas de validação Zod
│   ├── utils/            # Utilitários (logger, errors, crypto, etc)
│   ├── prisma/           # Schema Prisma e migrations
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seeds/
│   ├── app.ts            # Configuração Express
│   └── server.ts         # Entry point
├── uploads/              # Arquivos uploadados
├── logs/                 # Arquivos de log
├── .env                  # Variáveis de ambiente
├── .env.example          # Exemplo de variáveis
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema (admin, manager, customer)
- **refresh_tokens** - Tokens de refresh JWT
- **password_resets** - Reset de senhas
- **accommodations** - Acomodações do hotel
- **accommodation_images** - Imagens das acomodações
- **amenities** - Comodidades disponíveis
- **accommodation_amenities** - Relação N:N
- **reservations** - Reservas
- **payments** - Pagamentos
- **reviews** - Avaliações
- **promotions** - Promoções e pacotes
- **promotion_features** - Itens das promoções
- **settings** - Configurações do sistema
- **newsletter_subscriptions** - Inscritos na newsletter
- **contact_messages** - Mensagens de contato
- **audit_logs** - Log de auditoria

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Node
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/fusehotel_db

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:8080

# Uploads
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Rodar migrations
npm run prisma:migrate

# (Opcional) Popular banco de dados
npm run prisma:seed
```

## 🏃 Executando

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
# Build
npm run build

# Start
npm start
```

### Docker

```bash
# Na raiz do projeto
docker-compose up -d
```

## 📝 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm start                # Iniciar servidor em produção
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Rodar migrations (dev)
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:seed      # Popular banco de dados
npm run lint             # Rodar ESLint
npm run lint:fix         # Corrigir problemas do ESLint
npm run format           # Formatar código com Prettier
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Access Token**: 15 minutos de validade
- **Refresh Token**: 7 dias de validade, armazenado no banco

### Exemplo de Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Resposta

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### Usando o Token

```http
GET /api/users/me
Authorization: Bearer {accessToken}
```

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Recuperar senha
- `POST /api/auth/reset-password` - Resetar senha

### Usuários
- `GET /api/users/me` - Perfil do usuário
- `PUT /api/users/me` - Atualizar perfil
- `GET /api/users` - Listar usuários (admin)

### Acomodações
- `GET /api/accommodations` - Listar acomodações
- `GET /api/accommodations/:id` - Detalhes
- `POST /api/accommodations` - Criar (admin)
- `PUT /api/accommodations/:id` - Atualizar (admin)
- `DELETE /api/accommodations/:id` - Deletar (admin)

### Reservas
- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/:id` - Detalhes
- `POST /api/reservations` - Criar reserva
- `PUT /api/reservations/:id` - Atualizar
- `DELETE /api/reservations/:id/cancel` - Cancelar

### Health Check
- `GET /api/health` - Status do servidor
- `GET /api/health/db` - Status do banco de dados

## 🛡️ Segurança

- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min global, 5 req/15min login)
- ✅ Validação de dados com Zod
- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT com expiração
- ✅ Input sanitization
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection

## 📊 Logs

Logs são salvos em `./logs/`:
- `app.log` - Todos os logs
- `error.log` - Apenas erros

Formato: JSON com timestamp, level, message

## 🧪 Desenvolvimento

### Padrões de Código

- **ESLint** para linting
- **Prettier** para formatação
- **TypeScript** strict mode
- **Sem uso de `any`**
- **Nomenclatura consistente**

### Estrutura de Commits

```
feat: Adicionar autenticação JWT
fix: Corrigir validação de CPF
docs: Atualizar README
refactor: Melhorar estrutura de errors
```

## 📦 Build para Produção

```bash
# Build
npm run build

# O código compilado estará em ./dist/
```

## 🐳 Docker

### Serviços

- **postgres**: PostgreSQL 16
- **backend**: API Node.js
- **frontend**: React + Vite
- **nginx**: Reverse Proxy

### Portas

- `80`: Nginx (proxy)
- `3001`: Backend API
- `5432`: PostgreSQL
- `8080`: Frontend

### Volumes

- `postgres_data`: Dados do PostgreSQL
- `./uploads`: Arquivos uploadados
- `./logs`: Logs da aplicação

## 🔄 Migrations

```bash
# Criar migration
npx prisma migrate dev --name migration_name

# Aplicar migrations em produção
npx prisma migrate deploy

# Reset database (CUIDADO!)
npx prisma migrate reset
```

## 📈 Monitoramento

### Health Checks

```bash
# Server health
curl http://localhost:3001/api/health

# Database health
curl http://localhost:3001/api/health/db
```

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 👥 Autor

Fuse Hotel Development Team

---

**Versão**: 1.0.0
**Última atualização**: 2025-01-18
