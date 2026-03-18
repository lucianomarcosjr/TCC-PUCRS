import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { ChatLogService } from '../../services/ChatLogService';
import { ChatLog } from '../../models/ChatLog';

const MONGO_URI = 'mongodb://localhost:27017/omniflow_test';

describe('ChatLogService (MongoDB)', () => {
  const service = new ChatLogService();

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

  it('logEvent should save and return a log', async () => {
    const log = await service.logEvent({
      conversationId: 'conv-1',
      messageId: 'msg-1',
      event: 'message_sent',
      userId: 'user-1',
      metadata: { test: true },
    });

    expect(log.conversationId).toBe('conv-1');
    expect(log.event).toBe('message_sent');
    expect(log._id).toBeDefined();
  });

  it('getConversationLogs should return logs for a conversation', async () => {
    await service.logEvent({ conversationId: 'conv-2', messageId: 'm1', event: 'message_sent' });
    await service.logEvent({ conversationId: 'conv-2', messageId: 'm2', event: 'message_received' });
    await service.logEvent({ conversationId: 'conv-other', messageId: 'm3', event: 'message_sent' });

    const logs = await service.getConversationLogs('conv-2');
    expect(logs).toHaveLength(2);
  });

  it('getUserActivity should return logs limited by count', async () => {
    for (let i = 0; i < 5; i++) {
      await service.logEvent({ conversationId: 'c', messageId: `m${i}`, event: 'message_sent', userId: 'u1' });
    }

    const logs = await service.getUserActivity('u1', 3);
    expect(logs).toHaveLength(3);
  });

  it('getEventsByType should filter by event', async () => {
    await service.logEvent({ conversationId: 'c', messageId: 'm1', event: 'message_sent' });
    await service.logEvent({ conversationId: 'c', messageId: 'm2', event: 'message_read' });

    const logs = await service.getEventsByType('message_read');
    expect(logs).toHaveLength(1);
    expect(logs[0].event).toBe('message_read');
  });

  it('getEventsByType should filter by date range', async () => {
    const old = new Date('2024-01-01');
    const recent = new Date('2025-06-01');

    await ChatLog.create({ conversationId: 'c', messageId: 'm1', event: 'message_sent', timestamp: old });
    await ChatLog.create({ conversationId: 'c', messageId: 'm2', event: 'message_sent', timestamp: recent });

    const logs = await service.getEventsByType('message_sent', new Date('2025-01-01'));
    expect(logs).toHaveLength(1);
  });

  it('getEventsByType should filter with endDate only', async () => {
    await ChatLog.create({ conversationId: 'c', messageId: 'm1', event: 'conversation_closed', timestamp: new Date('2024-01-01') });
    await ChatLog.create({ conversationId: 'c', messageId: 'm2', event: 'conversation_closed', timestamp: new Date('2025-12-01') });

    const logs = await service.getEventsByType('conversation_closed', undefined, new Date('2024-06-01'));
    expect(logs).toHaveLength(1);
  });
});
