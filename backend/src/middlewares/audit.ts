import { Request, Response, NextFunction } from 'express';
import { ChatLogService } from '../services/ChatLogService';

const chatLogService = new ChatLogService();

export const auditLog = (action: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const ip = req.ip || req.socket.remoteAddress;

      await chatLogService.logEvent({
        conversationId: 'audit',
        messageId: `audit-${Date.now()}`,
        event: 'message_sent' as any,
        userId,
        metadata: {
          action,
          ip,
          userAgent: req.headers['user-agent'],
          timestamp: new Date(),
          path: req.path,
          method: req.method,
        },
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }
    next();
  };
};
