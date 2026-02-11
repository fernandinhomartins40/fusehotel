import { Request, Response, NextFunction } from 'express';
import { TeamMemberService } from '../services/team-member.service';
import { sendSuccess } from '../utils/response';

export class TeamMemberController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const teamMembers = await TeamMemberService.getAll();
      return sendSuccess(res, teamMembers);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const teamMembers = await TeamMemberService.getAllAdmin();
      return sendSuccess(res, teamMembers);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const teamMember = await TeamMemberService.getById(id);
      return sendSuccess(res, teamMember);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const teamMember = await TeamMemberService.create(req.body);
      return sendSuccess(res, teamMember, 'Membro da equipe criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const teamMember = await TeamMemberService.update(id, req.body);
      return sendSuccess(res, teamMember, 'Membro da equipe atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await TeamMemberService.delete(id);
      return sendSuccess(res, null, 'Membro da equipe deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { teamMemberIds } = req.body;
      await TeamMemberService.reorder(teamMemberIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
