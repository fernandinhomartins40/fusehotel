import { Request, Response, NextFunction } from 'express';
import { ServiceItemService } from '../services/service-item.service';
import { sendSuccess } from '../utils/response';

export class ServiceItemController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceItems = await ServiceItemService.getAll();
      return sendSuccess(res, serviceItems);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceItems = await ServiceItemService.getAllAdmin();
      return sendSuccess(res, serviceItems);
    } catch (error) {
      next(error);
    }
  }

  static async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const serviceItems = await ServiceItemService.getByCategory(category as any);
      return sendSuccess(res, serviceItems);
    } catch (error) {
      next(error);
    }
  }

  static async getByCategoryAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const serviceItems = await ServiceItemService.getByCategoryAdmin(category as any);
      return sendSuccess(res, serviceItems);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const serviceItem = await ServiceItemService.getById(id);
      return sendSuccess(res, serviceItem);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceItem = await ServiceItemService.create(req.body);
      return sendSuccess(res, serviceItem, 'Item de serviço criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const serviceItem = await ServiceItemService.update(id, req.body);
      return sendSuccess(res, serviceItem, 'Item de serviço atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ServiceItemService.delete(id);
      return sendSuccess(res, null, 'Item de serviço deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceItemIds } = req.body;
      await ServiceItemService.reorder(serviceItemIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
