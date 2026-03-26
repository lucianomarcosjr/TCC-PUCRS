import { SettingsLayout } from '@/components/SettingsLayout';
import './Billing.css';

export function Billing() {
  const currentPlan = {
    name: 'Professional',
    price: 149,
    conversations: 248,
    conversationsLimit: 'Ilimitadas',
    users: 3,
    usersLimit: 5,
  };

  const invoices = [
    { id: '1', date: '2024-01-01', amount: 149, status: 'paid' },
    { id: '2', date: '2023-12-01', amount: 149, status: 'paid' },
    { id: '3', date: '2023-11-01', amount: 149, status: 'paid' },
  ];

  return (
    <SettingsLayout>
      <div className="billing-page">
        <h1>Planos e Pagamento</h1>

        <div className="current-plan">
          <div className="plan-header">
            <div>
              <h2>Plano Atual: {currentPlan.name}</h2>
              <div className="plan-price">R$ {currentPlan.price}/mês</div>
            </div>
            <button className="btn-primary">Alterar Plano</button>
          </div>

          <div className="usage-stats">
            <div className="usage-item">
              <div className="usage-label">Conversas este mês</div>
              <div className="usage-value">{currentPlan.conversations} / {currentPlan.conversationsLimit}</div>
              <div className="usage-bar">
                <div className="usage-fill" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="usage-item">
              <div className="usage-label">Usuários ativos</div>
              <div className="usage-value">{currentPlan.users} / {currentPlan.usersLimit}</div>
              <div className="usage-bar">
                <div className="usage-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-method">
          <h3>Método de Pagamento</h3>
          <div className="card-info">
            <div className="card-icon">💳</div>
            <div>
              <div className="card-number">•••• •••• •••• 4242</div>
              <div className="card-expiry">Expira em 12/2025</div>
            </div>
            <button className="btn-secondary">Alterar</button>
          </div>
        </div>

        <div className="invoices-section">
          <h3>Histórico de Faturas</h3>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{new Date(invoice.date).toLocaleDateString('pt-BR')}</td>
                  <td>R$ {invoice.amount}</td>
                  <td><span className="status-badge paid">Pago</span></td>
                  <td><button className="btn-icon">Baixar PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="danger-zone">
          <h3>Zona de Perigo</h3>
          <p>Cancelar sua assinatura removerá o acesso a todos os recursos.</p>
          <button className="btn-danger">Cancelar Assinatura</button>
        </div>
      </div>
    </SettingsLayout>
  );
}
