# Plano de Implementacao - FuseHotel

Plano em fases para corrigir bugs, unificar canais e implementar o fluxo centrado no hospede.
Cada fase e independente e entrega valor real. Nenhuma fase quebra o que ja funciona.

Referencia: `docs/analise-canais-e-modulos.md` e `docs/proposta-fluxo-unificado.md`

---

## Fase 0 - Correcao de bugs (pre-requisito) -- CONCLUIDA

Corrigir o que esta errado ANTES de qualquer melhoria. Nenhuma alteracao de UX, apenas backend.

### 0.1 Walk-in deve criar FinancialEntry -- CONCLUIDO

**Problema**: `FrontdeskService.walkIn()` cria reserva + stay + folio mas nao cria `FinancialEntry` (contas a receber). Toda reserva criada pelo `ReservationService.create()` gera essa entrada. Walk-in pula. Relatorios financeiros ficam incompletos.

**Arquivo**: `apps/api/src/services/frontdesk.service.ts` - metodo `walkIn()`

**O que foi feito**:
- Adicionado criacao de `financialEntry` dentro da transaction do walkIn, apos `seedFromReservation` e antes do `roomUnit.update`
- Usa `tx as any` para acessar o model (mesmo padrao do ReservationService)
- Dados identicos ao que ReservationService gera: type RECEIVABLE, status OPEN, category Hospedagem, referenceType RESERVATION, com dueDate = checkOutDate

**Validacao**: Criar um walk-in e verificar que aparece em `GET /api/finance/entries`. Comparar com uma reserva feita pelo admin e confirmar que ambas geram FinancialEntry.

---

### 0.2 Incrementar currentRedemptions ao usar promocao -- CONCLUIDO

**Problema**: `ReservationService.create()` valida a promocao e aplica desconto, mas nunca incrementa `currentRedemptions`. O campo `maxRedemptions` existe mas o controle e inutil.

**Arquivo**: `apps/api/src/services/reservations.service.ts` - metodo `create()`

**O que foi feito**:
- Envolvido a criacao da reservation + financialEntry + promotion update em uma `prisma.$transaction()` para garantir atomicidade
- Apos criar a financialEntry, se `promotion` existe, faz `tx.promotion.update({ data: { currentRedemptions: { increment: 1 } } })`
- Bonus: a criacao da reservation e da financialEntry agora sao atomicas (antes eram operacoes separadas que podiam falhar parcialmente)

**Validacao**: Criar promocao com maxRedemptions=2. Fazer 2 reservas com ela (deve funcionar). Fazer uma 3a (deve rejeitar).

---

### 0.3 Validacao de capacidade no backend -- CONCLUIDO

**Problema**: Numero de hospedes e validado no frontend (max={accommodation.capacity}) mas o backend nao valida. Uma chamada direta a API pode criar reserva com 10 hospedes em quarto de 2.

**Arquivo**: `apps/api/src/services/reservations.service.ts` - metodo `create()`

**O que foi feito**:
- Adicionadas 2 validacoes apos `checkAvailability` e antes de `resolvePromotionForReservation`:
  1. `numberOfGuests > capacity + extraBeds` -> erro "Numero de hospedes excede a capacidade da acomodacao"
  2. `numberOfExtraBeds > maxExtraBeds` -> erro "Numero de camas extras excede o maximo permitido"

**Validacao**: Tentar criar reserva pela API com numberOfGuests maior que capacity. Deve retornar erro 400.

---

### Checklist Fase 0
- [x] 0.1 - FinancialEntry no walk-in
- [x] 0.2 - Incrementar currentRedemptions
- [x] 0.3 - Validacao de capacidade no backend
- [ ] Testes manuais de cada correcao
- [x] Nenhuma tela do frontend muda

---

## Fase 1 - Funcao unica de pricing -- CONCLUIDA

Eliminar a duplicacao de calculo de preco que existe em 3 lugares independentes.

### 1.1 Criar pricing.service.ts -- CONCLUIDO

**Problema**: A formula `subtotal + extraBeds + 5% servico + 2% impostos - desconto` esta copiada em:
- `reservations.service.ts` (backend, site + admin)
- `frontdesk.service.ts` (backend, walk-in)
- `CreateReservationDialog.tsx` (frontend, preview)

Se mudar qualquer taxa, tem que lembrar de mudar em 3 arquivos.

**Arquivo novo**: `apps/api/src/services/pricing.service.ts`

**O que fazer**:
```typescript
// pricing.service.ts

interface PricingInput {
  accommodationId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfExtraBeds: number;
  promotionId?: string;
  promotionCode?: string;
}

interface PricingBreakdown {
  pricePerNight: number;    // fonte: RatePlan ou Accommodation.pricePerNight
  numberOfNights: number;
  subtotal: number;         // pricePerNight * nights
  extraBedsCost: number;    // extraBedPrice * beds * nights
  serviceFeeRate: number;   // 0.05
  serviceFee: number;       // subtotal * rate
  taxRate: number;          // 0.02
  taxes: number;            // subtotal * rate
  discount: number;         // valor da promocao
  promotionId?: string;
  totalAmount: number;      // subtotal + extras + fee + taxes - discount
}

export class PricingService {
  static async calculate(input: PricingInput, tx?: TransactionClient): Promise<PricingBreakdown> {
    // 1. Busca accommodation
    // 2. Busca RatePlan ativo para o periodo (se existir, usa basePrice; senao, pricePerNight)
    // 3. Calcula noites, subtotal, extras
    // 4. Se tem promotionId/promotionCode, resolve e calcula desconto
    // 5. Aplica taxas fixas (5% servico, 2% impostos)
    // 6. Retorna breakdown completo
  }
}
```

