# Proposta: Fluxo Unificado de Hospedagem

## O Problema Real

O sistema trata a hospedagem como uma colecao de modulos tecnicos (reservas, frontdesk, folio, POS, housekeeping) em vez de tratar como o que ela e: **a jornada de um hospede**.

Tudo no hotel existe por causa do hospede. Sem hospede, nao tem reserva, nao tem consumo, nao tem receita, nao tem limpeza. O hospede e o centro de tudo.

---

## A Jornada Real do Hospede

```
1. O hospede quer se hospedar (reserva ou walk-in)
2. O hospede chega e recebe um quarto
3. O hospede consome coisas durante a estadia (restaurante, bar, room service)
4. O hospede paga sua conta (durante ou no check-out)
5. O hospede vai embora
6. O quarto e preparado para o proximo hospede
```

**Tudo e sobre o hospede. O quarto e apenas o recurso fisico que ele ocupa.**

Se o hospede troca de quarto, a conta vai com ele. Se o hospede pede um jantar, o debito e dele. Se o hospede sai, a conta fecha pra ele.

---

## Conceito: Hospede como Centro

### Modelo mental correto

```
            HOSPEDE
           /   |   \
      Reserva  |  Conta (Folio)
               |   /    |     \
            Estadia  Consumos  Pagamentos
               |
            Quarto (recurso fisico)
```

O quarto nao tem conta. O quarto nao consome. O quarto nao paga. **O hospede faz tudo isso.** O quarto e so onde ele dorme.

### O que muda

| Hoje (centrado em modulos)         | Proposta (centrado no hospede)         |
|------------------------------------|----------------------------------------|
| Frontdesk gerencia quartos         | Operador gerencia hospedes             |
| POS cria pedido vinculado a stay   | Consumo vai direto na conta do hospede |
| Folio pertence a stay              | Conta pertence ao hospede              |
| Check-out e operacao do quarto     | Check-out e encerramento da conta      |
| Housekeeping e modulo separado     | Limpeza e consequencia automatica      |

---

## Nova Estrutura

### Tela Principal: Painel de Hospedagens

A tela do dia-a-dia do operador. Mostra **hospedes**, nao quartos.

```
+------------------------------------------------------------------+
| HOSPEDAGENS                           [+ Nova reserva] [Walk-in] |
|                                                                  |
| Filtros: [Todos] [Em casa] [Chegando hoje] [Saindo hoje]         |
+------------------------------------------------------------------+

--- EM CASA (hospedes ativos) ---

+------------------+----------+--------+----------+---------+-----+
| Hospede          | Quarto   | Noites | Saldo    | Saida   |     |
+------------------+----------+--------+----------+---------+-----+
| Joao Silva       | Q.101    | 2 de 3 | R$ 389   | 03/mai  | [>] |
| Maria Lima       | Q.202    | 1 de 2 | R$ 0     | 02/mai  | [>] |
| Pedro Mendes     | Q.305    | 5 de 5 | R$ 1.220 | HOJE    | [>] |
| Ana Costa        | Q.108    | 3 de 7 | R$ 45    | 08/mai  | [>] |
+------------------+----------+--------+----------+---------+-----+

--- CHEGANDO HOJE (check-ins esperados) ---

+------------------+-------------+--------+----------+---------+
| Hospede          | Acomodacao  | Noites | Total    | Status  |
+------------------+-------------+--------+----------+---------+
| Carlos Souza     | Suite Prem. | 3      | R$ 1.800 | Confirm.|
| Lucia Ferreira   | Standard    | 2      | R$ 600   | Confirm.|
+------------------+-------------+--------+----------+---------+

--- SAINDO HOJE (check-outs esperados) ---

+------------------+----------+----------+----------+
| Hospede          | Quarto   | Saldo    | Acao     |
+------------------+----------+----------+----------+
| Pedro Mendes     | Q.305    | R$ 1.220 | [Quitar] |
+------------------+----------+----------+----------+
```

**O operador ve PESSOAS, nao numeros de quarto.**

Pedro Mendes sai hoje e deve R$ 1.220. Isso e claro e acionavel.

---

### Ficha do Hospede (ao clicar em um hospede)

Abre um drawer/painel lateral com tudo sobre aquele hospede:

