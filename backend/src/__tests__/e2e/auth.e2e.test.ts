import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { pool } from '../../config/database.js';

let authToken: string;

describe('Health', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Auth Endpoints', () => {
  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = 'e2e-test@example.com'");
    await pool.query("DELETE FROM companies WHERE email = 'e2e-test@example.com'");
    await pool.end();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'joao@lojaexemplo.com', password: 'senha123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('joao@lojaexemplo.com');
      authToken = res.body.token;
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'joao@lojaexemplo.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid', password: 'password123' });

      expect(res.status).toBe(422);
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'E2E Test User',
          email: 'e2e-test@example.com',
          password: 'password123',
          companyName: 'E2E Company',
          cnpj: '99999999999999',
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('e2e-test@example.com');
      expect(res.body.user.role).toBe('OWNER');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate',
          email: 'joao@lojaexemplo.com',
          password: 'password123',
          companyName: 'Dup Company',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return success message regardless of email existence', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('email');
    });
  });
});

export { authToken };
