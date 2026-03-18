import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import './Layout.css';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="layout-sidebar">
        <div className="sidebar-header">
          <h1 className="logo">OmniFlow</h1>
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">💬 Conversas</button>
          <button onClick={() => navigate('/clients')} className="nav-btn">👥 Clientes</button>
          <button onClick={() => navigate('/analytics')} className="nav-btn">📊 Analytics</button>
          <button onClick={() => navigate('/notifications')} className="nav-btn">🔔 Notificações</button>
          <button onClick={() => navigate('/automations')} className="nav-btn">⚡ Automações</button>
          <button onClick={() => navigate('/reports')} className="nav-btn">📄 Relatórios</button>
          <button onClick={() => navigate('/settings')} className="nav-btn">⚙️ Configurações</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">👤 Perfil</button>
          <button onClick={() => navigate('/help')} className="nav-btn">❓ Ajuda</button>
        </nav>
      </aside>

      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}