```
+-------------------------------------------+
| JOAO SILVA                                |
| CPF: 123.456.789-00                       |
| WhatsApp: (11) 99999-0000                 |
| Email: joao@email.com                     |
+-------------------------------------------+
| Reserva: FH-1234-ABCD                     |
| Quarto: 101 (Standard)                    |
| Check-in: 01/mai | Check-out: 04/mai      |
| Noite 2 de 3 | 2 adultos                  |
+-------------------------------------------+
|                                           |
|  [Conta]  [Consumo]  [Historico]  [Acoes] |
|                                           |
+-------------------------------------------+

--- ABA CONTA (padrao) ---

  Diarias (3 noites x R$ 200)    + R$ 600,00
  Taxa de servico (5%)           +  R$ 30,00
  Impostos (2%)                  +  R$ 12,00
  Jantar 01/mai                  +  R$ 85,00
  Frigobar 02/mai                +  R$ 22,00
  Desconto promocao              -  R$ 60,00
  Pagamento PIX (01/mai)         - R$ 300,00
  ──────────────────────────────────────────
  SALDO DO HOSPEDE                 R$ 389,00

  [+ Lancar consumo]  [+ Registrar pagamento]  [+ Desconto]

--- ABA CONSUMO ---

  Adicionar consumo para Joao Silva:
  [Buscar produto...]

  Categorias: [Restaurante] [Bar] [Frigobar] [Room Service] [Lavanderia]

  +----------------------------------+--------+
  | Produto                          | Preco  |
  +----------------------------------+--------+
  | Prato executivo                  | R$ 45  | [+]
  | Cerveja artesanal                | R$ 18  | [+]
  | Agua mineral                     | R$  6  | [+]
  | Lavagem camisa                   | R$ 25  | [+]
  +----------------------------------+--------+

  Ao clicar [+], o valor vai direto para a conta do hospede.
  Sem criar pedido POS, sem selecionar tipo de liquidacao, sem etapas.

--- ABA HISTORICO ---

  Estadias anteriores deste hospede:
  - 15/mar a 17/mar | Q.203 | R$ 420 | Pago
  - 10/jan a 12/jan | Q.101 | R$ 380 | Pago

  Preferencias conhecidas:
  - Quarto andar baixo
  - Travesseiro extra
  - Alergia a amendoim

--- ABA ACOES ---

  [Fazer check-out]       <- so habilita se saldo <= 0
  [Registrar pagamento]   <- atalho rapido
  [Trocar de quarto]
  [Estender estadia]
  [Enviar voucher por email]
  [Gerar link de pagamento]
```

---

### Mapa de Quartos (visao complementar, nao principal)

O mapa de quartos existe como **visao secundaria**, nao como tela principal. Serve para o operador ver rapidamente a ocupacao fisica.

```
+---------------------------------------------------------------+
| QUARTOS                                                       |
| [Por andar] [Por status]                                      |
+---------------------------------------------------------------+
|                                                               |
|  Andar 1                                                      |
|  +--------+  +--------+  +--------+  +--------+               |
|  |  101   |  |  102   |  |  103   |  |  104   |               |
|  | Joao S.|  |  LIVRE |  |  SUJO  |  | MANUT. |               |
|  +--------+  +--------+  +--------+  +--------+               |
|                                                               |
+---------------------------------------------------------------+

Ao clicar em um quarto ocupado: abre a ficha do **hospede** que esta nele.
Ao clicar em um quarto sujo: opcao de marcar limpeza.
Ao clicar em um quarto livre: opcao de check-in (selecionar hospede/reserva).

**O mapa e um atalho visual. O centro continua sendo o hospede.**

---

### POS (so para vendas de balcao)

O POS atual continua existindo, mas **somente para vendas diretas** (cliente no balcao que paga na hora). Nao precisa mais do modo FOLIO.

Consumo de hospede vai pela ficha do hospede, direto na conta dele.

```
POS ATUAL                          POS PROPOSTO
- Modo DIRECT (balcao)             - So vendas de balcao
- Modo FOLIO (hospede)             - Removido (vai pela ficha do hospede)
- Pedido: OPEN->PREPARING->        - Venda: cria, paga, fecha
  DELIVERED->CLOSED
- Sessao de caixa                  - Sessao de caixa (mantem)
```

---

### Fluxo de Check-in

```
OPCAO 1: Pela lista de "Chegando hoje"
  Operador ve "Carlos Souza - Suite Premium - Confirmada"
  Clica -> Abre ficha do hospede
  Clica em [Fazer check-in]
  Seleciona quarto disponivel (filtrado por tipo da acomodacao)
  Confirma -> hospede em casa

OPCAO 2: Pelo mapa de quartos
  Operador clica em quarto livre
  Seleciona reserva do dia (ou cria walk-in)
  Preenche dados do hospede (se walk-in)
  Confirma -> hospede em casa

OPCAO 3: Walk-in pela lista
  Operador clica em [Walk-in]
  Seleciona ou cadastra hospede
  Seleciona quarto
  Define datas
  Confirma -> hospede em casa, reserva criada automaticamente
```

Nos 3 casos, o resultado e o mesmo: hospede em casa com conta aberta.

---

### Fluxo de Check-out

```
Operador ve na lista: "Pedro Mendes - Saindo hoje - Saldo R$ 1.220"
    |
    v
Clica no hospede -> Abre ficha
    |
    v
