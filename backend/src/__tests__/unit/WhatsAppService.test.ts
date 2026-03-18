import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WhatsAppService } from '../../services/WhatsAppService';

vi.mock('axios', () => ({
  default: { create: vi.fn(() => ({ post: vi.fn() })) },
}));

describe('WhatsAppService', () => {
  let service: WhatsAppService;

  beforeEach(() => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify-token';
    service = new WhatsAppService();
  });

  describe('verifyWebhook', () => {
    it('should return challenge when mode and token match', () => {
      const result = service.verifyWebhook('subscribe', 'test-verify-token', 'challenge-123');
      expect(result).toBe('challenge-123');
    });

    it('should return null for wrong mode', () => {
      const result = service.verifyWebhook('wrong', 'test-verify-token', 'challenge');
      expect(result).toBeNull();
    });

    it('should return null for wrong token', () => {
      const result = service.verifyWebhook('subscribe', 'wrong-token', 'challenge');
      expect(result).toBeNull();
    });
  });

  describe('parseWebhookMessage', () => {
    it('should parse valid webhook body', () => {
      const body = {
        entry: [{
          changes: [{
            value: {
              messages: [{
                from: '5511999999999',
                id: 'msg-1',
                timestamp: '1234567890',
                type: 'text',
                text: { body: 'Hello' },
              }],
            },
          }],
        }],
      };

      const result = service.parseWebhookMessage(body);

      expect(result).toEqual({
        from: '5511999999999',
        id: 'msg-1',
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Hello' },
        image: undefined,
      });
    });

    it('should return null for empty body', () => {
      expect(service.parseWebhookMessage({})).toBeNull();
    });

    it('should return null for body without messages', () => {
      const body = { entry: [{ changes: [{ value: {} }] }] };
      expect(service.parseWebhookMessage(body)).toBeNull();
    });
  });
});
