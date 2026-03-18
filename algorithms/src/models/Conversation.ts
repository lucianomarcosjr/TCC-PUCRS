/**
 * Classe Conversation - Representa uma conversa
 * Demonstra: Associação, Dependência
 */

import { BaseMessage } from './Message';

export enum ConversationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export class Customer {
  constructor(
    public id: string,
    public name: string,
    public phone?: string,
    public email?: string,
    public tags: string[] = []
  ) {}

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }
}

export class Conversation {
  private _id: string;
  private _customer: Customer;
  private _companyId: string;
  private _assignedTo?: string;
  private _messages: BaseMessage[];
  private _status: ConversationStatus;
  private _channel: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    customer: Customer,
    companyId: string,
    channel: string
  ) {
    this._id = id;
    this._customer = customer;
    this._companyId = companyId;
    this._channel = channel;
    this._messages = [];
    this._status = ConversationStatus.OPEN;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get customer(): Customer {
    return this._customer;
  }

  get companyId(): string {
    return this._companyId;
  }

  get assignedTo(): string | undefined {
    return this._assignedTo;
  }

  get messages(): BaseMessage[] {
    return [...this._messages];
  }

  get status(): ConversationStatus {
    return this._status;
  }

  get channel(): string {
    return this._channel;
  }

  get lastMessage(): BaseMessage | undefined {
    return this._messages[this._messages.length - 1];
  }

  get messageCount(): number {
    return this._messages.length;
  }

  addMessage(message: BaseMessage): void {
    this._messages.push(message);
    this._updatedAt = new Date();
  }

  assignTo(userId: string): void {
    this._assignedTo = userId;
    this._updatedAt = new Date();
  }

  unassign(): void {
    this._assignedTo = undefined;
    this._updatedAt = new Date();
  }

  close(): void {
    this._status = ConversationStatus.CLOSED;
    this._updatedAt = new Date();
  }

  reopen(): void {
    this._status = ConversationStatus.OPEN;
    this._updatedAt = new Date();
  }

  archive(): void {
    this._status = ConversationStatus.ARCHIVED;
    this._updatedAt = new Date();
  }

  isAssigned(): boolean {
    return !!this._assignedTo;
  }

  isActive(): boolean {
    return this._status === ConversationStatus.OPEN;
  }

  toJSON(): object {
    return {
      id: this._id,
      customer: this._customer,
      companyId: this._companyId,
      assignedTo: this._assignedTo,
      messageCount: this._messages.length,
      status: this._status,
      channel: this._channel,
      lastMessage: this.lastMessage?.toJSON(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
