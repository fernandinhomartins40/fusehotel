import { Router, Request, Response, NextFunction } from 'express';
import { PricingService } from '../services/pricing.service';

const router = Router();

router.post('/preview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accommodationId, checkInDate, checkOutDate, numberOfExtraBeds, promotionId, promotionCode } = req.body;

    if (!accommodationId || !checkInDate || !checkOutDate) {
      res.status(400).json({ message: 'accommodationId, checkInDate e checkOutDate sao obrigatorios' });
      return;
    }

    const breakdown = await PricingService.calculate({
      accommodationId,
      checkInDate,
      checkOutDate,
      numberOfExtraBeds: numberOfExtraBeds || 0,
      promotionId,
      promotionCode,
    });

    res.json({ data: breakdown });
  } catch (error) {
    next(error);
  }
});

export default router;
