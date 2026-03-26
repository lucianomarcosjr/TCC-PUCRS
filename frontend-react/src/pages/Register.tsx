import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import './Login.css';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', width: 0 };
    if (password.length < 6) return { label: 'Fraca', color: '#ef4444', width: 33 };
    if (password.length < 10) return { label: 'Média', color: '#22c55e', width: 50 };
    return { label: 'Forte', color: '#22c55e', width: 100 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword || !companyName) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register({ name, email, password, companyName, cnpj: cnpj || undefined });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="logo">⚡ OmniFlow</div>
        <h2>Comece grátis<br />em 2 minutos</h2>
        <p>Crie sua conta e comece a transformar seu atendimento</p>
        <div className="login-benefits">
          <div className="login-benefit">
            <span className="check">✓</span>
            Sem cartão de crédito
          </div>
          <div className="login-benefit">
            <span className="check">✓</span>
            14 dias de teste
          </div>
          <div className="login-benefit">
            <span className="check">✓</span>
            Cancele quando quiser
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card" style={{ maxWidth: 456 }}>
          <div className="login-logo">
            <h1 className="login-title">Criar sua conta</h1>
            <p className="login-subtitle">Etapa 1 de 2</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Nome da Empresa</label>
              <input type="text" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Sua empresa" required />
            </div>

            <div className="form-group">
              <label className="form-label">CNPJ <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opcional)</span></label>
              <input type="text" className="form-input" value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
            </div>

            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
              {password && (
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: strength.width >= 33 ? strength.color : '#d1d5db' }} />
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: strength.width >= 66 ? strength.color : '#d1d5db' }} />
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: strength.width >= 100 ? strength.color : '#d1d5db' }} />
                </div>
              )}
              {password && <span style={{ fontSize: '0.6875rem', color: strength.color }}>{strength.label}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151' }}>
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
              Aceito os <a href="#" style={{ color: '#6366f1' }}>termos de uso</a> e <a href="#" style={{ color: '#6366f1' }}>política de privacidade</a>
            </label>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading || !acceptTerms}>
              {loading ? 'Criando conta...' : 'Criar Conta'} →
            </button>
          </form>

          <div className="login-footer">
            Já tem conta? <a href="/login">Entrar</a>
          </div>
        </div>
      </div>
    </div>
  );
}
