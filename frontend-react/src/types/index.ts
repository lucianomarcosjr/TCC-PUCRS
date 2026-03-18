export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'AGENT';
  companyId: string;
}

export interface Message {
  id: string;
  content: string;
  customerId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  channel: 'whatsapp' | 'instagram' | 'email';
  timestamp: Date;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ';
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  channel: 'whatsapp' | 'instagram' | 'email';
  status: 'OPEN' | 'CLOSED';
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  tags: string[];
}
