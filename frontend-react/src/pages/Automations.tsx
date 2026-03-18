import { Layout } from '@/components/Layout';
import './Automations.css';

export function Automations() {
  const automations = [
    { id: '1', name: 'Mensagem de Boas-vindas', trigger: 'Nova conversa', action: 'Enviar mensagem', active: true },
    { id: '2', name: 'Atribuição Automática', trigger: 'Nova mensagem', action: 'Atribuir ao agente disponível', active: true },
    { id: '3', name: 'Tag VIP', trigger: 'Palavra-chave: "urgente"', action: 'Adicionar tag VIP', active: false },
  ];

  return (
    <Layout>
      <div className="automations-page">
        <div className="automations-header">
          <div>
            <h1>Automações</h1>
            <p>Automatize tarefas repetitivas e economize tempo</p>
          </div>
          <button className="btn-primary">+ Nova Automação</button>
        </div>

        <div className="automations-list">
          {automations.map((automation) => (
            <div key={automation.id} className="automation-card">
              <div className="automation-info">
                <div className="automation-header">
                  <h3>{automation.name}</h3>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked={automation.active} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="automation-details">
                  <div className="automation-step">
                    <span className="step-label">Quando:</span>
                    <span className="step-value">{automation.trigger}</span>
                  </div>
                  <div className="automation-arrow">→</div>
                  <div className="automation-step">
                    <span className="step-label">Então:</span>
                    <span className="step-value">{automation.action}</span>
                  </div>
                </div>
              </div>
              <div className="automation-actions">
                <button className="btn-icon">Editar</button>
                <button className="btn-icon">Excluir</button>
              </div>
            </div>
          ))}
        </div>

        <div className="automation-templates">
          <h2>Templates Populares</h2>
          <div className="templates-grid">
            <div className="template-card">
              <h4>🎉 Boas-vindas Personalizada</h4>
              <p>Envie uma mensagem de boas-vindas quando um novo cliente entrar em contato</p>
              <button className="btn-secondary">Usar Template</button>
            </div>
            <div className="template-card">
              <h4>⏰ Mensagem Fora do Horário</h4>
              <p>Informe automaticamente quando o atendimento está fechado</p>
              <button className="btn-secondary">Usar Template</button>
            </div>
            <div className="template-card">
              <h4>🏷️ Tag por Palavra-chave</h4>
              <p>Adicione tags automaticamente baseado em palavras-chave</p>
              <button className="btn-secondary">Usar Template</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