**Regra de preco (prioridade)**:
1. RatePlan ativo para a acomodacao no periodo -> usa `basePrice`
2. Senao -> usa `Accommodation.pricePerNight`

Isso ativa o RatePlan que hoje existe mas ninguem usa.

---

### 1.2 Substituir calculo no ReservationService -- CONCLUIDO

**Arquivo**: `apps/api/src/services/reservations.service.ts`

**O que fazer**:
- Remover calculo manual de subtotal/serviceFee/taxes/discount
- Chamar `PricingService.calculate()` passando os dados da reserva
- Usar o `PricingBreakdown` retornado para preencher os campos da reservation
- NOTA: O `create()` agora ja usa `prisma.$transaction()` (feito na Fase 0.2), entao `PricingService.calculate()` pode receber o `tx` diretamente

---

### 1.3 Substituir calculo no FrontdeskService.walkIn -- CONCLUIDO

**Arquivo**: `apps/api/src/services/frontdesk.service.ts`

**O que fazer**:
- Remover calculo manual (linhas 359-362)
- Chamar `PricingService.calculate()` com os dados do walk-in
- Usar breakdown para preencher a reservation

---

### 1.4 Criar endpoint de preview de pricing -- CONCLUIDO

**Rota nova**: `POST /api/pricing/preview`

**O que fazer**:
- Endpoint publico (usado pelo site e pelo admin)
- Recebe: accommodationId, checkIn, checkOut, extraBeds, promotionId?
- Retorna: PricingBreakdown completo
- Frontend (SimpleCheckout e CreateReservationDialog) chama esse endpoint em vez de calcular localmente

---

### 1.5 Substituir calculo no CreateReservationDialog -- CONCLUIDO

**Arquivo**: `apps/web/src/components/admin/reservations/CreateReservationDialog.tsx`

**O que fazer**:
- Remover calculo local (linhas 117-127)
- Criar hook `usePricingPreview(accommodationId, checkIn, checkOut, extraBeds, promotionId)`
- Chamar `POST /api/pricing/preview`
- Renderizar o breakdown retornado pelo backend

**Mesmo para SimpleCheckout**: substituir calculo local por chamada ao endpoint.

---

### Checklist Fase 1
- [x] 1.1 - Criar PricingService com calculate()
- [x] 1.2 - ReservationService usa PricingService
- [x] 1.3 - FrontdeskService.walkIn usa PricingService
- [x] 1.4 - Endpoint POST /api/pricing/preview
- [x] 1.5 - Frontend usa endpoint de preview (CreateReservationDialog + SimpleCheckout)
- [ ] Testar: reserva pelo site, pelo admin e walk-in devem gerar mesmos valores para mesmos inputs
- [ ] Testar: RatePlan ativo deve sobrescrever pricePerNight

---

## Fase 2 - Equivalencia de canais -- CONCLUIDA

Garantir que os 3 canais de venda produzam o mesmo resultado.

### 2.1 Promocao no admin -- CONCLUIDO

**Problema**: CreateReservationDialog nao tem campo de promocao.

**Arquivos**:
- `apps/web/src/components/admin/reservations/CreateReservationDialog.tsx`
- O payload ja e enviado para `ReservationService.create()` que ja suporta promotionId

**O que fazer**:
- Adicionar campo opcional no formulario: combobox com promocoes ativas (`usePromotions({ isActive: true })`)
- Ao selecionar promocao, recarregar o preview de pricing com promotionId
- Passar promotionId no payload de criacao

---

### 2.2 Promocao no walk-in -- CONCLUIDO

**Problema**: `FrontdeskService.walkIn()` nao aceita promotionId e nao aplica desconto.

**Arquivos**:
- `apps/api/src/services/frontdesk.service.ts`
- `apps/api/src/types/pms.ts` (WalkInCheckInDto)

**O que fazer**:
- Adicionar `promotionId?: string` ao `WalkInCheckInDto`
- No `walkIn()`, usar `PricingService.calculate()` (ja feito na Fase 1) passando promotionId
- O PricingService ja resolve a promocao e calcula o desconto
- No frontend do walk-in, adicionar campo opcional de promocao

---

### 2.3 Walk-in usar ReservationService para criar reserva

**Problema**: Walk-in cria a reservation manualmente dentro do `FrontdeskService.walkIn()`, duplicando logica. A Fase 0.1 corrigiu a FinancialEntry e a Fase 0.2 adicionou a transaction no ReservationService, mas a causa raiz e a duplicacao de logica entre os dois services.

**O que fazer**:
- Extrair a criacao da reservation no walk-in para usar `ReservationService.create()` internamente
- Ou: criar um metodo compartilhado `ReservationService.createInternal()` que ambos usam
- Isso garante que qualquer logica futura adicionada ao create (validacoes, webhooks, etc) vale para walk-in tambem
- A unica diferenca: walk-in passa `source: 'WALK_IN'` e `status: 'CHECKED_IN'`

**Cuidado**: A transaction do walk-in precisa criar reservation + stay + folio atomicamente. O metodo interno deve aceitar um `tx` (transaction client) como parametro.

---

### 2.4 Disponibilidade real no Schedule -- CONCLUIDO

**Problema**: `ScheduleService.checkAvailability()` conta reservas e InventoryBlocks mas ignora estado fisico dos quartos. Site pode mostrar "disponivel" quando todos os quartos estao sujos ou em manutencao.

**Arquivo**: `apps/api/src/services/schedule.service.ts`

