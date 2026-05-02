# Analise Completa: Modulos x Canais de Venda

Como cada modulo do FuseHotel interage com os 3 canais de venda (Site, Admin, Walk-in)
e entre si, analisado a partir do codigo-fonte real.

---

## Os 3 Canais de Venda

### Canal 1: Site Publico (SimpleCheckout)
- **Entrada**: Paginas RoomDetail e PromotionDetail
- **Fluxo**: Hospede preenche dados -> verifica se ja e cliente -> cria reserva (PENDING) -> abre WhatsApp
- **Ponto de conversao**: WhatsApp (hotel confirma manualmente)
- **Arquivo**: `apps/web/src/components/booking/SimpleCheckout.tsx`

### Canal 2: Admin Manual (CreateReservationDialog)
- **Entrada**: Pagina de Reservas no painel admin
- **Fluxo**: Operador seleciona cliente cadastrado -> seleciona acomodacao -> datas -> cria reserva (PENDING)
- **Ponto de conversao**: Imediato (operador ja tem controle)
- **Arquivo**: `apps/web/src/components/admin/reservations/CreateReservationDialog.tsx`

### Canal 3: Walk-in (FrontdeskService.walkIn)
- **Entrada**: Pagina Frontdesk no painel admin
- **Fluxo**: Operador seleciona quarto -> preenche dados do hospede -> cria reserva + stay + folio (CHECKED_IN direto)
- **Ponto de conversao**: Imediato (hospede ja esta presente)
- **Arquivo**: `apps/api/src/services/frontdesk.service.ts`

---

## Convergencia dos Canais no Backend

Todos os canais convergem para o mesmo `ReservationService.create()`, exceto Walk-in que usa `FrontdeskService.walkIn()`:

```
SITE ---------> ReservationService.create() -> Reservation (PENDING)
                   |
ADMIN --------> ReservationService.create() -> Reservation (PENDING)
                                                    |
                                    [Operador confirma manualmente]
                                                    |
                                              Reservation (CONFIRMED)
                                                    |
                                    [Operador faz check-in no Frontdesk]
                                                    |
                                    FrontdeskService.checkIn() -> Stay + Folio

WALK-IN ------> FrontdeskService.walkIn() -> Reservation (CHECKED_IN) + Stay + Folio
```

### Ponto critico: Ambos os caminhos fazem o mesmo:
1. Criam Reservation
2. Criam Stay
3. Criam Folio (seedFromReservation)
4. Ocupam o RoomUnit
5. Criam StayGuest

A diferenca e que Site/Admin criam em 2 passos (reserva -> check-in) e Walk-in faz tudo em 1 passo.

---

## Analise por Modulo

### 1. RESERVAS (ReservationService)

**Interacao com Site:**
- SimpleCheckout chama `POST /api/reservations` passando dados do hospede
- Se hospede nao existe, cria usuario provisional (isProvisional=true) pelo WhatsApp
- Se hospede ja existe (mesmo WhatsApp), reutiliza o usuario
- Se tem promotionId/promotionCode, aplica desconto
- Resultado: Reservation PENDING + FinancialEntry RECEIVABLE

**Interacao com Admin:**
- CreateReservationDialog chama o mesmo `POST /api/reservations`
- Diferenca: passa userId de um cliente ja cadastrado (selecionado no combobox)
- Nao suporta promocoes (campo nao existe no dialog)
- Exige que o cliente tenha WhatsApp cadastrado

**Interacao com Walk-in:**
- Walk-in nao usa ReservationService.create()
- Cria reserva diretamente no FrontdeskService.walkIn() com source=WALK_IN
- Nao suporta promocoes
- Nao cria FinancialEntry (GAP!)

**Problemas identificados:**
1. Walk-in nao cria FinancialEntry (RECEIVABLE) - inconsistencia financeira
2. Admin nao suporta aplicar promocoes - perda de funcionalidade
3. Calculo de precos duplicado: ReservationService.create() e FrontdeskService.walkIn() calculam subtotal/serviceFee/taxes separadamente
4. Site depende de WhatsApp para confirmacao - nao ha automacao

---

### 2. RECEPCAO / FRONTDESK (FrontdeskService)

