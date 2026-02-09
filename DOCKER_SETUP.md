# 🐳 Docker Setup - FuseHotel

Configuração Docker completa para desenvolvimento local que simula o ambiente de produção.

## 📋 Arquitetura

```
┌─────────────────────────────────────┐
│   Navegador: localhost:3090         │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│   Nginx (Reverse Proxy)             │
│   Container: fusehotel-nginx-dev    │
│   Porta Externa: 3090               │
└─────┬──────────────────┬────────────┘
      │                  │
      │ /api/*          │ /*
      │                  │
┌─────▼─────────┐  ┌────▼──────────┐
│  Backend API  │  │  Frontend Web │
│  Container:   │  │  Container:   │
│  api-dev      │  │  web-dev      │
│  Porta: 3001  │  │  Porta: 80    │
└───────┬───────┘  └───────────────┘
        │
┌───────▼────────┐
│   PostgreSQL   │
│   Container:   │
│   postgres-dev │
│   Porta: 5432  │
└────────────────┘
```

## 🎯 Benefícios desta Configuração

✅ **Porta Única (3090)**: Acesso via uma única porta externa, evitando problemas de CORS
✅ **Nginx Reverse Proxy**: Simula exatamente o ambiente de produção
✅ **Isolamento**: Containers isolados na rede interna
✅ **Segurança**: Frontend e Backend não expõem portas diretamente
✅ **Desenvolvimento/Produção**: Mesma arquitetura em ambos ambientes

## 🚀 Como Usar

### 1. Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose v2+

Verificar instalação:
```bash
docker --version
docker-compose --version
```

### 2. Configuração Inicial

Os arquivos `.env` já estão configurados para usar Docker com porta 3090.

**apps/api/.env:**
```env
FRONTEND_URL=http://localhost:3090
```

**apps/web/.env:**
```env
VITE_API_URL=http://localhost:3090/api
```

### 3. Iniciar o Ambiente

```bash
# Na raiz do projeto
docker-compose -f docker-compose.dev.yml up --build
```

**Parâmetros:**
- `-f docker-compose.dev.yml`: Usa o arquivo de configuração de desenvolvimento
- `--build`: Reconstrói as imagens (use na primeira vez ou após mudanças)
- `-d`: (opcional) Roda em background (detached mode)

### 4. Acessar a Aplicação

🌐 **Aplicação completa:** http://localhost:3090

**Rotas disponíveis:**
- `/` - Frontend (React + Vite)
- `/api/*` - Backend API (Node.js + Express)
- `/uploads/*` - Arquivos estáticos
- `/health` - Health check do Nginx

### 5. Verificar Status dos Containers

```bash
# Listar containers rodando
docker ps

# Listar todos os containers
docker ps -a

# Ver logs de todos os serviços
docker-compose -f docker-compose.dev.yml logs

# Ver logs de um serviço específico
docker-compose -f docker-compose.dev.yml logs api
docker-compose -f docker-compose.dev.yml logs web
docker-compose -f docker-compose.dev.yml logs nginx
docker-compose -f docker-compose.dev.yml logs postgres
```

### 6. Executar Comandos nos Containers

#### Migrations e Seeds (API)

```bash
# Gerar Prisma Client
docker-compose -f docker-compose.dev.yml exec api npx prisma generate

# Rodar migrations
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev

# Executar seeds
docker-compose -f docker-compose.dev.yml exec api npm run prisma:seed

# Abrir Prisma Studio
docker-compose -f docker-compose.dev.yml exec api npx prisma studio
```

#### Acessar PostgreSQL

```bash
# Via container
docker-compose -f docker-compose.dev.yml exec postgres psql -U fusehotel_user -d fusehotel_db

# Via localhost (porta 5432 exposta)
psql -h localhost -U fusehotel_user -d fusehotel_db
```

#### Bash nos Containers

```bash
# API
docker-compose -f docker-compose.dev.yml exec api sh

# Web
docker-compose -f docker-compose.dev.yml exec web sh

# Nginx
docker-compose -f docker-compose.dev.yml exec nginx sh
```

### 7. Parar o Ambiente

```bash
# Parar containers (mantém volumes)
docker-compose -f docker-compose.dev.yml down

# Parar e remover volumes (ATENÇÃO: apaga banco de dados!)
docker-compose -f docker-compose.dev.yml down -v

# Parar e remover imagens
docker-compose -f docker-compose.dev.yml down --rmi all
```

