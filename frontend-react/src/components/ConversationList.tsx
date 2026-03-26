import { useState } from 'react';
import { useChatStore } from '@/store';
import type { Conversation } from '@/types';

interface Props {
  conversations: Conversation[];
}

const CHANNEL_BADGES: Record<string, { label: string; bg: string }> = {
  whatsapp: { label: 'WA', bg: '#22c55e' },
  instagram: { label: 'IG', bg: '#e91e8c' },
  email: { label: 'EM', bg: '#3b82f6' },
};

const COLORS = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#6366f1'];

export function ConversationList({ conversations }: Props) {
  const { selectConversation, selectedConversation } = useChatStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const unreadCount = conversations.filter(c => c.unreadCount > 0).length;
  const openCount = conversations.filter(c => c.status === 'open').length;

  const filtered = conversations.filter(c => {
    if (filter === 'unread' && c.unreadCount === 0) return false;
    if (filter === 'open' && c.status !== 'OPEN') return false;
    if (filter === 'closed' && c.status !== 'CLOSED') return false;
    if (search && !c.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 320, background: 'white', borderRight: '1px solid #e5e7eb', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Conversas</span>
        <button className="btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: 8 }}>+ Nova</button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 1rem 0.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Buscar conversas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 18, fontSize: '0.8125rem', background: '#f3f4f6' }}
        />
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: 4, padding: '0 1rem 0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '0.25rem 0.625rem', border: 'none', borderRadius: 13, fontSize: '0.6875rem', fontWeight: filter === 'all' ? 700 : 400, cursor: 'pointer', background: filter === 'all' ? '#6366f1' : '#f3f4f6', color: filter === 'all' ? 'white' : '#6b7280' }}>Todas</button>
        <button onClick={() => setFilter('unread')} style={{ padding: '0.25rem 0.625rem', border: 'none', borderRadius: 13, fontSize: '0.6875rem', cursor: 'pointer', background: filter === 'unread' ? '#6366f1' : '#f3f4f6', color: filter === 'unread' ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
          Não lidas
          {unreadCount > 0 && <span style={{ background: '#6366f1', color: 'white', fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 8, marginLeft: 2 }}>{unreadCount}</span>}
        </button>
        <button onClick={() => setFilter('open')} style={{ padding: '0.25rem 0.625rem', border: 'none', borderRadius: 13, fontSize: '0.6875rem', cursor: 'pointer', background: filter === 'open' ? '#6366f1' : '#f3f4f6', color: filter === 'open' ? 'white' : '#6b7280' }}>Abertas</button>
        <button onClick={() => setFilter('closed')} style={{ padding: '0.25rem 0.625rem', border: 'none', borderRadius: 13, fontSize: '0.6875rem', cursor: 'pointer', background: filter === 'closed' ? '#6366f1' : '#f3f4f6', color: filter === 'closed' ? 'white' : '#6b7280' }}>Fechadas</button>
      </div>

      {/* Quick Stats */}
      <div style={{ padding: '0 1rem 0.5rem', fontSize: '0.6875rem', color: '#9ca3af' }}>
        {openCount} abertas · {unreadCount} não lidas
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p style={{ fontSize: '0.875rem' }}>Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filtered.map(conv => {
            const colorIndex = conv.customerName.charCodeAt(0) % COLORS.length;
            const isActive = selectedConversation?.id === conv.id;
            const initials = conv.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const channel = CHANNEL_BADGES[conv.channel] || CHANNEL_BADGES.whatsapp;

            return (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                style={{
                  display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: isActive ? '#eef2ff' : 'white',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: '50%', background: COLORS[colorIndex], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6875rem', fontWeight: 700 }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{conv.customerName}</span>
                      <span style={{ background: channel.bg, color: 'white', fontSize: '0.5625rem', fontWeight: 700, padding: '1px 5px', borderRadius: 8 }}>{channel.label}</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{formatTime(conv.timestamp)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <span style={{ background: '#6366f1', color: 'white', fontSize: '0.5625rem', fontWeight: 700, padding: '1px 6px', borderRadius: 8, minWidth: 18, textAlign: 'center', flexShrink: 0, marginLeft: 8 }}>{conv.unreadCount}</span>
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