**Check-in (FrontdeskService.checkIn):**
- Recebe reservationId + roomUnitId
- Valida: reserva CONFIRMED, quarto AVAILABLE/INSPECTED + CLEAN/INSPECTED, sem stay ativa
- Cria Stay (IN_HOUSE) + StayGuest + Folio (seedFromReservation)
- Atualiza quarto para OCCUPIED
- Atualiza reserva para CHECKED_IN

**Check-out (FrontdeskService.checkOut):**
- Recebe stayId
- Valida: stay IN_HOUSE, folio quitado (balance <= 0)
- Atualiza Stay -> CHECKED_OUT
- Atualiza Reservation -> CHECKED_OUT
- Quarto -> DIRTY
- Cria HousekeepingTask automaticamente
- Fecha Folio (isClosed=true)

**Dashboard (FrontdeskService.getDashboard):**
- Arrivals: reservas CONFIRMED com checkIn hoje que ainda nao tem stay
- InHouse: stays IN_HOUSE (com folio balance)
- Departures: stays IN_HOUSE com checkout hoje
- RoomStats: contagem por status

**Interacao com Site:**
- Nenhuma direta. Site cria reserva PENDING, que precisa ser confirmada manualmente antes de poder fazer check-in.

**Interacao com Admin:**
- Reserva criada pelo admin (PENDING) -> operador confirma -> operador faz check-in
- Dashboard mostra arrivals do dia

**Problemas identificados:**
1. Folio fica vinculado a Stay (stayId), nao ao hospede diretamente - se o hospede trocar de quarto, precisa de logica especial
2. StayGuest recebe dados copiados da reserva, nao referencia ao User - dados podem divergir
3. Dashboard nao inclui dados do hospede com profundidade (falta historico, preferencias)

---

### 3. PDV / POS (POSService)

**Modo DIRECT (venda de balcao):**
- Cria pedido sem vinculo a stay/hospede
- Pagamento via sessao de caixa (CashSession)
- Ciclo: OPEN -> PREPARING -> DELIVERED -> CLOSED
- Estoque consumido ao DELIVERED
- Pagamento registrado como CashMovement

**Modo FOLIO (consumo de hospede):**
- Pedido vinculado a uma Stay via stayId ou roomUnitId
- Ao chegar em DELIVERED/CLOSED, cria FolioEntry tipo POS no folio do hospede
- Pagamento e "virtual" - vai para a conta do hospede
- Estoque consumido ao DELIVERED

**Interacao com Site:**
- Nenhuma. POS e 100% operacao interna do hotel.

**Interacao com Hospede:**
- Modo FOLIO vincula o consumo ao hospede via stay
- resolveOrderPayload() busca stay ativa pelo stayId ou pelo roomUnitId
- Se o hospede troca de quarto, roomUnitId muda mas stayId permanece (correto)

**Problemas identificados:**
1. O POS resolve o hospede pela Stay, nao pelo usuario. Isso esta correto para a logica de negocio (a conta pertence a estadia), mas a UX obriga o operador a saber o numero do quarto ou stayId
2. Ciclo de vida de pedido e complexo demais para consumo simples de hospede (OPEN -> PREPARING -> DELIVERED -> CLOSED). Lancar um frigobar nao precisa de 4 estados
3. Modo FOLIO e modo DIRECT compartilham o mesmo fluxo de pedido, tornando a tela do POS confusa
4. Sessao de caixa (CashSession) controla apenas vendas DIRECT, mas o operador pode confundir

---

### 4. GOVERNANCA / HOUSEKEEPING (HousekeepingService)

**Ciclo de tarefas:**
```
PENDING -> IN_PROGRESS (quarto->CLEANING) -> COMPLETED (quarto->INSPECTED) -> INSPECTED (quarto->AVAILABLE)
```

**Criacao automatica:**
- Check-out cria tarefa PENDING automaticamente (prioridade HIGH)
- Tarefas tambem podem ser criadas manualmente

**Interacao com Site:**
- Nenhuma direta
- Impacto indireto: se quarto nao esta pronto, check-in bloqueia (ensureRoomReady)

**Interacao com canais de venda:**
- Housekeeping afeta disponibilidade real: quarto DIRTY/CLEANING nao aceita check-in
- Mas a disponibilidade no Schedule (site/admin) olha apenas reservas, nao status fisico do quarto
- Resultado: site pode mostrar "disponivel" para uma acomodacao cujos quartos estao todos sujos

