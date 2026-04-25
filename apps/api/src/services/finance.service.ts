import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prismaPms = prisma as any;

export class FinanceService {
  static async listEntries() {
    const entries = await prismaPms.financialEntry.findMany({
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    });

    const summary = entries.reduce(
      (acc: any, entry: any) => {
        const amount = Number(entry.amount);
        const paid = Number(entry.paidAmount);

        if (entry.type === 'RECEIVABLE') {
          acc.receivableTotal += amount;
          acc.receivableOpen += Math.max(amount - paid, 0);
        } else {
          acc.payableTotal += amount;
          acc.payableOpen += Math.max(amount - paid, 0);
        }

        return acc;
      },
      {
        receivableTotal: 0,
        receivableOpen: 0,
        payableTotal: 0,
        payableOpen: 0,
      }
    );

    return { entries, summary };
  }

  static async createEntry(data: any) {
    return prismaPms.financialEntry.create({
      data: {
        type: data.type,
        status: data.status ?? 'OPEN',
        description: data.description.trim(),
        category: data.category?.trim(),
        amount: data.amount,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : new Date(),
        customerName: data.customerName?.trim(),
        supplierName: data.supplierName?.trim(),
        referenceType: data.referenceType?.trim(),
        referenceId: data.referenceId?.trim(),
        notes: data.notes?.trim(),
      },
    });
  }

  static async registerSettlement(id: string, data: any) {
    const entry = await prismaPms.financialEntry.findUnique({ where: { id } });

    if (!entry) {
      throw new NotFoundError('Lançamento financeiro não encontrado');
    }

    const settlementAmount = Number(data.amount);

    if (settlementAmount <= 0) {
      throw new BadRequestError('O valor deve ser maior que zero');
    }

    const nextPaidAmount = Number(entry.paidAmount) + settlementAmount;
    const totalAmount = Number(entry.amount);

    if (nextPaidAmount > totalAmount) {
      throw new BadRequestError('O valor informado excede o saldo em aberto');
    }

    const nextStatus =
      nextPaidAmount === totalAmount ? 'PAID' : nextPaidAmount > 0 ? 'PARTIALLY_PAID' : entry.status;

    return prismaPms.financialEntry.update({
      where: { id },
      data: {
        paidAmount: nextPaidAmount,
        paidAt: nextStatus === 'PAID' ? new Date() : undefined,
        status: nextStatus,
        notes: data.notes ? [entry.notes, data.notes.trim()].filter(Boolean).join('\n') : entry.notes,
      },
    });
  }
}
