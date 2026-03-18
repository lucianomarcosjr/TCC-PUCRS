import { ChatLog, IChatLog } from '../models/ChatLog';

export class ChatLogService {
  async logEvent(data: Partial<IChatLog>) {
    try {
      const log = new ChatLog(data);
      await log.save();
      return log;
    } catch (error) {
      console.error('Error logging event:', error);
      throw error;
    }
  }

  async getConversationLogs(conversationId: string) {
    return ChatLog.find({ conversationId }).sort({ timestamp: -1 });
  }

  async getUserActivity(userId: string, limit: number = 50) {
    return ChatLog.find({ userId }).sort({ timestamp: -1 }).limit(limit);
  }

  async getEventsByType(event: string, startDate?: Date, endDate?: Date) {
    const query: any = { event };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    return ChatLog.find(query).sort({ timestamp: -1 });
  }
}
