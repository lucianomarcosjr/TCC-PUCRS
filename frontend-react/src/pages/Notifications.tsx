import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { notificationsAPI } from '@/services/api';
import './Notifications.css';

export function Notifications() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.list(filter);
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Limpar todas as notificações?')) return;
    try {
      await notificationsAPI.clearAll();
      loadNotifications();
    } catch (error) {
      console.error('Erro ao limpar:', error);
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: '2rem' }}>Carregando...</div></Layout>;
  }

  return (
    <Layout>
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notificações</h1>
          <div className="notifications-actions">
            <button className="btn-secondary" onClick={handleMarkAllAsRead}>Marcar todas como lidas</button>
            <button className="btn-secondary" onClick={handleClearAll}>Limpar todas</button>
          </div>
        </div>

        <div className="notifications-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todas</button>
          <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Não lidas</button>
          <button className={filter === 'mentions' ? 'active' : ''} onClick={() => setFilter('mentions')}>Menções</button>
        </div>

        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              style={{ cursor: !notification.read ? 'pointer' : 'default' }}
            >
              <div className="notification-icon">
                {notification.type === 'message' && '💬'}
                {notification.type === 'assignment' && '👤'}
                {notification.type === 'mention' && '@'}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{new Date(notification.created_at).toLocaleString('pt-BR')}</div>
              </div>
              {!notification.read && <div className="notification-badge"></div>}
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p>Nenhuma notificação</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
