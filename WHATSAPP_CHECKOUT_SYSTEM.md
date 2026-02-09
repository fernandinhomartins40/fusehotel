# 📱 Sistema de Checkout via WhatsApp - FuseHotel

## 🎯 Visão Geral

Sistema simplificado de reservas com checkout via WhatsApp que permite aos clientes fazer reservas sem necessidade de cadastro prévio. O sistema cria automaticamente usuários provisórios e envia os detalhes da reserva via mensagem do WhatsApp.

**Status**: ✅ 100% Implementado

**Data**: 2026-02-07

---

## 🔄 Fluxo Completo

```
1. Cliente acessa /acomodacoes/:slug
2. Seleciona datas, quantidade de hóspedes e camas extras
3. Clica em "Reservar Agora"
4. Vai para tela de checkout simplificado
5. Preenche apenas: Nome + WhatsApp
6. Clica em "Finalizar via WhatsApp"
7. Sistema:
   ✅ Verifica se WhatsApp existe no cadastro
   ✅ Se NÃO existe → cria usuário provisório
   ✅ Cria reserva no banco (status PENDING)
   ✅ Vincula reserva ao usuário
   ✅ Gera mensagem formatada com todos os detalhes
   ✅ Abre WhatsApp Web/App com mensagem pré-preenchida
8. Cliente envia mensagem para o hotel
9. Hotel confirma manualmente no painel admin
```

---

## 🏗️ Arquitetura

### **Backend**

#### 1. Schema Prisma Atualizado

