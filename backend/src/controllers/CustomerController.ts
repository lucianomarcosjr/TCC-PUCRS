import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export class CustomerController {
  async list(req: Request, res: Response) {
    try {
      const { search, tag, limit = 50, offset = 0 } = req.query;
      
      let query = 'SELECT * FROM customers WHERE company_id = $1';
      const params: any[] = [req.user.companyId];
      
      if (search) {
        query += ' AND (name ILIKE $2 OR phone ILIKE $2 OR email ILIKE $2)';
        params.push(`%${search}%`);
      }
      
      if (tag) {
        query += ` AND $${params.length + 1} = ANY(tags)`;
        params.push(tag);
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar clientes' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM customers WHERE id = $1 AND company_id = $2',
        [id, req.user.companyId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, phone, email, tags, notes } = req.body;
      
      const processedTags = typeof tags === 'string' 
        ? tags.toLowerCase().split(' ').filter(t => t.trim())
        : (tags || []).map((t: string) => t.toLowerCase());
      
      const result = await pool.query(
        'INSERT INTO customers (company_id, name, phone, email, tags, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [req.user.companyId, name, phone, email, processedTags, notes]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, phone, email, tags, notes } = req.body;
      
      const processedTags = typeof tags === 'string' 
        ? tags.toLowerCase().split(' ').filter(t => t.trim())
        : (tags || []).map((t: string) => t.toLowerCase());
      
      const result = await pool.query(
        'UPDATE customers SET name = $1, phone = $2, email = $3, tags = $4, notes = $5, updated_at = NOW() WHERE id = $6 AND company_id = $7 RETURNING *',
        [name, phone, email, processedTags, notes || [], id, req.user.companyId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'DELETE FROM customers WHERE id = $1 AND company_id = $2 RETURNING id',
        [id, req.user.companyId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM conversations WHERE customer_id = $1 AND company_id = $2 ORDER BY created_at DESC',
        [id, req.user.companyId]
      );
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar conversas' });
    }
  }

  async addNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { note } = req.body;
      
      const result = await pool.query(
        'UPDATE customers SET notes = array_append(notes, $1), updated_at = NOW() WHERE id = $2 AND company_id = $3 RETURNING *',
        [note, id, req.user.companyId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar nota' });
    }
  }
}
