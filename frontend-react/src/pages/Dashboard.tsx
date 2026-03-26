import { useEffect, useState } from 'react';
import { useChatStore } from '@/store';
import { conversationsAPI } from '@/services/api';
import { Layout } from '@/components/Layout';
import { ConversationList } from '@/components/ConversationList';
import { ChatArea } from '@/components/ChatArea';
import { CustomerDetails } from '@/components/CustomerDetails';
import './Dashboard.css';

export function Dashboard() {
  const { conversations, setConversations } = useChatStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await conversationsAPI.list();
      const formattedConversations = response.data.map((conv: any) => ({
        id: conv.id,
        customerId: conv.customer_id,
        customerName: conv.customer_name || 'Cliente',
        lastMessage: conv.last_message || 'Sem mensagens',
        timestamp: new Date(conv.updated_at),
        unreadCount: conv.unread_count || 0,
        channel: conv.channel || 'whatsapp',
        status: conv.status,
      }));
      setConversations(formattedConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="dashboard-content">
        <ConversationList conversations={conversations} />
        <ChatArea />
        <CustomerDetails />
      </div>
    </Layout>
  );
}
