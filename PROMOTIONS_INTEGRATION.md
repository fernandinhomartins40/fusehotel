# Integração Completa do Sistema de Promoções e Pacotes - FuseHotel

## 📋 Visão Geral

Este documento descreve a implementação completa e funcional do sistema de promoções e pacotes do FuseHotel, incluindo gerenciamento administrativo completo e páginas públicas totalmente integradas.

**Status**: ✅ 100% Implementado e Integrado com API Real

**Data de Conclusão**: 2026-02-07

---

## 🎯 Objetivos Alcançados

1. ✅ Sistema administrativo CRUD completo para gerenciar promoções e pacotes
2. ✅ Página pública de listagem de promoções ativas
3. ✅ Página de detalhes de promoção com informações completas
4. ✅ Todas as funcionalidades integradas com API real (sem dados mockados)
5. ✅ Estados de loading, erro e empty states implementados
6. ✅ Validação de dados no backend
7. ✅ Upload de imagens com crop integrado
8. ✅ Gerenciamento de features/recursos inclusos
9. ✅ Sistema de ativação/desativação e featured

---

## 🏗️ Arquitetura

### Backend (API)

```
apps/api/
├── src/
│   ├── controllers/
│   │   └── promotions.controller.ts    # Endpoints de promoções
│   ├── services/
│   │   └── promotions.service.ts       # Lógica de negócio
│   ├── routes/
│   │   └── promotions.routes.ts        # Rotas HTTP
│   └── prisma/
│       └── schema.prisma                # Schema do banco de dados
```

### Frontend (Web)

```
apps/web/
├── src/
│   ├── hooks/
│   │   └── usePromotions.ts             # Hooks de API
│   ├── components/
│   │   └── ui/
│   │       └── PromotionCard.tsx        # Card de promoção
│   ├── pages/
│   │   ├── admin/
│   │   │   └── PackagesPromotions.tsx   # Painel admin
│   │   ├── Promotions.tsx               # Listagem pública
│   │   └── PromotionDetail.tsx          # Detalhes da promoção
│   └── types/
│       └── promotion.ts                  # TypeScript types
```

---

## 📊 Estrutura de Dados

### Modelo Prisma (Promotion)

```prisma
model Promotion {
  id                 String        @id @default(uuid())
  title              String
  slug               String        @unique
  shortDescription   String
  longDescription    String        @db.Text
  image              String?
  startDate          DateTime
  endDate            DateTime
  originalPrice      Decimal?      @db.Decimal(10, 2)
  discountedPrice    Decimal?      @db.Decimal(10, 2)
  discountPercent    Decimal?      @db.Decimal(5, 2)
  type               PromotionType
  isActive           Boolean       @default(true)
  isFeatured         Boolean       @default(false)
  termsAndConditions String?       @db.Text
  maxRedemptions     Int?
  currentRedemptions Int           @default(0)
  promotionCode      String?       @unique
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  features PromotionFeature[]

  @@index([slug])
  @@index([isActive])
  @@index([isFeatured])
}

model PromotionFeature {
  id          String @id @default(uuid())
  promotionId String
  feature     String
  order       Int

  promotion Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
}

enum PromotionType {
  PACKAGE
  PROMOTION
}
```

### Interface TypeScript

```typescript
export type PromotionType = 'PACKAGE' | 'PROMOTION';

export interface PromotionFeature {
  id: string;
  promotionId: string;
  feature: string;
  order: number;
}

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: string | null;
  startDate: string;
  endDate: string;
  originalPrice: number | null;
  discountedPrice: number | null;
  discountPercent: number | null;
  type: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
  termsAndConditions: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  promotionCode: string | null;
  createdAt: string;
  updatedAt: string;
  features: PromotionFeature[];
}
```

---

## 🔌 API Endpoints

### Endpoints Públicos

```http
# Listar promoções ativas
GET /api/promotions?isActive=true
Response: Promotion[]

# Buscar promoção por ID
GET /api/promotions/:id
Response: Promotion

# Buscar promoção por slug
GET /api/promotions/slug/:slug
Response: Promotion
```

### Endpoints Administrativos (ADMIN/MANAGER)

