import { Request, Response } from 'express';
import { ChatLogService } from '../services/ChatLogService';
import { pool } from '../config/database.js';

const chatLogService = new ChatLogService();

export class AnalyticsController {
  async dashboard(req: Request, res: Response) {
    try {
      const { companyId } = req.user!;
      const days = parseInt(req.query.days as string) || 7;
      const since = new Date();
      since.setDate(since.getDate() - days);

      const prevSince = new Date(since);
      prevSince.setDate(prevSince.getDate() - days);

      const convResult = await pool.query(
        'SELECT COUNT(*) as total FROM conversations WHERE company_id = $1 AND created_at >= $2',
        [companyId, since]
      );
      const totalConversations = parseInt(convResult.rows[0].total);

      const prevConvResult = await pool.query(
        'SELECT COUNT(*) as total FROM conversations WHERE company_id = $1 AND created_at >= $2 AND created_at < $3',
        [companyId, prevSince, since]
      );
      const prevConversations = parseInt(prevConvResult.rows[0].total);

      const closedResult = await pool.query(
        'SELECT COUNT(*) as total FROM conversations WHERE company_id = $1 AND created_at >= $2 AND status = $3',
        [companyId, since, 'CLOSED']
      );
      const closedCount = parseInt(closedResult.rows[0].total);
      const resolutionRate = totalConversations > 0 ? Math.round((closedCount / totalConversations) * 100) : 0;

      const prevClosedResult = await pool.query(
        'SELECT COUNT(*) as total FROM conversations WHERE company_id = $1 AND created_at >= $2 AND created_at < $3 AND status = $4',
        [companyId, prevSince, since, 'CLOSED']
      );
      const prevClosedCount = parseInt(prevClosedResult.rows[0].total);
      const prevResolutionRate = prevConversations > 0 ? Math.round((prevClosedCount / prevConversations) * 100) : 0;

      const msgResult = await pool.query(
        `SELECT COUNT(*) as total FROM messages m
         JOIN conversations c ON m.conversation_id = c.id
         WHERE c.company_id = $1 AND m.created_at >= $2`,
        [companyId, since]
      );
      const totalMessages = parseInt(msgResult.rows[0].total);

      const dailyResult = await pool.query(
        `SELECT DATE(created_at) as date, COUNT(*) as count
         FROM conversations WHERE company_id = $1 AND created_at >= $2
         GROUP BY DATE(created_at) ORDER BY date`,
        [companyId, since]
      );

      const channelResult = await pool.query(
        `SELECT ch.type as channel, COUNT(m.id) as count
         FROM messages m
         JOIN conversations c ON m.conversation_id = c.id
         JOIN channels ch ON c.channel_id = ch.id
         WHERE c.company_id = $1 AND m.created_at >= $2
         GROUP BY ch.type`,
        [companyId, since]
      );

      const topClientsResult = await pool.query(
        `SELECT cust.id, cust.name,
           COUNT(DISTINCT c.id) as conversations,
           COUNT(m.id) as messages,
           MAX(m.created_at) as last_interaction
         FROM customers cust
         JOIN conversations c ON c.customer_id = cust.id
         LEFT JOIN messages m ON m.conversation_id = c.id
         WHERE cust.company_id = $1 AND c.created_at >= $2
         GROUP BY cust.id, cust.name
         ORDER BY conversations DESC, messages DESC
         LIMIT 10`,
        [companyId, since]
      );

      const topAgentsResult = await pool.query(
        `SELECT u.id, u.name, u.role,
           COUNT(DISTINCT c.id) as conversations,
           COUNT(m.id) as messages_sent
         FROM users u
         JOIN messages m ON m.sender_id = u.id AND m.sender_type = 'agent'
         JOIN conversations c ON m.conversation_id = c.id
         WHERE u.company_id = $1 AND m.created_at >= $2
         GROUP BY u.id, u.name, u.role
         ORDER BY messages_sent DESC
         LIMIT 5`,
        [companyId, since]
      );

      const ratingResult = await pool.query(
        'SELECT AVG(rating)::numeric(3,1) as avg_rating, COUNT(rating) as total_ratings FROM conversations WHERE company_id = $1 AND created_at >= $2 AND rating IS NOT NULL',
        [companyId, since]
      );
      const avgRating = ratingResult.rows[0].avg_rating ? parseFloat(ratingResult.rows[0].avg_rating) : null;
      const totalRatings = parseInt(ratingResult.rows[0].total_ratings);

      const prevRatingResult = await pool.query(
        'SELECT AVG(rating)::numeric(3,1) as avg_rating FROM conversations WHERE company_id = $1 AND created_at >= $2 AND created_at < $3 AND rating IS NOT NULL',
        [companyId, prevSince, since]
      );
      const prevAvgRating = prevRatingResult.rows[0].avg_rating ? parseFloat(prevRatingResult.rows[0].avg_rating) : null;

      const convChange = prevConversations > 0
        ? Math.round(((totalConversations - prevConversations) / prevConversations) * 100)
        : 0;

      res.json({
        totalConversations, convChange, resolutionRate,
        resolutionChange: resolutionRate - prevResolutionRate,
        totalMessages, avgRating, totalRatings,
        ratingChange: avgRating && prevAvgRating ? parseFloat((avgRating - prevAvgRating).toFixed(1)) : 0,
        conversationsPerDay: dailyResult.rows.map(r => ({ date: r.date, count: parseInt(r.count) })),
        messagesByChannel: channelResult.rows.map(r => ({ channel: r.channel, count: parseInt(r.count) })),
        topClients: topClientsResult.rows.map(r => ({
          id: r.id, name: r.name, conversations: parseInt(r.conversations),
          messages: parseInt(r.messages), lastInteraction: r.last_interaction,
        })),
        topAgents: topAgentsResult.rows.map(r => ({
          id: r.id, name: r.name, role: r.role,
          conversations: parseInt(r.conversations), messagesSent: parseInt(r.messages_sent),
        })),
      });
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({ error: 'Erro ao carregar analytics' });
    }
  }

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
      res.json({ event, count: logs.length, logs: logs.slice(0, 100) });
    } catch (error) {
      console.error('Get event stats error:', error);
      res.status(500).json({ error: 'Failed to get event stats' });
    }
  }
}
