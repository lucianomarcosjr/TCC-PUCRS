import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../../middlewares/errorHandler';
import { AppError, NotFoundError } from '../../utils/errors';

const mockReq = {} as any;
const mockNext = vi.fn();

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  it('should return custom status and message for AppError', () => {
    const res = mockRes();
    errorHandler(new AppError('Bad request', 400), mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Bad request' });
  });

  it('should return 404 for NotFoundError', () => {
    const res = mockRes();
    errorHandler(new NotFoundError('User not found'), mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'User not found' });
  });

  it('should return 500 for unknown errors', () => {
    const res = mockRes();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    errorHandler(new Error('unexpected'), mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Internal server error' });
  });
});
