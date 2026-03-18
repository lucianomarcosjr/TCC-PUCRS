/**
 * Classe Message - Representa uma mensagem do sistema
 * Demonstra: Herança, Polimorfismo, Abstração
 */

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED'
}

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export abstract class BaseMessage {
  protected _id: string;
  protected _content: string;
  protected _timestamp: Date;
  protected _customerId: string;
  protected _companyId: string;
  protected _direction: MessageDirection;
  protected _status: MessageStatus;

  constructor(
    id: string,
    content: string,
    customerId: string,
    companyId: string,
    direction: MessageDirection
  ) {
    this._id = id;
    this._content = content;
    this._timestamp = new Date();
    this._customerId = customerId;
    this._companyId = companyId;
    this._direction = direction;
    this._status = MessageStatus.PENDING;
  }

  get id(): string {
    return this._id;
  }

  get content(): string {
    return this._content;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get status(): MessageStatus {
    return this._status;
  }

  updateStatus(status: MessageStatus): void {
    this._status = status;
  }

  abstract getChannel(): string;
  abstract toJSON(): object;
}

export class WhatsAppMessage extends BaseMessage {
  private _phoneNumber: string;
  private _mediaUrl?: string;

  constructor(
    id: string,
    content: string,
    customerId: string,
    companyId: string,
    direction: MessageDirection,
    phoneNumber: string,
    mediaUrl?: string
  ) {
    super(id, content, customerId, companyId, direction);
    this._phoneNumber = phoneNumber;
    this._mediaUrl = mediaUrl;
  }

  getChannel(): string {
    return 'whatsapp';
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get mediaUrl(): string | undefined {
    return this._mediaUrl;
  }

  hasMedia(): boolean {
    return !!this._mediaUrl;
  }

  toJSON(): object {
    return {
      id: this._id,
      content: this._content,
      timestamp: this._timestamp,
      customerId: this._customerId,
      companyId: this._companyId,
      direction: this._direction,
      status: this._status,
      channel: this.getChannel(),
      phoneNumber: this._phoneNumber,
      mediaUrl: this._mediaUrl
    };
  }
}

export class InstagramMessage extends BaseMessage {
  private _username: string;
  private _storyReply: boolean;

  constructor(
    id: string,
    content: string,
    customerId: string,
    companyId: string,
    direction: MessageDirection,
    username: string,
    storyReply: boolean = false
  ) {
    super(id, content, customerId, companyId, direction);
    this._username = username;
    this._storyReply = storyReply;
  }

  getChannel(): string {
    return 'instagram';
  }

  get username(): string {
    return this._username;
  }

  isStoryReply(): boolean {
    return this._storyReply;
  }

  toJSON(): object {
    return {
      id: this._id,
      content: this._content,
      timestamp: this._timestamp,
      customerId: this._customerId,
      companyId: this._companyId,
      direction: this._direction,
      status: this._status,
      channel: this.getChannel(),
      username: this._username,
      storyReply: this._storyReply
    };
  }
}

export class EmailMessage extends BaseMessage {
  private _subject: string;
  private _from: string;
  private _to: string;

  constructor(
    id: string,
    content: string,
    customerId: string,
    companyId: string,
    direction: MessageDirection,
    subject: string,
    from: string,
    to: string
  ) {
    super(id, content, customerId, companyId, direction);
    this._subject = subject;
    this._from = from;
    this._to = to;
  }

  getChannel(): string {
    return 'email';
  }

  get subject(): string {
    return this._subject;
  }

  toJSON(): object {
    return {
      id: this._id,
      content: this._content,
      timestamp: this._timestamp,
      customerId: this._customerId,
      companyId: this._companyId,
      direction: this._direction,
      status: this._status,
      channel: this.getChannel(),
      subject: this._subject,
      from: this._from,
      to: this._to
    };
  }
}
