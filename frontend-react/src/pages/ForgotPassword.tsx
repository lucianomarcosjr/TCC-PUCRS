import { useState, FormEvent } from 'react';
import './Login.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Digite seu email');
      return;
    }

    // TODO: Implementar envio via API
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="login">
        <div className="login-card">
          <div className="login-logo">
            <h1 className="login-title">✉️</h1>
            <h2 className="login-title">Email Enviado!</h2>
            <p className="login-subtitle">Verifique sua caixa de entrada para redefinir sua senha</p>
          </div>
          <a href="/login" style={{ display: 'block', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>Voltar ao login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-logo">
          <h1 className="login-title">Recuperar Senha</h1>
          <p className="login-subtitle">Digite seu email para receber o link de recuperação</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Enviar Link
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Lembrou a senha? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Voltar ao login</a>
        </p>
      </div>
    </div>
  );
}
