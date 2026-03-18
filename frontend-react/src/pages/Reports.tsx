import { useState } from 'react';
import { Layout } from '@/components/Layout';
import './Reports.css';

export function Reports() {
  const [reportType, setReportType] = useState('conversations');
  const [period, setPeriod] = useState('7days');

  return (
    <Layout>
      <div className="reports-page">
        <div className="reports-header">
          <h1>Relatórios Avançados</h1>
          <button className="btn-primary">📥 Exportar</button>
        </div>

        <div className="reports-filters">
          <div className="filter-group">
            <label>Tipo de Relatório</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="conversations">Conversas</option>
              <option value="agents">Atendentes</option>
              <option value="clients">Clientes</option>
              <option value="satisfaction">Satisfação</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Período</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="90days">Últimos 90 dias</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Canal</label>
            <select>
              <option>Todos</option>
              <option>WhatsApp</option>
              <option>Instagram</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select>
              <option>Todos</option>
              <option>Abertas</option>
              <option>Fechadas</option>
            </select>
          </div>
        </div>

        <div className="reports-content">
          <div className="report-chart">
            <h3>Conversas por Dia</h3>
            <div className="chart-placeholder">Gráfico de linha</div>
          </div>

          <div className="report-table">
            <h3>Dados Detalhados</h3>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Conversas</th>
                  <th>Mensagens</th>
                  <th>Tempo Médio</th>
                  <th>Taxa Resolução</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15/01/2024</td>
                  <td>48</td>
                  <td>256</td>
                  <td>2m 15s</td>
                  <td>92%</td>
                </tr>
                <tr>
                  <td>14/01/2024</td>
                  <td>52</td>
                  <td>289</td>
                  <td>2m 30s</td>
                  <td>90%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="scheduled-reports">
          <h3>Relatórios Agendados</h3>
          <p>Configure relatórios para serem enviados automaticamente por email</p>
          <button className="btn-secondary">+ Agendar Relatório</button>
        </div>
      </div>
    </Layout>
  );
}