**Problemas identificados:**
1. Desconexao entre disponibilidade comercial (Schedule) e disponibilidade operacional (status do quarto)
2. Governanca e um modulo separado que poderia ser integrado ao mapa de quartos
3. Staff de limpeza e gerenciado separadamente (HousekeepingStaff) sem integracao real com atribuicao de tarefas automatica
4. Lost & Found esta dentro do housekeeping mas nao tem relacao direta com limpeza

---

### 5. MANUTENCAO (MaintenanceService)

**Ciclo:**
```
OPEN -> IN_PROGRESS -> COMPLETED
```

**Impacto no quarto:**
- Criacao pode marcar quarto como OUT_OF_ORDER
- Conclusao retorna quarto a AVAILABLE (ou OCCUPIED se tem stay ativa)

**Interacao com Site:**
- Nenhuma direta
- Impacto indireto: quarto OUT_OF_ORDER reduz inventario real, mas InventoryBlock e que controla stopSell

**Interacao com canais de venda:**
- Manutencao afeta quarto individual, nao a acomodacao (tipo)
- Schedule olha InventoryBlocks para stopSell, nao status de RoomUnit diretamente
- Se quarto esta OUT_OF_ORDER mas nao tem InventoryBlock, o site ainda mostra acomodacao como disponivel

**Problemas identificados:**
1. Manutencao e InventoryBlock sao mecanismos independentes que deveriam ser coordenados
2. OUT_OF_ORDER no RoomUnit nao propaga automaticamente para o Schedule
3. Modulo separado que poderia ser acao contextual no mapa de quartos

---

### 6. TIPOS DE HOSPEDAGEM / ACCOMMODATIONS

**Modelo:**
- Accommodation = tipo generico (Standard, Suite, Chalet, etc)
- RoomUnit = unidade fisica (Q.101, Q.102)
- Uma Accommodation tem N RoomUnits

**Visibilidade no Site:**
- `isAvailable=true` + pelo menos 1 RoomUnit ativo = aparece no site
- Flag `isPublishedOnSite` calculado pelo service
- Preco base: `pricePerNight` na Accommodation

**Disponibilidade para reserva:**
- ScheduleService.checkAvailability() conta:
  - roomUnits ativos
  - menos InventoryBlocks com stopSell
  - menos reservas ativas no periodo
  - Se sobra >= 1 = disponivel

**Interacao com canais:**
- **Site**: RoomDetail mostra acomodacao + useCheckAvailability antes de reservar
- **Admin**: CreateReservationDialog lista todas acomodacoes (adminView) + useCheckAvailability
- **Walk-in**: operador seleciona roomUnit diretamente (nao acomodacao)

**Problemas identificados:**
1. Walk-in trabalha com RoomUnit enquanto os outros canais trabalham com Accommodation - niveis de abstracao diferentes
2. Preco esta na Accommodation, mas RatePlan (Distribution) pode sobrescrever - nenhum canal usa RatePlan para calculo de preco ainda
3. Capacidade e validada no frontend mas nao no backend para reservas pelo site

---

### 7. PACOTES E PROMOCOES (PromotionService)

**Modelo:**
- Promotion com tipo: PACKAGE ou PROMOTION
- Campos: discountPercent, originalPrice, discountedPrice, promotionCode
- Features: lista ordenada de beneficios
- Vigencia: startDate/endDate
- Limites: maxRedemptions/currentRedemptions

**Visibilidade no Site:**
- Listadas em /promocoes (isActive=true)
- Detalhes em /promocoes/:slug (PromotionDetail)
- PromotionDetail permite selecionar acomodacao + fazer reserva com desconto

**Aplicacao de desconto:**
- SimpleCheckout passa promotionId/promotionCode para o backend
- ReservationService.resolvePromotionForReservation() valida vigencia e limites
- ReservationService.calculatePromotionDiscount() calcula: percent direto OU derivado de original vs discounted price
- Desconto e subtraido do total da reserva

**Interacao com canais:**
- **Site**: Fluxo completo (ver promocao -> escolher acomodacao -> SimpleCheckout com desconto)
- **Admin**: NAO SUPORTA promocoes. CreateReservationDialog nao tem campo de promocao
- **Walk-in**: NAO SUPORTA promocoes. FrontdeskService.walkIn() nao recebe promotionId