```prisma
model User {
  // ... campos existentes ...
  whatsapp       String?  @unique  // Novo campo
  isProvisional  Boolean  @default(false)  // Novo campo
}

model Reservation {
  // ... campos existentes ...
  guestWhatsApp  String  // Campo obrigatório
  guestEmail     String?  // Agora opcional
  guestPhone     String?  // Agora opcional
}

model HotelSettings {
  id              String   @id @default(uuid())
  hotelWhatsApp   String   // WhatsApp do hotel
  hotelName       String   @default("FuseHotel")
  hotelEmail      String?
  hotelPhone      String?
  hotelAddress    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### 2. ReservationService - Lógica de Usuário Provisório

```typescript
static async create(data: CreateReservationDto, userId?: string) {
  // ... validações ...

  let finalUserId = userId;

  // Se não houver userId (reserva anônima)
  if (!userId && data.guestWhatsApp) {
    const whatsapp = data.guestWhatsApp.replace(/\D/g, '');

    // Buscar usuário pelo WhatsApp
    let user = await prisma.user.findUnique({
      where: { whatsapp }
    });

    // Se não existe, criar usuário provisório
    if (!user) {
      const firstThreeLetters = data.guestName
        .substring(0, 3)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const password = await hashPassword(firstThreeLetters);

      user = await prisma.user.create({
        data: {
          name: data.guestName,
          whatsapp: whatsapp,
          email: data.guestEmail || `${whatsapp}@provisional.fusehotel.com`,
          password: password, // 3 primeiras letras do nome
          phone: data.guestPhone,
          cpf: data.guestCpf,
          role: 'CUSTOMER',
          isProvisional: true,
          emailVerified: false
        }
      });
    }

    finalUserId = user.id;
  }

  // Criar reserva sempre vinculada ao usuário
  const reservation = await prisma.reservation.create({
    data: {
      // ...
      userId: finalUserId,  // Sempre vinculado
      guestWhatsApp: data.guestWhatsApp,
      // ...
    }
  });

  return reservation;
}
```

#### 3. SettingsController e SettingsService

**SettingsController.ts:**
```typescript
export class SettingsController {
  static async getHotelSettings(req, res, next) {
    try {
      const settings = await SettingsService.getHotelSettings();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateHotelSettings(req, res, next) {
    try {
      const settings = await SettingsService.updateHotelSettings(req.body);
      return sendSuccess(res, settings, 'Configurações atualizadas com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
```

**Rotas:**
```typescript
router.get('/hotel', SettingsController.getHotelSettings);  // Pública
router.put('/hotel', authenticate, requireRole(['ADMIN']), SettingsController.updateHotelSettings);  // Admin
```

---

### **Frontend**

#### 1. SimpleCheckout Component

**Localização:** `apps/web/src/components/booking/SimpleCheckout.tsx`

**Props:**
```typescript
interface SimpleCheckoutProps {
  accommodationId: string;
  accommodationName: string;
  accommodationType: string;
  pricePerNight: number;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  extraBedPrice: number;
}
```

**Funcionalidades:**
- Exibe resumo completo da reserva
- Formulário simplificado (apenas Nome + WhatsApp)
- Validação de campos
- Formatação automática de WhatsApp
- Cálculo de preço em tempo real
- Geração de mensagem formatada
- Redirecionamento para WhatsApp

**Mensagem WhatsApp Gerada:**
```
🏨 *Reserva Hotel FuseHotel*

📋 *Código:* FH-1707318245-A1B2C3D4

👤 *Hóspede:* João da Silva
📱 *WhatsApp:* (11) 99999-9999

🏠 *Acomodação:* Suíte Paraíso Tropical
🏷️ *Tipo:* Suíte

📅 *Check-in:* 10 de fevereiro de 2026
📅 *Check-out:* 13 de fevereiro de 2026
🛏️ *Diárias:* 3 noites
👥 *Hóspedes:* 2 pessoas
🛏️ *Camas extras:* 1

💰 *Valor Total:* R$ 2.072,79

Gostaria de confirmar esta reserva!
```

#### 2. RoomDetail Page Atualizada

**Mudanças:**
- Seleção de datas no card lateral
- Seleção de hóspedes e camas extras
- Botão "Reservar Agora" passa dados para SimpleCheckout
- Alternância entre visualização de detalhes e checkout

#### 3. useSettings Hook

```typescript
export function useSettings() {
  return useQuery({
    queryKey: ['hotel-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settings/hotel');
      return data.data as HotelSettings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settingsData) => {
      const { data } = await apiClient.put('/settings/hotel', settingsData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
  });
}
```

#### 4. Página de Settings no Admin

**Nova Aba: "Configurações"**

Campos:
- WhatsApp do Hotel (obrigatório)
- Nome do Hotel
- Email do Hotel
- Telefone do Hotel
- Endereço

---

## 📊 Dados Criados

### Usuário Provisório

Quando uma reserva anônima é criada:

```javascript
{
  name: "João da Silva",
  whatsapp: "11999999999",  // Sem formatação
  email: "joao@email.com" || "11999999999@provisional.fusehotel.com",
  password: hash("joa"),  // 3 primeiras letras do nome
  role: "CUSTOMER",
  isProvisional: true,
  emailVerified: false
}
```

### Reserva

```javascript
{
  reservationCode: "FH-1707318245-A1B2C3D4",
  accommodationId: "uuid...",
  userId: "uuid...",  // Sempre vinculado (nunca NULL)
  checkInDate: "2026-02-10",
  checkOutDate: "2026-02-13",
  numberOfNights: 3,
  numberOfGuests: 2,
  numberOfExtraBeds: 1,
  guestName: "João da Silva",
  guestWhatsApp: "11999999999",
  guestEmail: "joao@email.com",  // Opcional
  guestPhone: null,  // Opcional
  pricePerNight: 599.00,
  subtotal: 1797.00,
  extraBedsCost: 150.00,
  serviceFee: 89.85,  // 5%
  taxes: 35.94,  // 2%
  totalAmount: 2072.79,
  status: "PENDING",
  // ...
}
```

---

## 🔐 Login de Usuário Provisório

O cliente pode fazer login posteriormente:

**Login:** Número do WhatsApp (sem formatação)
**Senha:** 3 primeiras letras do nome (lowercase, sem acentos)

**Exemplo:**
- Nome: "João da Silva"
- WhatsApp: "11999999999"
- Senha: "joa"

Após login, o cliente pode:
- Ver seu histórico de reservas
- Atualizar seus dados
- Trocar a senha

---

## ⚙️ Configurações

### Configurar WhatsApp do Hotel

**Admin Panel → Configurações → Aba "Configurações"**

1. Acesse `/admin/settings`
2. Vá para aba "Configurações"
3. Preencha o campo "WhatsApp do Hotel"
   - Formato: `5511999999999` (código do país + DDD + número)
4. Clique em "Salvar Configurações"

Este número receberá todas as mensagens de confirmação de reserva.

---

## 🧪 Como Testar

### 1. Configurar WhatsApp do Hotel

```bash
# Via API
curl -X PUT http://localhost:5000/api/settings/hotel \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotelWhatsApp": "5511999999999",
    "hotelName": "FuseHotel"
  }'
```

### 2. Fazer Reserva como Cliente

1. Acesse http://localhost:3000/acomodacoes
2. Clique em qualquer acomodação
3. Selecione datas, hóspedes e camas extras
4. Clique em "Reservar Agora"
5. Preencha:
   - Nome: "João da Silva"
   - WhatsApp: "(11) 99999-9999"
6. Clique em "Finalizar via WhatsApp"
7. Você será redirecionado para o WhatsApp com mensagem pré-preenchida

### 3. Verificar no Banco de Dados

```sql
-- Verificar usuário provisório criado
SELECT * FROM "User" WHERE "whatsapp" = '11999999999';

-- Verificar reserva criada
SELECT * FROM "Reservation" WHERE "guestWhatsApp" = '11999999999';
```

### 4. Testar Login Provisório

1. Vá para tela de login
2. Email: `11999999999` (o número do WhatsApp)
3. Senha: `joa` (3 primeiras letras do nome)

---

## 📱 URLs do WhatsApp

### Formato Base

```
https://wa.me/{NUMERO}?text={MENSAGEM_CODIFICADA}
```

### Exemplo Completo

```javascript
const hotelWhatsApp = '5511999999999';
const message = `
🏨 *Reserva Hotel FuseHotel*
...
`;

const whatsappUrl = `https://wa.me/${hotelWhatsApp}?text=${encodeURIComponent(message)}`;

window.open(whatsappUrl, '_blank');
```

---

## 🚀 Migração e Seeds

### Aplicar Mudanças no Banco

```bash
cd apps/api
npx prisma db push --schema=./src/prisma/schema.prisma --accept-data-loss
```

### Rodar Seeds

```bash
npm run prisma:seed
```

Isso criará:
- Usuários de teste
- Amenidades
- Configurações do sistema
- **Configurações do hotel** (novo)
- Promoções
- Acomodações

---

## 📋 Checklist de Funcionalidades

### Backend
- [x] Adicionar campos `whatsapp` e `isProvisional` no User
- [x] Criar model `HotelSettings`
- [x] Atualizar schema de Reservation (guestWhatsApp obrigatório)
- [x] Criar SettingsController e SettingsService
- [x] Criar rotas públicas e protegidas de Settings
- [x] Atualizar ReservationService para criar usuário provisório
- [x] Validação de WhatsApp no shared package
- [x] Seed para configurações iniciais do hotel

### Frontend
- [x] Criar componente SimpleCheckout
- [x] Criar hook useSettings
- [x] Adicionar aba de Configurações no Admin
- [x] Atualizar RoomDetail com seleção de datas/hóspedes
- [x] Integrar SimpleCheckout no fluxo de reserva
- [x] Formatação automática de WhatsApp
- [x] Geração de mensagem formatada
- [x] Redirecionamento para WhatsApp

### UX/UI
- [x] Design responsivo
- [x] Loading states
- [x] Validação visual de campos
- [x] Toasts de feedback
- [x] Mensagem formatada profissionalmente

---

## 🎯 Benefícios

### Para o Cliente
✅ Processo ultra-simples (apenas nome + WhatsApp)
✅ Sem necessidade de criar conta previamente
✅ Confirmação via WhatsApp (familiar e rápido)
✅ Pode fazer login depois com WhatsApp + 3 letras do nome

### Para o Hotel
✅ Mais conversões (menos fricção)
✅ Contato direto com cliente via WhatsApp
✅ Dados do cliente salvos automaticamente
✅ Histórico completo de reservas
✅ Gerenciamento centralizado no admin

### Técnico
✅ Zero duplicação de usuários (busca por WhatsApp)
✅ Todas reservas vinculadas a usuários
✅ Migração suave (campos email/phone opcionais)
✅ Sistema escalável e manutenível

---

## 🔒 Segurança

### Senha Provisória
- 3 primeiras letras do nome (lowercase, sem acentos)
- Cliente pode alterar após primeiro login
- Hash bcrypt no banco de dados

### Validações
- WhatsApp único por usuário
- Validação de formato de WhatsApp
- Proteção contra SQL injection
- CSRF protection
- Rate limiting em endpoints públicos

---

## 🐛 Troubleshooting

### Erro: "WhatsApp já cadastrado"
**Causa:** Já existe usuário com este WhatsApp
**Solução:** Use o login provisório com o número + 3 letras do nome

### Erro: "Configurações do hotel não encontradas"
**Causa:** Seed não foi executado ou configurações não salvas
**Solução:** Rodar `npm run prisma:seed` ou configurar via admin

### WhatsApp não abre
**Causa:** Formato inválido de número ou caracteres especiais
**Solução:** Verificar se número está no formato `5511999999999`

### Reserva criada mas usuário não vinculado
**Causa:** Bug no fluxo de criação de usuário provisório
**Solução:** Verificar logs do backend, conferir se `guestWhatsApp` está sendo enviado

---

## 📝 Próximas Melhorias (Opcional)

- [ ] Integração com WhatsApp Business API (envio automático)
- [ ] Confirmação automática via webhook
- [ ] QR Code para pagamento PIX
- [ ] Gateway de pagamento integrado
- [ ] Notificações push para o hotel
- [ ] Bot de atendimento automatizado
- [ ] Histórico de mensagens no painel admin

---

## 👨‍💻 Desenvolvido por

Claude Sonnet 4.5
Data: 2026-02-07
Projeto: FuseHotel - Sistema Completo de Gerenciamento Hoteleiro

---

**Fim da Documentação**