**O que fazer**:
- No `checkAvailability()`, apos calcular `availableUnits`, descontar tambem quartos que estao em status impeditivo:
```typescript
const unavailableRooms = await tx.roomUnit.count({
  where: {
    accommodationId,
    isActive: true,
    OR: [
      { status: { in: ['OUT_OF_ORDER', 'OUT_OF_SERVICE', 'BLOCKED'] } },
    ],
  },
});

const effectiveAvailable = availableUnits - unavailableRooms;
return overlappingReservations < Math.max(effectiveAvailable, 0);
```

**Nota**: NAO descontar quartos DIRTY/CLEANING. Esses sao estados temporarios que se resolvem antes do check-in. Descontar apenas OUT_OF_ORDER, OUT_OF_SERVICE e BLOCKED que sao indisponibilidades reais.

---

### 2.5 Manutencao cria InventoryBlock automaticamente -- CONCLUIDO

**Problema**: Marcar quarto OUT_OF_ORDER nao cria InventoryBlock. Schedule nao sabe que tem quarto indisponivel.

**Arquivo**: `apps/api/src/services/maintenance.service.ts`

**O que fazer**:
- Ao criar MaintenanceOrder com `markRoomOutOfOrder=true`:
  1. Marcar RoomUnit como OUT_OF_ORDER (ja faz)
  2. Criar InventoryBlock para o roomUnit com stopSell=true e titulo referenciando a ordem
- Ao completar MaintenanceOrder:
  1. Retornar RoomUnit ao status anterior (ja faz)
  2. Deletar/desativar o InventoryBlock criado

---

### Checklist Fase 2
- [x] 2.1 - Campo de promocao no CreateReservationDialog
- [x] 2.2 - promotionId no walk-in (DTO + service + frontend)
- [ ] 2.3 - Walk-in usa ReservationService internamente (adiado - baixa prioridade, logica ja esta correta)
- [x] 2.4 - checkAvailability considera quartos OUT_OF_ORDER
- [x] 2.5 - Manutencao cria/remove InventoryBlock
- [ ] Testar: mesma promocao funciona pelo site, admin e walk-in
- [ ] Testar: quarto em manutencao reduz disponibilidade no site
- [ ] Testar: ao concluir manutencao, disponibilidade volta

---

## Fase 3 - Tela central de hospedagens -- CONCLUIDA

Primeira mudanca visivel para o operador. Substituir a tela de Frontdesk por uma lista centrada no hospede.

### 3.1 Endpoint GET /api/frontdesk/stays (melhorar o existente) -- CONCLUIDO

**Situacao atual**: `FrontdeskService.getDashboard()` ja retorna arrivals, inHouse e departures.

**O que foi feito**:
- Enriquecido as 3 queries (arrivals, inHouse, departures) com dados do hospede via `reservation.user`
- inHouse e departures agora incluem: guestEmail, guestPhone, guestWhatsApp, guestCpf, numberOfNights, totalAmount, accommodation (name), user (name, email, whatsapp, phone, cpf), folio.id e folio.isClosed
- arrivals agora incluem user select com mesmos campos

---

### 3.2 Componente StaysList -- CONCLUIDO

**Arquivo novo**: `apps/web/src/components/admin/frontdesk/StaysList.tsx`

**O que foi feito**:
- Filtros por aba: [Todos] [Em casa] [Chegadas] [Saidas] com contagens
- Barra de busca por nome, reserva ou quarto
- 3 tabelas separadas para chegadas, hospedados e saidas
- Chegadas: hospede, reserva, acomodacao, periodo, badge "Aguardando check-in"
- Hospedados: hospede (nome + codigo), quarto, noites (atual/total), saida prevista, saldo com badge colorido
- Saidas: hospede, quarto, reserva, saldo
- Linhas de saida destacadas em amarelo na lista de hospedados
- Click handlers separados: onSelectStay (stays) e onSelectArrival (reservations)

---

### 3.3 Componente GuestSheet (drawer lateral) -- CONCLUIDO

**Arquivo novo**: `apps/web/src/components/admin/frontdesk/GuestSheet.tsx`

**O que foi feito**:
- Header: nome do hospede, codigo da reserva, quarto
- Contato: email, telefone/whatsapp, CPF (com icones)
- Info: acomodacao, datas formatadas pt-BR
- Metricas: noite atual/total, saldo com cor (verde/vermelho)
- Aba Conta: resumo debitos/creditos, lista de FolioEntries com tipo traduzido e valor colorido
- Aba Acoes: formulario de lancamento (Pagamento/Consumo/Ajuste) com descricao auto-preenchida, botao check-out, aviso de saldo pendente
- Pagamentos registrados como valor negativo (-Math.abs)
- Usa hooks: useFolio, useAddFolioEntry, useCheckOut

---

### 3.4 Substituir rota /admin/frontdesk -- CONCLUIDO

**Arquivo**: `apps/web/src/pages/admin/Frontdesk.tsx`

**O que foi feito**:
- Reescrita completa da pagina usando StaysList + GuestSheet
- Mantidos: metricas no topo (cards de resumo), dialog de walk-in, dialog de check-in para chegadas
- Removidos: layout antigo baseado em tabs (Chegadas/Em casa/Quartos), Dialog de folio por linha, botao checkout por linha
- Titulo alterado de "Recepcao" para "Hospedagens"
- Click em stay abre GuestSheet (drawer lateral)
- Click em arrival abre dialog dedicado de check-in

---

### Checklist Fase 3
- [x] 3.1 - Melhorar endpoint de stays com dados do hospede
- [x] 3.2 - StaysList com filtros e tabela
- [x] 3.3 - GuestSheet com abas Conta e Acoes
- [x] 3.4 - Substituir pagina Frontdesk
- [ ] Testar: operador ve lista de hospedes com saldo e datas
- [ ] Testar: clicar em hospede abre drawer com conta e acoes
- [ ] Testar: check-out funciona pelo drawer

