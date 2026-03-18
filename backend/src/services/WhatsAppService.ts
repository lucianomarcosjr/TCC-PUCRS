import axios, { AxiosInstance } from 'axios';

interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'image' | 'document';
  text?: { body: string };
  image?: { link: string; caption?: string };
  document?: { link: string; filename: string };
}

interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string };
}

export class WhatsAppService {
  private client: AxiosInstance;
  private phoneNumberId: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.client = axios.create({
      baseURL: `https://graph.facebook.com/v18.0/${this.phoneNumberId}`,
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendTextMessage(to: string, message: string): Promise<any> {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    };

    const response = await this.client.post('/messages', payload);
    return response.data;
  }

  async sendImageMessage(to: string, imageUrl: string, caption?: string): Promise<any> {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: { link: imageUrl, caption },
    };

    const response = await this.client.post('/messages', payload);
    return response.data;
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.client.post('/messages', {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    });
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    
    return null;
  }

  parseWebhookMessage(body: any): WebhookMessage | null {
    try {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];

      if (!message) return null;

      return {
        from: message.from,
        id: message.id,
        timestamp: message.timestamp,
        type: message.type,
        text: message.text,
        image: message.image,
      };
    } catch (error) {
      console.error('Error parsing webhook message:', error);
      return null;
    }
  }
}
