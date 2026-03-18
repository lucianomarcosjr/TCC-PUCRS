import { describe, it, expect, vi } from 'vitest';
import { sanitizeInput } from '../../middlewares/sanitize';

const mockReq = (body: any = {}, query: any = {}, params: any = {}) =>
  ({ body, query, params }) as any;
const mockRes = {} as any;
const mockNext = vi.fn();

describe('sanitizeInput', () => {
  it('should strip script tags from body strings', () => {
    const req = mockReq({ name: 'test<script>alert("xss")</script>' });
    sanitizeInput(req, mockRes, mockNext);

    expect(req.body.name).toBe('test');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should trim whitespace from strings', () => {
    const req = mockReq({ name: '  hello  ' });
    sanitizeInput(req, mockRes, mockNext);

    expect(req.body.name).toBe('hello');
  });

  it('should sanitize nested objects', () => {
    const req = mockReq({ user: { name: '<script>x</script>safe' } });
    sanitizeInput(req, mockRes, mockNext);

    expect(req.body.user.name).toBe('safe');
  });

  it('should sanitize arrays', () => {
    const req = mockReq({ tags: ['<script>x</script>ok', ' trim '] });
    sanitizeInput(req, mockRes, mockNext);

    expect(req.body.tags).toEqual(['ok', 'trim']);
  });

  it('should sanitize query and params', () => {
    const req = mockReq({}, { q: ' <script>x</script>search ' }, { id: ' 123 ' });
    sanitizeInput(req, mockRes, mockNext);

    expect(req.query.q).toBe('search');
    expect(req.params.id).toBe('123');
  });

  it('should pass through non-string values', () => {
    const req = mockReq({ count: 42, active: true, data: null });
    sanitizeInput(req, mockRes, mockNext);

    expect(req.body.count).toBe(42);
    expect(req.body.active).toBe(true);
    expect(req.body.data).toBeNull();
  });
});
