import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store';
import { messagesAPI, conversationsAPI } from '@/services/api';

export function ChatArea() {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, messages, setMessages, addMessage } = useChatStore();

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!selectedConversation) return;
    
    try {
      const response = await messagesAPI.getHistory(selectedConversation.id);
      const formattedMessages = response.data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        customerId: msg.customer_id,
        direction: msg.sender_type?.toLowerCase() === 'customer' ? 'INBOUND' : 'OUTBOUND',
        channel: msg.channel || 'whatsapp',
        timestamp: new Date(msg.created_at),
        status: msg.status || 'SENT',
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      await messagesAPI.send({
        conversationId: selectedConversation.id,
        content: messageText,
        type: 'text'
      });

      const newMessage = {
        id: Date.now().toString(),
        content: messageText,
        customerId: selectedConversation.customerId,
        direction: 'OUTBOUND' as const,
        channel: 'whatsapp' as const,
        timestamp: new Date(),
        status: 'SENT' as const,
      };

      addMessage(newMessage);
      setMessageText('');
    } catch (error) {
      alert('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    if (!selectedConversation) return;
    if (!confirm('Fechar esta conversa?')) return;
    
    try {
      await conversationsAPI.close(selectedConversation.id);
      alert('Conversa fechada!');
    } catch (error) {
      alert('Erro ao fechar conversa');
    }
  };

  if (!selectedConversation) {
    return (
      <main className="chat-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Selecione uma conversa</h3>
          <p style={{ fontSize: '0.875rem' }}>Escolha uma conversa da lista para começar a enviar mensagens</p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-area">
      <div className="chat-header">
        <div className="customer-info">
          <div className="avatar" style={{ background: '#6366f1', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.125rem' }}>
            {selectedConversation.customerName[0]}
          </div>
          <div>
            <h3>{selectedConversation.customerName}</h3>
            <span className="status">✅ WhatsApp</span>
          </div>
        </div>
        <div className="chat-actions">
          <button className="icon-btn" onClick={handleClose} title="Fechar conversa">❌ Fechar</button>
        </div>
      </div>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <p>Nenhuma mensagem ainda. Envie a primeira!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.direction.toLowerCase()}`}>
              <div className="message-content">{msg.content}</div>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={sending}
        />
        <button 
          className="btn-primary" 
          onClick={handleSend}
          disabled={!messageText.trim() || sending}
          style={{ minWidth: '100px' }}
        >
          {sending ? 'Enviando...' : '➤ Enviar'}
        </button>
      </div>
    </main>
  );
}
