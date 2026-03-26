import { useState, useEffect, useCallback } from 'react';
import { SettingsLayout } from '@/components/SettingsLayout';
import { whatsappAPI } from '@/services/api';
import './Integrations.css';

type WaStatus = 'disconnected' | 'qr' | 'connecting' | 'connected';

interface WaState {
  status: WaStatus;
  qrDataUrl: string | null;
  phone: string | null;
  name: string | null;
}

export function Integrations() {
  const [waState, setWaState] = useState<WaState>({ status: 'disconnected', qrDataUrl: null, phone: null, name: null });
  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await whatsappAPI.getStatus();
      setWaState(data);
      return data.status;
    } catch {
      return 'disconnected';
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const status = await fetchStatus();
      if (status === 'connected' || status === 'disconnected') {
        setPolling(false);
        if (status === 'connected') setShowQrModal(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [polling, fetchStatus]);

  const handleConnect = async () => {
    setLoading(true);
    setShowQrModal(true);
    try {
      const { data } = await whatsappAPI.connect();
      setWaState(data);
      if (data.status === 'qr') setPolling(true);
    } catch {
      setShowQrModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await whatsappAPI.disconnect();
      setWaState({ status: 'disconnected', qrDataUrl: null, phone: null, name: null });
      setPolling(false);
    } finally {
      setLoading(false);
    }
  };

  const integrations = [
    { id: '2', name: 'Instagram Direct', icon: '📷', status: 'disconnected', description: 'Receba mensagens do Instagram' },
    { id: '3', name: 'Facebook Messenger', icon: '💬', status: 'disconnected', description: 'Integre com Facebook Messenger' },
    { id: '4', name: 'Email (SMTP)', icon: '📧', status: 'disconnected', description: 'Configure servidor de email' },
    { id: '5', name: 'Zapier', icon: '⚡', status: 'disconnected', description: 'Automatize com 5000+ apps' },
    { id: '6', name: 'Webhooks', icon: '🔗', status: 'disconnected', description: 'Envie eventos para sua API' },
  ];

  return (
    <SettingsLayout>
      <div className="integrations-page">
        <div className="integrations-header">
          <h1>Integrações</h1>
          <p>Conecte o OmniFlow com suas ferramentas favoritas</p>
        </div>

        <div className="integrations-grid">
          {/* WhatsApp Card */}
          <div className={`integration-card ${waState.status === 'connected' ? 'connected' : ''}`}>
            <div className="integration-icon">📱</div>
            <div className="integration-info">
              <h3>WhatsApp</h3>
              <p>Conecte seu WhatsApp via QR Code</p>
              {waState.status === 'connected' && waState.phone && (
                <p className="wa-connected-info">
                  {waState.name && <strong>{waState.name}</strong>}
                  {' '}{waState.phone}
                </p>
              )}
            </div>
            <div className="integration-status">
              {waState.status === 'connected' ? (
                <>
                  <span className="status-badge connected">Conectado</span>
                  <button className="btn-secondary" onClick={handleDisconnect} disabled={loading}>
                    Desconectar
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={handleConnect} disabled={loading}>
                  {loading ? 'Conectando...' : 'Conectar'}
                </button>
              )}
            </div>
          </div>

          {integrations.map((integration) => (
            <div key={integration.id} className={`integration-card ${integration.status}`}>
              <div className="integration-icon">{integration.icon}</div>
              <div className="integration-info">
                <h3>{integration.name}</h3>
                <p>{integration.description}</p>
              </div>
              <div className="integration-status">
                <button className="btn-primary" disabled>Em breve</button>
              </div>
            </div>
          ))}
        </div>

        <div className="integration-docs">
          <h3>📚 Documentação</h3>
          <p>Precisa de ajuda para configurar? <a href="#docs">Consulte nossa documentação</a></p>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="qr-modal-overlay" onClick={() => { setShowQrModal(false); setPolling(false); }}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => { setShowQrModal(false); setPolling(false); }}>✕</button>
            <h2>Conectar WhatsApp</h2>
            <p>Abra o WhatsApp no celular e escaneie o QR Code</p>

            <div className="qr-container">
              {waState.status === 'qr' && waState.qrDataUrl ? (
                <img src={waState.qrDataUrl} alt="QR Code WhatsApp" />
              ) : waState.status === 'connected' ? (
                <div className="qr-success">
                  <span className="qr-success-icon">✅</span>
                  <p>Conectado com sucesso!</p>
                </div>
              ) : (
                <div className="qr-loading">
                  <div className="spinner" />
                  <p>Gerando QR Code...</p>
                </div>
              )}
            </div>

            <div className="qr-instructions">
              <p>1. Abra o WhatsApp no celular</p>
              <p>2. Toque em <strong>Dispositivos conectados</strong></p>
              <p>3. Toque em <strong>Conectar dispositivo</strong></p>
              <p>4. Aponte a câmera para o QR Code</p>
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
