import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { customersAPI, conversationsAPI } from '@/services/api';
import './Clients.css';

export function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, [searchTerm, selectedTags]);

  useEffect(() => {
    loadAllTags();
    
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.actions-menu')) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadAllTags = async () => {
    try {
      const response = await customersAPI.list({});
      const tags = new Set<string>();
      response.data.forEach((client: any) => {
        client.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  };

  const loadClients = async () => {
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await customersAPI.list(params);
      
      // Filtrar por tags no frontend se houver tags selecionadas
      let filteredClients = response.data;
      if (selectedTags.length > 0) {
        filteredClients = response.data.filter((client: any) => 
          selectedTags.every(tag => client.tags?.includes(tag))
        );
      }
      
      setClients(filteredClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${name}?`)) return;
    
    try {
      await customersAPI.delete(id);
      loadClients();
    } catch (error) {
      alert('Erro ao deletar cliente');
    }
  };

  const handleStartConversation = async (customerId: string) => {
    try {
      console.log('Criando conversa para cliente:', customerId);
      const response = await conversationsAPI.create(customerId);
      console.log('Conversa criada:', response.data);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao criar conversa:', error);
      alert(error.response?.data?.error || 'Erro ao iniciar conversa');
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: '2rem' }}>Carregando...</div></Layout>;
  }

  return (
    <Layout>
      <div className="clients-page">
        <div className="clients-header">
          <h1>Clientes</h1>
          <div className="clients-actions">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={() => navigate('/clients/new')} className="btn-primary">+ Novo Cliente</button>
          </div>
        </div>

        <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {allTags.map(tag => (
            <span 
              key={tag} 
              onClick={() => toggleTag(tag)}
              className="tag"
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedTags.includes(tag) ? '#6366f1' : '#e5e7eb',
                color: selectedTags.includes(tag) ? '#fff' : '#374151'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="clients-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Tags</th>
                <th>Última Interação</th>
                <th>Mensagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client: any) => {
                const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
                const colorIndex = client.name.charCodeAt(0) % colors.length;
                return (
                <tr key={client.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar-small" style={{ background: colors[colorIndex] }}>{client.name[0]}</div>
                      <strong>{client.name}</strong>
                    </div>
                  </td>
                  <td><strong>{client.phone}</strong></td>
                  <td>{client.email}</td>
                  <td>
                    {client.tags && client.tags.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {client.tags.map((tag: string) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sem tags</span>
                    )}
                  </td>
                  <td>{new Date(client.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button 
                      className="btn-message"
                      onClick={() => handleStartConversation(client.id)}
                    >
                      Iniciar Conversa
                    </button>
                  </td>
                  <td>
                    <div className="actions-menu">
                      <button 
                        className="actions-trigger"
                        onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)}
                      >
                        ⋮
                      </button>
                      {openMenuId === client.id && (
                        <div className="actions-dropdown" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { navigate(`/clients/${client.id}`); setOpenMenuId(null); }}>Ver Detalhes</button>
                          <button onClick={() => { navigate(`/clients/${client.id}/edit`); setOpenMenuId(null); }}>Editar Cliente</button>
                          <button className="danger" onClick={() => { handleDelete(client.id, client.name); setOpenMenuId(null); }}>Deletar Cliente</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
