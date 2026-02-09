# 🚀 Quick Start - FuseHotel

Guia rápido para começar a desenvolver em 5 minutos!

## ⚡ Início Rápido com Docker (Recomendado)

### 1. Clone e Configure

```bash
# Clone o repositório
git clone <repo-url>
cd fusehotel

# Os arquivos .env já estão configurados!
# Não precisa fazer nada
```

### 2. Inicie o Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Aguarde...**  ⏳ (primeira vez leva ~5 minutos para buildar)

### 3. Execute as Migrations e Seeds

Em outro terminal:

```bash
# Migrations
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev

# Seeds (usuários de teste)
docker-compose -f docker-compose.dev.yml exec api npm run prisma:seed
```

### 4. Acesse a Aplicação

🎉 **Pronto!** Abra o navegador em: http://localhost:3090

## 👥 Usuários de Teste

| Tipo | Email | Senha | Acesso |
|------|-------|-------|--------|
| **Admin** | admin@fusehotel.com | Admin@123 | Painel completo |
| **Manager** | gerente@fusehotel.com | Manager@123 | Painel (exceto configs) |
| **Cliente** | joao.silva@email.com | Customer@123 | Área do cliente |

## 🛑 Parar o Ambiente

```bash
docker-compose -f docker-compose.dev.yml down
```

## 📖 Precisa de Mais Ajuda?

- **Docker Detalhado**: [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- **Proteção de Rotas**: [.claude/PROTECAO_ROTAS_ADMIN.md](./.claude/PROTECAO_ROTAS_ADMIN.md)
- **README Completo**: [README.md](./README.md)

---

## 💻 Desenvolvimento Local (Sem Docker)

Se preferir rodar sem Docker:

### 1. Instalar Dependências

```bash
# PostgreSQL deve estar rodando em localhost:5432
npm install
```

### 2. Configurar .env

```bash
# apps/api/.env
FRONTEND_URL=http://localhost:5173

# apps/web/.env
VITE_API_URL=http://localhost:3001/api
```

### 3. Executar Migrations e Seeds

```bash
cd apps/api
npx prisma migrate dev
npm run prisma:seed
```

### 4. Iniciar Aplicação

```bash
# Terminal 1 - Backend
cd apps/api
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

### 5. Acessar

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001/api
