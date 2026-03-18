import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else navigate('/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
        <div className="progress-text">Passo {step} de 5</div>

        {step === 1 && (
          <div className="onboarding-content">
            <h1>🎉 Bem-vindo ao OmniFlow!</h1>
            <p>Vamos configurar sua conta em 5 passos simples</p>
            <button onClick={handleNext} className="btn-primary">Começar</button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-content">
            <h2>Sobre sua empresa</h2>
            <div className="form-group">
              <label>Nome da Empresa</label>
              <input type="text" placeholder="Minha Empresa" />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" placeholder="(11) 99999-9999" />
            </div>
            <div className="form-group">
              <label>Segmento</label>
              <select>
                <option>Selecione...</option>
                <option>Varejo</option>
                <option>Serviços</option>
                <option>Alimentação</option>
              </select>
            </div>
            <div className="button-group">
              <button onClick={handleBack} className="btn-secondary">Voltar</button>
              <button onClick={handleNext} className="btn-primary">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-content">
            <h2>Conecte seu WhatsApp</h2>
            <p>Escaneie o QR Code com seu WhatsApp</p>
            <div className="qr-placeholder">
              <div className="qr-code">QR CODE</div>
              <p>Aguardando conexão...</p>
            </div>
            <div className="button-group">
              <button onClick={handleBack} className="btn-secondary">Voltar</button>
              <button onClick={handleNext} className="btn-primary">Próximo</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-content">
            <h2>Adicione sua equipe</h2>
            <p>Convide membros para sua equipe (opcional)</p>
            <div className="team-list">
              <div className="team-item">
                <input type="email" placeholder="email@exemplo.com" />
                <select>
                  <option>AGENT</option>
                  <option>MANAGER</option>
                </select>
                <button className="btn-icon">+</button>
              </div>
            </div>
            <div className="button-group">
              <button onClick={handleBack} className="btn-secondary">Voltar</button>
              <button onClick={handleNext} className="btn-primary">Pular</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="onboarding-content">
            <h1>✅ Tudo pronto!</h1>
            <p>Você já pode começar a atender seus clientes</p>
            <button onClick={handleNext} className="btn-primary">Ir para o Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}
