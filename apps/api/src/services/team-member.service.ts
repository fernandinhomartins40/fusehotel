import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class TeamMemberService {
  static async getAll() {
    return await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllAdmin() {
    return await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!teamMember) {
      throw new NotFoundError('Membro da equipe não encontrado');
    }

    return teamMember;
  }

  static async create(data: any) {
    const maxOrder = await prisma.teamMember.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.teamMember.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const teamMember = await this.getById(id);

    return await prisma.teamMember.update({
      where: { id: teamMember.id },
      data
    });
  }

  static async delete(id: string) {
    const teamMember = await this.getById(id);

    await prisma.teamMember.delete({
      where: { id: teamMember.id }
    });
  }

  static async reorder(teamMemberIds: string[]) {
    const updates = teamMemberIds.map((id, index) =>
      prisma.teamMember.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
