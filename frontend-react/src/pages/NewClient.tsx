import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { customersAPI } from '@/services/api';
import './ClientForm.css';

export function NewClient() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !phone) {
      setError('Nome e telefone são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const tagsArray = tags ? tags.split(' ').map(t => t.trim()).filter(t => t) : [];
      await customersAPI.create({
        name,
        phone,
        email,
        tags: tagsArray,
        notes: notes ? [notes] : []
      });
      navigate('/clients');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="client-form">
        <div className="form-header">
          <button onClick={() => navigate('/clients')} className="btn-back">← Voltar</button>
          <h1>Novo Cliente</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label htmlFor="name">Nome *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do cliente"
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
              placeholder="+55 11 99999-9999"
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
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="vip premium (separadas por espaço)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas Iniciais</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o cliente..."
              rows={4}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/clients')} className="btn-secondary" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
