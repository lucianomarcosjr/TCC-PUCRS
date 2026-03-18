import { describe, it, expect, vi } from 'vitest';
import { validate } from '../../middlewares/validate';
import { loginSchema } from '../../validators/schemas';
import { ValidationError } from '../../utils/errors';

const mockRes = {} as any;

describe('validate middleware', () => {
  it('should call next() for valid data', () => {
    const req = { body: { email: 'user@test.com', password: 'password123' } } as any;
    const next = vi.fn();

    validate(loginSchema)(req, mockRes, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with ValidationError for invalid data', () => {
    const req = { body: { email: 'invalid', password: '1' } } as any;
    const next = vi.fn();

    validate(loginSchema)(req, mockRes, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
