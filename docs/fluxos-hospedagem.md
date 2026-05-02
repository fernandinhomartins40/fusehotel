# Fluxos de Hospedagem - FuseHotel

Documento com todos os fluxos operacionais do sistema de hospedagem, baseado no codigo-fonte real da aplicacao.

---

## Visao Geral dos Modulos

O sistema possui 7 modulos operacionais que se conectam:

```
Reservas --> Frontdesk (Check-in) --> Stay + Folio --> POS / Servicos
                                                    |
                                                    v
                                              Check-out --> Housekeeping --> Quarto disponivel
                                                    |
                                                    v
                                               Financeiro / Relatorios
```

---

## 1. Fluxo de Reservas

### Ciclo de vida da reserva

```
                    +-----------+
                    |  PENDING  |  <-- Reserva criada (site, admin, walk-in)
                    +-----+-----+
                          |
                    Confirmar reserva
                          |
                    +-----v-----+
           +------->| CONFIRMED |
           |        +-----+-----+
           |              |
           |        +-----+-----+-----+
           |        |                   |
           |   Check-in            Nao compareceu
           |        |                   |
           |  +-----v------+    +------v------+
           |  | CHECKED_IN |    |   NO_SHOW   |
           |  +-----+------+    +-------------+
           |        |
           |   Check-out
           |        |
           |  +-----v-------+
           |  | CHECKED_OUT |
           |  +-----+-------+
           |        |
           |   Finalizar
           |        |
           |  +-----v-------+
           |  |  COMPLETED  |
           |  +-------------+
           |
           |  Em qualquer ponto (PENDING ou CONFIRMED):
           |        |
           |  +-----v-------+
           +--| CANCELLED   |
              +-------------+
```

### Transicoes permitidas (codigo real)

| De           | Para                    |
|--------------|-------------------------|
| PENDING      | CONFIRMED               |
| CONFIRMED    | CHECKED_IN, NO_SHOW     |
| CHECKED_IN   | CHECKED_OUT             |
| CHECKED_OUT  | COMPLETED               |
| CANCELLED    | (nenhuma)               |
| COMPLETED    | (nenhuma)               |
| NO_SHOW      | (nenhuma)               |

### O que acontece ao criar uma reserva

```
Cliente preenche formulario
        |
        v
Validar acomodacao (existe? esta disponivel?)
        |
        v
Validar datas (check-out > check-in?)
        |
        v
Verificar disponibilidade no periodo (sem conflito)
        |
        v
Verificar promocao (se informada: ativa? dentro da vigencia? dentro do limite?)
        |
        v
Calcular valores:
  subtotal = preco_por_noite x noites
  camas_extras = qtd x preco_extra x noites
  taxa_servico = subtotal x 5%
  impostos = subtotal x 2%
  desconto = promocao (se houver)
  total = subtotal + extras + taxa + impostos - desconto
        |
        v
Criar ou vincular cliente:
  - Se nao tem userId, busca pelo WhatsApp
  - Se nao encontra, cria usuario provisorio (isProvisional=true)
  - Envia email de acesso ao portal (se SMTP configurado)
        |
        v
Criar reserva com codigo unico (FH-{timestamp}-{uuid})
        |
        v
Criar lancamento financeiro (RECEIVABLE) vinculado a reserva
```

### Cancelamento

- So permite cancelar se status for PENDING ou CONFIRMED
- Registra motivo e data do cancelamento

### Fontes de reserva

WEBSITE, PHONE, EMAIL, WHATSAPP, WALK_IN, BOOKING, AIRBNB, EXPEDIA, CORPORATE, OTHER

---

## 2. Fluxo de Frontdesk (Recepcao)

### Dashboard da recepcao

O frontdesk mostra em tempo real:
- **Chegadas do dia**: reservas CONFIRMED com check-in hoje (sem stay criada)
- **Em hospedagem**: stays com status IN_HOUSE
- **Saidas do dia**: stays IN_HOUSE com check-out previsto para hoje
- **Status dos quartos**: total, disponiveis, ocupados, sujos, em limpeza, fora de servico

