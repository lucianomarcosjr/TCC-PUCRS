import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export class NotificationController {
  async list(req: Request, res: Response) {
    try {
      const { filter = 'all' } = req.query;
      
      let query = 'SELECT * FROM notifications WHERE user_id = $1';
      const params: any[] = [req.user.id];
      
      if (filter === 'unread') {
        query += ' AND read = false';
      } else if (filter === 'mentions') {
        query += ' AND type = $2';
        params.push('mention');
      }
      
      query += ' ORDER BY created_at DESC LIMIT 50';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar notificações' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'UPDATE notifications SET read = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao marcar notificação' });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      await pool.query(
        'UPDATE notifications SET read = true, updated_at = NOW() WHERE user_id = $1 AND read = false',
        [req.user.id]
      );
      
      res.json({ message: 'Todas as notificações marcadas como lidas' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao marcar notificações' });
    }
  }

  async clearAll(req: Request, res: Response) {
    try {
      await pool.query(
        'DELETE FROM notifications WHERE user_id = $1',
        [req.user.id]
      );
      
      res.json({ message: 'Todas as notificações foram removidas' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao limpar notificações' });
    }
  }
}
