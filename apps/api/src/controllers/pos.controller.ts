import { NextFunction, Request, Response } from 'express';
import { POSService } from '../services/pos.service';
import { sendSuccess } from '../utils/response';

export class POSController {
  static async listProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await POSService.listProducts();
      return sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await POSService.createProduct(req.body);
      return sendSuccess(res, product, 'Produto cadastrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await POSService.listOrders();
      return sendSuccess(res, orders);
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await POSService.createOrder(req.body);
      return sendSuccess(res, order, 'Pedido criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await POSService.updateOrderStatus(req.params.id, req.body);
      return sendSuccess(res, order, 'Status do pedido atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
