import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store';
import { messagesAPI, conversationsAPI } from '@/services/api';

const COLORS = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#6366f1'];
const QUICK_REPLIES = ['Obrigado!', 'Vou verificar', 'Um momento'];

export function ChatArea() {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, messages, setMessages, addMessage } = useChatStore();

  useEffect(() => {
    if (selectedConversation) loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!selectedConversation) return;
    try {
      const response = await messagesAPI.getHistory(selectedConversation.id);
      setMessages(response.data.map((msg: any) => ({
        id: msg.id, content: msg.content, customerId: msg.customer_id,
        direction: msg.sender_type === 'customer' ? 'INBOUND' : msg.sender_type === 'system' ? 'SYSTEM' : 'OUTBOUND',
        channel: msg.channel || 'whatsapp', timestamp: new Date(msg.created_at), status: msg.status || 'SENT',
      })));
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSend = async (text?: string) => {
    const content = text || messageText.trim();
    if (!content || !selectedConversation || sending) return;
    setSending(true);
    try {
      await messagesAPI.send({ conversationId: selectedConversation.id, content, type: 'text' });
      addMessage({
        id: Date.now().toString(), content, customerId: selectedConversation.customerId,
        direction: 'OUTBOUND', channel: 'whatsapp', timestamp: new Date(), status: 'SENT',
      });
      setMessageText('');
    } catch { alert('Erro ao enviar mensagem'); }
    finally { setSending(false); }
  };

  const handleClose = async () => {
    if (!selectedConversation || !confirm('Fechar esta conversa? Uma avaliação será enviada ao cliente.')) return;
    try {
      await conversationsAPI.close(selectedConversation.id);
      loadMessages();
    } catch { alert('Erro ao fechar conversa'); }
  };

  if (!selectedConversation) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Selecione uma conversa</h3>
          <p style={{ fontSize: '0.875rem' }}>Escolha uma conversa da lista para começar</p>
        </div>
      </main>
    );
  }

  const colorIndex = selectedConversation.customerName.charCodeAt(0) % COLORS.length;
  const initials = selectedConversation.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Chat Header */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS[colorIndex], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.6875rem' }}>{initials}</div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>{selectedConversation.customerName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6875rem', color: '#10b981' }}>Online</span>
            </div>
          </div>
          <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 11 }}>{selectedConversation.channel === 'instagram' ? 'Instagram' : selectedConversation.channel === 'email' ? 'Email' : 'WhatsApp'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button style={{ padding: '0.375rem 0.75rem', border: '1.5px solid #d1d5db', background: 'transparent', borderRadius: 6, fontSize: '0.6875rem', cursor: 'pointer', color: '#6b7280' }}>Atribuir</button>
          <button onClick={handleClose} style={{ padding: '0.375rem 0.75rem', border: '1.5px solid #fca5a5', background: 'transparent', borderRadius: 6, fontSize: '0.6875rem', cursor: 'pointer', color: '#ef4444' }}>Fechar</button>
          <button style={{ padding: '0.375rem 0.5rem', border: '1.5px solid #d1d5db', background: 'transparent', borderRadius: 6, fontSize: '1rem', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>···</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: '#fafafa' }}>
        {/* Date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0 1.25rem' }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ fontSize: '0.6875rem', color: '#9ca3af', background: '#f9fafb', border: '1px solid #e5e7eb', padding: '0.125rem 0.75rem', borderRadius: 10 }}>Hoje</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.875rem' }}>Nenhuma mensagem ainda. Envie a primeira!</div>
        ) : (
          messages.map(msg => {
            const isInbound = msg.direction === 'INBOUND';
            const isSystem = msg.direction === 'SYSTEM';

            if (isSystem) {
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ maxWidth: '80%', padding: '0.625rem 1rem', borderRadius: 12, fontSize: '0.75rem', lineHeight: 1.6, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', textAlign: 'center', whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isInbound ? 'flex-start' : 'flex-end', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: isInbound ? 'row' : 'row-reverse' }}>
                  {isInbound && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: COLORS[colorIndex], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.5rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{initials}</div>
                  )}
                  <div style={{ maxWidth: '60%', padding: '0.625rem 0.875rem', borderRadius: 12, fontSize: '0.8125rem', lineHeight: 1.5, background: isInbound ? '#f3f4f6' : '#6366f1', color: isInbound ? '#374151' : 'white' }}>
                    {msg.content}
                  </div>
                </div>
                <span style={{ fontSize: '0.625rem', color: isInbound ? '#9ca3af' : '#c7d2fe', marginTop: 2, paddingLeft: isInbound ? 36 : 0, paddingRight: isInbound ? 0 : 0 }}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {!isInbound && ' ✓✓'}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Suggestions */}
      <div style={{ padding: '0.5rem 1rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 6 }}>
        {QUICK_REPLIES.map(text => (
          <button key={text} onClick={() => handleSend(text)} style={{ padding: '0.25rem 0.75rem', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 13, fontSize: '0.6875rem', color: '#6366f1', cursor: 'pointer' }}>{text}</button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={sending}
          style={{ flex: 1, padding: '0.625rem 1rem', border: '1px solid #e5e7eb', borderRadius: 21, fontSize: '0.8125rem', background: '#f3f4f6' }}
        />
        {/* Attach */}
        <button style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</button>
        {/* Emoji */}
        <button style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>😊</button>
        {/* Send */}
        <button
          onClick={() => handleSend()}
          disabled={!messageText.trim() || sending}
          style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !messageText.trim() ? 0.5 : 1 }}
        >➤</button>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.625rem', color: '#c4c8cf', paddingBottom: 4 }}>Enter para enviar</div>
    </main>
  );
}
