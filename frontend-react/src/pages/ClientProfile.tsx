import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { customersAPI } from '@/services/api';
import './ClientProfile.css';

export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [client, setClient] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadClient();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'conversations') {
      loadConversations();
    }
  }, [activeTab]);

  const loadClient = async () => {
    try {
      const response = await customersAPI.getById(id!);
      setClient(response.data);
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await customersAPI.getConversations(id!);
      setConversations(response.data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await customersAPI.addNote(id!, newNote);
      setNewNote('');
      loadClient();
    } catch (error) {
      alert('Erro ao adicionar nota');
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: '2rem' }}>Carregando...</div></Layout>;
  }

  if (!client) {
    return <Layout><div style={{ padding: '2rem' }}>Cliente não encontrado</div></Layout>;
  }

  return (
    <Layout>
      <div className="client-profile">
        <div className="profile-header">
          <button onClick={() => navigate('/clients')} className="btn-back">← Voltar</button>
          <div className="profile-info">
            <div className="avatar-large">{client.name[0]}</div>
            <div>
              <h1>{client.name}</h1>
              <p>{client.phone}</p>
            </div>
          </div>
          <button onClick={() => navigate(`/clients/${id}/edit`)} className="btn-primary">Editar</button>
        </div>

        <div className="profile-tabs">
          <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Informações</button>
          <button className={activeTab === 'conversations' ? 'active' : ''} onClick={() => setActiveTab('conversations')}>Conversas</button>
          <button className={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>Notas</button>
        </div>

        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="info-section">
              <div className="info-card">
                <h3>Dados Pessoais</h3>
                <div className="info-grid">
                  <div><strong>Nome:</strong> {client.name}</div>
                  <div><strong>Email:</strong> {client.email || 'N/A'}</div>
                  <div><strong>Telefone:</strong> {client.phone}</div>
                  <div><strong>Tags:</strong> {client.tags?.map((tag: string) => <span key={tag} className="tag">{tag}</span>)}</div>
                </div>
              </div>
              <div className="info-card">
                <h3>Estatísticas</h3>
                <div className="info-grid">
                  <div><strong>Criado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</div>
                  <div><strong>Última atualização:</strong> {new Date(client.updated_at).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="conversations-section">
              <button 
                className="btn-primary" 
                style={{ marginBottom: '1rem' }}
                onClick={() => navigate('/dashboard')}
              >
                + Iniciar Nova Conversa
              </button>
              <div className="conversation-timeline">
                {conversations.length === 0 ? (
                  <p>Nenhuma conversa encontrada</p>
                ) : (
                  conversations.map((conv: any) => (
                    <div key={conv.id} className="timeline-item">
                      <div className="timeline-date">{new Date(conv.created_at).toLocaleDateString('pt-BR')}</div>
                      <div className="timeline-content">
                        <strong>Conversa via {conv.channel_type}</strong>
                        <p>Status: {conv.status}</p>
                        <button 
                          className="btn-secondary" 
                          style={{ marginTop: '0.5rem' }}
                          onClick={() => navigate('/dashboard')}
                        >
                          Ver Conversa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="notes-section">
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Digite uma nota..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <button className="btn-primary" onClick={handleAddNote}>Adicionar</button>
              </div>
              {client.notes && client.notes.length > 0 ? (
                client.notes.map((note: string, index: number) => (
                  <div key={index} className="note-item">
                    <div className="note-header">
                      <strong>Nota {index + 1}</strong>
                      <span>{new Date(client.updated_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p>{note}</p>
                  </div>
                ))
              ) : (
                <p>Nenhuma nota adicionada</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
