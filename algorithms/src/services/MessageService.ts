/**
 * MessageService - Serviço para gerenciar mensagens
 * Demonstra: Padrão Strategy, Single Responsibility
 */

import { BaseMessage, MessageStatus } from '../models/Message';

export interface MessageSender {
  send(message: BaseMessage): Promise<boolean>;
  getChannel(): string;
}

export class WhatsAppSender implements MessageSender {
  async send(message: BaseMessage): Promise<boolean> {
    console.log(`Enviando via WhatsApp: ${message.content}`);
    message.updateStatus(MessageStatus.SENT);
    return true;
  }

  getChannel(): string {
    return 'whatsapp';
  }
}

export class InstagramSender implements MessageSender {
  async send(message: BaseMessage): Promise<boolean> {
    console.log(`Enviando via Instagram: ${message.content}`);
    message.updateStatus(MessageStatus.SENT);
    return true;
  }

  getChannel(): string {
    return 'instagram';
  }
}

export class EmailSender implements MessageSender {
  async send(message: BaseMessage): Promise<boolean> {
    console.log(`Enviando via Email: ${message.content}`);
    message.updateStatus(MessageStatus.SENT);
    return true;
  }

  getChannel(): string {
    return 'email';
  }
}

export class MessageService {
  private senders: Map<string, MessageSender>;

  constructor() {
    this.senders = new Map();
    this.registerSender(new WhatsAppSender());
    this.registerSender(new InstagramSender());
    this.registerSender(new EmailSender());
  }

  registerSender(sender: MessageSender): void {
    this.senders.set(sender.getChannel(), sender);
  }

  async sendMessage(message: BaseMessage): Promise<boolean> {
    const sender = this.senders.get(message.getChannel());
    if (!sender) {
      throw new Error(`Canal não suportado: ${message.getChannel()}`);
    }
    return await sender.send(message);
  }

  getSupportedChannels(): string[] {
    return Array.from(this.senders.keys());
  }
}
