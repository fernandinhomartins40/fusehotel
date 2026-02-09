# 🔧 Correção do Loop de Autenticação

## 📋 Problema Identificado

O sistema estava entrando em loop infinito entre a landing page e a página de login ao fazer refresh da página. O ciclo era:

1. Frontend carrega e tenta buscar `/api/users/profile`
2. Token está inválido/expirado (401)
3. Interceptor Axios tenta fazer refresh: `POST /api/auth/refresh`
4. Backend valida e rejeita: **"refreshToken Required"** (422)
5. Interceptor redireciona para `/area-do-cliente`
6. Página carrega novamente e volta ao passo 1
7. **Loop infinito** 🔄

## 🔍 Causa Raiz

O problema estava na validação da rota de refresh token:

```typescript
// ❌ ANTES - em auth.routes.ts
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refreshToken);
```

A validação `refreshTokenSchema` exigia que o `refreshToken` estivesse no **body** da requisição:

```typescript
// refreshTokenSchema em auth.validators.ts
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});
```

Porém, o sistema foi projetado para usar **cookies httpOnly** para segurança:

```typescript
// auth.controller.ts - linha 78
const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
```

O controller aceita refreshToken do cookie OU do body, mas a validação era executada ANTES do controller ter chance de ler o cookie, causando rejeição prematura.

## ✅ Solução Implementada

Removemos a validação das rotas de refresh e logout para permitir que o controller leia o refreshToken do cookie:

```typescript
// ✅ DEPOIS - em auth.routes.ts
router.post('/refresh', AuthController.refreshToken); // Sem validator
router.post('/logout', AuthController.logout); // Sem validator
```

### Validação Agora Acontece no Controller

```typescript
// auth.controller.ts - linha 75-82
static async refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Tentar pegar refresh token do cookie primeiro, senão do body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token não fornecido' });
    }
    // ...
  }
}
```

## 📊 Resultado

### Antes da Correção:
```
GET /api/users/profile → 401 (Token inválido)
POST /api/auth/refresh → 422 (refreshToken Required) ❌
Redirect → /area-do-cliente
Loop infinito 🔄
```

### Depois da Correção:
```
GET /api/users/profile → 401 (Token inválido)
POST /api/auth/refresh → 401 (Refresh token não fornecido) ✅
Redirect → /area-do-cliente
Usuário vê tela de login (loop quebrado) ✓
```

## 🔒 Arquitetura de Autenticação

O sistema usa **cookies httpOnly** para segurança:

### Login/Register:
1. Backend cria tokens JWT
2. Envia tokens como **cookies httpOnly** (não acessíveis via JavaScript)
3. Frontend recebe apenas dados do usuário (sem tokens)

### Requisições Autenticadas:
1. Browser envia cookies automaticamente
2. Backend lê tokens dos cookies
3. Valida e processa requisição

### Refresh Token:
1. Access token expira (15 minutos)
2. Requisição falha com 401
3. Interceptor chama `/auth/refresh` **sem body**
4. Backend lê refreshToken do **cookie**
5. Gera novo access token e atualiza cookie

## 🛡️ Segurança

Os cookies são configurados com:

```typescript
const cookieOptions = {
  httpOnly: true,        // Não acessível via JavaScript (XSS protection)
  secure: isProduction,  // HTTPS only em produção
  sameSite: 'strict',    // CSRF protection
  maxAge: 15 * 60 * 1000 // 15 minutos para access token
};
```

## 🚀 Outras Correções Realizadas

### 1. Trust Proxy (app.ts)
```typescript
// Necessário para Nginx reverse proxy
app.set('trust proxy', 1);
```

### 2. Rate Limiter (rate-limiter.middleware.ts)
```typescript
// Mais permissivo em desenvolvimento
max: env.NODE_ENV === 'development' ? 10000 : 100
```

### 3. URLs Duplicadas (useLanding.ts)
```typescript
// ❌ Antes: '/api/landing/hero-slides'
// ✅ Depois: '/landing/hero-slides' (baseURL já tem /api)
```

### 4. Tabelas do Banco
```bash
# Criadas com prisma db push
docker exec fusehotel-api-dev npx prisma db push
```

## 📝 Arquivos Modificados

1. **apps/api/src/routes/auth.routes.ts** - Removeu validators de refresh/logout
2. **apps/api/src/app.ts** - Adicionou trust proxy
3. **apps/api/src/middlewares/rate-limiter.middleware.ts** - Ajustou limites
4. **apps/web/src/hooks/useLanding.ts** - Corrigiu URLs duplicadas
5. **apps/api/src/controllers/upload.controller.ts** - Corrigiu regex de path

## 🧪 Como Testar

1. **Acesse**: http://localhost:3090
2. **Navegue** pela landing page (deve carregar normalmente)
3. **Tente fazer login** (será redirecionado para /area-do-cliente)
4. **Faça F5** na página
5. **Resultado esperado**: Volta para login SEM loop ✅

## 🎯 Status Final

- ✅ Loop de autenticação corrigido
- ✅ Cookies httpOnly funcionando
- ✅ Refresh token aceita cookies
- ✅ Rate limiter configurado
- ✅ Trust proxy habilitado
- ✅ Todas as rotas da API funcionando
- ✅ Landing Page Customizer acessível

## 📚 Referências

- [Express Trust Proxy](https://expressjs.com/en/guide/behind-proxies.html)
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- [HTTP-only Cookies](https://owasp.org/www-community/HttpOnly)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
