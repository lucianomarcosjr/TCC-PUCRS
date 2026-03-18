import { useState, FormEvent } from 'react';
import { Layout } from '@/components/Layout';
import './CompanySettings.css';

export function CompanySettings() {
  const [companyName, setCompanyName] = useState('Loja Exemplo');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [phone, setPhone] = useState('+55 11 99999-9999');
  const [address, setAddress] = useState('Rua Exemplo, 123');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [autoMessage, setAutoMessage] = useState('Olá! Como posso ajudar?');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implementar salvamento via API
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Layout>
      <div className="company-settings">
        <h1>Configurações da Empresa</h1>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section">
            <h3>Dados da Empresa</h3>
            <div className="form-group">
              <label>Nome da Empresa</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>CNPJ</label>
              <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Endereço</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          <div className="form-section">
            <h3>Horário de Atendimento</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Início</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fim</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Mensagem Automática</h3>
            <div className="form-group">
              <label>Mensagem de Boas-vindas</label>
              <textarea value={autoMessage} onChange={(e) => setAutoMessage(e.target.value)} rows={3} />
            </div>
          </div>

          {success && <div className="success-message">Configurações salvas com sucesso!</div>}

          <button type="submit" className="btn-primary">Salvar Alterações</button>
        </form>
      </div>
    </Layout>
  );
}
