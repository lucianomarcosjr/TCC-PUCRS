import './Landing.css';

export function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="nav-content">
          <h1 className="logo">OmniFlow</h1>
          <div className="nav-links">
            <a href="#features">Recursos</a>
            <a href="#pricing">Preços</a>
            <a href="/login" className="btn-secondary">Entrar</a>
            <a href="/register" className="btn-primary">Começar Grátis</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Atendimento Omnichannel Simplificado</h1>
          <p>Centralize WhatsApp, Instagram e Email em uma única plataforma. Ideal para PMEs.</p>
          <div className="hero-buttons">
            <a href="/register" className="btn-primary btn-large">Começar Grátis</a>
            <a href="#demo" className="btn-secondary btn-large">Ver Demo</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="screenshot-placeholder">Dashboard Preview</div>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Recursos Principais</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Chat Unificado</h3>
            <p>Todos os canais em um só lugar</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Métricas e relatórios em tempo real</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Gestão de Equipe</h3>
            <p>Distribua conversas automaticamente</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Segurança</h3>
            <p>Dados protegidos e criptografados</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <h2>Planos e Preços</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">R$ 49<span>/mês</span></div>
            <ul>
              <li>✓ 1 usuário</li>
              <li>✓ WhatsApp</li>
              <li>✓ 100 conversas/mês</li>
            </ul>
            <a href="/register" className="btn-secondary">Começar</a>
          </div>
          <div className="pricing-card featured">
            <div className="badge">Mais Popular</div>
            <h3>Professional</h3>
            <div className="price">R$ 149<span>/mês</span></div>
            <ul>
              <li>✓ 5 usuários</li>
              <li>✓ Todos os canais</li>
              <li>✓ Conversas ilimitadas</li>
              <li>✓ Analytics avançado</li>
            </ul>
            <a href="/register" className="btn-primary">Começar</a>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Personalizado</div>
            <ul>
              <li>✓ Usuários ilimitados</li>
              <li>✓ Todos os recursos</li>
              <li>✓ Suporte prioritário</li>
              <li>✓ API dedicada</li>
            </ul>
            <a href="/register" className="btn-secondary">Contato</a>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>OmniFlow</h3>
            <p>Atendimento omnichannel para PMEs</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Produto</h4>
              <a href="#features">Recursos</a>
              <a href="#pricing">Preços</a>
            </div>
            <div>
              <h4>Empresa</h4>
              <a href="#about">Sobre</a>
              <a href="#contact">Contato</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 OmniFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
