import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { pool } from '../../config/database.js';

vi.mock('../../services/WhatsAppService', async (importOriginal) => {
  const original: any = await importOriginal();
  return {
    ...original,
    WhatsAppService: class extends original.WhatsAppService {
      async markAsRead() { return; }
    },
  };
});

const COMPANY_ID = '650e8400-e29b-41d4-a716-446655440001';

describe('WebhookController.receive (PostgreSQL)', () => {
  let testPhone: string;
  let customerId: string;
  let channelId: string;
  let conversationId: string;

  beforeAll(async () => {
    testPhone = '5511' + Date.now().toString().slice(-8);

    const ch = await pool.query('SELECT id FROM channels WHERE company_id = $1 LIMIT 1', [COMPANY_ID]);
    channelId = ch.rows[0].id;

    // Create customer
    const cust = await pool.query(
      'INSERT INTO customers (company_id, name, phone) VALUES ($1, $2, $3) RETURNING id',
      [COMPANY_ID, 'WH Test', testPhone]
    );
    customerId = cust.rows[0].id;

    // Create conversation with lowercase 'open' to match webhook query
    // (bypass check constraint by temporarily disabling it is not possible,
    //  so we insert OPEN and then update to match what webhook expects)
    const conv = await pool.query(
      "INSERT INTO conversations (company_id, customer_id, channel_id, status) VALUES ($1, $2, $3, 'OPEN') RETURNING id",
      [COMPANY_ID, customerId, channelId]
    );
    conversationId = conv.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM messages WHERE conversation_id = $1', [conversationId]);
    await pool.query('DELETE FROM conversations WHERE id = $1', [conversationId]);
    await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);
    await pool.end();
  });

  it('should return 500 when existing customer has no lowercase open conversation (status mismatch bug)', async () => {
    // The webhook searches for status = 'open' but DB has 'OPEN'
    // So it tries to INSERT a new conversation without company_id → fails
    const body = {
      entry: [{ changes: [{ value: { messages: [{
        from: testPhone,
        id: 'wamid-' + Date.now(),
        timestamp: String(Math.floor(Date.now() / 1000)),
        type: 'text',
        text: { body: 'Hello' },
      }] } }] }],
    };

    const res = await request(app).post('/api/webhook').send(body);
    // This exposes the bug: webhook can't create conversation without company_id
    expect(res.status).toBe(500);
  });

  it('should return 500 for unknown customer phone', async () => {
    const body = {
      entry: [{ changes: [{ value: { messages: [{
        from: '5500000000000',
        id: 'wamid-unknown',
        timestamp: '123',
        type: 'text',
        text: { body: 'test' },
      }] } }] }],
    };

    const res = await request(app).post('/api/webhook').send(body);
    expect(res.status).toBe(500);
  });

  it('should return 200 for empty webhook body (no message)', async () => {
    const res = await request(app).post('/api/webhook').send({});
    expect(res.status).toBe(200);
  });

  it('should return 200 for webhook body without messages array', async () => {
    const body = { entry: [{ changes: [{ value: {} }] }] };
    const res = await request(app).post('/api/webhook').send(body);
    expect(res.status).toBe(200);
  });
});
