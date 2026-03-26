import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { ConversationController } from '../controllers/ConversationController.js';
import { WebhookController } from '../controllers/WebhookController.js';
import { MessageController } from '../controllers/MessageController.js';
import { AnalyticsController } from '../controllers/AnalyticsController.js';
import { CustomerController } from '../controllers/CustomerController.js';
import { NotificationController } from '../controllers/NotificationController.js';
import { UserController } from '../controllers/UserController.js';
import { WhatsAppConnectionController } from '../controllers/WhatsAppConnectionController.js';
import { AutomationController } from '../controllers/AutomationController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const isTest = process.env.NODE_ENV === 'test';
const limiter = isTest ? (_req: any, _res: any, next: any) => next() : authLimiter;
import { auditLog } from '../middlewares/audit.js';
import { loginSchema, registerSchema, sendMessageSchema, assignConversationSchema } from '../validators/schemas.js';

const router = Router();

// Auth
const authController = new AuthController();
router.post('/auth/login', limiter, validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/auth/register', limiter, validate(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/auth/forgot-password', limiter, (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/auth/reset-password', limiter, (req, res, next) => authController.resetPassword(req, res, next));

// Conversations
const conversationController = new ConversationController();
router.get('/conversations', authMiddleware, (req, res) => conversationController.list(req, res));
router.post('/conversations', authMiddleware, (req, res) => conversationController.create(req, res));
router.get('/conversations/:id', authMiddleware, (req, res) => conversationController.getById(req, res));
router.patch('/conversations/:id/assign', authMiddleware, validate(assignConversationSchema), (req, res) => conversationController.assign(req, res));
router.patch('/conversations/:id/close', authMiddleware, (req, res) => conversationController.close(req, res));
router.post('/conversations/:id/rate', authMiddleware, (req, res) => conversationController.rate(req, res));

// Webhook
const webhookController = new WebhookController();
router.get('/webhook', (req, res) => webhookController.verify(req, res));
router.post('/webhook', (req, res) => webhookController.receive(req, res));

// Messages
const messageController = new MessageController();
router.post('/messages/send', authMiddleware, validate(sendMessageSchema), (req, res) => messageController.send(req, res));
router.get('/messages/:conversationId', authMiddleware, (req, res) => messageController.getHistory(req, res));

// Analytics
const analyticsController = new AnalyticsController();
router.get('/analytics/dashboard', authMiddleware, (req, res) => analyticsController.dashboard(req, res));
router.get('/analytics/conversations/:conversationId/logs', authMiddleware, auditLog('view_logs'), (req, res) => analyticsController.getConversationLogs(req, res));
router.get('/analytics/users/:userId/activity', authMiddleware, auditLog('view_activity'), (req, res) => analyticsController.getUserActivity(req, res));
router.get('/analytics/events/:event', authMiddleware, auditLog('view_events'), (req, res) => analyticsController.getEventStats(req, res));

// Customers
const customerController = new CustomerController();
router.get('/customers', authMiddleware, (req, res) => customerController.list(req, res));
router.get('/customers/:id', authMiddleware, (req, res) => customerController.getById(req, res));
router.post('/customers', authMiddleware, (req, res) => customerController.create(req, res));
router.put('/customers/:id', authMiddleware, (req, res) => customerController.update(req, res));
router.delete('/customers/:id', authMiddleware, (req, res) => customerController.delete(req, res));
router.get('/customers/:id/conversations', authMiddleware, (req, res) => customerController.getConversations(req, res));
router.post('/customers/:id/notes', authMiddleware, (req, res) => customerController.addNote(req, res));

// Notifications
const notificationController = new NotificationController();
router.get('/notifications', authMiddleware, (req, res) => notificationController.list(req, res));
router.put('/notifications/:id/read', authMiddleware, (req, res) => notificationController.markAsRead(req, res));
router.put('/notifications/read-all', authMiddleware, (req, res) => notificationController.markAllAsRead(req, res));
router.delete('/notifications', authMiddleware, (req, res) => notificationController.clearAll(req, res));

// User Profile
const userController = new UserController();
router.get('/users/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
router.put('/users/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.put('/users/password', authMiddleware, (req, res) => userController.changePassword(req, res));
router.post('/users/avatar', authMiddleware, (req, res) => userController.uploadAvatar(req, res));

// Automations
const automationController = new AutomationController();
router.get('/automations', authMiddleware, (req, res) => automationController.list(req, res));
router.post('/automations', authMiddleware, (req, res) => automationController.create(req, res));
router.put('/automations/:id', authMiddleware, (req, res) => automationController.update(req, res));
router.patch('/automations/:id/toggle', authMiddleware, (req, res) => automationController.toggle(req, res));
router.delete('/automations/:id', authMiddleware, (req, res) => automationController.delete(req, res));

// WhatsApp Connection
const whatsappConnectionController = new WhatsAppConnectionController();
router.get('/whatsapp/status', authMiddleware, (req, res) => whatsappConnectionController.getStatus(req, res));
router.post('/whatsapp/connect', authMiddleware, (req, res) => whatsappConnectionController.connect(req, res));
router.post('/whatsapp/disconnect', authMiddleware, (req, res) => whatsappConnectionController.disconnect(req, res));

export default router;
