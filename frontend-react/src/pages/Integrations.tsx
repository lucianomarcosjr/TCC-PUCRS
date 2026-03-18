import { Layout } from '@/components/Layout';
import './Integrations.css';

export function Integrations() {
  const integrations = [
    { id: '1', name: 'WhatsApp Business API', icon: '📱', status: 'connected', description: 'Conecte seu WhatsApp Business' },
    { id: '2', name: 'Instagram Direct', icon: '📷', status: 'disconnected', description: 'Receba mensagens do Instagram' },
    { id: '3', name: 'Facebook Messenger', icon: '💬', status: 'disconnected', description: 'Integre com Facebook Messenger' },
    { id: '4', name: 'Email (SMTP)', icon: '📧', status: 'disconnected', description: 'Configure servidor de email' },
    { id: '5', name: 'Zapier', icon: '⚡', status: 'disconnected', description: 'Automatize com 5000+ apps' },
    { id: '6', name: 'Webhooks', icon: '🔗', status: 'disconnected', description: 'Envie eventos para sua API' },
  ];

  return (
    <Layout>
      <div className="integrations-page">
        <div className="integrations-header">
          <h1>Integrações</h1>
          <p>Conecte o OmniFlow com suas ferramentas favoritas</p>
        </div>

        <div className="integrations-grid">
          {integrations.map((integration) => (
            <div key={integration.id} className={`integration-card ${integration.status}`}>
              <div className="integration-icon">{integration.icon}</div>
              <div className="integration-info">
                <h3>{integration.name}</h3>
                <p>{integration.description}</p>
              </div>
              <div className="integration-status">
                {integration.status === 'connected' ? (
                  <>
                    <span className="status-badge connected">Conectado</span>
                    <button className="btn-secondary">Configurar</button>
                    <button className="btn-secondary">Desconectar</button>
                  </>
                ) : (
                  <button className="btn-primary">Conectar</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="integration-docs">
          <h3>📚 Documentação</h3>
          <p>Precisa de ajuda para configurar? <a href="#docs">Consulte nossa documentação</a></p>
        </div>
      </div>
    </Layout>
  );
}
