import mongoose, { Schema, Document } from 'mongoose';

export interface IChatLog extends Document {
  conversationId: string;
  messageId: string;
  event: 'message_sent' | 'message_received' | 'message_read' | 'conversation_assigned' | 'conversation_closed';
  userId?: string;
  customerId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

const ChatLogSchema = new Schema<IChatLog>({
  conversationId: { type: String, required: true, index: true },
  messageId: { type: String, index: true },
  event: { 
    type: String, 
    required: true,
    enum: ['message_sent', 'message_received', 'message_read', 'conversation_assigned', 'conversation_closed']
  },
  userId: { type: String, index: true },
  customerId: { type: String, index: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true }
});

export const ChatLog = mongoose.models.ChatLog || mongoose.model<IChatLog>('ChatLog', ChatLogSchema);
