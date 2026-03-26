import { useState, FormEvent } from 'react';
import { SettingsLayout } from '@/components/SettingsLayout';
import './CompanySettings.css';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function CompanySettings() {
  const [companyName, setCompanyName] = useState('Loja Exemplo');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [activeDays, setActiveDays] = useState([0, 1, 2, 3, 4]);
  const [autoMessage, setAutoMessage] = useState('Olá! Como posso ajudar?');
  const [success, setSuccess] = useState(false);

  const toggleDay = (i: number) => {
    setActiveDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i].sort());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <SettingsLayout>
      <div className="company-settings">
        <div className="breadcrumb">Dashboard › Configurações › <span>Empresa</span></div>
        <h1>Configurações da Empresa</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <h3>Dados da Empresa</h3>
            <div className="form-divider" />
            <div className="form-grid-2">
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>CNPJ</label>
                <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, cidade" />
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3>Horário de Atendimento</h3>
            <div className="form-divider" />
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
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Dias de Atendimento</label>
            <div className="days-pills">
              {DAYS.map((day, i) => (
                <button key={i} type="button" className={`day-pill ${activeDays.includes(i) ? 'active' : ''}`} onClick={() => toggleDay(i)}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="form-card">
            <h3>Mensagem Automática</h3>
            <div className="form-divider" />
            <div className="form-group">
              <label>Mensagem de boas-vindas</label>
              <textarea value={autoMessage} onChange={(e) => setAutoMessage(e.target.value)} rows={3} />
            </div>
          </div>

          {success && <div className="success-message">Configurações salvas com sucesso!</div>}
          <button type="submit" className="btn-primary">Salvar Alterações</button>
        </form>
      </div>
    </SettingsLayout>
  );
}
