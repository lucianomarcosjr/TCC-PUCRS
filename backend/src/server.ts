import app from './app.js';
import { connectMongoDB } from './config/mongodb.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import dotenv from 'dotenv';

dotenv.config();

// Prevent whatsapp-web.js Client.inject crashes from killing the process
process.on('uncaughtException', (err) => {
  if (err.message?.includes('Execution context was destroyed')) {
    console.log('⚠️ Chromium ExecutionContext error (ignored)');
    return;
  }
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 3333;

connectMongoDB();
app.use('/api', apiLimiter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
