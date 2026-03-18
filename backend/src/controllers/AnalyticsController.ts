import { Request, Response } from 'express';
import { ChatLogService } from '../services/ChatLogService';

const chatLogService = new ChatLogService();

export class AnalyticsController {
  async getConversationLogs(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const logs = await chatLogService.getConversationLogs(conversationId);
      res.json(logs);
    } catch (error) {
      console.error('Get conversation logs error:', error);
      res.status(500).json({ error: 'Failed to get logs' });
    }
  }

  async getUserActivity(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await chatLogService.getUserActivity(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error('Get user activity error:', error);
      res.status(500).json({ error: 'Failed to get user activity' });
    }
  }

  async getEventStats(req: Request, res: Response) {
    try {
      const { event } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const logs = await chatLogService.getEventsByType(event, start, end);
      
      res.json({
        event,
        count: logs.length,
        logs: logs.slice(0, 100),
      });
    } catch (error) {
      console.error('Get event stats error:', error);
      res.status(500).json({ error: 'Failed to get event stats' });
    }
  }
}
