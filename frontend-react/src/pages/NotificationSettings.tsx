import { useState, FormEvent } from 'react';
import { SettingsLayout } from '@/components/SettingsLayout';
import './NotificationSettings.css';

export function NotificationSettings() {
  const [newMessages, setNewMessages] = useState(true);
  const [assignments, setAssignments] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [sound, setSound] = useState(true);
  const [silentStart, setSilentStart] = useState('22:00');
  const [silentEnd, setSilentEnd] = useState('08:00');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implementar salvamento via API
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <SettingsLayout>
      <div className="notification-settings">
        <h1>Configurações de Notificações</h1>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section">
            <h3>Tipos de Notificação</h3>
            
            <div className="toggle-item">
              <div>
                <div className="toggle-label">Novas Mensagens</div>
                <div className="toggle-description">Receber notificações de novas mensagens</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={newMessages} onChange={(e) => setNewMessages(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-label">Atribuições</div>
                <div className="toggle-description">Quando uma conversa for atribuída a você</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={assignments} onChange={(e) => setAssignments(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-label">Menções</div>
                <div className="toggle-description">Quando você for mencionado em uma conversa</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={mentions} onChange={(e) => setMentions(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-label">Notificações por Email</div>
                <div className="toggle-description">Receber resumo diário por email</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-label">Som de Notificação</div>
                <div className="toggle-description">Reproduzir som ao receber notificações</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Horário de Silêncio</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Início</label>
                <input type="time" value={silentStart} onChange={(e) => setSilentStart(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fim</label>
                <input type="time" value={silentEnd} onChange={(e) => setSilentEnd(e.target.value)} />
              </div>
            </div>
          </div>

          {success && <div className="success-message">Preferências salvas com sucesso!</div>}

          <button type="submit" className="btn-primary">Salvar Preferências</button>
        </form>
      </div>
    </SettingsLayout>
  );
}
