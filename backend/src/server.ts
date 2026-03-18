import app from './app.js';
import { connectMongoDB } from './config/mongodb.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3333;

connectMongoDB();
app.use('/api', apiLimiter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
