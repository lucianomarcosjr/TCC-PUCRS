import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class UserController {
  async getProfile(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, company_id, phone, avatar_url, created_at FROM users WHERE id = $1',
        [req.user!.userId]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { name, email, phone } = req.body;
      
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, phone = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, company_id, phone',
        [name, email, phone, req.user!.userId]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const userResult = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [req.user!.userId]
      );
      
      const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
      
      if (!isValid) {
        return res.status(400).json({ error: 'Senha atual incorreta' });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, req.user!.userId]
      );
      
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao alterar senha' });
    }
  }

  async uploadAvatar(req: Request, res: Response) {
    try {
      const avatarUrl = req.body.avatarUrl;
      
      await pool.query(
        'UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2',
        [avatarUrl, req.user!.userId]
      );
      
      res.json({ avatarUrl });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer upload do avatar' });
    }
  }
}
