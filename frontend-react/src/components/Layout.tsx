import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import './Layout.css';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="layout">
      <aside className="layout-sidebar">
        <div className="sidebar-header">
          <div className="logo">⚡ OmniFlow</div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Menu</div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate('/dashboard')} className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}>💬 Conversas</button>
          <button onClick={() => navigate('/clients')} className={`nav-btn ${isActive('/clients') ? 'active' : ''}`}>👥 Clientes</button>
          <button onClick={() => navigate('/analytics')} className={`nav-btn ${isActive('/analytics') ? 'active' : ''}`}>📊 Analytics</button>
          <button onClick={() => navigate('/notifications')} className={`nav-btn ${isActive('/notifications') ? 'active' : ''}`}>🔔 Notificações</button>
          <button onClick={() => navigate('/automations')} className={`nav-btn ${isActive('/automations') ? 'active' : ''}`}>⚡ Automações</button>
          <button onClick={() => navigate('/reports')} className={`nav-btn ${isActive('/reports') ? 'active' : ''}`}>📄 Relatórios</button>

          <div className="sidebar-divider" style={{ margin: '0.5rem 0' }} />

          <div className="sidebar-section-label">Sistema</div>

          <button onClick={() => navigate('/settings')} className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}>⚙️ Configurações</button>
          <button onClick={() => navigate('/profile')} className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}>👤 Perfil</button>
          <button onClick={() => navigate('/help')} className={`nav-btn ${isActive('/help') ? 'active' : ''}`}>❓ Ajuda</button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Usuário'}</div>
            <div className="sidebar-user-role">{user?.role || 'Admin'}</div>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </aside>

      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}
