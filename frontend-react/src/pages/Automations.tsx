import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { automationsAPI } from '@/services/api';
import './Automations.css';

interface Automation {
  id: string;
  name: string;
  trigger_type: string;
  trigger_value: string | null;
  action_type: string;
  action_value: string;
  is_active: boolean;
}

const TRIGGER_LABELS: Record<string, string> = {
  new_conversation: 'Nova conversa',
  new_message: 'Nova mensagem',
  keyword: 'Palavra-chave',
  off_hours: 'Fora do horário',
};

const ACTION_LABELS: Record<string, string> = {
  send_message: 'Enviar mensagem',
  assign_agent: 'Atribuir agente',
  add_tag: 'Adicionar tag',
  close_conversation: 'Fechar conversa',
};

const TEMPLATES = [
  { name: '🎉 Boas-vindas', desc: 'Mensagem automática para novos contatos', triggerType: 'new_conversation', actionType: 'send_message', actionValue: 'Olá! Bem-vindo ao nosso atendimento. Em que posso ajudar?' },
  { name: '⏰ Fora do Horário', desc: 'Aviso quando o atendimento está fechado', triggerType: 'off_hours', actionType: 'send_message', actionValue: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Retornaremos em breve!' },
  { name: '🏷️ Tag Urgente', desc: 'Marca como urgente por palavra-chave', triggerType: 'keyword', triggerValue: 'urgente', actionType: 'add_tag', actionValue: 'urgente' },
];

export function Automations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', triggerType: 'new_conversation', triggerValue: '', actionType: 'send_message', actionValue: '' });

  useEffect(() => { loadAutomations(); }, []);

  const loadAutomations = async () => {
    try {
      const { data } = await automationsAPI.list();
      setAutomations(data);
    } catch (e) {
      console.error('Erro ao carregar automações:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.actionValue) return;
    try {
      if (editingId) {
        await automationsAPI.update(editingId, { ...form, isActive: true });
      } else {
        await automationsAPI.create(form);
      }
      resetForm();
      loadAutomations();
    } catch (e) {
      console.error('Erro ao salvar automação:', e);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await automationsAPI.toggle(id);
      setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));
    } catch (e) {
      console.error('Erro ao alternar automação:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta automação?')) return;
    try {
      await automationsAPI.delete(id);
      setAutomations(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error('Erro ao excluir automação:', e);
    }
  };

  const handleEdit = (auto: Automation) => {
    setForm({ name: auto.name, triggerType: auto.trigger_type, triggerValue: auto.trigger_value || '', actionType: auto.action_type, actionValue: auto.action_value });
    setEditingId(auto.id);
    setShowForm(true);
  };

  const useTemplate = (t: typeof TEMPLATES[0]) => {
    setForm({ name: t.name, triggerType: t.triggerType, triggerValue: ('triggerValue' in t ? (t as any).triggerValue : '') || '', actionType: t.actionType, actionValue: t.actionValue });
    setEditingId(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', triggerType: 'new_conversation', triggerValue: '', actionType: 'send_message', actionValue: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="automations-page">
        <div className="automations-header">
          <div>
            <h1>Automações</h1>
            <p>Automatize respostas e ações no WhatsApp</p>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Nova Automação</button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="automation-form-card">
            <h3>{editingId ? 'Editar Automação' : 'Nova Automação'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Boas-vindas" />
              </div>
              <div className="form-group">
                <label>Quando (Trigger)</label>
                <select value={form.triggerType} onChange={e => setForm({ ...form, triggerType: e.target.value })}>
                  {Object.entries(TRIGGER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              {form.triggerType === 'keyword' && (
                <div className="form-group">
                  <label>Palavra-chave</label>
                  <input type="text" value={form.triggerValue} onChange={e => setForm({ ...form, triggerValue: e.target.value })} placeholder="Ex: urgente" />
                </div>
              )}
              <div className="form-group">
                <label>Ação</label>
                <select value={form.actionType} onChange={e => setForm({ ...form, actionType: e.target.value })}>
                  {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="form-group full-width">
                <label>
                  {form.actionType === 'send_message' ? 'Mensagem' :
                   form.actionType === 'add_tag' ? 'Nome da tag' :
                   form.actionType === 'assign_agent' ? 'ID do agente' : 'Valor'}
                </label>
                {form.actionType === 'send_message' ? (
                  <textarea value={form.actionValue} onChange={e => setForm({ ...form, actionValue: e.target.value })} placeholder="Digite a mensagem automática..." rows={3} />
                ) : form.actionType === 'close_conversation' ? (
                  <input type="text" value="auto" disabled />
                ) : (
                  <input type="text" value={form.actionValue} onChange={e => setForm({ ...form, actionValue: e.target.value })} />
                )}
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={resetForm}>Cancelar</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={!form.name || (!form.actionValue && form.actionType !== 'close_conversation')}>
                {editingId ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="automations-list">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Carregando...</p>
          ) : automations.length === 0 && !showForm ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Nenhuma automação criada. Use os templates abaixo ou crie uma nova.</p>
          ) : (
            automations.map((auto) => (
              <div key={auto.id} className={`automation-card ${!auto.is_active ? 'inactive' : ''}`}>
                <div className="automation-info">
                  <div className="automation-header">
                    <h3>{auto.name}</h3>
                    <label className="toggle">
                      <input type="checkbox" checked={auto.is_active} onChange={() => handleToggle(auto.id)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="automation-details">
                    <div className="automation-step">
                      <span className="step-label">Quando:</span>
                      <span className="step-value">
                        {TRIGGER_LABELS[auto.trigger_type] || auto.trigger_type}
                        {auto.trigger_value ? `: "${auto.trigger_value}"` : ''}
                      </span>
                    </div>
                    <div className="automation-arrow">→</div>
                    <div className="automation-step">
                      <span className="step-label">Então:</span>
                      <span className="step-value">
                        {ACTION_LABELS[auto.action_type] || auto.action_type}
                        {auto.action_type === 'send_message' ? '' : `: ${auto.action_value}`}
                      </span>
                    </div>
                  </div>
                  {auto.action_type === 'send_message' && (
                    <div className="automation-preview">"{auto.action_value}"</div>
                  )}
                </div>
                <div className="automation-actions">
                  <button className="btn-icon" onClick={() => handleEdit(auto)}>Editar</button>
                  <button className="btn-icon danger" onClick={() => handleDelete(auto.id)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Templates */}
        <div className="automation-templates">
          <h2>Templates Populares</h2>
          <div className="templates-grid">
            {TEMPLATES.map((t, i) => (
              <div key={i} className="template-card">
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
                <button className="btn-secondary" onClick={() => useTemplate(t)}>Usar Template</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