---

## Fase 4 - Consumo direto na ficha do hospede -- CONCLUIDA

Permitir lancar consumo do hospede sem passar pelo POS.

### 4.1 Endpoint POST /api/folios/:folioId/consume -- CONCLUIDO

**Arquivo**: `apps/api/src/services/folios.service.ts`

**O que foi feito**:
- Criado metodo `consumeProduct(folioId, data: ConsumeProductDto)` no FoliosService
- Fluxo transacional: valida folio (nao fechado) -> busca POSProduct (ativo) -> calcula total (price * quantity) -> ajusta estoque se trackStock=true (com InventoryMovement) -> cria FolioEntry tipo POS -> recalcula balance
- Descricao automatica: nome do produto (com "xN" se quantity > 1)
- referenceId aponta para o productId para rastreabilidade
- Rota: `POST /api/folios/:folioId/consume` com validacao Zod (productId UUID + quantity int positivo)

**Diferenca do POS modo FOLIO**: nao cria POSOrder, nao passa por estados, nao precisa de sessao de caixa. Lancamento direto.

---

### 4.2 Aba Consumo no GuestSheet -- CONCLUIDO

**Arquivo novo**: `apps/web/src/components/admin/frontdesk/ConsumeTab.tsx`

**O que foi feito**:
- Busca de produto por texto (nome, SKU, descricao)
- Filtro por categoria com abas (Alimentos, Bebidas, Servicos, Conveniencia, Outros)
- Contagem de produtos por categoria nas abas
- Lista de produtos ativos com preco, badge de categoria, alerta de estoque baixo
- Botao [+] por produto que lanca direto no folio via `useConsumeProduct` hook
- Feedback via toast "Consumo registrado com sucesso"
- ScrollArea para lista grande de produtos

---

### 4.3 POS modo FOLIO continua funcionando

**Nenhuma alteracao no POS**. O modo FOLIO do POS continua disponivel para pedidos complexos (restaurante com cozinha que precisa dos estados PREPARING->DELIVERED). O consumo direto e uma alternativa rapida, nao uma substituicao.

---

### Checklist Fase 4
- [x] 4.1 - Endpoint de consumo direto
- [x] 4.2 - Aba Consumo no GuestSheet
- [x] 4.3 - POS modo FOLIO nao alterado (continua funcionando)
- [ ] Testar: lancar produto pela ficha do hospede atualiza folio
- [ ] Testar: saldo do hospede atualiza em tempo real na StaysList

---

## Fase 5 - Mapa de quartos -- CONCLUIDA

Visao visual complementar a lista de hospedagens.

### 5.1 Endpoint GET /api/frontdesk/room-map -- CONCLUIDO

**Arquivo**: `apps/api/src/services/frontdesk.service.ts`

**O que foi feito**:
- Criado metodo `getRoomMap()` no FrontdeskService
- 5 queries paralelas: roomUnits (ativos, ordenados por floor+code), activeStays (IN_HOUSE com reservation+folio), pendingTasks (housekeeping PENDING/IN_PROGRESS), openMaintenance (OPEN/IN_PROGRESS), todayArrivals (CONFIRMED sem stay)
- Monta mapa indexado por roomUnitId para cruzar stays, tasks e maintenance com cada quarto
- Retorna array `rooms` com dados completos (guest, housekeepingTasks, maintenanceOrders, todayArrivals) e array `floors` para agrupamento
- Rota registrada em `GET /frontdesk/room-map` com autenticacao ADMIN/MANAGER

---

### 5.2 Componente RoomMap -- CONCLUIDO

**Arquivo novo**: `apps/web/src/components/admin/frontdesk/RoomMap.tsx`

**O que foi feito**:
- Grid visual: cards por quarto, agrupados por andar (Terreo, 1o Andar, etc)
- Cores por status: emerald (disponivel), sky (ocupado), amber (sujo), yellow (limpando), teal (inspecionado), red (fora de ordem), gray (bloqueado)
- Icones por status (CheckCircle2, BedDouble, Droplets, Sparkles, ClipboardList, ShieldAlert)
- Quarto ocupado mostra: nome do hospede, noite atual/total, saldo do folio (colorido)
- Quarto sujo mostra badge de status da tarefa (Pendente/Limpando)
- Quarto bloqueado mostra titulo da ordem de manutencao
- Quarto disponivel com chegada mostra badge "Chegada hoje"
- Tooltip com detalhes completos ao passar o mouse
- Filtros por status: Todos, Disponiveis, Ocupados, Sujos, Manutencao (com contagens)
- Click em quarto ocupado -> abre GuestSheet do hospede (via onSelectStay)
- Click em quarto sujo -> DirtyRoomDialog com botoes "Iniciar limpeza" / "Concluir" / "Inspecionar e liberar"
- Click em quarto disponivel -> AvailableRoomDialog com lista de chegadas do dia para check-in direto + opcao de registrar manutencao
- Dialog de manutencao: titulo, prioridade, descricao, botao "Criar e bloquear quarto" (usa useCreateMaintenanceOrder com markRoomOutOfOrder=true)

---

### 5.3 Integrar como aba na tela de Hospedagens -- CONCLUIDO

