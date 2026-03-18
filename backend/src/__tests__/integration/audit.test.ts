import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { auditLog } from '../../middlewares/audit';
import { ChatLog } from '../../models/ChatLog';

const MONGO_URI = 'mongodb://localhost:27017/omniflow_test';

describe('auditLog middleware (MongoDB)', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.db!.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await ChatLog.deleteMany({});
  });

  it('should log audit event and call next', async () => {
    const middleware = auditLog('test_action');
    const req = {
      userId: 'user-1',
      ip: '127.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
      headers: { 'user-agent': 'vitest' },
      path: '/test',
      method: 'GET',
    } as any;
    const res = {} as any;
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await middleware(req, res, next);

    expect(nextCalled).toBe(true);

    const logs = await ChatLog.find({});
    expect(logs).toHaveLength(1);
    expect(logs[0].conversationId).toBe('audit');
    expect(logs[0].metadata.action).toBe('test_action');
    expect(logs[0].metadata.ip).toBe('127.0.0.1');
    expect(logs[0].metadata.method).toBe('GET');
  });

  it('should call next even if logging fails', async () => {
    await mongoose.disconnect();

    const middleware = auditLog('fail_action');
    const req = {
      userId: 'u',
      ip: '0',
      socket: { remoteAddress: '0' },
      headers: {},
      path: '/',
      method: 'GET',
    } as any;
    const res = {} as any;
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await middleware(req, res, next);
    expect(nextCalled).toBe(true);

    // Reconnect for cleanup
    await mongoose.connect(MONGO_URI);
  });
});
