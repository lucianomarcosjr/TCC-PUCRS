import { useEffect, useState } from 'react';
import { useChatStore } from '@/store';
import { customersAPI } from '@/services/api';

const COLORS = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#6366f1'];

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  vip: { bg: '#eef2ff', color: '#6366f1' },
  premium: { bg: '#d1fae5', color: '#059669' },
  recorrente: { bg: '#fef3c7', color: '#d97706' },
  prospect: { bg: '#fef3c7', color: '#d97706' },
  ativo: { bg: '#d1fae5', color: '#10b981' },
  inativo: { bg: '#fee2e2', color: '#ef4444' },
};

const defaultTag = { bg: '#f3f4f6', color: '#6b7280' };

export function CustomerDetails() {
  const selectedConversation = useChatStore((state) => state.selectedConversation);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedConversation?.customerId) {
      loadCustomer(selectedConversation.customerId);
    } else {
      setCustomer(null);
    }
  }, [selectedConversation?.customerId]);

  const loadCustomer = async (id: string) => {
    setLoading(true);
    try {
      const response = await customersAPI.getById(id);
      setCustomer(response.data);
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedConversation) {
    return (
      <aside style={{ width: 280, background: 'white', borderLeft: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <p style={{ fontSize: '0.875rem' }}>Detalhes do cliente</p>
        </div>
      </aside>
    );
  }

  const colorIndex = selectedConversation.customerName.charCodeAt(0) % COLORS.length;
  const initials = selectedConversation.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const sectionTitle = { fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1.2px', marginBottom: '0.75rem' } as const;
  const divider = { height: 1, background: '#f3f4f6', margin: '0.75rem 0' };
  const infoLabel = { fontSize: '0.6875rem', color: '#9ca3af', marginBottom: 2 };
  const infoValue = { fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' };

  return (
    <aside style={{ width: 280, background: 'white', borderLeft: '1px solid #e5e7eb', padding: '1rem', overflowY: 'auto', flexShrink: 0 }}>
      {/* Avatar + Info */}
      <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: COLORS[colorIndex], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', margin: '0 auto' }}>{initials}</div>
          <div style={{ position: 'absolute', bottom: 0, right: -2, width: 14, height: 14, borderRadius: '50%', background: selectedConversation.status === 'OPEN' ? '#10b981' : '#9ca3af', border: '2px solid white' }} />
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>{selectedConversation.customerName}</div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          {selectedConversation.status === 'OPEN' ? '🟢 Conversa aberta' : '⚪ Conversa fechada'}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <button style={{ padding: '0.375rem 0.75rem', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem' }}>📞</button>
        <button style={{ padding: '0.375rem 0.75rem', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem' }}>✉️</button>
        <button style={{ padding: '0.375rem 0.75rem', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem' }}>📋</button>
      </div>

      <div style={divider} />

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem', fontSize: '0.8125rem' }}>Carregando...</div>
      ) : (
        <>
          {/* INFORMAÇÕES */}
          <div style={sectionTitle}>INFORMAÇÕES</div>
          <div style={infoLabel}>Email</div>
          <div style={infoValue}>{customer?.email || 'Não informado'}</div>
          <div style={infoLabel}>Telefone</div>
          <div style={infoValue}>{customer?.phone || 'Não informado'}</div>
          <div style={infoLabel}>Canal</div>
          <div style={infoValue}>{selectedConversation.channel}</div>
          <div style={infoLabel}>Cliente desde</div>
          <div style={infoValue}>
            {customer?.created_at
              ? new Date(customer.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
              : '—'}
          </div>

          <div style={divider} />

          {/* TAGS */}
          <div style={sectionTitle}>TAGS</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {customer?.tags && customer.tags.length > 0 ? (
              customer.tags.map((tag: string) => {
                const style = TAG_STYLES[tag.toLowerCase()] || defaultTag;
                return (
                  <span key={tag} style={{ padding: '0.125rem 0.5rem', borderRadius: 11, fontSize: '0.625rem', fontWeight: 700, background: style.bg, color: style.color }}>{tag}</span>
                );
              })
            ) : (
              <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>Sem tags</span>
            )}
          </div>

          <div style={divider} />

          {/* NOTAS */}
          <div style={sectionTitle}>NOTAS</div>
          {customer?.notes && customer.notes.length > 0 ? (
            customer.notes.map((note: string, i: number) => (
              <div key={i} style={{ padding: '0.625rem', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#374151' }}>{note}</div>
                <div style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: 4 }}>
                  {customer.updated_at
                    ? new Date(customer.updated_at).toLocaleDateString('pt-BR')
                    : ''}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Nenhuma nota</div>
          )}
          <button style={{ width: '100%', padding: '0.375rem', background: 'transparent', border: '1px dashed #d1d5db', borderRadius: 6, fontSize: '0.6875rem', color: '#9ca3af', cursor: 'pointer' }}>+ Adicionar nota</button>

          <div style={divider} />

          {/* ATIVIDADE */}
          <div style={sectionTitle}>ATIVIDADE</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
              <div style={{ width: 1.5, flex: 1, background: '#e5e7eb', minHeight: 24 }} />
            </div>
            <div style={{ paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#374151' }}>Conversa {selectedConversation.status === 'OPEN' ? 'aberta' : 'fechada'}</div>
              <div style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                {new Date(selectedConversation.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}, {new Date(selectedConversation.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          {customer?.created_at && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
              </div>
              <div style={{ paddingBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#374151' }}>Cadastro realizado</div>
                <div style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                  {new Date(customer.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