**O que foi feito**:
- Adicionadas abas [Hospedes] [Quartos] na pagina /admin/frontdesk usando Tabs do shadcn/ui
- [Hospedes] = StaysList (Fase 3), [Quartos] = RoomMap
- Ambas compartilham o mesmo GuestSheet
- Click em quarto ocupado no mapa abre GuestSheet (busca Stay pelo stayId no dashboard.inHouse)
- Check-in direto pelo mapa: lista chegadas do dia no dialog do quarto disponivel, botao check-in chama useCheckIn
- Invalidacao de cache `room-map` adicionada em: useCheckIn, useWalkInCheckIn, useCheckOut, useUpdateHousekeepingStatus, useCreateMaintenanceOrder, useUpdateMaintenanceOrder

---

### Checklist Fase 5
- [x] 5.1 - Endpoint room-map
- [x] 5.2 - Componente RoomMap com acoes contextuais
- [x] 5.3 - Integrar como aba na tela
- [ ] Testar: cores dos quartos correspondem ao status real
- [ ] Testar: acoes de housekeeping funcionam pelo mapa
- [ ] Testar: clicar em quarto ocupado abre ficha do hospede

---

## Fase 6 - Historico do hospede e CRM -- CONCLUIDA

Dar ao operador visao completa de quem e o hospede.

### 6.1 Endpoint GET /api/users/:id/stay-history -- CONCLUIDO

**Arquivo**: `apps/api/src/services/users.service.ts`

**O que foi feito**:
- Criado metodo `getStayHistory(userId)` no UserService
- Busca todas as stays do usuario via `reservation.userId`
- Cada stay inclui: status, datas reais de check-in/out, roomUnit (code, name), reservation (codigo, datas, noites, totalAmount, source, accommodation), folio (balance, isClosed)
- Calcula summary: totalStays, totalSpent, hasActiveStay, activeStayId
- Rota registrada em `GET /users/:id/stay-history` com autenticacao ADMIN/MANAGER

---

### 6.2 Aba Historico no GuestSheet -- CONCLUIDO

**Arquivo novo**: `apps/web/src/components/admin/frontdesk/HistoryTab.tsx`

**O que foi feito**:
- Cards de resumo: total de estadias e total gasto
- Lista de estadias anteriores (excluindo a estadia atual) em cards
- Cada card mostra: acomodacao, badge de status (Em casa/Finalizada/Cancelada/No-show), datas, noites, quarto, codigo reserva, canal de venda, valor total
- Estadias ativas destacadas com borda sky
- Saldo pendente mostrado em vermelho se folio nao fechado
- Mensagem apropriada para hospede sem cadastro vinculado ou sem historico
- Aba "Historico" adicionada ao GuestSheet entre "Acoes" e fechamento

---

### 6.3 Melhorar pagina de Hospedes (/admin/customers) -- CONCLUIDO

**Arquivos modificados**:
- `apps/api/src/services/users.service.ts` - list(): agora inclui reservations com totalAmount e stay status, calcula e retorna totalSpent, stayCount, hasActiveStay para cada usuario
- `apps/web/src/hooks/useCustomers.ts` - Customer interface: adicionados campos totalSpent, stayCount, hasActiveStay; novo hook useStayHistory(); novos tipos StayHistoryEntry e StayHistoryData
- `apps/web/src/pages/admin/Customers.tsx`:
  - Coluna "Reservas" substituida por "Estadias" (contagem de stays) e "Total gasto" (valor formatado BRL)
  - Badge "Em casa" (sky) ao lado do nome para hospedes com estadia ativa
  - Dialog de detalhes atualizado com "Estadias" e "Total gasto" em vez de "Total de Reservas"

---

### Checklist Fase 6
- [x] 6.1 - Endpoint de historico
- [x] 6.2 - Aba Historico no drawer
- [x] 6.3 - Melhorar pagina de Hospedes
- [ ] Testar: hospede com historico mostra estadias anteriores
- [ ] Testar: hospede novo mostra historico vazio

---

## Fase 7 - Limpeza e simplificacao ✅ CONCLUIDA

Remover complexidade desnecessaria agora que tudo esta integrado.

**O que foi feito:**
- Sidebar reorganizado em 3 grupos semanticos: Operacao (Painel, Hospedagens, Caixa/PDV), Gestao (Reservas, Hospedes, Indicadores, Relatorios), Cadastros (Acomodacoes, Quartos, Promocoes) + Site + Sistema
- "Recepção" renomeado para "Hospedagens" (alinhado com o titulo da pagina)
- Governanca e Manutencao removidos do menu (acoes integradas no Mapa de Quartos)
- Rotas /admin/housekeeping e /admin/maintenance mantidas acessiveis por URL direta
- POS FOLIO mantido - modo funcional e necessario para operacao de cozinha/bar

### 7.1 Housekeeping sai do menu

**O que fazer**:
- Remover item "Governanca" do sidebar
- Todas as acoes de housekeeping ja estao no RoomMap (Fase 5)
- Se necessario, manter uma pagina simplificada acessivel por link direto para a governanta (lista de tarefas pendentes filtrada)

---

### 7.2 Manutencao sai do menu

**O que fazer**:
- Remover item "Manutencao" do sidebar
- Acoes de manutencao ja estao no RoomMap
- Manter pagina acessivel por link direto para equipe de manutencao

---

### 7.3 Atualizar navegacao

**Sidebar final**:
```
Operacao
  Painel          -> Metricas do turno + alertas
  Hospedagens     -> Lista de hospedes + Mapa de quartos (2 abas)
  Caixa/PDV       -> Vendas de balcao

Gestao
  Reservas        -> Calendario + lista
  Hospedes        -> CRM com historico
  Financeiro      -> Contas a pagar/receber
  Relatorios      -> Indicadores

Configuracao
  Catalogo        -> Acomodacoes + Promocoes
  Site            -> Customizadores
  Configuracoes   -> Geral
```

