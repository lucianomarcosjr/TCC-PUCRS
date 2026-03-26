import { Request, Response } from 'express';
import { WhatsAppService } from '../services/WhatsAppService';
import { pool } from '../config/database';

const whatsappService = new WhatsAppService();

export class WebhookController {
  async verify(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const result = whatsappService.verifyWebhook(mode as string, token as string, challenge as string);
    if (result) return res.status(200).send(result);
    res.status(403).send('Forbidden');
  }

  async receive(req: Request, res: Response) {
    try {
      const message = whatsappService.parseWebhookMessage(req.body);
      if (!message) return res.sendStatus(200);

      const customerPhone = message.from;
      const messageText = message.text?.body || '';

      let customer = await pool.query('SELECT id FROM customers WHERE phone = $1', [customerPhone]);
      if (customer.rows.length === 0) {
        customer = await pool.query('INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING id', [`Cliente ${customerPhone}`, customerPhone, null]);
      }
      const customerId = customer.rows[0].id;

      // Verificar se há conversa aguardando avaliação
      const awaitingRating = await pool.query(
        'SELECT id FROM conversations WHERE customer_id = $1 AND awaiting_rating = TRUE ORDER BY updated_at DESC LIMIT 1', [customerId]
      );

      if (awaitingRating.rows.length > 0) {
        const convId = awaitingRating.rows[0].id;
        const rating = parseInt(messageText.trim());
        if (rating >= 1 && rating <= 5) {
          await pool.query('UPDATE conversations SET rating = $1, awaiting_rating = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [rating, convId]);
          await pool.query(`INSERT INTO messages (conversation_id, sender_type, content, whatsapp_message_id) VALUES ($1, 'customer', $2, $3)`, [convId, messageText, message.id]);
          const stars = '⭐'.repeat(rating);
          await pool.query(`INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, 'system', $2)`, [convId, `Avaliação recebida: ${stars} (${rating}/5). Obrigado!`]);
          await whatsappService.markAsRead(message.id);
          return res.sendStatus(200);
        }
      }

      // Fluxo normal
      let conversation = await pool.query('SELECT id FROM conversations WHERE customer_id = $1 AND status = $2', [customerId, 'OPEN']);
      if (conversation.rows.length === 0) {
        conversation = await pool.query(`INSERT INTO conversations (customer_id, channel_id, status, last_message_at) VALUES ($1, (SELECT id FROM channels LIMIT 1), $2, NOW()) RETURNING id`, [customerId, 'OPEN']);
      }
      const conversationId = conversation.rows[0].id;
      await pool.query(`INSERT INTO messages (conversation_id, sender_type, content, whatsapp_message_id) VALUES ($1, $2, $3, $4)`, [conversationId, 'customer', messageText, message.id]);
      await pool.query('UPDATE conversations SET last_message_at = NOW() WHERE id = $1', [conversationId]);
      await whatsappService.markAsRead(message.id);
      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook error:', error);
      res.sendStatus(500);
    }
  }
}
