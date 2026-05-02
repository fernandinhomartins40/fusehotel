import { Router, Request, Response, NextFunction } from 'express';
import { PricingService } from '../services/pricing.service';

const router = Router();

router.post('/preview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accommodationId, roomUnitId, checkInDate, checkOutDate, numberOfExtraBeds, promotionId, promotionCode } = req.body;

    if ((!accommodationId && !roomUnitId) || !checkInDate || !checkOutDate) {
      res.status(400).json({ message: 'roomUnitId ou accommodationId, checkInDate e checkOutDate sao obrigatorios' });
      return;
    }

    const breakdown = await PricingService.calculate({
      accommodationId,
      roomUnitId,
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