---

### 7.4 Avaliar simplificacao do POS

**Decisao a tomar nesta fase**: com o consumo direto funcionando (Fase 4), avaliar se o modo FOLIO do POS ainda e necessario.
- Se o hotel nao usa cozinha com estados de preparo -> remover modo FOLIO
- Se usa -> manter, mas adicionar opcao "cobrar de hospede" que lanca no folio apos fechar o pedido

Essa decisao depende do uso real. Nao remover preventivamente.

---

### Checklist Fase 7
- [x] 7.1 - Remover Governanca do menu
- [x] 7.2 - Remover Manutencao do menu
- [x] 7.3 - Atualizar sidebar
- [x] 7.4 - Avaliar e decidir sobre POS FOLIO (decisao: manter)
- [ ] Testar: todas as funcionalidades ainda acessiveis
- [ ] Testar: operador consegue fazer turno completo sem sair da tela de Hospedagens

---

## Resumo de Fases

| Fase | Nome                    | Tipo      | Impacto no usuario | Status |
|------|-------------------------|-----------|--------------------|--------|
| 0    | Correcao de bugs        | Backend   | Nenhum (correcoes internas) | CONCLUIDA |
| 1    | Pricing unificado       | Backend   | Nenhum (mesmos valores, fonte unica) | CONCLUIDA |
| 2    | Equivalencia de canais  | Back+Front| Promocao disponivel no admin e walk-in | CONCLUIDA |
| 3    | Tela de hospedagens     | Back+Front| Nova tela principal centrada no hospede | CONCLUIDA |
| 4    | Consumo direto          | Back+Front| Lancar consumo em 1 clique | CONCLUIDA |
| 5    | Mapa de quartos         | Back+Front| Visao visual + acoes de housekeeping/manutencao | CONCLUIDA |
| 6    | Historico e CRM         | Back+Front| Operador conhece o hospede | CONCLUIDA |
| 7    | Limpeza                 | Frontend  | Menu simplificado | CONCLUIDA |

### Ordem obrigatoria
```
Fase 0 (bugs) -> Fase 1 (pricing) -> Fase 2 (canais)
                                          |
                                          v
                           Fase 3 (hospedagens) -> Fase 4 (consumo)
                                          |
                                          v
                           Fase 5 (mapa) -> Fase 6 (CRM) -> Fase 7 (limpeza)
```

Fases 0, 1 e 2 sao fundacao. Nao mudam UX mas corrigem e unificam o backend.
Fases 3 a 7 sao as mudancas visiveis, cada uma entregando valor incremental.

---

## Registro de Alteracoes

### Fase 0 - Implementada em 01/05/2026

**Arquivos modificados:**

1. `apps/api/src/services/frontdesk.service.ts`
   - walkIn(): adicionado criacao de FinancialEntry (RECEIVABLE) apos seedFromReservation

2. `apps/api/src/services/reservations.service.ts`
   - create(): envolvido criacao de reservation + financialEntry em prisma.$transaction() para atomicidade
   - create(): adicionado promotion.update({ currentRedemptions: increment: 1 }) dentro da transaction
   - create(): adicionadas validacoes de capacity e maxExtraBeds antes do calculo de preco

**Impacto na Fase 1:**
- O create() do ReservationService agora ja usa transaction. O PricingService.calculate() pode receber o `tx` como parametro, simplificando a integracao.

**Impacto na Fase 2:**
- A FinancialEntry do walk-in ja esta corrigida. A Fase 2.3 (unificar walk-in com ReservationService) continua relevante para eliminar a duplicacao de logica, mas nao e mais urgente do ponto de vista de dados financeiros.

### Fase 1 - Implementada em 01/05/2026

**Arquivos criados:**

1. `apps/api/src/services/pricing.service.ts` (NOVO)
   - Classe PricingService com metodo estatico calculate(input, tx?)
   - resolveNightlyRate(): busca RatePlan ativo para o periodo, fallback para Accommodation.pricePerNight
   - resolveDiscount(): valida promocao (ativa, datas, maxRedemptions) e calcula desconto
   - Constantes centralizadas: SERVICE_FEE_RATE = 0.05, TAX_RATE = 0.02

2. `apps/api/src/routes/pricing.routes.ts` (NOVO)
   - POST /preview - endpoint publico que retorna PricingBreakdown

3. `apps/web/src/hooks/usePricing.ts` (NOVO)
   - Hook usePricingPreview() usando TanStack React Query
   - Exporta interface PricingBreakdown

**Arquivos modificados:**

4. `apps/api/src/services/reservations.service.ts`
   - create(): substituido calculo manual por PricingService.calculate()
   - Usa pricing.pricePerNight (pode vir de RatePlan) em vez de accommodation.pricePerNight

5. `apps/api/src/services/frontdesk.service.ts`
   - walkIn(): substituido calculo manual por PricingService.calculate(input, tx)
   - Adicionado suporte a promotionId no walk-in com incremento de currentRedemptions

6. `apps/api/src/routes/index.ts`
   - Registrado pricing routes: router.use('/pricing', pricingRoutes)

### Fase 2 - Implementada em 01/05/2026

**Arquivos modificados:**

1. `apps/web/src/components/admin/reservations/CreateReservationDialog.tsx`
   - Adicionado import de usePromotions e usePricingPreview
   - Adicionado campo promotionId ao formulario (Select com promocoes ativas)
   - Substituido calculo local (subtotal, serviceFee, taxes) por dados do usePricingPreview
   - Resumo financeiro agora mostra pricePerNight do servidor (RatePlan-aware), desconto promocional, e taxas dinamicas
   - promotionId passado no payload de criacao da reserva

