import { Request, Response } from 'express';
import { WhatsAppService } from '../services/WhatsAppService';
import { pool } from '../config/database';

const whatsappService = new WhatsAppService();

export class WebhookController {
  async verify(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const result = whatsappService.verifyWebhook(
      mode as string,
      token as string,
      challenge as string
    );

    if (result) {
      return res.status(200).send(result);
    }

    res.status(403).send('Forbidden');
  }

  async receive(req: Request, res: Response) {
    try {
      const message = whatsappService.parseWebhookMessage(req.body);

      if (!message) {
        return res.sendStatus(200);
      }

      const customerPhone = message.from;
      const messageText = message.text?.body || '';

      let customer = await pool.query(
        'SELECT id FROM customers WHERE phone = $1',
        [customerPhone]
      );

      if (customer.rows.length === 0) {
        const newCustomer = await pool.query(
          'INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING id',
          [`Cliente ${customerPhone}`, customerPhone, null]
        );
        customer = newCustomer;
      }

      const customerId = customer.rows[0].id;

      let conversation = await pool.query(
        'SELECT id FROM conversations WHERE customer_id = $1 AND status = $2',
        [customerId, 'open']
      );

      if (conversation.rows.length === 0) {
        const newConversation = await pool.query(
          `INSERT INTO conversations (customer_id, channel_id, status, last_message_at)
           VALUES ($1, (SELECT id FROM channels LIMIT 1), $2, NOW())
           RETURNING id`,
          [customerId, 'open']
        );
        conversation = newConversation;
      }

      const conversationId = conversation.rows[0].id;

      await pool.query(
        `INSERT INTO messages (conversation_id, sender_type, content, whatsapp_message_id)
         VALUES ($1, $2, $3, $4)`,
        [conversationId, 'customer', messageText, message.id]
      );

      await pool.query(
        'UPDATE conversations SET last_message_at = NOW() WHERE id = $1',
        [conversationId]
      );

      await whatsappService.markAsRead(message.id);

      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook error:', error);
      res.sendStatus(500);
    }
  }
}