```http
# Listar todas as promoções (incluindo inativas)
GET /api/promotions
Query params: ?type=PACKAGE&isFeatured=true
Response: Promotion[]

# Criar nova promoção
POST /api/promotions
Auth: ADMIN, MANAGER
Body: {
  title: string,
  shortDescription: string,
  longDescription: string,
  image?: string,
  startDate: string,
  endDate: string,
  originalPrice?: number,
  discountedPrice?: number,
  type: 'PACKAGE' | 'PROMOTION',
  isActive?: boolean,
  isFeatured?: boolean,
  features?: string[],
  termsAndConditions?: string,
  maxRedemptions?: number,
  promotionCode?: string
}
Response: Promotion

# Atualizar promoção
PUT /api/promotions/:id
Auth: ADMIN, MANAGER
Body: Partial<CreatePromotionData>
Response: Promotion

# Deletar promoção
DELETE /api/promotions/:id
Auth: ADMIN
Response: { message: "Promoção removida com sucesso" }
```

---

## ⚙️ Funcionalidades Implementadas

### 1. Painel Administrativo (`/admin/packages-promotions`)

**Funcionalidades:**
- ✅ CRUD completo de promoções e pacotes
- ✅ Duas abas: "Ativos" e "Todos"
- ✅ Tabela com informações principais
- ✅ Upload de imagem com crop (600x400px)
- ✅ Gerenciamento de features/recursos
- ✅ Toggle ativo/inativo em tempo real
- ✅ Toggle featured/destaque em tempo real
- ✅ Datas de validade
- ✅ Preço original e promocional
- ✅ Estados de loading, erro e vazio
- ✅ Confirmação antes de deletar

**Arquivo:** `apps/web/src/pages/admin/PackagesPromotions.tsx`

**Hooks Utilizados:**
```typescript
const { data: allPromotions, isLoading, error } = usePromotions({});
const createMutation = useCreatePromotion();
const updateMutation = useUpdatePromotion();
const deleteMutation = useDeletePromotion();
```

**Operações:**
- **Criar**: Formulário completo em modal com validação
- **Editar**: Carrega dados da promoção no formulário
- **Deletar**: Confirmação + chamada à API
- **Toggle Active**: Atualiza via PATCH apenas campo isActive
- **Toggle Featured**: Atualiza via PATCH apenas campo isFeatured

### 2. Página Pública de Promoções (`/promocoes`)

**Funcionalidades:**
- ✅ Lista apenas promoções ativas (`isActive: true`)
- ✅ Cards com imagem, título, descrição curta
- ✅ Mostra até 3 features + indicador de mais
- ✅ Preço original (riscado) e preço promocional
- ✅ Badge indicando tipo (Pacote/Promoção)
- ✅ Link para página de detalhes
- ✅ Estados de loading, erro e vazio
- ✅ Grid responsivo (1/2/3 colunas)

**Arquivo:** `apps/web/src/pages/Promotions.tsx`

**Hook Utilizado:**
```typescript
const { data: promotions, isLoading, error } = usePromotions({ isActive: true });
```

**Componente de Card:**
- Arquivo: `apps/web/src/components/ui/PromotionCard.tsx`
- Usa slug da promoção para navegação
- Formata preços em BRL
- Exibe features em badges

### 3. Página de Detalhes (`/promocoes/:slug`)

**Funcionalidades:**
- ✅ Hero image em tela cheia
- ✅ Breadcrumbs de navegação
- ✅ Informações completas da promoção
- ✅ Descrição longa formatada
- ✅ Lista completa de features/recursos
- ✅ Termos e condições (se houver)
- ✅ Card lateral com preços e botão reservar
- ✅ Contador de vagas disponíveis (se houver limite)
- ✅ Estados de loading e erro
- ✅ Busca por slug

**Arquivo:** `apps/web/src/pages/PromotionDetail.tsx`

**Hook Utilizado:**
```typescript
const { data: promotion, isLoading, error } = usePromotionBySlug(slug);
```

---

## 🔄 Fluxo de Dados

### 1. Criação de Promoção (Admin)

