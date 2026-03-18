import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { pool } from '../../config/database.js';

let token: string;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'joao@lojaexemplo.com', password: 'senha123' });
  token = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

// --- Conversations ---

describe('Conversations', () => {
  it('GET /api/conversations should list conversations', async () => {
    const res = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/conversations should reject without token', async () => {
    const res = await request(app).get('/api/conversations');
    expect(res.status).toBe(401);
  });

  it('GET /api/conversations/:id should return conversation details', async () => {
    const list = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get(`/api/conversations/${list.body[0].id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(list.body[0].id);
    expect(res.body.customer_name).toBeDefined();
  });

  it('GET /api/conversations/:id should return 404 for non-existent', async () => {
    const res = await request(app)
      .get('/api/conversations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('PATCH /api/conversations/:id/assign should assign conversation', async () => {
    const list = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .patch(`/api/conversations/${list.body[0].id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: '750e8400-e29b-41d4-a716-446655440001' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('atribuída');
  });

  it('PATCH /api/conversations/:id/close should close conversation', async () => {
    const list = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .patch(`/api/conversations/${list.body[0].id}/close`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('fechada');
  });

  it('POST /api/conversations should create conversation', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ customerId: '950e8400-e29b-41d4-a716-446655440001' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});

// --- Messages ---

describe('Messages', () => {
  it('POST /api/messages/send should send a message', async () => {
    const convRes = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);

    const conversationId = convRes.body[0].id;

    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ conversationId, content: 'Hello from E2E test', type: 'text' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Hello from E2E test');
  });

  it('GET /api/messages/:conversationId should return message history', async () => {
    const convRes = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get(`/api/messages/${convRes.body[0].id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/messages/send should reject invalid payload', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '' });

    expect(res.status).toBe(422);
  });
});

// --- Customers ---

describe('Customers', () => {
  let customerId: string;

  it('POST /api/customers should create a customer', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'E2E Customer', phone: '11999990000', email: 'e2e@client.com', tags: ['vip'] });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('E2E Customer');
    customerId = res.body.id;
  });

  it('POST /api/customers should accept tags as string', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tag String Customer', phone: '11888880000', email: 'tags@client.com', tags: 'vip premium' });

    expect(res.status).toBe(201);
    expect(res.body.tags).toContain('vip');
    expect(res.body.tags).toContain('premium');

    await pool.query('DELETE FROM customers WHERE id = $1', [res.body.id]);
  });

  it('GET /api/customers should list customers', async () => {
    const res = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/customers/:id should return customer', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('E2E Customer');
  });

  it('GET /api/customers with search should filter', async () => {
    const res = await request(app)
      .get('/api/customers?search=E2E')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/customers with tag should filter', async () => {
    const res = await request(app)
      .get('/api/customers?tag=vip')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/customers/:id should update customer', async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Customer', phone: '11999990000', email: 'updated@client.com', tags: ['premium'] });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Customer');
  });

  it('PUT /api/customers/:id should return 404 for non-existent', async () => {
    const res = await request(app)
      .put('/api/customers/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost', phone: '0', email: 'x@x.com', tags: [] });

    expect(res.status).toBe(404);
  });

  it('POST /api/customers/:id/notes should add note', async () => {
    const res = await request(app)
      .post(`/api/customers/${customerId}/notes`)
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'Cliente preferencial' });

    expect(res.status).toBe(200);
  });

  it('POST /api/customers/:id/notes should return 404 for non-existent', async () => {
    const res = await request(app)
      .post('/api/customers/00000000-0000-0000-0000-000000000000/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'test' });

    expect(res.status).toBe(404);
  });

  it('GET /api/customers/:id/conversations should return conversations', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}/conversations`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /api/customers/:id should delete customer', async () => {
    const res = await request(app)
      .delete(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deletado');
  });

  it('DELETE /api/customers/:id should return 404 for non-existent', async () => {
    const res = await request(app)
      .delete('/api/customers/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('GET /api/customers/:id should return 404 after delete', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

// --- Notifications ---

describe('Notifications', () => {
  it('GET /api/notifications should list all notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/notifications?filter=unread should filter unread', async () => {
    const res = await request(app)
      .get('/api/notifications?filter=unread')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/notifications?filter=mentions should filter mentions', async () => {
    const res = await request(app)
      .get('/api/notifications?filter=mentions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/notifications/read-all should mark all as read', async () => {
    const res = await request(app)
      .put('/api/notifications/read-all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('DELETE /api/notifications should clear all', async () => {
    const res = await request(app)
      .delete('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('removidas');
  });
});

// --- User Profile ---

describe('User Profile', () => {
  it('GET /api/users/profile should return profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('joao@lojaexemplo.com');
  });

  it('PUT /api/users/profile should update profile', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'João Silva', email: 'joao@lojaexemplo.com', phone: '11999999999' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('João Silva');
  });

  it('PUT /api/users/password should change password', async () => {
    const res = await request(app)
      .put('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'senha123', newPassword: 'novaSenha123' });

    expect(res.status).toBe(200);

    // Restore original password
    await request(app)
      .put('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'novaSenha123', newPassword: 'senha123' });
  });

  it('PUT /api/users/password should reject wrong current password', async () => {
    const res = await request(app)
      .put('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'wrongpassword', newPassword: 'newpass123' });

    expect(res.status).toBe(400);
  });

  it('POST /api/users/avatar should update avatar', async () => {
    const res = await request(app)
      .post('/api/users/avatar')
      .set('Authorization', `Bearer ${token}`)
      .send({ avatarUrl: 'https://example.com/avatar.png' });

    expect(res.status).toBe(200);
    expect(res.body.avatarUrl).toBe('https://example.com/avatar.png');
  });
});

// --- Webhook ---

describe('Webhook', () => {
  it('GET /api/webhook should return 403 for invalid token', async () => {
    const res = await request(app)
      .get('/api/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=test');

    expect(res.status).toBe(403);
  });

  it('GET /api/webhook should return challenge for valid token', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'test-token';
    const res = await request(app)
      .get('/api/webhook?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=challenge123');

    expect(res.status).toBe(200);
    expect(res.text).toBe('challenge123');
  });

  it('POST /api/webhook should return 200 for empty body', async () => {
    const res = await request(app)
      .post('/api/webhook')
      .send({});

    expect(res.status).toBe(200);
  });
});