Aba Conta mostra: saldo R$ 1.220
    |
    v
[Registrar pagamento] -> PIX R$ 1.220
    |
    v
Saldo agora: R$ 0
    |
    v
[Fazer check-out] -> Confirma
    |
    v
Automaticamente:
  - Stay: CHECKED_OUT
  - Reserva: CHECKED_OUT
  - Quarto: DIRTY (aparece amarelo no mapa)
  - Tarefa de limpeza criada automaticamente
  - Folio fechado
    |
    v
Hospede encerrado. Quarto sera limpo.
```

**Nao precisa navegar para nenhuma outra tela.** Tudo acontece na ficha do hospede.

---

### Fluxo de Consumo

```
Hospede pede um jantar
    |
    v
Operador abre ficha do hospede (pela lista ou pelo mapa)
    |
    v
Aba Consumo -> Busca "jantar" -> Clica [+] em "Prato executivo R$ 45"
    |
    v
Lancamento criado automaticamente no folio do hospede
    |
    v
Saldo do hospede atualizado
```

**1 clique para lancar consumo. Sem criar pedido POS, sem etapas de preparo.**

Para pedidos complexos (restaurante com cozinha), o POS de balcao pode ter uma opcao "cobrar de hospede" que lanca no folio, mas o fluxo simples deve ser o padrao.

---

### Housekeeping e Manutencao (automaticos)

Nao sao mais telas separadas. Sao **consequencias automaticas** e **acoes contextuais**.

**Housekeeping:**
- Check-out cria tarefa de limpeza automaticamente (ja faz isso hoje)
- Quarto aparece amarelo no mapa
- Operador/governanta clica no quarto -> "Iniciar limpeza" / "Concluir" / "Inspecionar"
- Quarto volta a verde

**Manutencao:**
- Operador ve problema em um quarto -> Clica no quarto no mapa -> "Registrar manutencao"
- Quarto fica vermelho
- Ao concluir -> quarto volta ao status anterior

Se necessario, uma aba "Pendencias" no painel mostra tarefas de limpeza e manutencao em aberto para gestao.

---

## Nova Navegacao

```
SIDEBAR

Operacao (dia-a-dia)
  [Painel]           -> Metricas + alertas do turno
  [Hospedagens]      -> Lista de hospedes (TELA PRINCIPAL)
  [Quartos]          -> Mapa visual (complementar)
  [Caixa/PDV]        -> Vendas de balcao

Gestao
  [Reservas]         -> Calendario + lista de reservas futuras
  [Hospedes]         -> CRM (cadastro, historico, preferencias)
  [Financeiro]       -> Contas a pagar/receber
  [Relatorios]       -> Indicadores e metricas

Configuracao
  [Catalogo]         -> Acomodacoes, promocoes
  [Site]             -> Customizadores
  [Sistema]          -> Configuracoes gerais