```
1. Admin acessa /admin/packages-promotions
2. Clica em "Criar Novo"
3. Preenche formulário:
   - Título, tipo (Pacote/Promoção)
   - Descrição curta e completa
   - Upload de imagem (crop 600x400)
   - Datas de validade
   - Preços (original e promocional)
   - Features/recursos inclusos
   - Termos e condições
   - Toggles: Ativo, Destaque
4. Submit do formulário
5. Hook useCreatePromotion() envia POST /api/promotions
6. Backend:
   - Gera slug único do título
   - Valida dados
   - Cria registro no banco
   - Cria features associadas
7. Retorna promoção criada
8. Frontend:
   - Toast de sucesso
   - Invalida queries
   - Fecha modal
   - Atualiza tabela automaticamente
```

### 2. Edição de Promoção (Admin)

```
1. Admin clica em ícone de editar
2. Modal abre com dados preenchidos
3. Admin modifica campos desejados
4. Submit do formulário
5. Hook useUpdatePromotion() envia PUT /api/promotions/:id
6. Backend:
   - Atualiza slug se título mudou
   - Deleta features antigas
   - Cria novas features
   - Atualiza registro
7. Frontend:
   - Toast de sucesso
   - Invalida queries
   - Fecha modal
   - Tabela atualizada
```

### 3. Toggle Ativo/Featured (Admin)

```
1. Admin clica no switch
2. Hook useUpdatePromotion() envia PUT com apenas o campo alterado
3. Backend atualiza apenas o campo específico
4. Frontend:
   - Toast de sucesso
   - Invalida queries
   - Switch atualizado
   - Se virar inactive em aba "Ativos", item some da lista
```

### 4. Visualização Pública

```
1. Usuário acessa /promocoes
2. Hook usePromotions({ isActive: true }) busca promoções ativas
3. Backend retorna apenas promoções com isActive = true
4. Cards renderizados em grid
5. Usuário clica em "Ver detalhes"
6. Navega para /promocoes/:slug
7. Hook usePromotionBySlug(slug) busca promoção específica
8. Página de detalhes renderizada
```

---

## 🧰 Hooks Implementados

### usePromotions.ts

```typescript
// Listar promoções com filtros
export function usePromotions(filters?: PromotionFilters): UseQueryResult<Promotion[]>

// Buscar por ID
export function usePromotion(id: string): UseQueryResult<Promotion>

// Buscar por slug (para página pública)
export function usePromotionBySlug(slug: string): UseQueryResult<Promotion>

// Criar promoção (admin)
export function useCreatePromotion(): UseMutationResult<Promotion, Error, CreatePromotionData>

// Atualizar promoção (admin)
export function useUpdatePromotion(): UseMutationResult<Promotion, Error, { id: string; data: Partial<CreatePromotionData> }>

// Deletar promoção (admin)
export function useDeletePromotion(): UseMutationResult<void, Error, string>
```

**Features dos Hooks:**
- Integração com React Query para cache automático
- Toast notifications de sucesso/erro
- Invalidação automática de queries após mutations
- Tratamento de erros com mensagens amigáveis
- Estados de loading individuais

---

## 🎨 Estados da Interface

### Loading States

```tsx
{isLoading && (
  <Card>
    <CardContent className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="ml-3 text-lg">Carregando promoções...</span>
    </CardContent>
  </Card>
)}
```

### Error States

```tsx
{error && (
  <Card>
    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-red-600 mb-4">
        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">Erro ao carregar promoções</h2>
      <p className="text-gray-600">
        {error?.response?.data?.message || 'Ocorreu um erro'}
      </p>
    </CardContent>
  </Card>
)}
```

### Empty States

```tsx
{promotions?.length === 0 && (
  <Card>
    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
      <Tag size={64} className="text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhuma promoção encontrada</h3>
      <p className="text-gray-600 mb-4">
        {activeTab === 'active'
          ? 'Não há promoções ativas no momento.'
          : 'Ainda não há promoções cadastradas.'}
      </p>
      <Button onClick={handleNewPromotion}>
        <Plus className="mr-2 h-4 w-4" /> Criar Nova Promoção
      </Button>
    </CardContent>
  </Card>
)}
```

---

## 📱 Responsividade

Todos os componentes são totalmente responsivos:

- **Desktop**: Grid de 3 colunas para cards
- **Tablet**: Grid de 2 colunas
- **Mobile**:
  - Grid de 1 coluna
  - Formulário adaptado
  - Modal com scroll
  - Tabelas com scroll horizontal