### 8. Rebuild após Mudanças no Código

```bash
# Rebuild apenas um serviço
docker-compose -f docker-compose.dev.yml up --build api
docker-compose -f docker-compose.dev.yml up --build web

# Rebuild todos os serviços
docker-compose -f docker-compose.dev.yml up --build
```

## 🔧 Troubleshooting

### Problema: Erro de CORS

**Sintoma:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solução:**
1. Verificar se está acessando via `http://localhost:3090` (não 5173, 3000, etc)
2. Verificar `FRONTEND_URL` em `apps/api/.env`
3. Reconstruir containers: `docker-compose -f docker-compose.dev.yml up --build`

### Problema: Porta 3090 já em uso

**Solução:**
```bash
# Ver o que está usando a porta
netstat -ano | findstr :3090  # Windows
lsof -i :3090                 # Linux/Mac

# Mudar a porta no docker-compose.dev.yml
# Linha 77: "3090:80" -> "3091:80"
```

### Problema: Banco de dados não conecta

**Solução:**
```bash
# Verificar se PostgreSQL está saudável
docker-compose -f docker-compose.dev.yml ps

# Ver logs do PostgreSQL
docker-compose -f docker-compose.dev.yml logs postgres

# Recriar o volume do banco
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Problema: Mudanças no código não aparecem

**Solução:**
1. Rebuild do container específico
2. Limpar cache do Docker:
```bash
docker system prune -a
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Problema: Container reiniciando constantemente

**Solução:**
```bash
# Ver logs detalhados
docker-compose -f docker-compose.dev.yml logs --tail=100 <service_name>

# Verificar health check
docker inspect fusehotel-api-dev | grep -A 10 Health
```

## 📦 Estrutura de Arquivos

```
fusehotel/
├── docker-compose.dev.yml        # Configuração Docker desenvolvimento
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.api        # Build da API
│   │   └── Dockerfile.web        # Build do Frontend
│   └── nginx/
│       └── nginx.dev.conf        # Configuração Nginx desenvolvimento
├── apps/
│   ├── api/
│   │   └── .env                  # Variáveis de ambiente API
│   └── web/
│       └── .env                  # Variáveis de ambiente Web
```

## 🔐 Variáveis de Ambiente

### Backend (apps/api/.env)

```env
NODE_ENV=development
PORT=3001
API_PREFIX=/api
DATABASE_URL=postgresql://fusehotel_user:fusehotel_password@postgres:5432/fusehotel_db
JWT_SECRET=dev-secret-key-change-in-production-min-32-characters-long
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32-characters
FRONTEND_URL=http://localhost:3090
```

### Frontend (apps/web/.env)

```env
VITE_API_URL=http://localhost:3090/api
```

## 🌐 Diferenças: Desenvolvimento Local vs Docker

| Aspecto | Desenvolvimento Local | Docker |
|---------|----------------------|--------|
| Frontend | http://localhost:5173 | http://localhost:3090 |
| Backend | http://localhost:3001 | http://localhost:3090/api |
| PostgreSQL | localhost:5432 | postgres:5432 (interno) |
| CORS | Configurado por URL | Não há CORS (mesma origem) |
| Nginx | Não usado | Reverse Proxy |

## 📝 Notas Importantes

1. **Sempre use `http://localhost:3090`** quando rodar via Docker
2. **Migrations**: Execute dentro do container API
3. **Volumes**: Dados persistem entre restarts (exceto com `-v`)
4. **Logs**: São essenciais para debug, use `docker-compose logs`
5. **Rebuild**: Necessário após mudanças em `package.json` ou `Dockerfile`

## 🎓 Comandos Úteis Resumidos

```bash
# Iniciar
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar
docker-compose -f docker-compose.dev.yml down

# Rebuild
docker-compose -f docker-compose.dev.yml up --build

# Executar seeds
docker-compose -f docker-compose.dev.yml exec api npm run prisma:seed

# Acessar bash da API
docker-compose -f docker-compose.dev.yml exec api sh

# Remover tudo (CUIDADO!)
docker-compose -f docker-compose.dev.yml down -v --rmi all
```

## 🚀 Deploy para VPS

Esta configuração Docker é idêntica à de produção, apenas mudando:
- Porta externa (3090 → 80 ou 443)
- Variáveis de ambiente (dev → production)
- Certificado SSL (adicionar HTTPS)

Veja `infra/docker/docker-compose.yml` para configuração de produção.
