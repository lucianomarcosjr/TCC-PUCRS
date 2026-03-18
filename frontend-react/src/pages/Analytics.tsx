import { Layout } from '@/components/Layout';
import './Analytics.css';

export function Analytics() {
  return (
    <Layout>
      <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <div className="analytics-actions">
          <select className="period-select">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
          </select>
          <button className="btn-secondary">Exportar PDF</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total de Conversas</div>
          <div className="metric-value">248</div>
          <div className="metric-change positive">+12% vs período anterior</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tempo Médio de Resposta</div>
          <div className="metric-value">2m 34s</div>
          <div className="metric-change negative">+8% vs período anterior</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Taxa de Resolução</div>
          <div className="metric-value">94%</div>
          <div className="metric-change positive">+3% vs período anterior</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Satisfação do Cliente</div>
          <div className="metric-value">4.8/5</div>
          <div className="metric-change positive">+0.2 vs período anterior</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Conversas por Dia</h3>
          <div className="chart-placeholder">Gráfico de linha</div>
        </div>
        <div className="chart-card">
          <h3>Mensagens por Canal</h3>
          <div className="chart-placeholder">Gráfico de barras</div>
        </div>
      </div>

      <div className="top-clients">
        <h3>Top 10 Clientes Mais Ativos</h3>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Conversas</th>
              <th>Mensagens</th>
              <th>Última Interação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João Silva</td>
              <td>12</td>
              <td>48</td>
              <td>Hoje</td>
            </tr>
            <tr>
              <td>Maria Santos</td>
              <td>8</td>
              <td>32</td>
              <td>Ontem</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </Layout>
  );
}
