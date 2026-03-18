import { useState, useEffect, FormEvent } from 'react';
import { Layout } from '@/components/Layout';
import { useAuthStore } from '@/store';
import { userAPI } from '@/services/api';
import './Profile.css';

export function Profile() {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      console.log('Profile data:', response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setPhone(response.data.phone || '');
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile({ name, email, phone });
      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos de senha');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await userAPI.changePassword(currentPassword, newPassword);
      setSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erro ao alterar senha. Verifique a senha atual.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt('Esta ação é IRREVERSÍVEL e removerá todos os seus dados, incluindo clientes, conversas e mensagens. Digite "DELETAR" para confirmar:');
    
    if (confirmation !== 'DELETAR') {
      return;
    }

    try {
      await userAPI.deleteAccount();
      alert('Conta deletada com sucesso');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } catch (error) {
      setError('Erro ao deletar conta');
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: '2rem' }}>Carregando...</div></Layout>;
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>Meu Perfil</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Gerencie suas informações pessoais e configurações de conta</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h3>Foto de Perfil</h3>
            </div>
            <div className="avatar-section">
              <div className="avatar-large">{name ? name[0].toUpperCase() : 'U'}</div>
              <div>
                <p>{name}</p>
                <p>{email}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-card">
            <div className="card-header">
              <h3>Informações Pessoais</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 11 99999-9999" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Salvar Alterações</button>
          </form>

          <div className="profile-card">
            <div className="card-header">
              <h3>Segurança</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Altere sua senha regularmente para manter sua conta segura</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Senha Atual</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Digite sua senha atual" />
              </div>
              <div className="form-group">
                <label>Nova Senha</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="form-group">
                <label>Confirmar Nova Senha</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Digite novamente" />
              </div>
            </div>
            <button type="button" className="btn-secondary" onClick={handleChangePassword}>Alterar Senha</button>
          </div>

          <div className="profile-card danger-zone">
            <div className="card-header">
              <h3>Zona de Perigo</h3>
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>⚠️ Esta ação é irreversível</p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>Ao deletar sua conta:</p>
              <ul style={{ color: '#6b7280', paddingLeft: '1.5rem', lineHeight: '1.75' }}>
                <li>Todos os seus dados pessoais serão removidos permanentemente</li>
                <li>Todos os clientes vinculados à sua conta serão deletados</li>
                <li>Todas as conversas e mensagens serão perdidas</li>
                <li>Esta ação não pode ser desfeita</li>
              </ul>
            </div>
            <button type="button" className="btn-danger" onClick={handleDeleteAccount}>Deletar Conta Permanentemente</button>
          </div>
        </div>

        {success && <div className="success-toast">{success}</div>}
        {error && <div className="error-toast">{error}</div>}
      </div>
    </Layout>
  );
}
