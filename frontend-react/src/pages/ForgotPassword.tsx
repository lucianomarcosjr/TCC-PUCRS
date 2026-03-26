import { useState, FormEvent } from 'react';
import './Login.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Digite seu email'); return; }
    setSuccess(true);
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="logo">⚡ OmniFlow</div>
        <h2>Recupere o acesso<br />à sua conta</h2>
        <p>Enviaremos um link seguro para redefinir sua senha</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem' }}>
              🔒
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          {success ? (
            <>
              <div className="login-logo">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✉️</div>
                <h1 className="login-title">Email Enviado!</h1>
                <p className="login-subtitle">Verifique sua caixa de entrada para redefinir sua senha</p>
              </div>
              <a href="/login" style={{ display: 'block', textAlign: 'center', color: '#6366f1', fontWeight: 600 }}>← Voltar ao login</a>
            </>
          ) : (
            <>
              <a href="/login" style={{ color: '#6366f1', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>← Voltar ao login</a>

              <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eef2ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                <h1 className="login-title">Esqueceu sua senha?</h1>
                <p className="login-subtitle">Sem problemas! Digite seu email e enviaremos um link para redefinir.</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="✉️  seu@email.com" required />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="login-button">Enviar link de recuperação</button>
              </form>

              <div className="login-footer">
                Lembrou a senha? <a href="/login">Fazer login</a>
              </div>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>🔒 Seus dados estão seguros conosco</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
