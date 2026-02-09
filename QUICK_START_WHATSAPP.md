# 🚀 Quick Start - Sistema de Checkout via WhatsApp

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Portas 3000, 5000 e 5432 disponíveis

---

## ⚡ Início Rápido (3 passos)

### 1️⃣ Subir o Ambiente

```bash
# Fazer rebuild completo
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d

# Aguardar containers iniciarem (30-60 segundos)
docker-compose -f docker-compose.dev.yml logs -f
```

### 2️⃣ Configurar WhatsApp do Hotel

Acesse o painel admin e configure o WhatsApp:

1. **Login Admin:**
   - URL: http://localhost:3000/admin-login
   - Email: `admin@fusehotel.com`
   - Senha: `Admin@123`

2. **Configurar WhatsApp:**
   - Vá para: http://localhost:3000/admin/settings
   - Aba: "Configurações"
   - Campo "WhatsApp do Hotel": `5511999999999` (seu número)
   - Clique em "Salvar Configurações"

### 3️⃣ Testar Reserva

1. **Acesse uma acomodação:**
   - URL: http://localhost:3000/acomodacoes

2. **Clique em qualquer acomodação**

3. **Selecione datas e hóspedes:**
   - Check-in: Amanhã
   - Check-out: Daqui 3 dias
   - Hóspedes: 2
   - Camas extras: 0 ou 1

4. **Clique em "Reservar Agora"**

5. **Preencha o checkout:**
   - Nome: "João da Silva"
   - WhatsApp: "(11) 99999-9999"

6. **Clique em "Finalizar via WhatsApp"**
   - Você será redirecionado para o WhatsApp
   - A mensagem estará pré-preenchida
   - Envie para o hotel

7. **Verificar reserva criada:**
   - Acesse: http://localhost:3000/admin/reservations
   - Sua reserva estará lá com status PENDING

---

## 🔐 Credenciais de Teste

### Admin
- Email: `admin@fusehotel.com`
- Senha: `Admin@123`

### Gerente
- Email: `gerente@fusehotel.com`
- Senha: `Manager@123`

### Clientes
- Email: `joao.silva@email.com`
- Senha: `Customer@123`

### Cliente Provisório (criado após reserva)
- Login: `11999999999` (o número do WhatsApp)
- Senha: `joa` (3 primeiras letras do nome)

---

## 📱 Formatos de WhatsApp

### Formato para Configurar (Admin)
```
5511999999999
```
- Código do país (55 = Brasil)
- DDD (11 = São Paulo)
- Número (999999999)

### Formato no Formulário (Cliente)
```
(11) 99999-9999
```
- O sistema formata automaticamente
- Remove caracteres especiais antes de salvar

---

## 🔍 Verificar Implementação

### 1. Verificar Banco de Dados

```bash
# Acessar container do PostgreSQL
docker exec -it fusehotel-postgres-dev psql -U fusehotel_user -d fusehotel_db

# Verificar configurações do hotel
SELECT * FROM "HotelSettings";

# Verificar usuários provisórios
SELECT * FROM "User" WHERE "isProvisional" = true;

# Verificar reservas
SELECT "reservationCode", "guestName", "guestWhatsApp", "status" FROM "Reservation";

# Sair
\q
```

### 2. Ver Logs

```bash
# Logs da API
docker-compose -f docker-compose.dev.yml logs -f api

# Logs do Web
docker-compose -f docker-compose.dev.yml logs -f web

# Logs do banco
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### 3. Testar API Diretamente

```bash
# Buscar configurações do hotel (público)
curl http://localhost:5000/api/settings/hotel

# Criar reserva
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "accommodationId": "SEU_UUID_AQUI",
    "checkInDate": "2026-02-10T00:00:00.000Z",
    "checkOutDate": "2026-02-13T00:00:00.000Z",
    "numberOfGuests": 2,
    "numberOfExtraBeds": 1,
    "guestName": "João da Silva",
    "guestWhatsApp": "11999999999"
  }'
