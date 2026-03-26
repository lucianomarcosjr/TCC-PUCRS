import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { authAPI } from '@/services/api';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="logo">⚡ OmniFlow</div>
        <h2>Centralize seu<br />atendimento</h2>
        <p>Plataforma completa para gestão de comunicação</p>
        <div className="login-benefits">
          <div className="login-benefit">
            <span className="check">✓</span>
            Chat unificado
          </div>
          <div className="login-benefit">
            <span className="check">✓</span>
            Analytics em tempo real
          </div>
          <div className="login-benefit">
            <span className="check">✓</span>
            Gestão de equipe
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-logo">
            <h1 className="login-title">Bem-vindo de volta</h1>
            <p className="login-subtitle">Entre na sua conta para continuar</p>
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

            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="login-extras">
              <label>
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a href="/forgot-password">Esqueceu a senha?</a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'} →
            </button>

            <div className="login-divider">ou continue com</div>

            <button type="button" className="google-btn">
              <strong style={{ color: '#4285F4', fontSize: '1.125rem' }}>G</strong> Google
            </button>
          </form>

          <div className="login-footer">
            Não tem conta? <a href="/register">Criar conta grátis</a>
          </div>
        </div>
      </div>
    </div>
  );
}
