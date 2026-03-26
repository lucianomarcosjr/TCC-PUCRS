import { SettingsLayout } from '@/components/SettingsLayout';

export function Users() {
  return (
    <SettingsLayout>
      <div style={{ padding: '0.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Usuários</h1>
            <p style={{ color: '#6b7280', fontSize: '0.8125rem' }}>Gerencie os membros da sua equipe</p>
          </div>
          <button className="btn-primary">+ Convidar Usuário</button>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', padding: '0.75rem 1rem' }}>Nome</th>
                <th style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', padding: '0.75rem 1rem' }}>Função</th>
                <th style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', padding: '0.75rem 1rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6875rem', fontWeight: 700 }}>JS</div>
                    <strong>João Silva</strong>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>joao@lojaexemplo.com</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ padding: '0.125rem 0.5rem', borderRadius: 11, fontSize: '0.6875rem', fontWeight: 600, background: '#eef2ff', color: '#6366f1' }}>OWNER</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ padding: '0.125rem 0.5rem', borderRadius: 11, fontSize: '0.6875rem', fontWeight: 600, background: '#d1fae5', color: '#059669' }}>Ativo</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', borderTop: '1px solid #f3f4f6' }}>
                  <button style={{ padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', background: 'white', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', color: '#6b7280' }}>Editar</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6875rem', fontWeight: 700 }}>MS</div>
                    <strong>Maria Santos</strong>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>maria@lojaexemplo.com</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ padding: '0.125rem 0.5rem', borderRadius: 11, fontSize: '0.6875rem', fontWeight: 600, background: '#d1fae5', color: '#059669' }}>AGENT</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ padding: '0.125rem 0.5rem', borderRadius: 11, fontSize: '0.6875rem', fontWeight: 600, background: '#d1fae5', color: '#059669' }}>Ativo</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', borderTop: '1px solid #f3f4f6' }}>
                  <button style={{ padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', background: 'white', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', color: '#6b7280' }}>Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SettingsLayout>
  );
}
