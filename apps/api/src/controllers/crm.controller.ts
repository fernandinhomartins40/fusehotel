import { NextFunction, Request, Response } from 'express';
import { CRMService } from '../services/crm.service';
import { sendSuccess } from '../utils/response';

export class CRMController {
  static async listQuotes(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.listQuotes());
    } catch (error) {
      next(error);
    }
  }

  static async createQuote(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.createQuote(req.body), 'Orçamento criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuote(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.updateQuote(req.params.id, req.body), 'Orçamento atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async convertQuote(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.convertQuote(req.params.id), 'Orçamento convertido em reserva com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listBusinessAccounts(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.listBusinessAccounts());
    } catch (error) {
      next(error);
    }
  }

  static async createBusinessAccount(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.createBusinessAccount(req.body), 'Conta B2B criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateBusinessAccount(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.updateBusinessAccount(req.params.id, req.body), 'Conta B2B atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listFeedbacks(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.listFeedbacks());
    } catch (error) {
      next(error);
    }
  }

  static async createFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.createFeedback(req.body), 'Avaliação registrada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async issuePreCheckIn(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.issuePreCheckIn(req.body.reservationId), 'Pré-check-in gerado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listPreCheckIns(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.listPreCheckIns());
    } catch (error) {
      next(error);
    }
  }

  static async getPreCheckInByToken(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.getPreCheckInByToken(req.params.token));
    } catch (error) {
      next(error);
    }
  }

  static async submitPreCheckIn(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.submitPreCheckIn(req.params.token, req.body), 'Pré-check-in enviado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async approvePreCheckIn(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.approvePreCheckIn(req.params.id), 'Pré-check-in aprovado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async sendFNRH(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.sendFNRH(req.params.id), 'FNRH enviada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async sendVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.sendVoucher(req.params.reservationId), 'Voucher enviado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async generatePaymentLink(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await CRMService.generatePaymentLink(req.params.reservationId), 'Link de pagamento gerado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
