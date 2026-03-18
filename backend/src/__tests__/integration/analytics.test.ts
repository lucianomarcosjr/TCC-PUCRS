import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { pool } from '../../config/database.js';
import { ChatLog } from '../../models/ChatLog';

const MONGO_URI = 'mongodb://localhost:27017/omniflow_test';
let token: string;

describe('AnalyticsController (MongoDB)', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@lojaexemplo.com', password: 'senha123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db!.dropDatabase();
    await mongoose.disconnect();
    await pool.end();
  });

  beforeEach(async () => {
    await ChatLog.deleteMany({});
  });

  it('GET /analytics/conversations/:id/logs should return logs', async () => {
    await ChatLog.create({ conversationId: 'conv-abc', messageId: 'm1', event: 'message_sent' });
    await ChatLog.create({ conversationId: 'conv-abc', messageId: 'm2', event: 'message_received' });

    const res = await request(app)
      .get('/api/analytics/conversations/conv-abc/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('GET /analytics/users/:id/activity should return user activity', async () => {
    await ChatLog.create({ conversationId: 'c', messageId: 'm1', event: 'message_sent', userId: 'user-xyz' });

    const res = await request(app)
      .get('/api/analytics/users/user-xyz/activity')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /analytics/users/:id/activity should respect limit param', async () => {
    for (let i = 0; i < 5; i++) {
      await ChatLog.create({ conversationId: 'c', messageId: `m${i}`, event: 'message_sent', userId: 'u-limit' });
    }

    const res = await request(app)
      .get('/api/analytics/users/u-limit/activity?limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('GET /analytics/events/:event should return event stats', async () => {
    await ChatLog.create({ conversationId: 'c', messageId: 'm1', event: 'conversation_closed' });
    await ChatLog.create({ conversationId: 'c', messageId: 'm2', event: 'conversation_closed' });

    const res = await request(app)
      .get('/api/analytics/events/conversation_closed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.event).toBe('conversation_closed');
    expect(res.body.count).toBe(2);
    expect(res.body.logs).toHaveLength(2);
  });

  it('GET /analytics/events/:event should filter by date range', async () => {
    await ChatLog.create({ conversationId: 'c', messageId: 'm1', event: 'message_read', timestamp: new Date('2025-01-15') });
    await ChatLog.create({ conversationId: 'c', messageId: 'm2', event: 'message_read', timestamp: new Date('2025-06-15') });

    const res = await request(app)
      .get('/api/analytics/events/message_read?startDate=2025-06-01&endDate=2025-12-31')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('GET /analytics/conversations/:id/logs should return empty for unknown conversation', async () => {
    const res = await request(app)
      .get('/api/analytics/conversations/nonexistent/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
