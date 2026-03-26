import './Landing.css';

export function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="nav-content">
          <h1 className="logo">⚡ OmniFlow</h1>
          <div className="nav-links">
            <a href="#features">Funcionalidades</a>
            <a href="#pricing">Preços</a>
            <a href="#testimonials">Depoimentos</a>
            <a href="#contact">Contato</a>
            <a href="/login" className="btn-text-primary">Entrar</a>
            <a href="/register" className="btn-primary">Começar grátis</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Todos os seus canais.<br />Uma só plataforma.</h1>
          <p>Unifique WhatsApp, Instagram, e-mail e chat em um único painel. Atenda mais rápido, venda mais.</p>
          <div className="hero-buttons">
            <a href="/register" className="btn-primary btn-large btn-gradient">Teste grátis por 14 dias</a>
            <a href="#demo" className="btn-secondary btn-large">Ver demo →</a>
          </div>
          <div className="trust-badges">
            <span>✅ Sem cartão de crédito</span>
            <span>✅ 14 dias grátis</span>
            <span>✅ Cancele quando quiser</span>
          </div>
        </div>
        <div className="hero-image">
          <div className="screenshot-placeholder">
            <div className="mock-sidebar" />
            <div className="mock-content">
              <div className="mock-bar" />
              <div className="mock-bar short" />
              <div className="mock-bar" />
            </div>
          </div>
        </div>
      </section>

      <section className="social-proof">
        <p className="section-label">CONFIANÇA DE QUEM USA</p>
        <h3>+ de 500 empresas confiam no OmniFlow</h3>
        <div className="stats-row">
          <span className="stat-item primary">50k+ mensagens/dia</span>
          <span className="stat-divider">|</span>
          <span className="stat-item secondary">98% satisfação</span>
          <span className="stat-divider">|</span>
          <span className="stat-item success">24/7 suporte</span>
        </div>
      </section>

      <section id="features" className="features">
        <p className="section-label">FUNCIONALIDADES</p>
        <h2>Tudo que você precisa para atender melhor</h2>
        <div className="features-grid">
          <div className="feature-card" style={{ borderTop: '4px solid #6366f1' }}>
            <div className="feature-icon" style={{ background: '#eef2ff' }}>📨</div>
            <h3>Inbox Unificado</h3>
            <p>WhatsApp, Instagram, e-mail e chat ao vivo em uma única caixa de entrada inteligente.</p>
          </div>
          <div className="feature-card" style={{ borderTop: '4px solid #8b5cf6' }}>
            <div className="feature-icon" style={{ background: '#f5f3ff' }}>⚡</div>
            <h3>Automações</h3>
            <p>Chatbots, respostas rápidas e fluxos automatizados para agilizar o atendimento.</p>
          </div>
          <div className="feature-card" style={{ borderTop: '4px solid #10b981' }}>
            <div className="feature-icon" style={{ background: '#d1fae5' }}>📊</div>
            <h3>Relatórios</h3>
            <p>Métricas em tempo real, tempo de resposta e satisfação do cliente em dashboards.</p>
          </div>
          <div className="feature-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="feature-icon" style={{ background: '#fef3c7' }}>🔗</div>
            <h3>Integrações</h3>
            <p>Conecte com CRM, ERP e mais de 50 ferramentas via API e webhooks nativos.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <p className="section-label">COMO FUNCIONA</p>
        <h2>Comece em 3 passos simples</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number" style={{ background: '#eef2ff', color: '#6366f1' }}>1</div>
            <h3>Conecte seus canais</h3>
            <p>WhatsApp, Instagram, e-mail em poucos cliques.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>2</div>
            <h3>Receba mensagens</h3>
            <p>Todas as conversas chegam em um inbox unificado.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number" style={{ background: '#d1fae5', color: '#10b981' }}>3</div>
            <h3>Atenda em um só lugar</h3>
            <p>Responda, organize e resolva tudo de forma centralizada.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <p className="section-label">PREÇOS</p>
        <h2>Planos para cada momento</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">R$97<span>/mês por usuário</span></div>
            <ul>
              <li>✅ 3 canais integrados</li>
              <li>✅ 1.000 mensagens/mês</li>
              <li>✅ Relatórios básicos</li>
            </ul>
            <a href="/register" className="btn-secondary">Começar agora</a>
          </div>
          <div className="pricing-card featured">
            <div className="badge">MAIS POPULAR</div>
            <h3>Pro</h3>
            <div className="price">R$197<span>/mês por usuário</span></div>
            <ul>
              <li>✅ Canais ilimitados</li>
              <li>✅ 10.000 mensagens/mês</li>
              <li>✅ Automações + Chatbot</li>
              <li>✅ Relatórios avançados</li>
            </ul>
            <a href="/register" className="btn-primary btn-large">Começar agora</a>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Custom<span style={{ display: 'block' }}>contato para cotação</span></div>
            <ul>
              <li>✅ Tudo do Pro +</li>
              <li>✅ SLA dedicado</li>
              <li>✅ Onboarding personalizado</li>
            </ul>
            <a href="/register" className="btn-secondary">Falar com vendas</a>
          </div>
        </div>
        <div className="guarantee-badge">✅ Garantia de 30 dias ou seu dinheiro de volta</div>
      </section>

      <section id="testimonials" className="testimonials">
        <p className="section-label">DEPOIMENTOS</p>
        <h2>O que nossos clientes dizem</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★ ★ ★ ★ ★</div>
            <p>"O OmniFlow reduziu nosso tempo de resposta em 60%. Nossos clientes nunca estiveram tão satisfeitos."</p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#e0e7ff' }}>AS</div>
              <div>
                <strong>Ana Silva</strong>
                <span>CEO, TechStore</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★ ★ ★ ★ ★</div>
            <p>"A integração com WhatsApp foi game-changer. Atendemos 3x mais clientes com a mesma equipe."</p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#fce7f3' }}>CM</div>
              <div>
                <strong>Carlos Mendes</strong>
                <span>Diretor, ModaFit</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★ ★ ★ ★ ★</div>
            <p>"Melhor investimento que fizemos. O suporte é incrível e a plataforma é super intuitiva de usar."</p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#d1fae5' }}>JC</div>
              <div>
                <strong>Juliana Costa</strong>
                <span>Gerente, SaúdePlus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="cta-section">
        <h2>Pronto para transformar seu atendimento?</h2>
        <p>Comece agora e veja resultados em minutos.</p>
        <div className="cta-form">
          <input type="email" placeholder="Seu melhor e-mail" />
          <a href="/register" className="btn-white">Começar grátis →</a>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>⚡ OmniFlow</h3>
            <p>© 2024 OmniFlow. Todos os direitos reservados.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Produto</h4>
              <a href="#features">Funcionalidades</a>
              <a href="#pricing">Preços</a>
            </div>
            <div>
              <h4>Empresa</h4>
              <a href="#about">Sobre nós</a>
              <a href="#blog">Blog</a>
            </div>
            <div>
              <h4>Suporte</h4>
              <a href="#help">Central de ajuda</a>
              <a href="#contact">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
