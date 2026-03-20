import { Request, Response } from 'express';
import { whatsappConnection } from '../services/WhatsAppConnectionService.js';
import { pool } from '../config/database.js';

export class MessageController {
  async send(req: Request, res: Response) {
    try {
      const { conversationId, content, type = 'text' } = req.body;
      const { userId } = req.user!;

      // Save message to DB
      const result = await pool.query(
        `INSERT INTO messages (conversation_id, sender_type, sender_id, content)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [conversationId, 'agent', userId, content]
      );

      await pool.query(
        'UPDATE conversations SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1',
        [conversationId]
      );

      // Send via WhatsApp if connected
      const waState = whatsappConnection.getState();
      if (waState.status === 'connected') {
        const convResult = await pool.query(
          `SELECT c.phone, c.whatsapp_id FROM customers c
           JOIN conversations conv ON conv.customer_id = c.id
           WHERE conv.id = $1`,
          [conversationId]
        );

        const sendTo = convResult.rows[0]?.whatsapp_id || convResult.rows[0]?.phone;
        if (sendTo) {
          try {
            await whatsappConnection.sendMessage(sendTo, content);
          } catch (waError) {
            console.error('WhatsApp send failed (message saved to DB):', waError);
          }
        }
      }

      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('Send message error:', error.message);
      res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;

      const messages = await pool.query(
        `SELECT m.*, u.name as sender_name
         FROM messages m
         LEFT JOIN users u ON m.sender_id = u.id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at ASC`,
        [conversationId]
      );

      res.json(messages.rows);
    } catch (error: any) {
      console.error('Get history error:', error.message);
      res.status(500).json({ error: 'Failed to get message history' });
    }
  }
}
