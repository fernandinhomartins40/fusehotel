
import {
  BusinessAccountType,
  CashMovementType,
  CashSessionStatus,
  ChannelConnectionType,
  FinancialEntryStatus,
  FinancialEntryType,
  FNRHStatus,
  FolioEntrySource,
  FolioEntryType,
  HousekeepingStatus,
  HousekeepingTaskPriority,
  HousekeepingTaskStatus,
  LostFoundStatus,
  MaintenanceOrderPriority,
  MaintenanceOrderStatus,
  MarkupType,
  PaymentMethod,
  PaymentStatus,
  POSOrderOrigin,
  POSOrderStatus,
  POSSettlementType,
  PreCheckInStatus,
  QuoteStatus,
  ReservationSource,
  ReservationStatus,
  RoomUnitStatus,
  StayStatus,
  StockMovementType,
} from '@prisma/client';
import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../utils/logger';

const DAY = 24 * 60 * 60 * 1000;
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY);
const setHour = (date: Date, hour: number, minute = 0) => {
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  return next;
};

const creditFolioEntryTypes = new Set<FolioEntryType>([FolioEntryType.DISCOUNT, FolioEntryType.PAYMENT]);
const signedFolioAmount = (type: FolioEntryType, amount: number) =>
  creditFolioEntryTypes.has(type) ? -Math.abs(amount) : Math.abs(amount);

function buildReservationAmounts({
  pricePerNight,
  nights,
  extraBeds,
  extraBedPrice,
  discount = 0,
  serviceFeeRate = 0.05,
  taxRate = 0.02,
}: {
  pricePerNight: number;
  nights: number;
  extraBeds: number;
  extraBedPrice: number;
  discount?: number;
  serviceFeeRate?: number;
  taxRate?: number;
}) {
  const subtotal = pricePerNight * nights;
  const extraBedsCost = extraBeds * extraBedPrice * nights;
  const serviceFee = subtotal * serviceFeeRate;
  const taxes = subtotal * taxRate;
  const totalAmount = subtotal + extraBedsCost + serviceFee + taxes - discount;

  return { subtotal, extraBedsCost, serviceFee, taxes, discount, totalAmount };
}

async function seedAdditionalCustomers() {
  const customerPassword = await hashPassword('Customer@123');
  const customers = [
    { email: 'beatriz.lima@email.com', name: 'Beatriz Lima', phone: '(11) 93211-2200', cpf: '888.111.111-11' },
    { email: 'ricardo.azev@email.com', name: 'Ricardo Azevedo', phone: '(11) 93211-2201', cpf: '888.111.111-12' },
    { email: 'camila.rocha@email.com', name: 'Camila Rocha', phone: '(11) 93211-2202', cpf: '888.111.111-13' },
    { email: 'gustavo.pires@email.com', name: 'Gustavo Pires', phone: '(11) 93211-2203', cpf: '888.111.111-14' },
  ];

  for (const customer of customers) {
    await prisma.user.upsert({
      where: { email: customer.email },
      update: { ...customer, role: 'CUSTOMER', isActive: true, emailVerified: true },
      create: { ...customer, password: customerPassword, role: 'CUSTOMER', isActive: true, emailVerified: true },
    });
  }
}

async function clearOperationalData() {
  logger.info('🧹 Limpando dados operacionais para recriar o cenário de testes...');
  await prisma.review.deleteMany();
  await prisma.guestFeedback.deleteMany();
  await prisma.preCheckIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.folioEntry.deleteMany();
  await prisma.folio.deleteMany();
  await prisma.pOSPayment.deleteMany();
  await prisma.cashMovement.deleteMany();
  await prisma.cashSession.deleteMany();
  await prisma.pOSOrderItem.deleteMany();
  await prisma.pOSOrder.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.pOSProduct.deleteMany();
  await prisma.maintenanceOrder.deleteMany();
  await prisma.lostFoundItem.deleteMany();
  await prisma.housekeepingTask.deleteMany();
  await prisma.stayGuest.deleteMany();
  await prisma.stay.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.reservationQuote.deleteMany();
  await prisma.inventoryBlock.deleteMany();
  await prisma.ratePlan.deleteMany();
  await prisma.channelConnection.deleteMany();
  await prisma.financialEntry.deleteMany();
  await prisma.businessAccount.deleteMany();
  await prisma.housekeepingStaff.deleteMany();
  await prisma.roomUnit.deleteMany();
}

