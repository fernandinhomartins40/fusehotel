import { NextFunction, Request, Response } from 'express';
import { RoomServiceService } from '../services/room-service.service';
import { sendSuccess } from '../utils/response';

export class RoomServiceController {
  static async listConfigurations(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnitId = typeof req.query.roomUnitId === 'string' ? req.query.roomUnitId : undefined;
      const data = await RoomServiceService.listConfigurations(roomUnitId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async upsertConfiguration(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.upsertConfiguration(req.body);
      return sendSuccess(res, data, 'Item do serviço de quarto salvo com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteConfiguration(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.deleteConfiguration(req.params.id);
      return sendSuccess(res, data, 'Item do serviço de quarto removido com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async getConferencePreview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.getConferencePreview(req.params.stayId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async confirmConference(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.confirmConference(req.params.stayId, req.body, req.user!);
      return sendSuccess(res, data, 'Conferência do quarto registrada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async myStay(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.getMyStay(req.user!.id);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async catalog(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.listCatalog();
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async myOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.listMyOrders(req.user!.id);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async createMyOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.createGuestOrder(req.user!.id, req.body);
      return sendSuccess(res, data, 'Pedido de serviço de quarto criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async toggleDoNotDisturb(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RoomServiceService.toggleDoNotDisturb(req.user!.id, req.body);
      return sendSuccess(
        res,
        data,
        req.body.enabled ? 'Quarto marcado como não perturbe' : 'Sinalização de não perturbe removida'
      );
    } catch (error) {
      next(error);
    }
  }
}