```

**10 itens no menu (antes ~15). Agrupados por frequencia de uso.**

---

## Mudancas no Backend

### O que NAO muda (services existentes estao corretos):
- ReservationService (criar, confirmar, cancelar, status)
- FrontdeskService (check-in, check-out, walk-in, dashboard)
- FoliosService (lancamentos, balance, ensureSettled)
- HousekeepingService (tarefas, status)
- MaintenanceService (ordens)
- FinanceService (lancamentos, liquidacao)

### O que PRECISA:

**1. Endpoint de hospedagens ativas (novo)**

```
GET /api/frontdesk/active-stays
```

Retorna todos os hospedes em casa com:
- Dados do hospede (nome, contato, cpf)
- Dados da estadia (quarto, noites, datas)
- Saldo do folio
- Reserva vinculada

**2. Endpoint de consumo direto (novo)**

```
POST /api/folios/:folioId/consume
Body: { productId, quantity }
```

Busca o produto no catalogo POS, calcula valor, cria FolioEntry tipo POS.
Um unico passo. Sem criar POSOrder.

**3. Endpoint de historico do hospede (novo)**

```
GET /api/crm/customers/:id/history
```

Retorna estadias anteriores, preferencias, total gasto.

**4. Endpoint de mapa de quartos (novo)**

```
GET /api/frontdesk/room-map
```

Retorna todos os quartos com:
- Status + housekeeping status
- Hospede atual (se ocupado)
- Saldo do folio (se ocupado)
- Tarefas pendentes (limpeza, manutencao)
- Reserva esperada hoje (se houver)

---

## Mudancas no Frontend

### Componentes NOVOS:
1. **StaysList** - Lista de hospedagens ativas (tela principal)
2. **GuestSheet** - Drawer com ficha completa do hospede
3. **GuestAccount** - Aba conta (folio) na ficha
4. **QuickConsume** - Aba consumo com busca de produtos
5. **GuestHistory** - Aba historico de estadias
6. **GuestActions** - Aba acoes (checkout, trocar quarto, etc)
7. **RoomMap** - Grid visual de quartos por andar

### Telas que MUDAM:
| Tela atual       | Destino                                       |
|------------------|-----------------------------------------------|
| PMSCentral       | Simplificar: metricas + alertas + pendencias  |
| Frontdesk        | Substituir por StaysList + RoomMap (2 abas)   |
| POS              | Manter so modo DIRECT (vendas de balcao)      |
| Housekeeping     | Remover do menu. Acoes no RoomMap + Pendencias|
| Maintenance      | Remover do menu. Acoes no RoomMap + Pendencias|

### Telas que NAO MUDAM:
- Reservations, Customers, Reports, Accommodations
- Settings, Customizadores do site

---

## Ordem de Implementacao

### Fase 1 - Lista de hospedagens (tela central)
- Endpoint /api/frontdesk/active-stays
- Componente StaysList com filtros
- GuestSheet (drawer) com abas Conta e Dados
- Substituir /admin/frontdesk

### Fase 2 - Consumo direto
- Endpoint /api/folios/:id/consume
- Aba Consumo na GuestSheet
- Busca de produtos POS com categorias

### Fase 3 - Check-in e check-out pela ficha
- Check-in de reserva do dia (selecionar quarto)
- Walk-in (cadastrar hospede + selecionar quarto)
- Check-out com verificacao de saldo

### Fase 4 - Mapa de quartos
- Endpoint /api/frontdesk/room-map
- Componente RoomMap (grid visual)
- Acoes contextuais (limpeza, manutencao)
- Aba complementar na tela de Hospedagens

### Fase 5 - Limpeza
- Absorver Housekeeping e Maintenance no mapa
- Remover do menu lateral
- Simplificar POS (remover modo FOLIO)
- Atualizar navegacao final

---

## Analise Cross-Channel: Gaps Encontrados

Analise completa em `docs/analise-canais-e-modulos.md`.

### Bugs e Inconsistencias a Corrigir ANTES da Refatoracao

Estes problemas existem no sistema atual e devem ser corrigidos independente da proposta:

1. **Walk-in nao cria FinancialEntry** - `FrontdeskService.walkIn()` nao gera a entrada de contas a receber que `ReservationService.create()` gera. Relatorios financeiros ficam incompletos.

2. **currentRedemptions nunca incrementa** - Ao criar reserva com promocao, o campo `currentRedemptions` da Promotion nao e incrementado. O controle de `maxRedemptions` nao funciona.

3. **Promocoes so funcionam pelo site** - `CreateReservationDialog` nao tem campo de promocao. `FrontdeskService.walkIn()` nao aceita promotionId. Apenas o SimpleCheckout (site publico) aplica descontos.

4. **Disponibilidade comercial vs operacional desconectadas** - `ScheduleService.checkAvailability()` conta apenas reservas e InventoryBlocks. Quartos DIRTY, CLEANING ou OUT_OF_ORDER nao afetam a disponibilidade mostrada no site/admin. O site pode mostrar "disponivel" quando todos os quartos fisicos estao sujos.

5. **Manutencao nao coordena com InventoryBlock** - Marcar quarto como OUT_OF_ORDER nao cria InventoryBlock automaticamente, entao o Schedule nao sabe que tem quarto indisponivel.

### Unificacao de Precos (Pre-requisito)

Atualmente existem 3 pontos de calculo de preco independentes:
- `ReservationService.create()` (site + admin)
- `FrontdeskService.walkIn()` (walk-in)
- `CreateReservationDialog` (preview no frontend)

Proposta: criar uma funcao unica `calculateStayPricing()` que:
```
1. Busca RatePlan ativo para a acomodacao/periodo (se existir)
2. Aplica promocao (se fornecida e valida)
3. Fallback: Accommodation.pricePerNight
4. Calcula: subtotal + extraBeds + serviceFee + taxes - discount
5. Retorna breakdown completo
```

Essa funcao deve ser usada por todos os canais (site, admin, walk-in).

### Equivalencia de Canais (Objetivo)

Todos os canais devem convergir para o mesmo resultado:

| Capacidade              | Site | Admin | Walk-in |
|-------------------------|------|-------|---------|
| Criar reserva           | Sim  | Sim   | Sim     |
| Aplicar promocao        | Sim  | Sim   | Sim     |
| Usar RatePlan           | Sim  | Sim   | Sim     |
| Criar FinancialEntry    | Sim  | Sim   | Sim     |
| Auto-criar User         | Sim  | Sim   | Sim     |
| Verificar disponibilidade| Sim | Sim   | Sim     |

O que difere entre canais e apenas o **momento** e o **ator**:
- Site: hospede inicia, hotel confirma
- Admin: hotel cria e confirma
- Walk-in: hotel cria, confirma e faz check-in em 1 passo