### Check-in (reserva existente)

```
Reserva CONFIRMED
        |
        v
Selecionar quarto (RoomUnit)
        |
        v
Validar quarto:
  - Status deve ser AVAILABLE ou INSPECTED
  - Housekeeping deve ser CLEAN ou INSPECTED
  - Nao pode ter stay IN_HOUSE no mesmo quarto
        |
        v
Criar ou atualizar Stay:
  - Status: IN_HOUSE
  - Registra adultos, notas
  - Cria StayGuest (hospede principal)
  - Registra horario real de check-in
        |
        v
Criar Folio (conta do hospede):
  - Lanca automaticamente: diarias, camas extras, taxa servico, impostos, descontos
  - Calcula balance inicial
        |
        v
Atualizar reserva: status -> CHECKED_IN, registra checkedInAt
        |
        v
Atualizar quarto: status -> OCCUPIED, housekeeping -> CLEAN
```

### Walk-in (hospede sem reserva previa)

```
Hospede chega sem reserva
        |
        v
Selecionar quarto disponivel
        |
        v
Validar quarto (mesmas regras do check-in)
        |
        v
Verificar disponibilidade comercial da acomodacao
        |
        v
Vincular ou buscar cliente (por customerId ou dados informados)
        |
        v
Criar reserva com source=WALK_IN e status=CHECKED_IN direto
        |
        v
Criar Stay (IN_HOUSE) + StayGuest + Folio (com lancamentos)
        |
        v
Atualizar quarto: OCCUPIED
```

### Check-out

```
Stay IN_HOUSE
        |
        v
Verificar folio: existe e esta quitado (balance <= 0)?
  - Se balance > 0: BLOQUEIA check-out (pendencias financeiras)
        |
        v
Atualizar Stay: status -> CHECKED_OUT, registra horario real
        |
        v
Atualizar reserva: status -> CHECKED_OUT, registra checkedOutAt
        |
        v
Atualizar quarto: status -> DIRTY, housekeeping -> DIRTY
        |
        v
Criar tarefa automatica de housekeeping:
  - Titulo: "Limpeza pos check-out"
  - Prioridade: HIGH
  - Agendada para agora
        |
        v
Fechar folio: isClosed=true, registra closedAt
```

---

## 3. Fluxo de Folio (Conta do Hospede)

### O que e o Folio

O folio e a conta financeira vinculada a uma Stay. Funciona como um extrato:
- Valores positivos = debitos (hospede deve)
- Valores negativos = creditos (pagamentos, descontos)
- Balance = soma de todos os lancamentos

### Tipos de lancamento

| Tipo         | Sinal    | Descricao                     |
|-------------|----------|-------------------------------|
| DAILY_RATE  | +debito  | Diarias da reserva            |
| EXTRA_BED   | +debito  | Camas extras                  |
| SERVICE_FEE | +debito  | Taxa de servico               |
| TAX         | +debito  | Impostos                      |
| ROOM_SERVICE| +debito  | Pedido room service (POS)     |
| POS         | +debito  | Pedido PDV (restaurante/bar)  |
| ADJUSTMENT  | +debito  | Ajuste manual                 |
| DISCOUNT    | -credito | Desconto aplicado              |
| PAYMENT     | -credito | Pagamento recebido             |
| REFUND      | -credito | Estorno                        |

### Fontes de lancamento

RESERVATION (automatico no check-in), STAY, POS, MANUAL, SYSTEM

### Regras de negocio

- Nao pode lancar em folio fechado
- Check-out so permitido se balance <= 0
- Balance recalculado a cada lancamento (sum de todos entries)

---

## 4. Fluxo de POS (Ponto de Venda)

### Visao geral

O POS gerencia vendas de produtos (comida, bebida, servicos) que podem ser cobrados diretamente ou lancados no folio do hospede.

