import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import QRCode from 'qrcode';
import { EventEmitter } from 'events';
import { pool } from '../config/database.js';
import { automationService } from './AutomationService.js';

type ConnectionStatus = 'disconnected' | 'qr' | 'connecting' | 'connected';

interface ConnectionState {
  status: ConnectionStatus;
  qrDataUrl: string | null;
  phone: string | null;
  name: string | null;
}

async function getDefaultCompanyId(): Promise<string | null> {
  const result = await pool.query(
    "SELECT company_id FROM channels WHERE type = 'whatsapp' AND status = 'ACTIVE' LIMIT 1"
  );
  return result.rows[0]?.company_id || null;
}

async function getWhatsAppChannelId(companyId: string): Promise<string | null> {
  const result = await pool.query(
    "SELECT id FROM channels WHERE company_id = $1 AND type = 'whatsapp' AND status = 'ACTIVE' LIMIT 1",
    [companyId]
  );
  return result.rows[0]?.id || null;
}

class WhatsAppConnectionService extends EventEmitter {
  private client: Client | null = null;
  private state: ConnectionState = {
    status: 'disconnected',
    qrDataUrl: null,
    phone: null,
    name: null,
  };
  private page: any = null;

  private initializing = false;

  getState(): ConnectionState {
    return { ...this.state };
  }

