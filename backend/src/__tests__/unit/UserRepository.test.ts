import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from '../../repositories/UserRepository';
import { pool } from '../../config/database';

vi.mock('../../config/database', () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    vi.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        company_id: '456',
        password_hash: 'hash',
        role: 'AGENT',
        is_active: true,
      };

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockUser] } as any);

      const result = await userRepository.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
        'test@example.com',
      ]);
    });

    it('should return null when email does not exist', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      const result = await userRepository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when id exists', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockUser] } as any);

      const result = await userRepository.findById('123');

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['123']);
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const userData = {
        company_id: '456',
        name: 'New User',
        email: 'new@example.com',
        password_hash: 'hash',
        role: 'AGENT',
        is_active: true,
      };

      const mockCreatedUser = { id: '789', ...userData };

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockCreatedUser] } as any);

      const result = await userRepository.create(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([userData.company_id, userData.name, userData.email])
      );
    });
  });
});