### Ciclo de vida do pedido

```
  +--------+
  |  OPEN  |  <-- Pedido criado
  +---+----+
      |
  Preparar
      |
  +---v------+
  |PREPARING |
  +---+------+
      |
  Entregar
      |
  +---v------+
  |DELIVERED |  <-- Estoque consumido, lancado no folio (se tipo FOLIO)
  +---+------+
      |
  Fechar
      |
  +---v------+
  | CLOSED   |  <-- Estoque consumido (se nao foi no DELIVERED)
  +----------+

  Em qualquer ponto:
  +----------+
  |CANCELLED |  <-- Estoque revertido, folio estornado, pagamentos estornados
  +----------+
```

### Dois modos de cobranca

1. **DIRECT** (pagamento direto no caixa):
   - Exige sessao de caixa aberta
   - Pagamento registrado com metodo (PIX, cartao, dinheiro, etc)
   - Movimentacao de caixa registrada
   - So fecha se paidAmount >= totalAmount

2. **FOLIO** (lancado na conta do hospede):
   - Exige hospedagem ativa (stay IN_HOUSE)
   - Ao entregar ou fechar, lanca no folio automaticamente
   - Nao recebe pagamento direto no PDV

### Sessao de Caixa

```
Abrir caixa (com fundo de troco)
        |
        v
Registrar vendas, pagamentos, suprimentos, sangrias
        |
        v
Fechar caixa:
  - Calcula valor esperado (soma movimentacoes de caixa em dinheiro)
  - Compara com valor contado
  - Registra diferenca (sobra/falta)
```

### Movimentacoes de caixa

| Tipo              | Descricao                      |
|-------------------|--------------------------------|
| OPENING_FLOAT     | Fundo de troco inicial         |
| SALE              | Recebimento de venda           |
| REFUND            | Estorno de venda               |
| SUPPLY            | Suprimento (entrada de caixa)  |
| WITHDRAWAL        | Sangria (retirada de caixa)    |
| CLOSING_ADJUSTMENT| Ajuste de fechamento           |

### Cancelamento de pedido

- Se tem pagamentos, exige flag `refundPayments=true`
- Estorna todos pagamentos ativos
- Se foi lancado no folio, cria entrada de REFUND no folio
- Se estoque foi consumido (DELIVERED ou CLOSED), reverte estoque

---

## 5. Fluxo de Housekeeping (Governanca)

### Ciclo de uma tarefa de limpeza

```
  +---------+
  | PENDING |  <-- Criada automaticamente (pos check-out) ou manualmente
  +----+----+
       |
  Iniciar limpeza
       |
  +----v--------+
  | IN_PROGRESS |  --> Quarto: CLEANING / IN_PROGRESS
  +----+--------+
       |
  Concluir limpeza
       |
  +----v--------+
  |  COMPLETED  |  --> Quarto: INSPECTED / INSPECTED
  +----+--------+
       |
  Inspecionar
       |
  +----v--------+
  |  INSPECTED  |  --> Quarto: AVAILABLE / CLEAN
  +-------------+
```

### Impacto no quarto (RoomUnit)

| Status Tarefa | Status Quarto    | Housekeeping Status |
|--------------|------------------|---------------------|
| IN_PROGRESS  | CLEANING         | IN_PROGRESS         |
| COMPLETED    | INSPECTED        | INSPECTED           |
| INSPECTED    | AVAILABLE        | CLEAN               |

### Funcionalidades extras

- **Equipe de governanca**: cadastro de profissionais (nome, telefone, funcao)
- **Atribuicao**: tarefas podem ser atribuidas a profissionais
- **Achados e perdidos**: registro de itens encontrados vinculados a quarto/stay
  - Status: OPEN -> RETURNED ou DISCARDED

---

## 6. Fluxo de Manutencao

### Ciclo de uma ordem de manutencao

