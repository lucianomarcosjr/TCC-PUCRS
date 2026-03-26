import { useState, useEffect, useCallback } from 'react';
import { SettingsLayout } from '@/components/SettingsLayout';
import { whatsappAPI } from '@/services/api';

type WaStatus = 'disconnected' | 'qr' | 'connecting' | 'connected';

export function Channels() {
  const [waStatus, setWaStatus] = useState<WaStatus>('disconnected');
  const [waPhone, setWaPhone] = useState<string | null>(null);
  const [waName, setWaName] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [polling, setPolling] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await whatsappAPI.getStatus();
      setWaStatus(data.status);
      setWaPhone(data.phone);
      setWaName(data.name);
      setQrDataUrl(data.qrDataUrl);
      return data.status;
    } catch { return 'disconnected'; }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const status = await fetchStatus();
      if (status === 'connected' || status === 'disconnected') {
        setPolling(false);
        if (status === 'connected') setShowQr(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [polling, fetchStatus]);

  const handleConnect = async () => {
    setLoading(true);
    setShowQr(true);
    try {
      const { data } = await whatsappAPI.connect();
      setWaStatus(data.status);
      setQrDataUrl(data.qrDataUrl);
      if (data.status === 'qr') setPolling(true);
    } catch { setShowQr(false); }
    finally { setLoading(false); }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await whatsappAPI.disconnect();
      setWaStatus('disconnected');
      setWaPhone(null);
      setWaName(null);
      setPolling(false);
    } finally { setLoading(false); }
  };

  const channels = [
    { name: 'Instagram Direct', icon: '📷', desc: 'Gerencie mensagens do Instagram Direct' },
    { name: 'Facebook Messenger', icon: '💬', desc: 'Integre com o Messenger da sua página' },
    { name: 'Email (SMTP)', icon: '📧', desc: 'Conecte sua caixa de e-mail via SMTP/IMAP' },
  ];

  return (
    <SettingsLayout>
      <div style={{ padding: '0.5rem 0' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Canais</h1>
        <p style={{ color: '#6b7280', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Gerencie os canais de comunicação conectados</p>

        {/* WhatsApp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'white', border: `1px solid ${waStatus === 'connected' ? '#10b981' : '#e5e7eb'}`, borderRadius: 12, marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📱</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>WhatsApp</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Receba e envie mensagens via WhatsApp</div>
            {waStatus === 'connected' && waPhone && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: 2 }}>{waName && <strong>{waName}</strong>} {waPhone}</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            {waStatus === 'connected' ? (
              <>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: 11, fontSize: '0.6875rem', fontWeight: 600, background: '#d1fae5', color: '#059669' }}>Conectado</span>
                <button onClick={handleDisconnect} disabled={loading} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', borderColor: '#fecaca', color: '#ef4444' }}>Desconectar</button>
              </>
            ) : (
              <button onClick={handleConnect} disabled={loading} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>{loading ? 'Conectando...' : 'Conectar'}</button>
            )}
          </div>
        </div>

        {/* Outros canais */}
        {channels.map(ch => (
          <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{ch.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{ch.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{ch.desc}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: 11, fontSize: '0.6875rem', fontWeight: 600, background: '#f3f4f6', color: '#9ca3af' }}>Em breve</span>
            </div>
          </div>
        ))}
      </div>

      {/* QR Modal */}
      {showQr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowQr(false); setPolling(false); }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 420, textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setShowQr(false); setPolling(false); }} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Conectar WhatsApp</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>Escaneie o QR Code com seu WhatsApp</p>
            <div style={{ margin: '1.5rem 0' }}>
              {waStatus === 'qr' && qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" style={{ width: 256, height: 256, borderRadius: 8 }} />
              ) : waStatus === 'connected' ? (
                <div><span style={{ fontSize: '3rem' }}>✅</span><p>Conectado!</p></div>
              ) : (
                <div style={{ padding: '2rem' }}><p style={{ color: '#9ca3af' }}>Gerando QR Code...</p></div>
              )}
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
