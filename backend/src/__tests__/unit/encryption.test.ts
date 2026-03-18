import { describe, it, expect } from 'vitest';
import { EncryptionService } from '../../utils/encryption';

describe('EncryptionService', () => {
  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt text correctly', () => {
      const original = 'dados sensíveis do cliente';
      const encrypted = EncryptionService.encrypt(original);

      expect(encrypted).not.toBe(original);
      expect(EncryptionService.decrypt(encrypted)).toBe(original);
    });

    it('should produce different ciphertexts for same input', () => {
      const text = 'test';
      const a = EncryptionService.encrypt(text);
      const b = EncryptionService.encrypt(text);

      expect(a).not.toBe(b);
    });
  });

  describe('hashSensitiveData', () => {
    it('should return consistent hash for same input', () => {
      const data = 'cpf-123.456.789-00';

      expect(EncryptionService.hashSensitiveData(data)).toBe(
        EncryptionService.hashSensitiveData(data)
      );
    });

    it('should return different hash for different input', () => {
      expect(EncryptionService.hashSensitiveData('a')).not.toBe(
        EncryptionService.hashSensitiveData('b')
      );
    });
  });
});