```
  +------+
  | OPEN |  <-- Ordem criada para um quarto
  +--+---+
     |
  Iniciar trabalho
     |
  +--v---------+
  |IN_PROGRESS |
  +--+---------+
     |
  Concluir
     |
  +--v---------+
  | COMPLETED  |  --> Quarto volta para AVAILABLE (ou OCCUPIED se tem stay ativa)
  +------------+
```

### Regras

- Ao criar, pode marcar quarto como OUT_OF_ORDER (impede check-in)
- Ao concluir:
  - Se tem stay ativa no quarto -> quarto volta para OCCUPIED
  - Se nao tem stay -> quarto volta para AVAILABLE
  - Housekeeping status e preservado (se estava DIRTY, continua DIRTY)
- Registra custo estimado e custo real

---

## 7. Fluxo Financeiro

### Lancamentos financeiros

Cada reserva gera automaticamente um lancamento RECEIVABLE (a receber).

```
Reserva criada
    |
    v
FinancialEntry criado:
  - type: RECEIVABLE
  - status: OPEN
  - amount: totalAmount da reserva
  - category: "Hospedagem"
  - dueDate: data do check-in
  - referenceType: RESERVATION
  - referenceId: id da reserva
```

### Status dos lancamentos

```
  +------+
  | OPEN |
  +--+---+
     |
  Pagamento parcial
     |
  +--v-------------+
  | PARTIALLY_PAID |
  +--+-------------+
     |
  Pagamento completo
     |
  +--v------+
  |  PAID   |
  +---------+
```

### Tipos

| Tipo       | Descricao            |
|-----------|----------------------|
| RECEIVABLE | Valores a receber   |
| PAYABLE    | Valores a pagar     |

### Resumo financeiro

O sistema calcula em tempo real:
- Total a receber / total em aberto
- Total a pagar / total em aberto

---

## 8. Unidades de Quarto (RoomUnit)

### Status do quarto

```
  AVAILABLE ----check-in----> OCCUPIED
      ^                          |
      |                     check-out
  inspecionar                    |
      |                          v
  INSPECTED <--concluir--- DIRTY/CLEANING
      ^
      |
  BLOCKED / OUT_OF_ORDER / OUT_OF_SERVICE  (manutencao)
```

| Status         | Descricao                              |
|---------------|----------------------------------------|
| AVAILABLE      | Disponivel para check-in               |
| OCCUPIED       | Hospede presente                       |
| DIRTY          | Aguardando limpeza (pos check-out)     |
| CLEANING       | Limpeza em andamento                   |
| INSPECTED      | Limpo, aguardando inspecao final       |
| OUT_OF_ORDER   | Fora de servico (manutencao)           |
| OUT_OF_SERVICE | Temporariamente indisponivel           |
| BLOCKED        | Bloqueado administrativamente          |

### Housekeeping Status (paralelo)

| Status      | Descricao           |
|------------|---------------------|
| CLEAN       | Limpo e pronto      |
| DIRTY       | Sujo                |
| IN_PROGRESS | Limpeza em curso    |
| INSPECTED   | Inspecionado        |

---

## 9. Pre-Check-in (Hospede)

O sistema permite que o hospede faca um pre-check-in online antes de chegar:

```
Reserva confirmada
    |
    v
Enviar link de pre-check-in (token unico)
    |
    v
Hospede acessa /pre-check-in/:token
    |
    v
Preenche dados pessoais e documentos
    |
    v
Status: PENDING -> SUBMITTED -> APPROVED -> CHECKED_IN
```

### FNRH (Ficha Nacional de Registro de Hospede)

- Status: PENDING -> READY -> SENT (ou ERROR)
- Dados do hospede e documentos armazenados em JSON

---

## 10. Fluxo de CRM (Gestao de Clientes)

### Cotacoes (Quotes)