**Problemas identificados:**
1. Promocoes so funcionam pelo site - admin e walk-in nao podem aplicar
2. currentRedemptions nunca e incrementado (nao encontrei codigo que faca ++ ao criar reserva com promocao)
3. Promocao nao esta vinculada a acomodacao especifica - qualquer acomodacao pode ser reservada com qualquer promocao
4. Nao ha validacao se a acomodacao selecionada e compativel com o pacote

---

### 8. DISTRIBUICAO (DistributionService)

**RatePlan:**
- Plano tarifario por acomodacao com: basePrice, markup, minStay, maxStay, allotment
- Tem campo salesChannel (para diferenciar canais futuramente)
- Tem startsAt/endsAt para vigencia
- NAO e usado por nenhum canal de venda atualmente para calculo de preco

**InventoryBlock:**
- Bloqueio de inventario por periodo
- Pode bloquear acomodacao inteira ou roomUnit especifico
- stopSell=true impede vendas
- Usado pelo ScheduleService.checkAvailability()

**ChannelConnection:**
- Preparacao para OTAs (Booking.com, Expedia, etc)
- Cadastro de canais com type, syncEnabled, externalCode
- NAO tem integracao real com nenhum canal externo

**Problemas identificados:**
1. RatePlan existe mas e ignorado - todos os canais usam Accommodation.pricePerNight
2. salesChannel no RatePlan sugere diferenciacao por canal, mas nao ha logica implementada
3. InventoryBlock funciona corretamente com Schedule, mas nao e coordenado com MaintenanceOrder
4. ChannelConnection e placeholder sem funcionalidade real

---

## Matriz de Interacao: Modulos x Canais

| Modulo              | Site (publico)     | Admin (painel)     | Walk-in            |
|---------------------|--------------------|--------------------|---------------------|
| **Reservas**        | Cria PENDING       | Cria PENDING       | Cria CHECKED_IN     |
| **Promocoes**       | Aplica desconto    | NAO SUPORTA        | NAO SUPORTA         |
| **Disponibilidade** | checkAvailability  | checkAvailability  | checkAvailability   |
| **RatePlan**        | NAO USA            | NAO USA            | NAO USA             |
| **InventoryBlock**  | Afeta dispo.       | Afeta dispo.       | Afeta dispo.        |
| **Check-in**        | N/A (manual admin) | FrontdeskService   | Automatico          |
| **Check-out**       | N/A                | FrontdeskService   | FrontdeskService    |
| **Folio**           | N/A                | seedFromReservation| seedFromReservation |
| **POS**             | N/A                | DIRECT + FOLIO     | N/A (via admin)     |
| **Housekeeping**    | N/A                | Modulo separado    | N/A                 |
| **Manutencao**      | N/A                | Modulo separado    | N/A                 |
| **FinancialEntry**  | Cria RECEIVABLE    | Cria RECEIVABLE    | NAO CRIA (BUG)      |
| **User provisorio** | Cria se nao existe | Exige pre-cadastro | Opcional             |

---

## Fluxo Completo por Canal

### Site: Hospede reserva pelo site
```
1. Hospede navega pelo site -> ve acomodacao ou promocao
2. Seleciona datas, verifica disponibilidade (Schedule)
3. Preenche nome, email, WhatsApp, CPF
4. Backend verifica se WhatsApp ja existe
   - Sim: reutiliza User
   - Nao: cria User provisional
5. Cria Reservation (PENDING) + FinancialEntry (RECEIVABLE)
6. Frontend abre WhatsApp com mensagem formatada
7. Hotel recebe WhatsApp, confirma manualmente no admin
8. Reservation -> CONFIRMED
9. No dia, operador faz check-in no Frontdesk
   - Seleciona RoomUnit
   - Cria Stay + StayGuest + Folio
   - RoomUnit -> OCCUPIED
10. Durante estadia: POS (FOLIO mode) lanca consumos
11. Check-out: quita folio, fecha stay, quarto -> DIRTY
12. Housekeeping: limpa quarto -> AVAILABLE
```

### Admin: Hoteleiro cria reserva no painel
```
1. Operador acessa /admin/reservations
2. Clica "Nova Reserva" -> CreateReservationDialog
3. Seleciona acomodacao, datas, verifica disponibilidade
4. Seleciona cliente cadastrado (ou cadastra novo)
   - Cliente DEVE ter WhatsApp
5. Cria Reservation (PENDING) + FinancialEntry (RECEIVABLE)
6. Operador confirma reserva -> CONFIRMED
7-12. Mesmo fluxo do site a partir do check-in
```