2. `apps/web/src/components/booking/SimpleCheckout.tsx`
   - Adicionado usePricingPreview hook com fallback para calculo local (exibe imediatamente, atualiza quando servidor responde)
   - Preco por noite exibido vem do servidor quando disponivel (displayPricePerNight)

3. `apps/web/src/pages/admin/Frontdesk.tsx`
   - Adicionado import de usePromotions
   - Adicionado campo promotionId ao walkInForm state
   - Adicionado Select de promocao no dialog de walk-in
   - promotionId passado no walkInCheckIn.mutate()

4. `apps/web/src/hooks/useFrontdesk.ts`
   - Adicionado promotionId?: string ao tipo do payload de useWalkInCheckIn

5. `apps/api/src/types/pms.ts`
   - Adicionado promotionId?: string ao WalkInCheckInDto

6. `apps/api/src/services/schedule.service.ts`
   - Importado RoomUnitStatus, criada constante UNAVAILABLE_ROOM_STATUSES
   - checkAvailability(): roomUnits query agora filtra status: { notIn: [OUT_OF_ORDER, OUT_OF_SERVICE, BLOCKED] }
   - getSchedule(): mesma filtragem aplicada
   - getScheduleStats(): mesma filtragem aplicada

7. `apps/api/src/services/maintenance.service.ts`
   - create(): quando markRoomOutOfOrder=true, cria InventoryBlock automaticamente (stopSell=true, reason='OUT_OF_ORDER', endsAt=1 ano)
   - update(): quando status=COMPLETED, deleta InventoryBlocks com reason='OUT_OF_ORDER' para o roomUnit

**Nota sobre 2.3 (Walk-in usar ReservationService):**
- Adiado. A logica do walk-in ja esta correta (usa PricingService, cria FinancialEntry, incrementa redemptions). A refatoracao para compartilhar codigo com ReservationService e uma melhoria de manutencao, nao uma correcao funcional. Pode ser feita em qualquer momento futuro sem impacto.

### Fase 3 - Implementada em 01/05/2026

**Arquivos criados:**

1. `apps/web/src/components/admin/frontdesk/StaysList.tsx` (NOVO)
   - Componente de lista unificada com filtros por aba (Todos/Em casa/Chegadas/Saidas)
   - Barra de busca por nome, codigo de reserva ou quarto
   - 3 tabelas: chegadas (com badge "Aguardando check-in"), hospedados (noites, saldo, saida), saidas (saldo)
   - Saidas do dia destacadas em amarelo na lista de hospedados
   - Handlers separados: onSelectStay e onSelectArrival

2. `apps/web/src/components/admin/frontdesk/GuestSheet.tsx` (NOVO)
   - Drawer lateral (Sheet) com dados do hospede e conta
   - Header: nome, codigo reserva, quarto, contato (email, telefone, CPF)
   - Metricas: noite atual/total, saldo colorido
   - Aba Conta: resumo debitos/creditos + lista de FolioEntries com tipo traduzido
   - Aba Acoes: formulario de lancamento (Pagamento/Consumo/Ajuste), botao check-out, aviso de saldo pendente
   - Hooks: useFolio, useAddFolioEntry, useCheckOut

**Arquivos modificados:**

3. `apps/api/src/services/frontdesk.service.ts`
   - getDashboard(): arrivals agora inclui user select (name, email, whatsapp, phone, cpf)
   - getDashboard(): inHouse e departures enriquecidos com guestEmail, guestPhone, guestWhatsApp, guestCpf, numberOfNights, totalAmount, accommodation select, user select, folio.id e folio.isClosed

4. `apps/web/src/pages/admin/Frontdesk.tsx`
   - Reescrita completa: layout antigo de tabs substituido por StaysList + GuestSheet
   - Mantidos: cards de metricas, dialog de walk-in com promocao, dialog de check-in para chegadas
   - Removidos: tabs Chegadas/Em casa/Quartos, Dialog de folio por linha, botao checkout por linha
   - Titulo alterado para "Hospedagens"

### Fase 4 - Implementada em 01/05/2026

**Arquivos criados:**

1. `apps/web/src/components/admin/frontdesk/ConsumeTab.tsx` (NOVO)
   - Componente de consumo direto de produtos do catalogo POS
   - Busca por texto (nome, SKU, descricao)
   - Filtro por categoria com abas dinamicas (so mostra categorias com produtos)
   - Lista de produtos ativos com preco, badge de categoria, alerta de estoque baixo
   - Botao [+] por produto que lanca direto no folio (1 clique)
   - Usa hooks: usePOSProducts, useConsumeProduct

**Arquivos modificados:**

2. `apps/api/src/services/folios.service.ts`
   - Novo metodo consumeProduct(folioId, data): transacional, valida folio/produto, calcula total, ajusta estoque (trackStock), cria FolioEntry tipo POS, recalcula balance

3. `apps/api/src/types/pms.ts`
   - Novo tipo ConsumeProductDto: { productId: string, quantity?: number }

4. `apps/api/src/validators/pms.validators.ts`
   - Novo schema consumeProductSchema: productId UUID + quantity int positivo (default 1)

5. `apps/api/src/controllers/folios.controller.ts`
   - Novo metodo consumeProduct() no controller

6. `apps/api/src/routes/folios.routes.ts`
   - Nova rota POST /:folioId/consume com validacao

7. `apps/web/src/hooks/useFolios.ts`
   - Novo hook useConsumeProduct(): mutation que chama POST /folios/:folioId/consume, invalida caches de stays e dashboard

8. `apps/web/src/components/admin/frontdesk/GuestSheet.tsx`
   - Adicionada aba "Consumo" entre Conta e Acoes
   - Renderiza ConsumeTab passando folioId