```
Hospede solicita cotacao (WhatsApp, email, telefone)
        |
        v
Criar cotacao:
  - Valida acomodacao e disponibilidade
  - Calcula noites = max(1, round((checkOut - checkIn) / 86400000))
  - Calcula valor = preco_por_noite x noites
  - Gera codigo unico: ORC-{timestamp-ultimos-8}
  - Envia email de confirmacao (se configurado)
        |
        v
+--------+                          +------------+
| QUOTED |  --> Aprovar -->          |  APPROVED  |
+--------+                          +-----+------+
                                          |
                                    Converter em reserva
                                          |
                                    +-----v------+
                                    | CONVERTED  | --> Cria reserva real
                                    +------------+
```

### Pre-Check-in Online

```
Admin emite pre-check-in para reserva confirmada
        |
        v
Gera token unico (UUID) + envia email com link
        |
        v
Hospede acessa /pre-check-in/:token
        |
        v
+---------+
| PENDING |  <-- Token emitido
+----+----+
     |
Hospede preenche dados pessoais, documentos, assinatura
     |
+----v------+
| SUBMITTED |  --> FNRH: READY
+----+------+
     |
Admin aprova
     |
+----v------+
| APPROVED  |  --> FNRH pode ser enviado (SENT)
+-----------+
```

### Voucher e Link de Pagamento

- **Voucher**: envia email com confirmacao da reserva + link de check-in
- **Link de pagamento**: gera link temporario (expira em 24h) para `/area-do-cliente?pagamento={token}&reserva={code}`

### Contas Corporativas (B2B)

- Cadastro de empresas/agencias com comissao e markup
- Vinculo com reservas corporativas
- Status: ativa/inativa

### Feedback de Hospedes

- Registro de avaliacao (rating + comentarios) vinculado a reserva/stay
- Usado para analise de qualidade

---

## 11. Fluxo de Relatorios

### Relatorio Operacional Unico

O sistema gera um relatorio consolidado com metricas em tempo real:

```
+---------------------+------------------------------------------+
| Secao               | Metricas                                 |
+---------------------+------------------------------------------+
| Quartos             | Total, ocupados, taxa ocupacao %          |
| Recepcao            | Chegadas/saidas do dia, em hospedagem    |
| Operacoes           | Housekeeping pendente, manutencao aberta |
| Financeiro          | Receita reservas (mes), receita POS (mes)|
|                     | Folios em aberto, a receber, a pagar     |
|                     | RevPAR (receita por quarto disponivel)   |
| Comercial           | Cotacoes no mes, taxa conversao %         |
|                     | Contas ativas, vendas por canal (source) |
+---------------------+------------------------------------------+
```

### Calculos principais

- **Taxa de ocupacao** = (quartos ocupados / total quartos) x 100
- **RevPAR** = receita de reservas / (total quartos x dias no periodo)
- **Taxa de conversao** = (cotacoes convertidas / total cotacoes) x 100
- **Vendas por canal**: agrupa reservas por source (WEBSITE, WHATSAPP, BOOKING, etc)

---

## 12. PMSCentral (Dashboard Operacional)

O PMSCentral e a tela principal do operador. Funciona como painel de triagem de turno.

### Estrutura do dashboard

```
+---------------------------------------------------------------+
|  METRICAS RAPIDAS (topo)                                      |
|  [Caixa atual]  [Receita dia]  [A receber]  [Quartos ocupados]|
+---------------------------------------------------------------+
|                                                                |
|  ACOES RAPIDAS (4 botoes)                                     |
|  [PDV]  [Recepcao]  [Reservas]  [Calendario]                  |
|                                                                |
+---------------------------------------------------------------+
|                                |                               |
|  PRIORIDADES (6 cards)         |  FILA DE DECISOES             |
|  - Chegadas do dia             |  - Reservas sem confirmacao   |
|  - Saidas do dia               |  - Check-ins de hoje          |
|  - Pedidos abertos (POS)       |  - Pedidos aguardando fech.   |
|  - Limpeza pendente            |  - Quartos aguard. governanca |
|  - Manutencao aberta           |  - Ordens de manutencao       |
|  - Reservas pendentes          |                               |
|                                |                               |
+--------------------------------+-------------------------------+
```