---

## 🔐 Permissões e Autenticação

### Rotas Públicas
- `GET /api/promotions?isActive=true` - Ver promoções ativas
- `GET /api/promotions/slug/:slug` - Ver detalhes

### Rotas Administrativas
- `GET /api/promotions` (todas) - ADMIN, MANAGER
- `POST /api/promotions` - ADMIN, MANAGER
- `PUT /api/promotions/:id` - ADMIN, MANAGER
- `DELETE /api/promotions/:id` - ADMIN

---

## 🚀 Como Testar

### 1. Teste de Criação (Admin)

```bash
# 1. Acesse o painel admin
http://localhost:3000/admin/packages-promotions

# 2. Clique em "Criar Novo"

# 3. Preencha o formulário:
   Título: "Pacote Lua de Mel"
   Tipo: Pacote
   Descrição curta: "Experiência romântica inesquecível"
   Descrição completa: [texto longo]
   Data início: Hoje
   Data fim: +3 meses
   Preço original: 2000
   Preço promocional: 1500
   Imagem: [upload]
   Features: ["Jantar romântico", "Spa para casal", "Champagne"]
   Ativo: ✓
   Destaque: ✓

# 4. Clique em "Criar Promoção"

# 5. Verifique:
   - Toast de sucesso
   - Promoção aparece na tabela
   - Dados corretos exibidos
```

### 2. Teste de Edição (Admin)

```bash
# 1. Na tabela, clique no ícone de editar

# 2. Modifique alguns campos:
   - Altere o preço promocional para 1400
   - Adicione mais uma feature
   - Mude para "não destacado"

# 3. Salve

# 4. Verifique que as alterações foram aplicadas
```

### 3. Teste de Toggle (Admin)

```bash
# 1. Na coluna "Status", clique no switch de uma promoção ativa

# 2. Verifique:
   - Promoção fica inativa
   - Se estiver na aba "Ativos", desaparece da lista
   - Na aba "Todos", aparece como inativa

# 3. Vá para a aba "Todos"

# 4. Reative a promoção

# 5. Volte para "Ativos" - deve aparecer novamente
```

### 4. Teste Público

```bash
# 1. Acesse a página pública
http://localhost:3000/promocoes

# 2. Verifique que apenas promoções ATIVAS aparecem

# 3. Clique em "Ver detalhes" de uma promoção

# 4. Na página de detalhes, verifique:
   - Imagem hero
   - Breadcrumbs funcionais
   - Todas as informações exibidas
   - Features listadas
   - Preços corretos
   - Card lateral com resumo

# 5. Clique em "Ver todas as promoções"

# 6. Deve voltar para /promocoes
```

### 5. Teste via API (cURL)

