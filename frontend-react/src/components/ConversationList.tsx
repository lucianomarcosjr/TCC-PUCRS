import { useChatStore } from '@/store';
import type { Conversation } from '@/types';

interface Props {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: Props) {
  const { selectConversation, selectedConversation } = useChatStore();
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '320px', background: 'white', borderRight: '1px solid #e5e7eb' }}>
      <div className="search-bar">
        <input type="text" placeholder="🔍 Buscar conversas..." />
      </div>

      <div className="filters">
        <button className="filter-btn active">Todas</button>
        <button className="filter-btn">Não lidas</button>
        <button className="filter-btn">Abertas</button>
      </div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p style={{ fontSize: '0.875rem' }}>Nenhuma conversa ainda</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const colorIndex = conv.customerName.charCodeAt(0) % colors.length;
            const isActive = selectedConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                className={`conversation-item ${isActive ? 'active' : ''}`}
                onClick={() => selectConversation(conv)}
              >
                <div className="avatar" style={{ background: colors[colorIndex] }}>
                  {conv.customerName[0]}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conv.customerName}</h4>
                    <span className="timestamp">
                      {new Date(conv.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="conversation-preview">
                    <p>{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <span className="badge">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
