import { useState } from 'react';
import { Layout } from '@/components/Layout';
import './Help.css';

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: '1', name: 'Primeiros Passos', icon: '🚀', articles: 5 },
    { id: '2', name: 'Conversas', icon: '💬', articles: 8 },
    { id: '3', name: 'Clientes', icon: '👥', articles: 6 },
    { id: '4', name: 'Analytics', icon: '📊', articles: 4 },
    { id: '5', name: 'Integrações', icon: '🔗', articles: 7 },
    { id: '6', name: 'Configurações', icon: '⚙️', articles: 10 },
  ];

  const faqs = [
    { q: 'Como conectar meu WhatsApp?', a: 'Acesse Configurações > Canais > WhatsApp e escaneie o QR Code.' },
    { q: 'Como adicionar usuários à equipe?', a: 'Vá em Configurações > Usuários e clique em "Convidar Usuário".' },
    { q: 'Como exportar relatórios?', a: 'Em Analytics, selecione o período e clique em "Exportar PDF".' },
  ];

  return (
    <Layout>
      <div className="help-page">
        <div className="help-header">
          <h1>Central de Ajuda</h1>
          <p>Como podemos ajudar você hoje?</p>
          <div className="help-search">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="help-categories">
          <h2>Categorias</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.articles} artigos</p>
              </div>
            ))}
          </div>
        </div>

        <div className="help-faq">
          <h2>Perguntas Frequentes</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="help-contact">
          <h2>Ainda precisa de ajuda?</h2>
          <p>Nossa equipe está pronta para ajudar você</p>
          <div className="contact-options">
            <button className="btn-primary">💬 Chat ao Vivo</button>
            <button className="btn-secondary">📧 Enviar Email</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
