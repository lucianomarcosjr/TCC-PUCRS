import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, sendMessageSchema } from '../../validators/schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
      };

      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '123',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        companyName: 'Company Inc',
        cnpj: '12345678901234',
      };

      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid CNPJ length', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        companyName: 'Company Inc',
        cnpj: '123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });

  describe('sendMessageSchema', () => {
    it('should validate text message', () => {
      const validData = {
        conversationId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Hello',
        type: 'text' as const,
      };

      expect(() => sendMessageSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        conversationId: 'invalid-uuid',
        content: 'Hello',
        type: 'text' as const,
      };

      expect(() => sendMessageSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty content', () => {
      const invalidData = {
        conversationId: '123e4567-e89b-12d3-a456-426614174000',
        content: '',
        type: 'text' as const,
      };

      expect(() => sendMessageSchema.parse(invalidData)).toThrow();
    });
  });
});
