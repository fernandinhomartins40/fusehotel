import { Request, Response } from 'express';
import { scheduleService } from '../services/schedule.service';

export class ScheduleController {
  /**
   * GET /api/schedule
   * Get schedule for all accommodations or specific accommodation
   */
  async getSchedule(req: Request, res: Response) {
    try {
      const { startDate, endDate, accommodationId } = req.query;

      // Validate required parameters
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required',
        });
      }

      const schedule = await scheduleService.getSchedule({
        startDate: startDate as string,
        endDate: endDate as string,
        accommodationId: accommodationId as string | undefined,
      });

      return res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error: any) {
      console.error('Error fetching schedule:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching schedule',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/schedule/availability/:accommodationId
   * Check availability for specific accommodation
   */
  async checkAvailability(req: Request, res: Response) {
    try {
      const { accommodationId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required',
        });
      }

      const isAvailable = await scheduleService.checkAvailability(
        accommodationId,
        startDate as string,
        endDate as string
      );

      return res.status(200).json({
        success: true,
        data: {
          accommodationId,
          startDate,
          endDate,
          isAvailable,
        },
      });
    } catch (error: any) {
      console.error('Error checking availability:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking availability',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/schedule/stats
   * Get schedule statistics
   */
  async getStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required',
        });
      }

      const stats = await scheduleService.getScheduleStats(
        startDate as string,
        endDate as string
      );

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error fetching schedule stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching schedule stats',
        error: error.message,
      });
    }
  }
}

export const scheduleController = new ScheduleController();
