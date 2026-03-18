import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  cnpj: z.string().length(14, 'CNPJ must be exactly 14 characters').optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  content: z.string().min(1, 'Content cannot be empty'),
  type: z.enum(['text', 'image']).default('text'),
  mediaUrl: z.string().url().optional(),
});

export const assignConversationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});