### Fase 5 - Implementada em 01/05/2026

**Arquivos criados:**

1. `apps/web/src/components/admin/frontdesk/RoomMap.tsx` (NOVO)
   - Componente RoomMap: grid visual de quartos agrupados por andar com cores por status
   - RoomCard: card individual com icone, nome hospede, noite atual/total, saldo folio, badges contextuais, tooltip detalhado
   - DirtyRoomDialog: acoes de housekeeping (iniciar/concluir/inspecionar) usando useUpdateHousekeepingStatus
   - AvailableRoomDialog: lista chegadas do dia para check-in direto + formulario de manutencao com useCreateMaintenanceOrder
   - Filtros por status com contagens (Todos, Disponiveis, Ocupados, Sujos, Manutencao)

**Arquivos modificados:**

2. `apps/api/src/services/frontdesk.service.ts`
   - Novo metodo getRoomMap(): 5 queries paralelas (roomUnits, activeStays, pendingTasks, openMaintenance, todayArrivals), retorna rooms[] com dados cruzados + floors[]

3. `apps/api/src/controllers/frontdesk.controller.ts`
   - Novo metodo roomMap() no controller

4. `apps/api/src/routes/frontdesk.routes.ts`
   - Nova rota GET /room-map

5. `apps/web/src/types/pms.ts`
   - Novos tipos: RoomMapRoom (room com guest, housekeepingTasks, maintenanceOrders, todayArrivals) e RoomMapData ({ rooms, floors })

6. `apps/web/src/hooks/useFrontdesk.ts`
   - Novo hook useRoomMap(): query GET /frontdesk/room-map
   - Invalidacao de cache 'room-map' adicionada em useCheckIn, useWalkInCheckIn, useCheckOut

7. `apps/web/src/hooks/useHousekeeping.ts`
   - Invalidacao de cache 'room-map' adicionada em useUpdateHousekeepingStatus

8. `apps/web/src/hooks/useMaintenance.ts`
   - Invalidacao de cache 'room-map' adicionada em useCreateMaintenanceOrder e useUpdateMaintenanceOrder

9. `apps/web/src/pages/admin/Frontdesk.tsx`
   - Adicionadas abas [Hospedes] [Quartos] usando Tabs do shadcn/ui
   - Importado RoomMap e useRoomMap
   - Handler handleSelectStayById: busca Stay no dashboard.inHouse e abre GuestSheet
   - Handler handleRoomMapCheckIn: check-in direto pelo mapa

### Fase 6 - Implementada em 01/05/2026

**Arquivos criados:**

1. `apps/web/src/components/admin/frontdesk/HistoryTab.tsx` (NOVO)
   - Componente de historico de estadias do hospede dentro do GuestSheet
   - Cards de resumo: total de estadias e total gasto
   - Lista de estadias passadas com acomodacao, status badge, datas, noites, quarto, codigo reserva, canal, valor, saldo pendente
   - Filtra a estadia atual para mostrar apenas historico anterior
   - Tratamento de edge cases: hospede sem conta vinculada, loading, historico vazio

**Arquivos modificados:**

2. `apps/api/src/services/users.service.ts`
   - Novo metodo getStayHistory(userId): query de stays via reservation.userId com roomUnit, reservation (code, datas, noites, totalAmount, source, accommodation), folio; retorna { stays, summary }
   - list(): enriquecido com reservations.totalAmount e stay, pos-processamento calcula totalSpent, stayCount, hasActiveStay por usuario

3. `apps/api/src/controllers/users.controller.ts`
   - Novo metodo stayHistory() chamando UserService.getStayHistory

4. `apps/api/src/routes/users.routes.ts`
   - Nova rota GET /:id/stay-history (antes da rota /:id PUT)

5. `apps/web/src/hooks/useCustomers.ts`
   - Novos tipos StayHistoryEntry e StayHistoryData
   - Novo hook useStayHistory(userId?): query GET /users/:id/stay-history
   - Interface Customer estendida com totalSpent, stayCount, hasActiveStay

6. `apps/web/src/components/admin/frontdesk/GuestSheet.tsx`
   - Adicionada aba "Historico" apos Acoes
   - Renderiza HistoryTab passando userId e currentStayId

7. `apps/web/src/pages/admin/Customers.tsx`
   - Colunas "Estadias" e "Total gasto" substituiram "Reservas"
   - Badge "Em casa" no nome quando hasActiveStay
   - Dialog de detalhes atualizado com estadias e total gasto

### Fase 7 - Implementada em 01/05/2026

**Arquivos modificados:**

1. `apps/web/src/components/admin/AdminLayout.tsx`
   - Sidebar reorganizado: grupos "Principal"/"Hotel"/"Backoffice" substituidos por "Operacao"/"Gestao"/"Cadastros"
   - Grupo Operacao: Painel, Hospedagens (antes "Recepção"), Caixa/PDV
   - Grupo Gestao: Reservas, Hospedes, Indicadores, Relatorios
   - Grupo Cadastros: Acomodacoes, Quartos, Promocoes
   - Removidos itens Governanca (ClipboardCheck) e Manutencao (Wrench) do menu
   - Imports removidos: ConciergeBell, ClipboardCheck, Wrench

**Decisoes tomadas:**

- POS FOLIO: mantido. O modo FOLIO permite lancar vendas de cozinha/bar na conta do hospede e nao e substituido pelo consumo direto (Fase 4), que e para produtos simples
- Rotas /admin/housekeeping e /admin/maintenance continuam funcionais por URL direta, apenas nao aparecem no menu
