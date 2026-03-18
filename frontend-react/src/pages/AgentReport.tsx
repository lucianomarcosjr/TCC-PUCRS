import { useState } from 'react';
import { Layout } from '@/components/Layout';
import './AgentReport.css';

export function AgentReport() {
  const [selectedAgent, setSelectedAgent] = useState('1');

  const agents = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
  ];

  const mockData = {
    conversationsHandled: 48,
    avgResponseTime: '2m 15s',
    resolutionRate: '92%',
    avgRating: 4.7,
    teamAvg: {
      conversationsHandled: 42,
      avgResponseTime: '3m 30s',
      resolutionRate: '88%',
      avgRating: 4.5,
    },
  };

  return (
    <Layout>
      <div className="agent-report">
        <div className="report-header">
          <h1>Relatório de Atendente</h1>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="agent-select">
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Conversas Atendidas</div>
            <div className="metric-value">{mockData.conversationsHandled}</div>
            <div className="metric-comparison">
              Média da equipe: {mockData.teamAvg.conversationsHandled}
              <span className="positive">+14%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Tempo Médio de Resposta</div>
            <div className="metric-value">{mockData.avgResponseTime}</div>
            <div className="metric-comparison">
              Média da equipe: {mockData.teamAvg.avgResponseTime}
              <span className="positive">-36%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Taxa de Resolução</div>
            <div className="metric-value">{mockData.resolutionRate}</div>
            <div className="metric-comparison">
              Média da equipe: {mockData.teamAvg.resolutionRate}
              <span className="positive">+5%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Avaliação Média</div>
            <div className="metric-value">{mockData.avgRating}/5</div>
            <div className="metric-comparison">
              Média da equipe: {mockData.teamAvg.avgRating}/5
              <span className="positive">+4%</span>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Desempenho Semanal</h3>
          <div className="chart-placeholder">Gráfico de desempenho semanal</div>
        </div>

        <div className="recent-conversations">
          <h3>Conversas Recentes</h3>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Canal</th>
                <th>Status</th>
                <th>Tempo de Resposta</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>João Silva</td>
                <td>WhatsApp</td>
                <td><span className="status-badge resolved">Resolvida</span></td>
                <td>1m 45s</td>
                <td>Hoje</td>
              </tr>
              <tr>
                <td>Maria Santos</td>
                <td>WhatsApp</td>
                <td><span className="status-badge resolved">Resolvida</span></td>
                <td>3m 20s</td>
                <td>Hoje</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