### Walk-in: Hospede chega sem reserva
```
1. Operador acessa /admin/frontdesk
2. Clica "Walk-in"
3. Seleciona RoomUnit disponivel
4. Seleciona ou cadastra hospede (customerId ou dados avulsos)
5. Define datas
6. Em 1 passo:
   - Cria Reservation (CHECKED_IN, source=WALK_IN)
   - Cria Stay + StayGuest + Folio
   - RoomUnit -> OCCUPIED
   - NAO cria FinancialEntry (inconsistencia)
7-12. Mesmo fluxo de estadia e check-out
```

---

## Sincronizacao e Orquestracao: Estado Atual

### O que esta sincronizado corretamente:
- Schedule.checkAvailability() e usado por todos os canais de criacao de reserva
- InventoryBlock afeta todos os canais igualmente
- Check-in valida quarto pronto (ensureRoomReady) para todos os casos
- Check-out gera housekeeping automaticamente
- Folio seedFromReservation funciona para check-in normal e walk-in

### O que NAO esta sincronizado:
1. **Preco**: Accommodation.pricePerNight e a unica fonte. RatePlan existe mas e ignorado
2. **Promocoes**: So funcionam pelo site. Admin e walk-in nao aplicam desconto
3. **FinancialEntry**: Walk-in nao cria, quebrando relatorios financeiros
4. **Status fisico vs comercial**: Quarto DIRTY/OUT_OF_ORDER nao afeta disponibilidade no Schedule (que olha so reservas + InventoryBlocks)
5. **User provisional**: Site cria automaticamente, admin exige pre-cadastro, walk-in aceita sem User
6. **currentRedemptions**: Promocoes nunca incrementam o contador de uso

---

## Gaps Criticos para o Fluxo Centrado no Hospede

### 1. O hospede nao e o centro
- Folio pertence a Stay, nao ao User
- POS resolve por stayId/roomUnitId, nao por hospede
- Dashboard mostra reservas e stays, nao hospedes
- Historico do hospede nao existe como conceito integrado

### 2. Dados do hospede sao copiados, nao referenciados
- Reservation tem guestName, guestEmail, guestWhatsApp, guestCpf (copia)
- StayGuest tem name, email, phone, cpf (outra copia)
- User tem name, email, whatsapp, cpf (fonte)
- Se o hospede atualiza seu cadastro, as copias ficam desatualizadas

### 3. Canais nao sao equivalentes
- Site tem promocao, admin nao
- Admin exige cliente pre-cadastrado, site cria automaticamente
- Walk-in pula confirmacao, nao cria financial entry
- Nenhum canal usa RatePlan

### 4. Modulos operacionais sao ilhas
- Housekeeping nao aparece no contexto do hospede
- Manutencao nao coordena com InventoryBlock
- POS tem dupla personalidade (balcao vs hospede)
- Governanca e manutencao sao telas separadas que poderiam ser acoes contextuais

---

## Recomendacoes para o Fluxo Unificado

### Prioridade 1: Corrigir inconsistencias
- Walk-in deve criar FinancialEntry (mesmo que ReservationService faz)
- Promocoes devem funcionar em todos os canais
- currentRedemptions deve ser incrementado ao usar promocao

### Prioridade 2: Unificar calculo de precos
- Criar uma funcao unica de pricing que considera: RatePlan (se ativo) -> Promotion (se aplicavel) -> Accommodation.pricePerNight (fallback)
- Usar essa funcao em todos os canais

### Prioridade 3: Centrar no hospede (conforme proposta-fluxo-unificado.md)
- Tela principal mostra hospedes, nao quartos
- Ficha do hospede agrega: conta, consumos, historico, acoes
- POS modo FOLIO vira "lancar consumo" na ficha do hospede
- Housekeeping e manutencao viram acoes contextuais no mapa de quartos

### Prioridade 4: Coordenar disponibilidade
- Schedule deve considerar status fisico dos quartos alem de reservas
- MaintenanceOrder com OUT_OF_ORDER deve criar/atualizar InventoryBlock automaticamente
- Disponibilidade real = comercial (Schedule) intersecao operacional (quartos prontos)
