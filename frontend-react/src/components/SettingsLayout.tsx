import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import '../pages/Settings.css';

interface Props {
  children: ReactNode;
}

const ITEMS = [
  { path: '/settings', label: '👤 Perfil', exact: true },
  { path: '/settings/company', label: '🏢 Empresa' },
  { path: '/settings/channels', label: '🔗 Canais' },
  { path: '/settings/users', label: '👥 Usuários' },
  { path: '/settings/notifications', label: '🔔 Notificações' },
  { path: '/integrations', label: '🔌 Integrações' },
  { path: '/billing', label: '💳 Faturamento' },
];

export function SettingsLayout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: typeof ITEMS[0]) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <Layout>
      <div className="settings-page">
        <div className="settings-sidebar">
          <h2>Configurações</h2>
          <nav>
            {ITEMS.map(item => (
              <button
                key={item.path}
                className={isActive(item) ? 'active' : ''}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="settings-content">
          {children}
        </div>
      </div>
    </Layout>
  );
}
