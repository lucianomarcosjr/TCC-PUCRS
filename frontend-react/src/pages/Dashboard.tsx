import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore, useAuthStore } from '@/store';
import { conversationsAPI } from '@/services/api';
import { ConversationList } from '@/components/ConversationList';
import { ChatArea } from '@/components/ChatArea';
import { CustomerDetails } from '@/components/CustomerDetails';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { conversations, setConversations } = useChatStore();
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      console.log('Carregando conversas...');
      const response = await conversationsAPI.list();
      console.log('Conversas recebidas:', response.data);
      const formattedConversations = response.data.map((conv: any) => ({
        id: conv.id,
        customerId: conv.customer_id,
        customerName: conv.customer_name || 'Cliente',
        lastMessage: conv.last_message || 'Sem mensagens',
        timestamp: new Date(conv.updated_at),
        unreadCount: conv.unread_count || 0,
        channel: conv.channel_type || 'whatsapp',
        status: conv.status,
      }));
      console.log('Conversas formatadas:', formattedConversations);
      setConversations(formattedConversations);
      console.log('Conversas setadas no store');
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1 className="logo">OmniFlow</h1>
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn active">💬 Conversas</button>
          <button onClick={() => navigate('/clients')} className="nav-btn">👥 Clientes</button>
          <button onClick={() => navigate('/analytics')} className="nav-btn">📊 Analytics</button>
          <button onClick={() => navigate('/notifications')} className="nav-btn">🔔 Notificações</button>
          <button onClick={() => navigate('/automations')} className="nav-btn">⚡ Automações</button>
          <button onClick={() => navigate('/reports')} className="nav-btn">📄 Relatórios</button>
          <button onClick={() => navigate('/settings')} className="nav-btn">⚙️ Configurações</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">👤 Perfil</button>
          <button onClick={() => navigate('/help')} className="nav-btn">❓ Ajuda</button>
        </nav>
      </aside>
      
      <ConversationList conversations={conversations} />
      <ChatArea />
      <CustomerDetails />
    </div>
  );
}
