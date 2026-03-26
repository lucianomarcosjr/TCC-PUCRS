import { useState } from 'react';
import { SettingsLayout } from '@/components/SettingsLayout';
import './Settings.css';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <SettingsLayout>
      {activeTab === 'profile' && (
        <div className="settings-section">
          <h1>Perfil</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Gerencie suas informações pessoais</p>

          <div className="profile-photo-section">
            <div className="avatar-circle">LC</div>
            <div>
              <p style={{ fontWeight: 600 }}>Luciano Costa</p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>admin@omniflow.com</p>
              <a href="#" style={{ color: '#6366f1', fontSize: '0.8125rem', fontWeight: 500 }}>Alterar foto</a>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" defaultValue="Luciano" />
            </div>
            <div className="form-group">
              <label>Sobrenome</label>
              <input type="text" defaultValue="Costa" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="admin@omniflow.com" disabled style={{ background: '#f9fafb', color: '#9ca3af' }} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" defaultValue="(11) 99999-0000" />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Preferências de Notificação</h3>

          <div className="toggle-card">
            <div>
              <div className="toggle-label">📧 Notificações por email</div>
              <div className="toggle-desc">Receba atualizações sobre novas conversas por email</div>
            </div>
            <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
          </div>

          <div className="toggle-card">
            <div>
              <div className="toggle-label">🔔 Notificações push</div>
              <div className="toggle-desc">Receba alertas em tempo real no navegador</div>
            </div>
            <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
          </div>

          <div className="toggle-card">
            <div>
              <div className="toggle-label">📱 Notificações SMS</div>
              <div className="toggle-desc">Receba alertas urgentes via SMS</div>
            </div>
            <label className="toggle"><input type="checkbox" /><span className="toggle-slider"></span></label>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Segurança</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary">🔑 Alterar senha</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <span style={{ fontSize: '0.8125rem', color: '#374151' }}>🛡 Autenticação em dois fatores</span>
              <label className="toggle"><input type="checkbox" /><span className="toggle-slider"></span></label>
            </div>
          </div>

          <div className="settings-footer-bar">
            <span>⚠️ Alterações não salvas</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary">Descartar</button>
              <button className="btn-primary">Salvar alterações</button>
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
