import { useChatStore } from '@/store';

export function CustomerDetails() {
  const selectedConversation = useChatStore((state) => state.selectedConversation);
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  if (!selectedConversation) {
    return (
      <aside className="sidebar-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <p style={{ fontSize: '0.875rem' }}>Detalhes do cliente</p>
        </div>
      </aside>
    );
  }

  const colorIndex = selectedConversation.customerName.charCodeAt(0) % colors.length;

  return (
    <aside className="sidebar-right">
      <div className="customer-details">
        <div 
          className="avatar-large" 
          style={{ 
            background: colors[colorIndex],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '2rem',
            textTransform: 'uppercase'
          }}
        >
          {selectedConversation.customerName[0]}
        </div>
        <h3>{selectedConversation.customerName}</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cliente #{selectedConversation.customerId.slice(0, 8)}</p>
      </div>

      <div className="customer-stats">
        <h4>Informações</h4>
        <p>Status: <strong style={{ color: '#10b981' }}>{selectedConversation.status}</strong></p>
        <p>Canal: <strong>{selectedConversation.channel}</strong></p>
        <p>Última atualização: <strong>{new Date(selectedConversation.timestamp).toLocaleDateString('pt-BR')}</strong></p>
      </div>

      <div className="notes">
        <h4>Notas Internas</h4>
        <textarea placeholder="Adicionar nota sobre este cliente..." style={{ minHeight: '120px' }} />
        <button className="btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>Salvar Nota</button>
      </div>
    </aside>
  );
}
