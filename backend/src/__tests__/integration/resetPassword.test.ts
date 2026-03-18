import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app.js';
import { pool } from '../../config/database.js';

describe('AuthController.resetPassword (PostgreSQL)', () => {
  afterAll(async () => {
    // Restore original password for seed user
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('senha123', 10);
    await pool.query('UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2', [hash, 'joao@lojaexemplo.com']);
    await pool.end();
  });

  it('POST /api/auth/forgot-password should set reset token for existing user', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'joao@lojaexemplo.com' });

    expect(res.status).toBe(200);

    // Verify token was stored in DB
    const user = await pool.query('SELECT reset_token, reset_token_expires FROM users WHERE email = $1', ['joao@lojaexemplo.com']);
    expect(user.rows[0].reset_token).toBeTruthy();
    expect(user.rows[0].reset_token_expires).toBeTruthy();
  });

  it('POST /api/auth/reset-password should reset password with valid token', async () => {
    // Get the token that was set by forgot-password
    const user = await pool.query('SELECT id, reset_token FROM users WHERE email = $1', ['joao@lojaexemplo.com']);
    const resetToken = user.rows[0].reset_token;

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'novaSenha456' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Senha alterada');

    // Verify can login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@lojaexemplo.com', password: 'novaSenha456' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });

  it('POST /api/auth/reset-password should reject invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalid-token', newPassword: 'test123' });

    expect(res.status).toBe(500);
  });

  it('POST /api/auth/reset-password should reject expired/used token', async () => {
    // Token was already used in previous test (cleared from DB)
    const user = await pool.query('SELECT id FROM users WHERE email = $1', ['joao@lojaexemplo.com']);
    const fakeToken = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET!);

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: fakeToken, newPassword: 'test123' });

    expect(res.status).toBe(400);
  });
});
