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

  static async getActiveCashSession(_req: Request, res: Response, next: NextFunction) {
    try {
      const session = await POSService.getActiveCashSession();
      return sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  static async listCashSessions(_req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await POSService.listCashSessions();
      return sendSuccess(res, sessions);
    } catch (error) {
      next(error);
    }
  }

  static async openCashSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await POSService.openCashSession(req.body, (req as any).user);
      return sendSuccess(res, session, 'Caixa aberto com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async closeCashSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await POSService.closeCashSession(req.body, (req as any).user);
      return sendSuccess(res, session, 'Caixa fechado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async createCashMovement(req: Request, res: Response, next: NextFunction) {
    try {
      const movement = await POSService.createCashMovement(req.body, (req as any).user);
      return sendSuccess(res, movement, 'Movimentação registrada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async registerPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await POSService.registerPayment(req.body, (req as any).user);
      return sendSuccess(res, order, 'Pagamento registrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async refundPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await POSService.refundPayment(req.body, (req as any).user);
      return sendSuccess(res, order, 'Estorno registrado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await POSService.cancelOrder(req.params.id, req.body, (req as any).user);
      return sendSuccess(res, order, 'Pedido cancelado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