```

---

## 🐛 Solução de Problemas

### Containers não iniciam

```bash
# Ver status
docker-compose -f docker-compose.dev.yml ps

# Ver logs de erro
docker-compose -f docker-compose.dev.yml logs

# Restart completo
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Banco de dados não inicializa

```bash
# Recriar banco
docker-compose -f docker-compose.dev.yml down -v
docker volume rm fusehotel_postgres-dev-data
docker-compose -f docker-compose.dev.yml up -d postgres

# Aguardar 30 segundos
# Rodar seeds
docker exec -it fusehotel-api-dev npm run prisma:seed
```

### Frontend não compila

```bash
# Limpar e rebuildar
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build web --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### API não conecta ao banco

```bash
# Verificar variáveis de ambiente
docker exec -it fusehotel-api-dev env | grep DATABASE_URL

# Verificar se banco está acessível
docker exec -it fusehotel-api-dev ping postgres

# Recriar containers
docker-compose -f docker-compose.dev.yml restart
```

---

## 📊 Fluxo Completo de Teste

### Teste 1: Reserva Anônima

```
1. Abrir: http://localhost:3000/acomodacoes
2. Clicar em uma acomodação
3. Selecionar datas
4. Clicar "Reservar Agora"
5. Preencher: Nome + WhatsApp
6. Clicar "Finalizar via WhatsApp"
7. WhatsApp abre com mensagem
```

**Resultado Esperado:**
- ✅ Usuário provisório criado no banco
- ✅ Reserva criada com status PENDING
- ✅ Reserva vinculada ao usuário
- ✅ WhatsApp abre com mensagem formatada

### Teste 2: Login Provisório

```
1. Anotar WhatsApp usado: 11999999999
2. Anotar nome usado: João da Silva
3. Ir para: http://localhost:3000/login
4. Email: 11999999999
5. Senha: joa (3 primeiras letras)
6. Fazer login
7. Ver dashboard
```

**Resultado Esperado:**
- ✅ Login com sucesso
- ✅ Ver histórico de reservas
- ✅ Dados do usuário exibidos

### Teste 3: Admin Confirma Reserva

```
1. Login admin: http://localhost:3000/admin-login
2. Ir para: http://localhost:3000/admin/reservations
3. Ver reserva PENDING
4. Abrir detalhes
5. Mudar status para CONFIRMED
```

**Resultado Esperado:**
- ✅ Status atualizado
- ✅ Timestamp preenchido
- ✅ Cliente vê status atualizado

---

## 🎯 Checklist de Validação

Após subir o ambiente, verifique:

- [ ] Frontend acessível em http://localhost:3000
- [ ] API acessível em http://localhost:5000/api/health
- [ ] PostgreSQL rodando na porta 5432
- [ ] Admin login funcionando
- [ ] Configurações do hotel salvando
- [ ] Página de acomodações carregando
- [ ] Formulário de reserva funcionando
- [ ] WhatsApp abrindo com mensagem
- [ ] Reserva sendo criada no banco
- [ ] Usuário provisório sendo criado
- [ ] Login provisório funcionando
- [ ] Admin vendo reservas

---

## 📞 Suporte

### Documentação Completa
- [WHATSAPP_CHECKOUT_SYSTEM.md](WHATSAPP_CHECKOUT_SYSTEM.md)

### Logs Úteis

```bash
# Tudo
docker-compose -f docker-compose.dev.yml logs -f

# Apenas API
docker-compose -f docker-compose.dev.yml logs -f api

# Últimas 100 linhas
docker-compose -f docker-compose.dev.yml logs --tail=100
```

### Reset Completo

```bash
# CUIDADO: Apaga tudo!
docker-compose -f docker-compose.dev.yml down -v
docker volume prune -f
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

---

## ✅ Tudo Pronto!

Se todos os passos funcionaram:

1. ✅ Sistema está rodando
2. ✅ WhatsApp configurado
3. ✅ Reservas funcionando
4. ✅ Usuários provisórios criados
5. ✅ Admin gerenciando reservas

**Aproveite o sistema!** 🎉