```bash
# Criar promoção
curl -X POST http://localhost:5000/api/promotions \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Promoção de Verão",
    "shortDescription": "Aproveite o verão com desconto!",
    "longDescription": "Descrição completa aqui...",
    "startDate": "2026-03-01",
    "endDate": "2026-05-31",
    "originalPrice": 1000,
    "discountedPrice": 700,
    "type": "PROMOTION",
    "isActive": true,
    "isFeatured": true,
    "features": ["Piscina", "Café da manhã", "Welcome drink"]
  }'

# Listar promoções ativas
curl http://localhost:5000/api/promotions?isActive=true

# Atualizar promoção
curl -X PUT http://localhost:5000/api/promotions/PROMOTION_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# Deletar promoção
curl -X DELETE http://localhost:5000/api/promotions/PROMOTION_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## ✅ Checklist de Funcionalidades

### Backend
- [x] Modelo Prisma de Promotion e PromotionFeature
- [x] Controller com todos os endpoints (list, getById, getBySlug, create, update, delete)
- [x] Service com lógica completa
- [x] Rotas configuradas e protegidas
- [x] Geração automática de slug
- [x] Gerenciamento de features em cascade

### Frontend - Admin
- [x] Página de listagem com tabela
- [x] Abas: Ativos / Todos
- [x] Modal de criação/edição
- [x] Formulário completo com validação
- [x] Upload de imagem com crop
- [x] Gerenciamento de features dinâmico
- [x] Toggle ativo/inativo funcional
- [x] Toggle featured funcional
- [x] Deletar com confirmação
- [x] Estados de loading/erro/vazio
- [x] Integração 100% com API

### Frontend - Público
- [x] Página de listagem de promoções
- [x] Cards responsivos
- [x] Página de detalhes completa
- [x] Navegação por slug
- [x] Estados de loading/erro/vazio
- [x] Integração 100% com API

### UX/UI
- [x] Design responsivo
- [x] Loading states com spinners
- [x] Error states informativos
- [x] Empty states com call-to-action
- [x] Toasts de feedback
- [x] Confirmações para ações destrutivas

---

## 📊 Comparação Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Admin - Dados** | Mock (mockPromotions) | API real |
| **Público - Dados** | Mock (promotionsData) | API real |
| **Persistência** | ❌ Nenhuma | ✅ PostgreSQL |
| **CRUD** | ❌ Apenas local | ✅ API completa |
| **Sincronização** | ❌ Admin ≠ Público | ✅ Mesma fonte |
| **Slug** | ✅ Gerado no frontend | ✅ Gerado no backend |
| **Features** | Array de strings | Tabela relacional |
| **Upload Imagem** | ✅ Funciona | ✅ Funciona |
| **Estados** | ⚠️ Parcial | ✅ Completo |
| **Filtros** | ❌ Não funcionavam | ✅ Funcionais |

---

## 🔍 Detalhes Técnicos

### Geração de Slug

O slug é gerado automaticamente no backend a partir do título:

```typescript
const slug = generateSlug(data.title);
// "Pacote Lua de Mel" → "pacote-lua-de-mel"
```

**Benefícios:**
- URLs amigáveis e SEO-friendly
- Único no banco (constraint)
- Atualizado automaticamente se título mudar

### Gerenciamento de Features

Features são armazenadas em tabela separada com ordem:

```typescript
features: {
  create: features.map((feature: string, index: number) => ({
    feature,
    order: index
  }))
}
```

**Na atualização:**
1. Deleta todas as features antigas
2. Cria novas com a ordem correta
3. Cascade delete automático

### Upload de Imagem

Usa componente `ImageCropUpload`:
- Aspect ratio 3:2 (600×400px)
- Crop antes do upload
- Preview em tempo real
- Armazena URL no campo `image`

---

## 📝 Notas Importantes

### Tipos de Promoção
- **PACKAGE**: Pacote completo com múltiplos serviços
- **PROMOTION**: Desconto ou oferta especial

### Campos Opcionais
- `image` - Se não fornecido, usa imagem padrão
- `originalPrice` - Pode ter apenas preço promocional
- `termsAndConditions` - Opcional
- `maxRedemptions` - Se não definido, sem limite
- `promotionCode` - Para cupons especiais

### Filtros Disponíveis
- `isActive` - true/false (público usa true)
- `type` - PACKAGE/PROMOTION
- `isFeatured` - true/false

### Ordenação
Por padrão, ordena por `startDate` decrescente (mais recentes primeiro)

---

## 🔄 Próximas Melhorias (Opcional)

- [ ] Sistema de cupons de desconto
- [ ] Integração com reservas (aplicar promoção)
- [ ] Estatísticas de redemptions
- [ ] Promoções agendadas (publicação futura)
- [ ] Notificações quando promoção está próxima do fim
- [ ] Histórico de alterações
- [ ] Exportação de relatórios
- [ ] Preview antes de publicar

---

## 👥 Autores e Contato

**Desenvolvido por**: Claude Sonnet 4.5
**Data**: 2026-02-07
**Projeto**: FuseHotel - Sistema Completo de Gerenciamento Hoteleiro

---

## 📚 Documentação Relacionada

- [ACCOMMODATIONS_INTEGRATION.md](./ACCOMMODATIONS_INTEGRATION.md) - Sistema de Acomodações
- [RESERVATIONS_INTEGRATION.md](./RESERVATIONS_INTEGRATION.md) - Sistema de Reservas
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Configuração Docker
- [QUICK_START.md](./QUICK_START.md) - Guia de Início Rápido

---

**Fim da Documentação**
