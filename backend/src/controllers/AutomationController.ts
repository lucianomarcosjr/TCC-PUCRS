import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export class AutomationController {
  async list(req: Request, res: Response) {
    try {
      const { companyId } = req.user!;
      const result = await pool.query(
        'SELECT * FROM automations WHERE company_id = $1 ORDER BY created_at DESC',
        [companyId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('List automations error:', error);
      res.status(500).json({ error: 'Erro ao listar automações' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { companyId } = req.user!;
      const { name, triggerType, triggerValue, actionType, actionValue } = req.body;

      const result = await pool.query(
        `INSERT INTO automations (company_id, name, trigger_type, trigger_value, action_type, action_value)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [companyId, name, triggerType, triggerValue || null, actionType, actionValue]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create automation error:', error);
      res.status(500).json({ error: 'Erro ao criar automação' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { companyId } = req.user!;
      const { name, triggerType, triggerValue, actionType, actionValue, isActive } = req.body;

      const result = await pool.query(
        `UPDATE automations SET name = $1, trigger_type = $2, trigger_value = $3,
         action_type = $4, action_value = $5, is_active = $6
         WHERE id = $7 AND company_id = $8 RETURNING *`,
        [name, triggerType, triggerValue || null, actionType, actionValue, isActive, id, companyId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automação não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update automation error:', error);
      res.status(500).json({ error: 'Erro ao atualizar automação' });
    }
  }

  async toggle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { companyId } = req.user!;

      const result = await pool.query(
        `UPDATE automations SET is_active = NOT is_active WHERE id = $1 AND company_id = $2 RETURNING *`,
        [id, companyId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automação não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Toggle automation error:', error);
      res.status(500).json({ error: 'Erro ao alternar automação' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { companyId } = req.user!;

      const result = await pool.query(
        'DELETE FROM automations WHERE id = $1 AND company_id = $2 RETURNING id',
        [id, companyId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Automação não encontrada' });
      }

      res.json({ message: 'Automação excluída' });
    } catch (error) {
      console.error('Delete automation error:', error);
      res.status(500).json({ error: 'Erro ao excluir automação' });
    }
  }
}