  async initialize(): Promise<void> {
    if (this.initializing || this.state.status === 'connected') return;
    if (this.client) {
      await this.destroy();
    }
    this.initializing = true;

    this.state = { status: 'connecting', qrDataUrl: null, phone: null, name: null };
    this.emit('status', this.state);

    // Remove all previous session data for a clean login
    try {
      const { readdirSync, rmSync } = await import('fs');
      for (const entry of readdirSync('/app/.wwebjs_auth')) {
        rmSync(`/app/.wwebjs_auth/${entry}`, { recursive: true, force: true });
      }
      console.log('🧹 Previous session cleared');
    } catch {}

    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: '/app/.wwebjs_auth' }),
      puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-software-rasterizer',
          '--disk-cache-size=0',
          '--ignore-certificate-errors',
        ],
      },
      webVersionCache: { type: 'none' },
    });

    this.client.on('qr', async (qr: string) => {
      const qrDataUrl = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
      this.state = { ...this.state, status: 'qr', qrDataUrl };
      this.emit('qr', qrDataUrl);
      this.emit('status', this.state);
    });

    this.client.on('ready', async () => {
      if (this.state.status === 'connected') return;
      const info = this.client?.info;
      this.state = {
        status: 'connected',
        qrDataUrl: null,
        phone: info?.wid?.user || null,
        name: info?.pushname || null,
      };
      // Store page reference for direct evaluation
      try {
        this.page = (this.client as any)?.pupPage;
      } catch {}
      this.emit('status', this.state);
      console.log('✅ WhatsApp connected:', this.state.phone);
    });

    this.client.on('authenticated', () => {
      this.state = { ...this.state, status: 'connecting', qrDataUrl: null };
      this.emit('status', this.state);
    });

    this.client.on('disconnected', (reason: string) => {
      console.log('❌ WhatsApp disconnected:', reason);
      this.state = { status: 'disconnected', qrDataUrl: null, phone: null, name: null };
      this.emit('status', this.state);
      this.client = null;
      this.page = null;
    });

    this.client.on('auth_failure', (msg: string) => {
      console.error('❌ WhatsApp auth failure:', msg);
      this.state = { status: 'disconnected', qrDataUrl: null, phone: null, name: null };
      this.emit('status', this.state);
    });

    this.client.on('message_create', async (message) => {
      if (message.fromMe || message.from === 'status@broadcast') return;
      try {
        await this.handleIncomingMessage(message);
      } catch (error) {
        console.error('❌ Error handling incoming message:', error);
      }
      this.emit('message', message);
    });

    try {
      await this.client.initialize();
    } catch (err) {
      console.error('❌ WhatsApp initialize error:', (err as Error).message);
      this.state = { status: 'disconnected', qrDataUrl: null, phone: null, name: null };
      this.emit('status', this.state);
      this.client = null;
    } finally {
      this.initializing = false;
    }
  }

  private async handleIncomingMessage(message: any) {
    // Get real phone number (not LID)
    const contact = await message.getContact();
    const phone = contact.number || message.from.replace('@c.us', '').replace('@lid', '');
    const content = message.body || '';
    const contactName = contact.pushname || contact.name || `+${phone}`;

    const companyId = await getDefaultCompanyId();
    if (!companyId) return;

    const channelId = await getWhatsAppChannelId(companyId);
    if (!channelId) return;

    let customerResult = await pool.query(
      'SELECT id FROM customers WHERE phone = $1 AND company_id = $2',
      [phone, companyId]
    );

    let customerId: string;
    if (customerResult.rows.length === 0) {
      const newCustomer = await pool.query(
        'INSERT INTO customers (company_id, name, phone, whatsapp_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [companyId, contactName, phone, message.from]
      );
      customerId = newCustomer.rows[0].id;
    } else {
      customerId = customerResult.rows[0].id;
      await pool.query('UPDATE customers SET name = CASE WHEN name LIKE $3 THEN $1 ELSE name END, whatsapp_id = $4 WHERE id = $2',
        [contactName, customerId, '+%', message.from]
      );
    }

    let convResult = await pool.query(
      "SELECT id FROM conversations WHERE customer_id = $1 AND company_id = $2 AND status = 'OPEN'",
      [customerId, companyId]
    );

    let conversationId: string;
    let isNewConversation = false;

    if (convResult.rows.length === 0) {
      const newConv = await pool.query(
        `INSERT INTO conversations (company_id, customer_id, channel_id, status, last_message_at)
         VALUES ($1, $2, $3, 'OPEN', NOW()) RETURNING id`,
        [companyId, customerId, channelId]
      );
      conversationId = newConv.rows[0].id;
      isNewConversation = true;
    } else {
      conversationId = convResult.rows[0].id;
    }

    await pool.query(
      `INSERT INTO messages (conversation_id, sender_type, content, whatsapp_message_id)
       VALUES ($1, 'customer', $2, $3)`,
      [conversationId, content, message.id?._serialized || message.id]
    );

    await pool.query(
      'UPDATE conversations SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1',
      [conversationId]
    );

    console.log(`📩 Message from ${contactName} (${phone}) [wid: ${message.from}]: ${content.substring(0, 50)}`);

    if (isNewConversation) {
      await automationService.runForNewConversation(companyId, conversationId, phone);
    }
    await automationService.runForNewMessage(companyId, conversationId, phone, content);
  }

  async destroy(): Promise<void> {
    if (this.client) {
      try { await this.client.destroy(); } catch {}
      this.client = null;
      this.page = null;
    }
    this.state = { status: 'disconnected', qrDataUrl: null, phone: null, name: null };
    this.emit('status', this.state);
  }

  async sendMessage(to: string, content: string): Promise<void> {
    if (!this.client || this.state.status !== 'connected') {
      throw new Error('WhatsApp not connected');
    }
    // 'to' can be a LID (xxx@lid), a @c.us id, or a plain phone number
    const chatId = to.includes('@') ? to : `${to}@c.us`;
    const page = (this.client as any)?.pupPage;
    if (!page) throw new Error('Browser page not available');

    const result = await page.evaluate(async (id: string, msg: string) => {
      try {
        let chat = window.Store.Chat.get(id);
        if (!chat) chat = await window.Store.Chat.find(id);
        if (!chat) return { ok: false, error: 'Chat not found: ' + id };
        await window.WWebJS.sendMessage(chat, msg, {});
        return { ok: true };
      } catch (e: any) {
        return { ok: false, error: String(e?.message || e).substring(0, 500) };
      }
    }, chatId, content);

    if (!result.ok) {
      console.log(`\u26a0\ufe0f sendMessage to ${chatId} failed:`, result.error);
      throw new Error(`WhatsApp send failed: ${result.error}`);
    }
    console.log(`\u2705 Message sent to ${chatId}`);
  }
}

export const whatsappConnection = new WhatsAppConnectionService();
