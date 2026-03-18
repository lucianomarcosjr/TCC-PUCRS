import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { pool } from '../config/database.js';
import { UnauthorizedError, AppError } from '../utils/errors.js';

const userRepository = new UserRepository();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id, companyId: user.company_id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.company_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, companyName, cnpj } = req.body;

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const planResult = await pool.query('SELECT id FROM plans WHERE name = $1', ['Básico']);
      const planId = planResult.rows[0].id;

      const companyResult = await pool.query(
        'INSERT INTO companies (name, cnpj, email, plan_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [companyName, cnpj, email, planId]
      );

      const companyId = companyResult.rows[0].id;

      const user = await userRepository.create({
        company_id: companyId,
        name,
        email,
        password_hash: passwordHash,
        role: 'OWNER',
        is_active: true,
      });

      const token = jwt.sign(
        { userId: user.id, companyId, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.json({ message: 'Se o email existir, um link será enviado' });
      }
      
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      
      await pool.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL \'1 hour\' WHERE id = $2',
        [resetToken, user.id]
      );
      
      // TODO: Enviar email com link de recuperação
      
      res.json({ message: 'Se o email existir, um link será enviado' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1 AND reset_token = $2 AND reset_token_expires > NOW()',
        [decoded.userId, token]
      );
      
      if (userResult.rows.length === 0) {
        throw new AppError('Token inválido ou expirado', 400);
      }
      
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      await pool.query(
        'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
        [passwordHash, decoded.userId]
      );
      
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}
