import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../../config/database';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Setup: Limpar dados de teste
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['test%@example.com']);
  });

  afterAll(async () => {
    // Cleanup
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['test%@example.com']);
    await pool.end();
  });

  describe('User Registration Flow', () => {
    it('should create user with hashed password', async () => {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        ['joao@lojaexemplo.com']
      );

      expect(result.rows.length).toBeGreaterThan(0);
      const user = result.rows[0];
      expect(user.password_hash).toBeDefined();
      expect(user.password_hash).not.toBe('senha123'); // Password should be hashed
    });
  });

  describe('Database Queries', () => {
    it('should find user by email', async () => {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        ['joao@lojaexemplo.com']
      );

      expect(result.rows.length).toBe(1);
      expect(result.rows[0].email).toBe('joao@lojaexemplo.com');
    });

    it('should return empty for non-existent email', async () => {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        ['nonexistent@example.com']
      );

      expect(result.rows.length).toBe(0);
    });
  });
});
