import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { customersAPI } from '@/services/api';
import './ClientForm.css';

export function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const response = await customersAPI.getById(id!);
      const client = response.data;
      setName(client.name);
      setEmail(client.email || '');
      setPhone(client.phone);
      setTags(client.tags?.join(' ') || '');
      setNotes(client.notes || '');
    } catch (error) {
      setError('Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone) {
      setError('Nome e telefone são obrigatórios');
      return;
    }

    try {
      await customersAPI.update(id!, {
        name,
        phone,
        email: email || null,
        tags: tags ? tags.split(' ').map(t => t.trim()).filter(t => t) : [],
        notes
      });
      navigate('/clients');
    } catch (error) {
      setError('Erro ao atualizar cliente');
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: '2rem' }}>Carregando...</div></Layout>;
  }

  return (
    <Layout>
      <div className="client-form">
        <div className="form-header">
          <button onClick={() => navigate(`/clients/${id}`)} className="btn-back">← Voltar</button>
          <h1>Editar Cliente</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label htmlFor="name">Nome *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone *</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/clients')} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
