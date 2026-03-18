import { describe, it, expect, vi } from 'vitest';
import { authMiddleware } from '../../middlewares/auth';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('authMiddleware', () => {
  it('should return 401 when no token provided', () => {
    const req = { headers: {} } as any;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as any;
    const res = mockRes();
    const next = vi.fn();

    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('invalid'); });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
  });

  it('should set req.user and call next for valid token', () => {
    const payload = { userId: '1', companyId: '2', role: 'AGENT' };
    const req = { headers: { authorization: 'Bearer valid-token' } } as any;
    const res = mockRes();
    const next = vi.fn();

    vi.mocked(jwt.verify).mockReturnValue(payload as any);

    authMiddleware(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });
});