### Fluxo de triagem

```
Operador abre PMSCentral
    |
    v
Ve 6 metricas de prioridade
    |
    v
Identifica gargalos (chegadas, limpeza, POS, manutencao)
    |
    v
Fila de decisoes mostra o que precisa de acao
    |
    v
Clica e navega direto para o modulo relevante
```

---

## 13. Fluxo de Schedule (Calendario)

### Disponibilidade

```
Consulta: acomodacao + periodo
        |
        v
Para cada acomodacao:
  - Conta unidades de quarto (RoomUnits)
  - Subtrai bloqueios de inventario (stop-sell)
  - Calcula: disponivel = max(roomUnits - bloqueios, 0)
  - Minimo 1 unidade sempre considerada
        |
        v
Para cada dia do periodo:
  - Verifica reservas existentes (exclui CANCELLED e NO_SHOW)
  - Marca dia como disponivel ou ocupado
        |
        v
Retorna mapa de disponibilidade por acomodacao
```

### Stats do calendario

- Total de acomodacoes
- Total de reservas (excluindo CANCELLED/NO_SHOW)
- Reservas ativas (CHECKED_IN)
- Taxa de ocupacao = (noites ocupadas / noites possiveis) x 100
- Acomodacoes disponiveis (tem inventario E unidades livres)

---

## 14. Fluxo Completo (do inicio ao fim)

```
1. RESERVA
   Cliente faz reserva pelo site ou admin cria manualmente
   -> Status: PENDING
   -> Cliente provisorio criado (se novo)
   -> Lancamento financeiro (RECEIVABLE) criado

2. CONFIRMACAO
   Admin confirma a reserva
   -> Status: CONFIRMED
   -> (Opcional) Envia link de pre-check-in

3. CHECK-IN
   Hospede chega, recepcao faz check-in
   -> Seleciona quarto fisico (RoomUnit)
   -> Cria Stay (IN_HOUSE) + StayGuest
   -> Cria Folio com lancamentos iniciais (diarias, taxas, etc)
   -> Quarto: OCCUPIED
   -> Reserva: CHECKED_IN

4. DURANTE A ESTADIA
   -> POS: pedidos de room service, restaurante, bar
      - FOLIO: lanca na conta do hospede
      - DIRECT: paga no caixa
   -> Housekeeping: limpeza diaria, achados/perdidos
   -> Manutencao: ordens de servico se necessario
   -> Folio: lancamentos manuais (ajustes, pagamentos parciais)

5. CHECK-OUT
   -> Verificar folio quitado (balance <= 0)
   -> Stay: CHECKED_OUT
   -> Reserva: CHECKED_OUT
   -> Quarto: DIRTY
   -> Tarefa automatica de limpeza (prioridade HIGH)
   -> Folio: fechado

6. POS-CHECK-OUT
   -> Housekeeping limpa o quarto
   -> Quarto: CLEANING -> INSPECTED -> AVAILABLE
   -> Quarto pronto para nova reserva

7. FINALIZACAO
   -> Reserva: COMPLETED
   -> Lancamento financeiro: PAID
```

---

## Mapa de Integracao entre Modulos

```
+-------------+     cria      +-----------+    atribui     +------------+
|  RESERVA    |-------------->|   STAY    |<---------------|  ROOM UNIT |
+------+------+               +-----+-----+               +------+-----+
       |                            |                             |
       |                     +------v------+              +-------v-------+
       |                     |    FOLIO    |              | HOUSEKEEPING  |
       |                     +------+------+              +-------+-------+
       |                            |                             |
       |                     +------v------+              +-------v-------+
       |                     |  POS ORDER  |              |  MANUTENCAO   |
       |                     +-------------+              +---------------+
       |
+------v------+
|  FINANCEIRO |
+-------------+
```