export async function seedPmsData() {
  logger.info('🌱 Seeding PMS operational data...');
  await seedAdditionalCustomers();
  await clearOperationalData();

  const now = new Date();
  const today = setHour(now, 12, 0);
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);
  const inTwoDays = addDays(today, 2);
  const inFiveDays = addDays(today, 5);
  const inEightDays = addDays(today, 8);
  const inFifteenDays = addDays(today, 15);
  const nextMonth = addDays(today, 30);

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: [
          'admin@fusehotel.com', 'gerente@fusehotel.com', 'joao.silva@email.com', 'maria.santos@email.com',
          'pedro.oliveira@email.com', 'ana.costa@email.com', 'beatriz.lima@email.com', 'ricardo.azev@email.com',
          'camila.rocha@email.com', 'gustavo.pires@email.com',
        ],
      },
    },
  });
  const userByEmail = new Map(users.map((user) => [user.email, user]));
  const admin = userByEmail.get('admin@fusehotel.com');
  const manager = userByEmail.get('gerente@fusehotel.com');

  const accommodations = await prisma.accommodation.findMany();
  const accommodationByName = new Map(accommodations.map((item) => [item.name, item]));
  const businessAccounts = await Promise.all([
    prisma.businessAccount.create({ data: { name: 'Operadora Serra Azul Turismo', type: BusinessAccountType.OPERATOR, document: '12.345.678/0001-99', email: 'reservas@serraazul.com.br', phone: '(11) 4020-1000', commissionRate: 12, markupType: MarkupType.PERCENT, markupValue: 8, paymentTermsDays: 15, notes: 'Operadora parceira para grupos e famílias.' } }),
    prisma.businessAccount.create({ data: { name: 'BlueWave Viagens Corporativas', type: BusinessAccountType.CORPORATE, document: '98.765.432/0001-10', email: 'eventos@bluewave.com', phone: '(21) 3555-8811', commissionRate: 5, markupType: MarkupType.FIXED, markupValue: 40, paymentTermsDays: 21, notes: 'Contrato corporativo com faturamento mensal.' } }),
    prisma.businessAccount.create({ data: { name: 'Horizonte Eventos e Incentivos', type: BusinessAccountType.AGENCY, document: '77.654.321/0001-55', email: 'grupos@horizonteeventos.com.br', phone: '(31) 3444-9900', commissionRate: 10, markupType: MarkupType.PERCENT, markupValue: 6, paymentTermsDays: 10, notes: 'Agência com foco em casamentos e eventos sociais.' } }),
  ]);
  const businessByName = new Map(businessAccounts.map((item) => [item.name, item]));

  const roomUnitsPayload: Array<[string, string, string, number, RoomUnitStatus, HousekeepingStatus, boolean]> = [
    ['Quarto Standard Vista Jardim', 'Quarto 101', '101', 1, RoomUnitStatus.OCCUPIED, HousekeepingStatus.CLEAN, true],
    ['Quarto Standard Vista Jardim', 'Quarto 102', '102', 1, RoomUnitStatus.AVAILABLE, HousekeepingStatus.INSPECTED, true],
    ['Quarto Standard Vista Jardim', 'Quarto 103', '103', 1, RoomUnitStatus.DIRTY, HousekeepingStatus.DIRTY, true],
    ['Quarto Standard Vista Jardim', 'Quarto 104', '104', 1, RoomUnitStatus.CLEANING, HousekeepingStatus.IN_PROGRESS, true],
    ['Quarto Standard Vista Jardim', 'Quarto 105', '105', 1, RoomUnitStatus.BLOCKED, HousekeepingStatus.CLEAN, true],
    ['Quarto Standard Vista Jardim', 'Quarto 106', '106', 1, RoomUnitStatus.OUT_OF_ORDER, HousekeepingStatus.DIRTY, true],
    ['Quarto Standard Vista Jardim', 'Quarto 107', '107', 1, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Quarto Standard Vista Jardim', 'Quarto 108', '108', 1, RoomUnitStatus.OUT_OF_SERVICE, HousekeepingStatus.CLEAN, false],
    ['Quarto Deluxe Vista Mar', 'Quarto 201', '201', 2, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Quarto Deluxe Vista Mar', 'Quarto 202', '202', 2, RoomUnitStatus.INSPECTED, HousekeepingStatus.INSPECTED, true],
    ['Quarto Deluxe Vista Mar', 'Quarto 203', '203', 2, RoomUnitStatus.OUT_OF_ORDER, HousekeepingStatus.DIRTY, true],
    ['Quarto Deluxe Vista Mar', 'Quarto 204', '204', 2, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Quarto Deluxe Vista Mar', 'Quarto 205', '205', 2, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Quarto Deluxe Vista Mar', 'Quarto 206', '206', 2, RoomUnitStatus.BLOCKED, HousekeepingStatus.CLEAN, true],
    ['Suíte Master com Hidromassagem', 'Suíte 301', '301', 3, RoomUnitStatus.AVAILABLE, HousekeepingStatus.INSPECTED, true],
    ['Suíte Master com Hidromassagem', 'Suíte 302', '302', 3, RoomUnitStatus.OCCUPIED, HousekeepingStatus.CLEAN, true],
    ['Suíte Master com Hidromassagem', 'Suíte 303', '303', 3, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Suíte Família', 'Suíte Família 401', '401', 4, RoomUnitStatus.OCCUPIED, HousekeepingStatus.CLEAN, true],
    ['Suíte Família', 'Suíte Família 402', '402', 4, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Suíte Família', 'Suíte Família 403', '403', 4, RoomUnitStatus.AVAILABLE, HousekeepingStatus.INSPECTED, true],
    ['Suíte Família', 'Suíte Família 404', '404', 4, RoomUnitStatus.DIRTY, HousekeepingStatus.DIRTY, true],
    ['Chalé Romântico', 'Chalé 01', 'CHA-01', 0, RoomUnitStatus.AVAILABLE, HousekeepingStatus.CLEAN, true],
    ['Chalé Romântico', 'Chalé 02', 'CHA-02', 0, RoomUnitStatus.AVAILABLE, HousekeepingStatus.INSPECTED, true],
    ['Chalé Romântico', 'Chalé 03', 'CHA-03', 0, RoomUnitStatus.OUT_OF_SERVICE, HousekeepingStatus.CLEAN, true],
    ['Villa Presidencial', 'Villa 01', 'VIL-01', 0, RoomUnitStatus.OCCUPIED, HousekeepingStatus.CLEAN, true],
  ];

  for (const [accommodationName, name, code, floor, status, housekeepingStatus, isActive] of roomUnitsPayload) {
    const accommodation = accommodationByName.get(accommodationName);
    if (!accommodation) throw new Error(`Acomodação não encontrada: ${accommodationName}`);
    await prisma.roomUnit.create({ data: { accommodationId: accommodation.id, name, code, floor, status, housekeepingStatus, isActive, notes: isActive ? null : 'Unidade desativada para reforma estrutural.' } });
  }

  const roomUnits = await prisma.roomUnit.findMany({ include: { accommodation: true } });
  const roomUnitByCode = new Map(roomUnits.map((item) => [item.code, item]));

  const housekeepingStaff = await Promise.all([
    prisma.housekeepingStaff.create({ data: { name: 'Sandra Camareira', phone: '(11) 99111-1001', role: 'Camareira líder' } }),
    prisma.housekeepingStaff.create({ data: { name: 'Patrícia Gomes', phone: '(11) 99111-1002', role: 'Camareira' } }),
    prisma.housekeepingStaff.create({ data: { name: 'Rafael Lima', phone: '(11) 99111-1003', role: 'Supervisor de limpeza' } }),
  ]);
  const staffByName = new Map(housekeepingStaff.map((item) => [item.name, item]));

  const ratePlansPayload: Array<[string, string, number, MarkupType, number, number, number | null, number | null, boolean, string]> = [
    ['Quarto Standard Vista Jardim', 'Tarifa Balcão', 250, MarkupType.FIXED, 0, 1, null, null, true, 'DIRECT'],
    ['Quarto Standard Vista Jardim', 'Não Reembolsável', 235, MarkupType.FIXED, 0, 1, null, 6, true, 'DIRECT'],
    ['Quarto Deluxe Vista Mar', 'Tarifa Flexível', 450, MarkupType.FIXED, 0, 1, null, 4, true, 'DIRECT'],
    ['Quarto Deluxe Vista Mar', 'OTA Booking', 450, MarkupType.PERCENT, 12, 1, null, 3, true, 'BOOKING'],
    ['Suíte Família', 'Corporativo BlueWave', 650, MarkupType.FIXED, -50, 2, 7, 2, true, 'CORPORATE'],
    ['Chalé Romântico', 'Pacote Romântico', 900, MarkupType.PERCENT, 10, 2, null, 2, true, 'DIRECT'],
    ['Villa Presidencial', 'Experiência Exclusiva', 1500, MarkupType.FIXED, 200, 2, null, 1, true, 'DIRECT'],
  ];
  for (const [accommodationName, name, basePrice, markupType, markupValue, minStay, maxStay, allotment, isActive, salesChannel] of ratePlansPayload) {
    const accommodation = accommodationByName.get(accommodationName);
    if (!accommodation) continue;
    await prisma.ratePlan.create({ data: { accommodationId: accommodation.id, name, basePrice, markupType, markupValue, minStay, maxStay, allotment, isActive, salesChannel } });
  }

  await prisma.channelConnection.createMany({ data: [
    { name: 'Booking.com Principal', type: ChannelConnectionType.BOOKING, isActive: true, syncEnabled: true, externalCode: 'FH-BOOKING-01', notes: 'Canal principal para OTA internacional.', lastSyncedAt: addDays(today, -1) },
    { name: 'Airbnb Chalés', type: ChannelConnectionType.AIRBNB, isActive: true, syncEnabled: true, externalCode: 'FH-AIRBNB-CHALE', notes: 'Canal focado em escapadas românticas.', lastSyncedAt: addDays(today, -2) },
    { name: 'Expedia Families', type: ChannelConnectionType.EXPEDIA, isActive: false, syncEnabled: false, externalCode: 'FH-EXP-01', notes: 'Integração pausada aguardando revisão de tarifas.' },
    { name: 'Site Oficial', type: ChannelConnectionType.DIRECT, isActive: true, syncEnabled: true, externalCode: 'FH-DIRECT', notes: 'Motor de reservas do site.', lastSyncedAt: today },
  ] });

  const inventoryBlocksPayload = [
    { accommodationName: 'Quarto Standard Vista Jardim', roomCode: '106', title: 'Reparo hidráulico do banheiro', reason: 'Troca de tubulação e revisão do box.', startsAt: addDays(today, -1), endsAt: addDays(today, 2), stopSell: true, allotment: null, salesChannel: null },
    { accommodationName: 'Suíte Família', roomCode: null, title: 'Bloqueio para grupo casamento Horizonte', reason: 'Pré-bloqueio de 2 unidades para evento social.', startsAt: addDays(today, 18), endsAt: addDays(today, 21), stopSell: false, allotment: 2, salesChannel: 'DIRECT' },
    { accommodationName: 'Chalé Romântico', roomCode: 'CHA-03', title: 'Paisagismo externo', reason: 'Reforma do deck e ajuste de iluminação.', startsAt: addDays(today, 3), endsAt: addDays(today, 9), stopSell: true, allotment: null, salesChannel: null },
  ];
  for (const block of inventoryBlocksPayload) {
    const accommodation = accommodationByName.get(block.accommodationName);
    if (!accommodation) continue;
    await prisma.inventoryBlock.create({ data: { accommodationId: accommodation.id, roomUnitId: block.roomCode ? roomUnitByCode.get(block.roomCode)?.id : null, title: block.title, reason: block.reason, startsAt: block.startsAt, endsAt: block.endsAt, stopSell: block.stopSell, allotment: block.allotment, salesChannel: block.salesChannel } });
  }

  const productCategoriesPayload = [
    { slug: 'FOOD', label: 'Alimentos', color: '#f97316', order: 0 },
    { slug: 'BEVERAGE', label: 'Bebidas', color: '#3b82f6', order: 1 },
    { slug: 'SERVICE', label: 'Serviços', color: '#8b5cf6', order: 2 },
    { slug: 'CONVENIENCE', label: 'Conveniência', color: '#10b981', order: 3 },
    { slug: 'OTHER', label: 'Outros', color: '#6b7280', order: 4 },
  ];
  for (const cat of productCategoriesPayload) {
    await prisma.productCategory.create({ data: cat });
  }
  const allCategories = await prisma.productCategory.findMany();
  const categoryBySlug = new Map(allCategories.map((c) => [c.slug, c]));

  const posProductsPayload: Array<[string, string, string, number, number, number, number, string, boolean, string]> = [
    ['Água sem gás 500ml', 'BEB-001', 'BEVERAGE', 5.5, 1.8, 120, 24, 'UN', true, 'Água mineral sem gás.'],
    ['Água com gás 500ml', 'BEB-002', 'BEVERAGE', 6, 2.1, 90, 24, 'UN', true, 'Água mineral com gás.'],
    ['Refrigerante lata 350ml', 'BEB-003', 'BEVERAGE', 8, 3.2, 80, 18, 'UN', true, 'Sabores variados.'],
    ['Suco integral 300ml', 'BEB-004', 'BEVERAGE', 12, 4.5, 50, 12, 'UN', true, 'Suco natural gelado.'],
    ['Cerveja long neck', 'BEB-005', 'BEVERAGE', 16, 6.8, 64, 18, 'UN', true, 'Cerveja premium long neck.'],
    ['Espumante 187ml', 'BEB-006', 'BEVERAGE', 39, 18, 20, 6, 'UN', true, 'Mini espumante para celebrações.'],
    ['Café expresso', 'ALM-001', 'FOOD', 7, 1.5, 999, 0, 'UN', false, 'Café expresso do bar.'],
    ['Sanduíche natural', 'ALM-002', 'FOOD', 24, 9.8, 25, 8, 'UN', true, 'Sanduíche leve para lanche rápido.'],
    ['Hambúrguer artesanal', 'ALM-003', 'FOOD', 39, 15.2, 18, 6, 'UN', true, 'Hambúrguer com fritas.'],
    ['Pizza individual marguerita', 'ALM-004', 'FOOD', 42, 17.5, 15, 4, 'UN', true, 'Pizza individual assada no forno.'],
    ['Tábua de frios', 'ALM-005', 'FOOD', 58, 24, 12, 4, 'UN', true, 'Porção para duas pessoas.'],
    ['Sobremesa do dia', 'ALM-006', 'FOOD', 18, 6.5, 20, 5, 'UN', true, 'Sobremesa fresca do restaurante.'],
    ['Lavanderia - camiseta', 'SER-001', 'SERVICE', 12, 0, 999, 0, 'UN', false, 'Lavagem e passagem de camiseta.'],
    ['Lavanderia - calça', 'SER-002', 'SERVICE', 18, 0, 999, 0, 'UN', false, 'Lavagem e passagem de calça.'],
    ['Transfer aeroporto', 'SER-003', 'SERVICE', 160, 0, 999, 0, 'UN', false, 'Transfer compartilhado aeroporto/hotel.'],
    ['Kit amenidades premium', 'CON-001', 'CONVENIENCE', 34, 12, 14, 4, 'UN', true, 'Kit com chinelo, hidratante e itens premium.'],
    ['Protetor solar 200ml', 'CON-002', 'CONVENIENCE', 45, 18, 10, 3, 'UN', true, 'Protetor solar para venda avulsa.'],
    ['Balde de gelo', 'OUT-001', 'OTHER', 15, 2, 999, 0, 'UN', false, 'Serviço de entrega de gelo no quarto.'],
  ];
  for (const [name, sku, categorySlug, price, costPrice, stockQuantity, minStockQuantity, saleUnit, trackStock, description] of posProductsPayload) {
    const categoryId = categoryBySlug.get(categorySlug)!.id;
    await prisma.pOSProduct.create({ data: { name, sku, categoryId, price, costPrice, stockQuantity, minStockQuantity, saleUnit, trackStock, description } });
  }
  const posProducts = await prisma.pOSProduct.findMany();
  const productBySku = new Map(posProducts.map((item) => [item.sku || item.name, item]));
  for (const product of posProducts.filter((item) => item.trackStock)) {
    await prisma.inventoryMovement.create({ data: { productId: product.id, type: StockMovementType.PURCHASE_IN, quantity: Number(product.stockQuantity), unitCost: Number(product.costPrice), referenceId: `SUP-${product.sku}`, notes: 'Carga inicial de estoque para ambiente de demonstração.', createdByUserId: admin?.id, createdByEmail: admin?.email } });
  }
  const reservationsData = [
    {
      code: 'FH-SEED-260426-001', accommodationName: 'Quarto Standard Vista Jardim', userEmail: 'joao.silva@email.com',
      guestName: 'João Silva', guestEmail: 'joao.silva@email.com', guestPhone: '(11) 97777-7777', guestWhatsApp: '(11) 97777-7777', guestCpf: '333.333.333-33',
      checkInDate: addDays(today, -1), checkOutDate: addDays(today, 2), numberOfGuests: 2, numberOfExtraBeds: 0,
      source: ReservationSource.WEBSITE, status: ReservationStatus.CHECKED_IN, paymentStatus: PaymentStatus.COMPLETED, paymentMethod: PaymentMethod.CREDIT_CARD,
      voucherSentAt: addDays(today, -3), specialRequests: 'Apartamento silencioso e próximo ao elevador.',
      payments: [{ amount: 500, method: PaymentMethod.CREDIT_CARD, status: PaymentStatus.COMPLETED, transactionId: 'PAY-SEED-001' }],
      stay: { roomCode: '101', status: StayStatus.IN_HOUSE, adults: 2, children: 0, expectedCheckInAt: setHour(addDays(today, -1), 14), expectedCheckOutAt: setHour(addDays(today, 2), 12), actualCheckInAt: setHour(addDays(today, -1), 14, 35), notes: 'Hóspede prefere travesseiros extras.', folioEntries: [
        { type: FolioEntryType.ROOM_SERVICE, source: FolioEntrySource.POS, description: 'Room service - jantar no quarto', amount: 68 },
        { type: FolioEntryType.POS, source: FolioEntrySource.POS, description: 'Consumo no bar da piscina', amount: 24 },
        { type: FolioEntryType.PAYMENT, source: FolioEntrySource.MANUAL, description: 'Pagamento antecipado', amount: 500 },
      ] },
      stayGuests: [
        { name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 97777-7777', cpf: '333.333.333-33', isPrimary: true },
        { name: 'Fernanda Silva', email: 'fernanda.silva@email.com', phone: '(11) 97777-7712', cpf: '123.456.789-12', isPrimary: false },
      ],
    },
    {
      code: 'FH-SEED-260426-002', accommodationName: 'Quarto Deluxe Vista Mar', userEmail: 'maria.santos@email.com',
      guestName: 'Maria Santos', guestEmail: 'maria.santos@email.com', guestPhone: '(11) 96666-6666', guestWhatsApp: '(11) 96666-6666', guestCpf: '444.444.444-44',
      checkInDate: today, checkOutDate: addDays(today, 3), numberOfGuests: 2, numberOfExtraBeds: 0,
      source: ReservationSource.WEBSITE, status: ReservationStatus.CONFIRMED, paymentStatus: PaymentStatus.COMPLETED, paymentMethod: PaymentMethod.PIX,
      voucherSentAt: addDays(today, -2), specialRequests: 'Solicita early check-in se houver disponibilidade.',
      payments: [{ amount: 600, method: PaymentMethod.PIX, status: PaymentStatus.COMPLETED, transactionId: 'PAY-SEED-002' }],
      preCheckIn: { status: PreCheckInStatus.APPROVED, fnrhStatus: FNRHStatus.READY, guestData: { documento: 'RG 44.222.111-9', nacionalidade: 'Brasileira' }, documentData: { cpf: '444.444.444-44', endereco: 'São Paulo/SP' }, submittedAt: addDays(today, -1), approvedAt: addDays(today, -1) },
    },
    {
      code: 'FH-SEED-260426-003', accommodationName: 'Suíte Família', businessAccountName: 'BlueWave Viagens Corporativas',
      guestName: 'Ricardo Azevedo', guestEmail: 'ricardo.azev@email.com', guestPhone: '(11) 93211-2201', guestWhatsApp: '(11) 93211-2201', guestCpf: '888.111.111-12',
      checkInDate: inTwoDays, checkOutDate: addDays(inTwoDays, 4), numberOfGuests: 3, numberOfExtraBeds: 1,
      source: ReservationSource.CORPORATE, status: ReservationStatus.CONFIRMED, paymentStatus: PaymentStatus.PENDING, paymentMethod: PaymentMethod.BANK_TRANSFER,
      paymentLinkUrl: 'https://pay.fusehotel.test/corporativo/FH-SEED-260426-003', paymentLinkExpiresAt: addDays(today, 4), specialRequests: 'Necessita nota para faturamento empresarial.',
      preCheckIn: { status: PreCheckInStatus.PENDING, fnrhStatus: FNRHStatus.PENDING },
    },
    {
      code: 'FH-SEED-260426-004', accommodationName: 'Quarto Standard Vista Jardim',
      guestName: 'Paulo Mendes', guestEmail: 'paulo.mendes@email.com', guestPhone: '(21) 97711-9011', guestWhatsApp: '(21) 97711-9011', guestCpf: '011.222.333-44',
      checkInDate: inFiveDays, checkOutDate: addDays(inFiveDays, 2), numberOfGuests: 1, numberOfExtraBeds: 0,
      source: ReservationSource.PHONE, status: ReservationStatus.PENDING, paymentStatus: PaymentStatus.PENDING,
      specialRequests: 'Reserva em espera aguardando sinal.', paymentLinkUrl: 'https://pay.fusehotel.test/sinal/FH-SEED-260426-004', paymentLinkExpiresAt: addDays(today, 2),
    },
    {
      code: 'FH-SEED-260426-005', accommodationName: 'Quarto Deluxe Vista Mar',
      guestName: 'Camila Rocha', guestEmail: 'camila.rocha@email.com', guestPhone: '(11) 93211-2202', guestWhatsApp: '(11) 93211-2202', guestCpf: '888.111.111-13',
      checkInDate: inEightDays, checkOutDate: addDays(inEightDays, 3), numberOfGuests: 2, numberOfExtraBeds: 0,
      source: ReservationSource.BOOKING, status: ReservationStatus.CONFIRMED, paymentStatus: PaymentStatus.COMPLETED, paymentMethod: PaymentMethod.CREDIT_CARD,
      specialRequests: 'Cliente chega tarde; manter welcome kit.', payments: [{ amount: 900, method: PaymentMethod.CREDIT_CARD, status: PaymentStatus.COMPLETED, transactionId: 'PAY-SEED-005' }],
      externalChannel: 'BOOKING', externalReservationId: 'BK-99887766', voucherSentAt: addDays(today, -1),
    },
    {
      code: 'FH-SEED-260426-006', accommodationName: 'Suíte Master com Hidromassagem', userEmail: 'pedro.oliveira@email.com',
      guestName: 'Pedro Oliveira', guestEmail: 'pedro.oliveira@email.com', guestPhone: '(11) 95555-5555', guestWhatsApp: '(11) 95555-5555', guestCpf: '555.555.555-55',
      checkInDate: addDays(today, -5), checkOutDate: addDays(today, -2), numberOfGuests: 2, numberOfExtraBeds: 0,
      source: ReservationSource.WEBSITE, status: ReservationStatus.COMPLETED, paymentStatus: PaymentStatus.COMPLETED, paymentMethod: PaymentMethod.CREDIT_CARD,
      voucherSentAt: addDays(today, -7), payments: [{ amount: 1605, method: PaymentMethod.CREDIT_CARD, status: PaymentStatus.COMPLETED, transactionId: 'PAY-SEED-006' }],
      stay: { roomCode: '301', status: StayStatus.CHECKED_OUT, adults: 2, children: 0, expectedCheckInAt: setHour(addDays(today, -5), 14), expectedCheckOutAt: setHour(addDays(today, -2), 12), actualCheckInAt: setHour(addDays(today, -5), 15, 10), actualCheckOutAt: setHour(addDays(today, -2), 11, 20), notes: 'Estadia concluída sem intercorrências.', folioEntries: [
        { type: FolioEntryType.POS, source: FolioEntrySource.POS, description: 'Espumante no quarto', amount: 39 },
        { type: FolioEntryType.PAYMENT, source: FolioEntrySource.MANUAL, description: 'Liquidação no check-out', amount: 39 },
      ], closeFolio: true },
      stayGuests: [{ name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', phone: '(11) 95555-5555', cpf: '555.555.555-55', isPrimary: true }],
      feedback: { rating: 5, source: 'checkout', comment: 'Atendimento excelente e suíte impecável.' },
      review: { rating: 5, title: 'Experiência memorável', comment: 'Vista linda, quarto impecável e café da manhã muito bom.' },
    },
    {
      code: 'FH-SEED-260426-007', accommodationName: 'Chalé Romântico',
      guestName: 'Juliana Prado', guestEmail: 'juliana.prado@email.com', guestPhone: '(41) 98844-1212', guestWhatsApp: '(41) 98844-1212', guestCpf: '120.330.450-90',
      checkInDate: inFifteenDays, checkOutDate: addDays(inFifteenDays, 2), numberOfGuests: 2, numberOfExtraBeds: 0,
      source: ReservationSource.EMAIL, status: ReservationStatus.CANCELLED, paymentStatus: PaymentStatus.REFUNDED, paymentMethod: PaymentMethod.PIX,
      cancelledAt: addDays(today, -1), cancellationReason: 'Mudança de agenda do casal.', payments: [{ amount: 300, method: PaymentMethod.PIX, status: PaymentStatus.REFUNDED, transactionId: 'PAY-SEED-007' }],
    },
    {
      code: 'FH-SEED-260426-008', accommodationName: 'Quarto Standard Vista Jardim',
      guestName: 'Gustavo Pires', guestEmail: 'gustavo.pires@email.com', guestPhone: '(11) 93211-2203', guestWhatsApp: '(11) 93211-2203', guestCpf: '888.111.111-14',
      checkInDate: yesterday, checkOutDate: tomorrow, numberOfGuests: 1, numberOfExtraBeds: 0,
      source: ReservationSource.WHATSAPP, status: ReservationStatus.NO_SHOW, paymentStatus: PaymentStatus.FAILED, specialRequests: 'Cliente não compareceu até 23h59.',
    },
    {
      code: 'FH-SEED-260426-009', accommodationName: 'Suíte Família',
      guestName: 'Beatriz Lima', guestEmail: 'beatriz.lima@email.com', guestPhone: '(11) 93211-2200', guestWhatsApp: '(11) 93211-2200', guestCpf: '888.111.111-11',
      checkInDate: addDays(today, -2), checkOutDate: tomorrow, numberOfGuests: 2, numberOfExtraBeds: 1,
      source: ReservationSource.WEBSITE, status: ReservationStatus.CHECKED_IN, paymentStatus: PaymentStatus.PARTIALLY_REFUNDED, paymentMethod: PaymentMethod.CREDIT_CARD,
      voucherSentAt: addDays(today, -4), payments: [{ amount: 1200, method: PaymentMethod.CREDIT_CARD, status: PaymentStatus.COMPLETED, transactionId: 'PAY-SEED-009' }],
      stay: { roomCode: '401', status: StayStatus.IN_HOUSE, adults: 2, children: 1, expectedCheckInAt: setHour(addDays(today, -2), 14), expectedCheckOutAt: setHour(tomorrow, 12), actualCheckInAt: setHour(addDays(today, -2), 14, 20), notes: 'Família viaja com criança pequena; berço já entregue.', folioEntries: [
        { type: FolioEntryType.ROOM_SERVICE, source: FolioEntrySource.POS, description: 'Lanche noturno infantil', amount: 42 },
        { type: FolioEntryType.PAYMENT, source: FolioEntrySource.MANUAL, description: 'Sinal antecipado', amount: 1200 },
      ] },
      stayGuests: [
        { name: 'Beatriz Lima', email: 'beatriz.lima@email.com', phone: '(11) 93211-2200', cpf: '888.111.111-11', isPrimary: true },
        { name: 'Caio Lima', email: 'caio.lima@email.com', phone: '(11) 93211-2204', cpf: '120.110.222-33', isPrimary: false },
      ],
    },
    {
      code: 'FH-SEED-260426-010', accommodationName: 'Villa Presidencial', businessAccountName: 'Horizonte Eventos e Incentivos',
      guestName: 'Fernanda Moura', guestEmail: 'fernanda.moura@email.com', guestPhone: '(71) 98776-5555', guestWhatsApp: '(71) 98776-5555', guestCpf: '220.110.330-55',
      checkInDate: addDays(today, -3), checkOutDate: today, numberOfGuests: 4, numberOfExtraBeds: 1,
      source: ReservationSource.CORPORATE, status: ReservationStatus.CHECKED_IN, paymentStatus: PaymentStatus.PROCESSING, paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: 'Evento VIP com montagem de welcome desk.',
      stay: { roomCode: 'VIL-01', status: StayStatus.IN_HOUSE, adults: 4, children: 0, expectedCheckInAt: setHour(addDays(today, -3), 14), expectedCheckOutAt: setHour(today, 12), actualCheckInAt: setHour(addDays(today, -3), 13, 50), notes: 'Check-out previsto para hoje com cobrança de extras pendentes.', folioEntries: [
        { type: FolioEntryType.POS, source: FolioEntrySource.POS, description: 'Espumantes e amenities VIP', amount: 240 },
        { type: FolioEntryType.ROOM_SERVICE, source: FolioEntrySource.POS, description: 'Café da manhã especial na villa', amount: 180 },
        { type: FolioEntryType.PAYMENT, source: FolioEntrySource.MANUAL, description: 'Adiantamento corporativo', amount: 2500 },
      ] },
      stayGuests: [{ name: 'Fernanda Moura', email: 'fernanda.moura@email.com', phone: '(71) 98776-5555', cpf: '220.110.330-55', isPrimary: true }],
    },
    {
      code: 'FH-SEED-260426-011', accommodationName: 'Chalé Romântico',
      guestName: 'Ana Costa', guestEmail: 'ana.costa@email.com', guestPhone: '(11) 94444-4444', guestWhatsApp: '(11) 94444-4444', guestCpf: '666.666.666-66',
      checkInDate: addDays(today, 4), checkOutDate: addDays(today, 6), numberOfGuests: 2, numberOfExtraBeds: 0,
      source: ReservationSource.WHATSAPP, status: ReservationStatus.CONFIRMED, paymentStatus: PaymentStatus.PROCESSING, paymentMethod: PaymentMethod.PIX,
      paymentLinkUrl: 'https://pay.fusehotel.test/romantico/FH-SEED-260426-011', paymentLinkExpiresAt: addDays(today, 1),
      preCheckIn: { status: PreCheckInStatus.SUBMITTED, fnrhStatus: FNRHStatus.PENDING, guestData: { acompanhante: 'Rafael Costa' }, submittedAt: today },
    },
    {
      code: 'FH-SEED-260426-012', accommodationName: 'Quarto Standard Vista Jardim',
      guestName: 'Marcelo Torres', guestEmail: 'marcelo.torres@email.com', guestPhone: '(61) 98888-1234', guestWhatsApp: '(61) 98888-1234', guestCpf: '101.202.303-40',
      checkInDate: today, checkOutDate: tomorrow, numberOfGuests: 1, numberOfExtraBeds: 0,
      source: ReservationSource.WALK_IN, status: ReservationStatus.CHECKED_IN, paymentStatus: PaymentStatus.COMPLETED, paymentMethod: PaymentMethod.CASH,
      payments: [{ amount: 267.5, method: PaymentMethod.CASH, status: PaymentStatus.COMPLETED, transactionId: 'PAY-SEED-012' }],
      stay: { roomCode: '302', status: StayStatus.IN_HOUSE, adults: 1, children: 0, expectedCheckInAt: setHour(today, 18), expectedCheckOutAt: setHour(tomorrow, 12), actualCheckInAt: setHour(today, 18, 5), notes: 'Walk-in do balcão para uma diária.', folioEntries: [{ type: FolioEntryType.PAYMENT, source: FolioEntrySource.MANUAL, description: 'Pagamento integral no balcão', amount: 267.5 }] },
      stayGuests: [{ name: 'Marcelo Torres', email: 'marcelo.torres@email.com', phone: '(61) 98888-1234', cpf: '101.202.303-40', isPrimary: true }],
    },
  ];

  const reservationsByCode = new Map<string, { id: string }>();
  const staysByReservationCode = new Map<string, { id: string }>();
  const foliosByReservationCode = new Map<string, { id: string }>();

  for (const reservationSeed of reservationsData) {
    const accommodation = accommodationByName.get(reservationSeed.accommodationName);
    if (!accommodation) throw new Error(`Acomodação não encontrada para reserva: ${reservationSeed.accommodationName}`);
    const nights = Math.max(1, Math.round((reservationSeed.checkOutDate.getTime() - reservationSeed.checkInDate.getTime()) / DAY));
    const pricing = buildReservationAmounts({ pricePerNight: Number(accommodation.pricePerNight), nights, extraBeds: reservationSeed.numberOfExtraBeds, extraBedPrice: Number(accommodation.extraBedPrice), discount: reservationSeed.businessAccountName ? 80 : 0 });
    const user = reservationSeed.userEmail ? userByEmail.get(reservationSeed.userEmail) : null;
    const businessAccount = reservationSeed.businessAccountName ? businessByName.get(reservationSeed.businessAccountName) : null;

    const reservation = await prisma.reservation.create({ data: {
      reservationCode: reservationSeed.code, accommodationId: accommodation.id, userId: user?.id, businessAccountId: businessAccount?.id,
      checkInDate: reservationSeed.checkInDate, checkOutDate: reservationSeed.checkOutDate, numberOfNights: nights, numberOfGuests: reservationSeed.numberOfGuests,
      numberOfExtraBeds: reservationSeed.numberOfExtraBeds, guestName: reservationSeed.guestName, guestEmail: reservationSeed.guestEmail, guestPhone: reservationSeed.guestPhone,
      guestWhatsApp: reservationSeed.guestWhatsApp, guestCpf: reservationSeed.guestCpf, pricePerNight: Number(accommodation.pricePerNight), subtotal: pricing.subtotal,
      extraBedsCost: pricing.extraBedsCost, serviceFee: pricing.serviceFee, taxes: pricing.taxes, discount: pricing.discount, totalAmount: pricing.totalAmount,
      status: reservationSeed.status, paymentStatus: reservationSeed.paymentStatus, paymentMethod: reservationSeed.paymentMethod, source: reservationSeed.source,
      externalChannel: reservationSeed.externalChannel, externalReservationId: reservationSeed.externalReservationId, paymentLinkUrl: reservationSeed.paymentLinkUrl,
      paymentLinkExpiresAt: reservationSeed.paymentLinkExpiresAt, specialRequests: reservationSeed.specialRequests, cancelledAt: reservationSeed.cancelledAt,
      cancellationReason: reservationSeed.cancellationReason, checkedInAt: reservationSeed.stay?.actualCheckInAt, checkedOutAt: reservationSeed.stay?.actualCheckOutAt,
      voucherSentAt: reservationSeed.voucherSentAt,
    } });
    reservationsByCode.set(reservationSeed.code, { id: reservation.id });
    if (reservationSeed.payments) {
      for (const payment of reservationSeed.payments) {
        await prisma.payment.create({ data: {
          reservationId: reservation.id, amount: payment.amount, method: payment.method, status: payment.status, transactionId: payment.transactionId,
          gateway: payment.method === PaymentMethod.PIX ? 'PIX' : 'Stripe Test', paidAt: payment.status === PaymentStatus.COMPLETED ? addDays(today, -1) : null,
          refundedAt: payment.status === PaymentStatus.REFUNDED ? today : null,
        } });
      }
    }

    if (reservationSeed.preCheckIn) {
      await prisma.preCheckIn.create({ data: {
        reservationId: reservation.id, token: `PCHI-${reservationSeed.code}`, status: reservationSeed.preCheckIn.status, fnrhStatus: reservationSeed.preCheckIn.fnrhStatus,
        guestData: reservationSeed.preCheckIn.guestData, documentData: reservationSeed.preCheckIn.documentData,
        signatureData: reservationSeed.preCheckIn.status !== PreCheckInStatus.PENDING ? 'data:image/png;base64,SEED' : null,
        submittedAt: reservationSeed.preCheckIn.submittedAt, approvedAt: reservationSeed.preCheckIn.approvedAt,
      } });
    }

    if (reservationSeed.stay) {
      const roomUnit = roomUnitByCode.get(reservationSeed.stay.roomCode);
      const stay = await prisma.stay.create({ data: {
        reservationId: reservation.id, roomUnitId: roomUnit?.id, status: reservationSeed.stay.status, adults: reservationSeed.stay.adults,
        children: reservationSeed.stay.children, notes: reservationSeed.stay.notes, expectedCheckInAt: reservationSeed.stay.expectedCheckInAt,
        expectedCheckOutAt: reservationSeed.stay.expectedCheckOutAt, actualCheckInAt: reservationSeed.stay.actualCheckInAt, actualCheckOutAt: reservationSeed.stay.actualCheckOutAt,
      } });
      staysByReservationCode.set(reservationSeed.code, { id: stay.id });

      for (const guest of reservationSeed.stayGuests || []) {
        await prisma.stayGuest.create({ data: { stayId: stay.id, userId: guest.email ? userByEmail.get(guest.email)?.id : null, name: guest.name, email: guest.email, phone: guest.phone, cpf: guest.cpf, isPrimary: guest.isPrimary } });
      }

      const folio = await prisma.folio.create({ data: { stayId: stay.id, isClosed: reservationSeed.stay.closeFolio === true, closedAt: reservationSeed.stay.closeFolio === true ? reservationSeed.stay.actualCheckOutAt || today : null } });
      const baseEntries = [
        { type: FolioEntryType.DAILY_RATE, source: FolioEntrySource.RESERVATION, description: 'Diárias da reserva', amount: pricing.subtotal },
        pricing.extraBedsCost > 0 ? { type: FolioEntryType.EXTRA_BED, source: FolioEntrySource.RESERVATION, description: 'Camas extras', amount: pricing.extraBedsCost } : null,
        pricing.serviceFee > 0 ? { type: FolioEntryType.SERVICE_FEE, source: FolioEntrySource.RESERVATION, description: 'Taxa de serviço', amount: pricing.serviceFee } : null,
        pricing.taxes > 0 ? { type: FolioEntryType.TAX, source: FolioEntrySource.RESERVATION, description: 'Impostos', amount: pricing.taxes } : null,
        pricing.discount > 0 ? { type: FolioEntryType.DISCOUNT, source: FolioEntrySource.RESERVATION, description: 'Desconto aplicado', amount: pricing.discount } : null,
        ...(reservationSeed.stay.folioEntries || []),
      ].filter(Boolean) as Array<{ type: FolioEntryType; source: FolioEntrySource; description: string; amount: number }>;

      let balance = 0;
      for (const entry of baseEntries) {
        const amount = signedFolioAmount(entry.type, entry.amount);
        balance += amount;
        await prisma.folioEntry.create({ data: { folioId: folio.id, type: entry.type, source: entry.source, description: entry.description, amount, quantity: 1 } });
      }
      await prisma.folio.update({ where: { id: folio.id }, data: { balance } });
      foliosByReservationCode.set(reservationSeed.code, { id: folio.id });
    }

    if (reservationSeed.feedback) {
      await prisma.guestFeedback.create({ data: { reservationId: reservation.id, rating: reservationSeed.feedback.rating, source: reservationSeed.feedback.source, comment: reservationSeed.feedback.comment } });
    }
    if (reservationSeed.review && user) {
      await prisma.review.create({ data: { reservationId: reservation.id, accommodationId: accommodation.id, userId: user.id, rating: reservationSeed.review.rating, title: reservationSeed.review.title, comment: reservationSeed.review.comment, isApproved: true, approvedAt: today } });
    }
  }
  const housekeepingTasksPayload: Array<[string, string, string, HousekeepingTaskStatus, HousekeepingTaskPriority, string, Date, Date | null, Date | null, string | undefined, string | undefined]> = [
    ['103', 'Limpeza pós-saída', 'Apartamento saiu hoje e precisa liberação para nova reserva.', HousekeepingTaskStatus.PENDING, HousekeepingTaskPriority.HIGH, 'Sandra Camareira', setHour(today, 11), null, null, reservationsByCode.get('FH-SEED-260426-008')?.id, undefined],
    ['104', 'Limpeza em andamento', 'Troca completa de enxoval e reposição de minibar.', HousekeepingTaskStatus.IN_PROGRESS, HousekeepingTaskPriority.MEDIUM, 'Patrícia Gomes', setHour(today, 10), setHour(today, 10, 20), null, undefined, undefined],
    ['301', 'Inspeção de suíte premium', 'Validar amenities após check-out recente.', HousekeepingTaskStatus.INSPECTED, HousekeepingTaskPriority.MEDIUM, 'Rafael Lima', setHour(yesterday, 15), setHour(yesterday, 15, 30), setHour(yesterday, 16), reservationsByCode.get('FH-SEED-260426-006')?.id, staysByReservationCode.get('FH-SEED-260426-006')?.id],
    ['404', 'Preparação para chegada', 'Suíte família chega em dois dias; conferir berço e cama extra.', HousekeepingTaskStatus.PENDING, HousekeepingTaskPriority.HIGH, 'Sandra Camareira', setHour(tomorrow, 9), null, null, reservationsByCode.get('FH-SEED-260426-003')?.id, undefined],
  ];
  for (const [roomCode, title, notes, status, priority, assignedToName, scheduledFor, startedAt, completedAt, reservationId, stayId] of housekeepingTasksPayload) {
    const roomUnit = roomUnitByCode.get(roomCode);
    if (!roomUnit) continue;
    await prisma.housekeepingTask.create({ data: { roomUnitId: roomUnit.id, stayId, reservationId, assignedToId: staffByName.get(assignedToName)?.id, status, priority, title, notes, scheduledFor, startedAt, completedAt, inspectedAt: status === HousekeepingTaskStatus.INSPECTED ? completedAt : null, checklist: { roupas: true, minibar: true, banheiro: true } } });
  }

  const maintenancePayload: Array<[string, string, string, MaintenanceOrderStatus, MaintenanceOrderPriority, number, number | null, Date, Date | null, Date | null]> = [
    ['106', 'Vazamento no banheiro', 'Troca de tubulação sob a pia e vedação do box.', MaintenanceOrderStatus.OPEN, MaintenanceOrderPriority.URGENT, 850, null, addDays(today, -1), null, null],
    ['203', 'Ar-condicionado sem refrigeração', 'Equipe técnica verificando condensadora.', MaintenanceOrderStatus.IN_PROGRESS, MaintenanceOrderPriority.HIGH, 420, null, addDays(today, -2), today, null],
    ['CHA-03', 'Revisão do deck externo', 'Manutenção concluída aguardando reabertura comercial.', MaintenanceOrderStatus.COMPLETED, MaintenanceOrderPriority.MEDIUM, 1200, 1175, addDays(today, -10), addDays(today, -8), addDays(today, -5)],
  ];
  for (const [roomCode, title, description, status, priority, estimatedCost, actualCost, openedAt, startedAt, completedAt] of maintenancePayload) {
    const roomUnit = roomUnitByCode.get(roomCode);
    if (!roomUnit) continue;
    await prisma.maintenanceOrder.create({ data: { roomUnitId: roomUnit.id, title, description, status, priority, estimatedCost, actualCost, blockedFrom: openedAt, blockedUntil: completedAt, openedAt, startedAt, completedAt, notes: 'Ordem criada pela equipe de manutenção para ambiente de demonstração.' } });
  }

  const closedCashSession = await prisma.cashSession.create({ data: { code: 'CX-20260425-SEED1', status: CashSessionStatus.CLOSED, openingFloat: 300, expectedCashAmount: 628.5, countedCashAmount: 628.5, differenceAmount: 0, notes: 'Caixa do restaurante encerrado sem divergências.', openedByUserId: manager?.id, openedByEmail: manager?.email, closedByUserId: manager?.id, closedByEmail: manager?.email, openedAt: setHour(yesterday, 7), closedAt: setHour(yesterday, 23, 10) } });
  const openCashSession = await prisma.cashSession.create({ data: { code: 'CX-20260426-SEED2', status: CashSessionStatus.OPEN, openingFloat: 400, notes: 'Caixa atual do PDV central.', openedByUserId: admin?.id, openedByEmail: admin?.email, openedAt: setHour(today, 7) } });
  await prisma.cashMovement.create({ data: { cashSessionId: closedCashSession.id, type: CashMovementType.OPENING_FLOAT, method: PaymentMethod.CASH, amount: 300, description: 'Fundo inicial do caixa do restaurante', performedByUserId: manager?.id, performedByEmail: manager?.email, createdAt: setHour(yesterday, 7) } });
  await prisma.cashMovement.create({ data: { cashSessionId: openCashSession.id, type: CashMovementType.OPENING_FLOAT, method: PaymentMethod.CASH, amount: 400, description: 'Fundo inicial do PDV central', performedByUserId: admin?.id, performedByEmail: admin?.email, createdAt: setHour(today, 7) } });

  const posOrdersSeed: any[] = [
    { orderNumber: 'POS-SEED-001', origin: POSOrderOrigin.RESTAURANT, settlementType: POSSettlementType.DIRECT, status: POSOrderStatus.CLOSED, customerName: 'Passante almoço executivo', tableNumber: 'M12', notes: 'Pedido fechado no salão do restaurante.', serviceFeeAmount: 6, discountAmount: 0, items: [{ sku: 'ALM-003', quantity: 1 }, { sku: 'BEB-005', quantity: 2 }], cashSessionId: closedCashSession.id, payments: [{ amount: 77, method: PaymentMethod.DEBIT_CARD, status: PaymentStatus.COMPLETED, transactionId: 'POSPAY-SEED-001' }], createdAt: setHour(yesterday, 13, 20), closeAt: setHour(yesterday, 14, 5) },
    { orderNumber: 'POS-SEED-002', origin: POSOrderOrigin.ROOM_SERVICE, settlementType: POSSettlementType.FOLIO, status: POSOrderStatus.CLOSED, customerName: 'João Silva', roomCode: '101', stayCode: 'FH-SEED-260426-001', notes: 'Lançado na conta da hospedagem.', serviceFeeAmount: 0, discountAmount: 0, items: [{ sku: 'ALM-002', quantity: 1 }, { sku: 'BEB-004', quantity: 2 }], postedToFolioAt: setHour(today, 9, 45), createdAt: setHour(today, 9, 10), closeAt: setHour(today, 9, 45) },
    { orderNumber: 'POS-SEED-003', origin: POSOrderOrigin.BAR, settlementType: POSSettlementType.DIRECT, status: POSOrderStatus.OPEN, customerName: 'Cliente piscina', tableNumber: 'B03', notes: 'Comanda em aberto no bar da piscina.', serviceFeeAmount: 4, discountAmount: 0, items: [{ sku: 'BEB-003', quantity: 2 }, { sku: 'ALM-005', quantity: 1 }], cashSessionId: openCashSession.id, createdAt: setHour(today, 15, 5) },
    { orderNumber: 'POS-SEED-004', origin: POSOrderOrigin.FRONTDESK, settlementType: POSSettlementType.DIRECT, status: POSOrderStatus.CANCELLED, customerName: 'Marcelo Torres', notes: 'Venda cancelada antes do recebimento.', serviceFeeAmount: 0, discountAmount: 5, items: [{ sku: 'CON-001', quantity: 1 }], cancellationReason: 'Cliente desistiu da compra no balcão.', createdAt: setHour(today, 18, 10), cancelAt: setHour(today, 18, 18) },
    { orderNumber: 'POS-SEED-005', origin: POSOrderOrigin.RESTAURANT, settlementType: POSSettlementType.DIRECT, status: POSOrderStatus.PREPARING, customerName: 'Mesa 08', tableNumber: 'M08', notes: 'Pedido em preparo na cozinha.', serviceFeeAmount: 5, discountAmount: 0, items: [{ sku: 'ALM-004', quantity: 1 }, { sku: 'BEB-001', quantity: 2 }], cashSessionId: openCashSession.id, createdAt: setHour(today, 19, 5) },
    { orderNumber: 'POS-SEED-006', origin: POSOrderOrigin.ROOM_SERVICE, settlementType: POSSettlementType.FOLIO, status: POSOrderStatus.DELIVERED, customerName: 'Beatriz Lima', roomCode: '401', stayCode: 'FH-SEED-260426-009', notes: 'Pedido entregue e aguardando fechamento no check-out.', serviceFeeAmount: 0, discountAmount: 0, items: [{ sku: 'ALM-006', quantity: 2 }, { sku: 'BEB-006', quantity: 1 }], createdAt: setHour(today, 20, 15) },
  ];
  for (const orderSeed of posOrdersSeed) {
    let subtotal = 0;
    const items = orderSeed.items.map((item: any) => {
      const product = productBySku.get(item.sku);
      if (!product) throw new Error(`Produto não encontrado: ${item.sku}`);
      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;
      return { productId: product.id, productName: product.name, quantity: item.quantity, unitPrice: Number(product.price), totalPrice: lineTotal };
    });
    const totalAmount = subtotal + orderSeed.serviceFeeAmount - orderSeed.discountAmount;
    const stay = orderSeed.stayCode ? staysByReservationCode.get(orderSeed.stayCode) : null;
    const roomUnit = orderSeed.roomCode ? roomUnitByCode.get(orderSeed.roomCode) : null;
    const order = await prisma.pOSOrder.create({ data: { orderNumber: orderSeed.orderNumber, stayId: stay?.id, roomUnitId: roomUnit?.id, origin: orderSeed.origin, settlementType: orderSeed.settlementType, status: orderSeed.status, customerName: orderSeed.customerName, tableNumber: orderSeed.tableNumber, notes: orderSeed.notes, subtotalAmount: subtotal, serviceFeeAmount: orderSeed.serviceFeeAmount, discountAmount: orderSeed.discountAmount, totalAmount, paidAmount: orderSeed.payments?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0, postedToFolioAt: orderSeed.postedToFolioAt, closedAt: orderSeed.closeAt || null, cancelledAt: orderSeed.cancelAt || null, cancellationReason: orderSeed.cancellationReason, createdAt: orderSeed.createdAt, items: { create: items } } });

    if (orderSeed.payments) {
      for (const paymentSeed of orderSeed.payments) {
        const payment = await prisma.pOSPayment.create({ data: { orderId: order.id, cashSessionId: orderSeed.cashSessionId, amount: paymentSeed.amount, refundedAmount: 0, method: paymentSeed.method, status: paymentSeed.status, transactionId: paymentSeed.transactionId, reference: `REF-${paymentSeed.transactionId}`, gateway: paymentSeed.method === PaymentMethod.DEBIT_CARD ? 'Stone Test' : 'PDV Manual', notes: 'Pagamento gerado pela seed.', paidAt: orderSeed.closeAt || orderSeed.createdAt, createdByUserId: admin?.id, createdByEmail: admin?.email } });
        await prisma.cashMovement.create({ data: { cashSessionId: orderSeed.cashSessionId || openCashSession.id, orderId: order.id, paymentId: payment.id, type: CashMovementType.SALE, method: paymentSeed.method, amount: paymentSeed.amount, description: `Recebimento do pedido ${order.orderNumber}`, performedByUserId: admin?.id, performedByEmail: admin?.email, createdAt: orderSeed.closeAt || orderSeed.createdAt } });
      }
    }

    if (orderSeed.postedToFolioAt && orderSeed.stayCode) {
      const folio = foliosByReservationCode.get(orderSeed.stayCode);
      if (folio) {
        await prisma.folioEntry.create({ data: { folioId: folio.id, type: FolioEntryType.POS, source: FolioEntrySource.POS, description: `Consumo do pedido ${order.orderNumber}`, amount: totalAmount, quantity: 1, referenceId: order.id } });
        const aggregate = await prisma.folioEntry.aggregate({ where: { folioId: folio.id }, _sum: { amount: true } });
        await prisma.folio.update({ where: { id: folio.id }, data: { balance: Number(aggregate._sum.amount ?? 0) } });
      }
    }

    for (const item of items) {
      const product = posProducts.find((entry) => entry.id === item.productId);
      if (product?.trackStock) {
        await prisma.inventoryMovement.create({ data: { productId: product.id, type: StockMovementType.CONSUMPTION, quantity: item.quantity, referenceId: order.id, notes: `Baixa automática do pedido ${order.orderNumber}`, createdByUserId: admin?.id, createdByEmail: admin?.email } });
      }
    }
  }

  await prisma.cashMovement.create({ data: { cashSessionId: openCashSession.id, type: CashMovementType.SUPPLY, method: PaymentMethod.CASH, amount: 150, description: 'Suprimento para troco do turno da noite', performedByUserId: admin?.id, performedByEmail: admin?.email, createdAt: setHour(today, 18, 30) } });
  await prisma.cashMovement.create({ data: { cashSessionId: openCashSession.id, type: CashMovementType.WITHDRAWAL, method: PaymentMethod.CASH, amount: 80, description: 'Sangria parcial para segurança do caixa', performedByUserId: admin?.id, performedByEmail: admin?.email, createdAt: setHour(today, 21, 10) } });

  await prisma.reservationQuote.createMany({ data: [
    { quoteCode: 'ORC-SEED-001', accommodationId: accommodationByName.get('Chalé Romântico')!.id, guestName: 'Paula Nascimento', guestEmail: 'paula.nascimento@email.com', guestPhone: '(11) 98800-1200', source: ReservationSource.WHATSAPP, checkInDate: addDays(today, 12), checkOutDate: addDays(today, 14), numberOfGuests: 2, numberOfExtraBeds: 0, amount: 1980, status: QuoteStatus.SENT, paymentLinkUrl: 'https://pay.fusehotel.test/quote/ORC-SEED-001', expiresAt: addDays(today, 2), notes: 'Cotação enviada com decoração romântica opcional.' },
    { quoteCode: 'ORC-SEED-002', accommodationId: accommodationByName.get('Suíte Família')!.id, guestName: 'Mariana Souza', guestEmail: 'mariana.souza@email.com', guestPhone: '(31) 98877-1000', source: ReservationSource.EMAIL, checkInDate: addDays(today, 20), checkOutDate: addDays(today, 24), numberOfGuests: 4, numberOfExtraBeds: 0, amount: 2860, status: QuoteStatus.OPEN, expiresAt: addDays(today, 5), notes: 'Família avaliando datas de férias escolares.' },
    { quoteCode: 'ORC-SEED-003', accommodationId: accommodationByName.get('Quarto Deluxe Vista Mar')!.id, guestName: 'Carlos Menezes', guestEmail: 'carlos.menezes@email.com', guestPhone: '(21) 98123-2020', source: ReservationSource.PHONE, checkInDate: addDays(today, -10), checkOutDate: addDays(today, -7), numberOfGuests: 2, numberOfExtraBeds: 0, amount: 1350, status: QuoteStatus.CONVERTED, convertedReservationId: reservationsByCode.get('FH-SEED-260426-005')?.id, notes: 'Orçamento convertido em reserva OTA confirmada.' },
    { quoteCode: 'ORC-SEED-004', accommodationId: accommodationByName.get('Villa Presidencial')!.id, guestName: 'Renata Brandão', guestEmail: 'renata.brandao@email.com', guestPhone: '(81) 99911-5500', source: ReservationSource.CORPORATE, checkInDate: nextMonth, checkOutDate: addDays(nextMonth, 3), numberOfGuests: 6, numberOfExtraBeds: 1, amount: 5120, status: QuoteStatus.EXPIRED, expiresAt: addDays(today, -1), notes: 'Grupo corporativo não confirmou dentro do prazo.' },
  ] });

  await prisma.financialEntry.createMany({ data: [
    { type: FinancialEntryType.RECEIVABLE, status: FinancialEntryStatus.OPEN, description: 'Faturamento BlueWave - hospedagem corporativa', category: 'Hospedagem corporativa', amount: 2784, paidAmount: 0, dueDate: addDays(today, 15), customerName: 'BlueWave Viagens Corporativas', referenceType: 'RESERVATION', referenceId: reservationsByCode.get('FH-SEED-260426-003')?.id, notes: 'Cobrança por faturamento após check-out.' },
    { type: FinancialEntryType.RECEIVABLE, status: FinancialEntryStatus.PAID, description: 'Receita balcão - walk-in Marcelo Torres', category: 'Recepção', amount: 267.5, paidAmount: 267.5, dueDate: today, issuedAt: today, paidAt: today, customerName: 'Marcelo Torres', referenceType: 'RESERVATION', referenceId: reservationsByCode.get('FH-SEED-260426-012')?.id },
    { type: FinancialEntryType.PAYABLE, status: FinancialEntryStatus.OPEN, description: 'Fornecedor de lavanderia terceirizada', category: 'Lavanderia', amount: 780, paidAmount: 0, dueDate: addDays(today, 7), supplierName: 'Lavanderia Brilho Azul', notes: 'Faturas de enxoval e roupas de hóspedes.' },
    { type: FinancialEntryType.PAYABLE, status: FinancialEntryStatus.PARTIALLY_PAID, description: 'Compra de bebidas para bar da piscina', category: 'Estoque bar', amount: 1460, paidAmount: 600, dueDate: addDays(today, 10), supplierName: 'Distribuidora Mar Azul', notes: 'Pagamento parcial já realizado.' },
    { type: FinancialEntryType.PAYABLE, status: FinancialEntryStatus.OVERDUE, description: 'Manutenção deck chalé 03', category: 'Manutenção', amount: 1175, paidAmount: 0, dueDate: addDays(today, -3), supplierName: 'Deck & Wood Serviços', referenceType: 'MAINTENANCE' },
    { type: FinancialEntryType.RECEIVABLE, status: FinancialEntryStatus.OPEN, description: 'Evento Horizonte - villa presidencial', category: 'Eventos e hospedagem', amount: 2791, paidAmount: 0, dueDate: addDays(today, 5), customerName: 'Horizonte Eventos e Incentivos', referenceType: 'RESERVATION', referenceId: reservationsByCode.get('FH-SEED-260426-010')?.id },
  ] });

  const villaStay = staysByReservationCode.get('FH-SEED-260426-010');
  const completedStay = staysByReservationCode.get('FH-SEED-260426-006');
  if (villaStay) {
    await prisma.lostFoundItem.create({ data: { roomUnitId: roomUnitByCode.get('VIL-01')?.id, stayId: villaStay.id, title: 'Carregador USB-C', description: 'Encontrado próximo à bancada da sala.', foundBy: 'Sandra Camareira', storedLocation: 'Armário de achados e perdidos - caixa A', status: LostFoundStatus.OPEN } });
  }
  if (completedStay) {
    await prisma.lostFoundItem.create({ data: { roomUnitId: roomUnitByCode.get('301')?.id, stayId: completedStay.id, title: 'Óculos escuros', description: 'Cliente informou retirada futura pela recepção.', foundBy: 'Rafael Lima', storedLocation: 'Recepção cofre 02', status: LostFoundStatus.RETURNED, claimedBy: 'Pedro Oliveira', claimedAt: addDays(today, -1) } });
  }

  logger.info('✅ PMS operational data seeded successfully');
  logger.info(`✅ Quartos físicos: ${await prisma.roomUnit.count()}`);
  logger.info(`✅ Reservas: ${await prisma.reservation.count()}`);
  logger.info(`✅ Estadias: ${await prisma.stay.count()}`);
  logger.info(`✅ Produtos PDV: ${await prisma.pOSProduct.count()}`);
  logger.info(`✅ Pedidos PDV: ${await prisma.pOSOrder.count()}`);
}


