import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export class ConversationController {
  async list(req: Request, res: Response) {
    try {
      const { companyId } = req.user!;

      const result = await pool.query(
        `SELECT 
          conv.id,
          conv.status,
          conv.created_at,
          conv.updated_at,
          cust.id as customer_id,
          cust.name as customer_name,
          cust.phone as customer_phone,
          cust.avatar_url as customer_avatar,
          ch.type as channel,
          u.name as assigned_to_name
        FROM conversations conv
        JOIN customers cust ON conv.customer_id = cust.id
        JOIN channels ch ON conv.channel_id = ch.id
        LEFT JOIN users u ON conv.assigned_to = u.id
        WHERE conv.company_id = $1
        ORDER BY conv.updated_at DESC`,
        [companyId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('List conversations error:', error);
      res.status(500).json({ error: 'Erro ao listar conversas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { companyId } = req.user!;

      const result = await pool.query(
        `SELECT 
          conv.*,
          cust.name as customer_name,
          cust.phone as customer_phone,
          cust.email as customer_email,
          cust.avatar_url as customer_avatar,
          cust.tags as customer_tags,
          ch.type as channel
        FROM conversations conv
        JOIN customers cust ON conv.customer_id = cust.id
        JOIN channels ch ON conv.channel_id = ch.id
        WHERE conv.id = $1 AND conv.company_id = $2`,
        [id, companyId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ error: 'Erro ao buscar conversa' });
    }
  }

  async assign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const { companyId } = req.user!;

      await pool.query(
        'UPDATE conversations SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND company_id = $3',
        [userId, id, companyId]
      );

      res.json({ message: 'Conversa atribuída com sucesso' });
    } catch (error) {
      console.error('Assign conversation error:', error);
      res.status(500).json({ error: 'Erro ao atribuir conversa' });
    }
  }

  async close(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { companyId } = req.user!;

      await pool.query(
        'UPDATE conversations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND company_id = $3',
        ['CLOSED', id, companyId]
      );

      res.json({ message: 'Conversa fechada com sucesso' });
    } catch (error) {
      console.error('Close conversation error:', error);
      res.status(500).json({ error: 'Erro ao fechar conversa' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const { companyId, userId } = req.user!;

      // Buscar primeiro canal disponível
      const channelResult = await pool.query(
        'SELECT id FROM channels WHERE company_id = $1 AND status = $2 LIMIT 1',
        [companyId, 'ACTIVE']
      );

      if (channelResult.rows.length === 0) {
        return res.status(400).json({ error: 'Nenhum canal configurado' });
      }

      const result = await pool.query(
        'INSERT INTO conversations (company_id, customer_id, channel_id, status, assigned_to) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [companyId, customerId, channelResult.rows[0].id, 'OPEN', userId]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ error: 'Erro ao criar conversa' });
    }
  }
}
