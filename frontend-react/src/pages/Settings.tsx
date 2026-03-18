import { useState } from 'react';
import { Layout } from '@/components/Layout';
import './Settings.css';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Layout>
      <div className="settings-page">
      <div className="settings-sidebar">
        <h2>Configurações</h2>
        <nav>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Perfil</button>
          <button className={activeTab === 'company' ? 'active' : ''} onClick={() => window.location.href = '/settings/company'}>Empresa</button>
          <button className={activeTab === 'channels' ? 'active' : ''} onClick={() => setActiveTab('channels')}>Canais</button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Usuários</button>
          <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => window.location.href = '/settings/notifications'}>Notificações</button>
          <button onClick={() => window.location.href = '/integrations'}>Integrações</button>
          <button onClick={() => window.location.href = '/billing'}>Planos e Pagamento</button>
        </nav>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h1>Perfil</h1>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" defaultValue="João Silva" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="joao@lojaexemplo.com" />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="btn-primary">Salvar Alterações</button>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="settings-section">
            <h1>Canais</h1>
            <div className="channel-card connected">
              <div className="channel-info">
                <div className="channel-icon">📱</div>
                <div>
                  <h3>WhatsApp</h3>
                  <p>Conectado</p>
                </div>
              </div>
              <button className="btn-secondary">Desconectar</button>
            </div>
            <div className="channel-card">
              <div className="channel-info">
                <div className="channel-icon">📷</div>
                <div>
                  <h3>Instagram</h3>
                  <p>Não conectado</p>
                </div>
              </div>
              <button className="btn-primary">Conectar</button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="settings-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1>Usuários</h1>
              <button className="btn-primary">+ Convidar Usuário</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>João Silva</td>
                  <td>joao@lojaexemplo.com</td>
                  <td>OWNER</td>
                  <td><span className="status-badge active">Ativo</span></td>
                  <td><button className="btn-icon">Editar</button></td>
                </tr>
                <tr>
                  <td>Maria Santos</td>
                  <td>maria@lojaexemplo.com</td>
                  <td>AGENT</td>
                  <td><span className="status-badge active">Ativo</span></td>
                  <td><button className="btn-icon">Editar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
}
