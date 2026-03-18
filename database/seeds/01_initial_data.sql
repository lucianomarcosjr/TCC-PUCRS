-- Seed Data para OmniFlow
-- Dados iniciais para desenvolvimento e testes

-- Inserir Planos
INSERT INTO plans (id, name, price, max_users, max_messages, features) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Básico', 97.00, 1, 1000, '["whatsapp", "email"]'),
('550e8400-e29b-41d4-a716-446655440002', 'Pro', 297.00, 5, 10000, '["whatsapp", "instagram", "email", "analytics"]'),
('550e8400-e29b-41d4-a716-446655440003', 'Enterprise', 797.00, 999, 999999, '["whatsapp", "instagram", "email", "analytics", "automation", "api"]');

-- Inserir Empresa de Teste
INSERT INTO companies (id, name, cnpj, email, plan_id, status) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Loja Exemplo LTDA', '12345678901234', 'contato@lojaexemplo.com', '550e8400-e29b-41d4-a716-446655440002', 'ACTIVE');

-- Inserir Usuários de Teste
INSERT INTO users (id, company_id, name, email, password_hash, role, is_active) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao@lojaexemplo.com', '$2a$10$7H2aQdhcTbtSqBtP.3BemeDJ05rt/muW9kIjlpo5QjkVIvsTDsr7.', 'OWNER', TRUE),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Maria Santos', 'maria@lojaexemplo.com', '$2a$10$7H2aQdhcTbtSqBtP.3BemeDJ05rt/muW9kIjlpo5QjkVIvsTDsr7.', 'AGENT', TRUE);

-- Inserir Canal WhatsApp
INSERT INTO channels (id, company_id, type, credentials, status) VALUES
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'whatsapp', '{"phone": "+5511999999999", "token": "mock-token"}', 'ACTIVE');

-- Inserir Clientes de Teste
INSERT INTO customers (id, company_id, name, phone, email, tags) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Cliente Teste 1', '+5511988888888', 'cliente1@email.com', ARRAY['VIP', 'Recorrente']),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Cliente Teste 2', '+5511977777777', 'cliente2@email.com', ARRAY['Novo']);

-- Inserir Conversas de Teste
INSERT INTO conversations (id, company_id, customer_id, channel_id, assigned_to, status) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'OPEN'),
('a50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', NULL, 'OPEN');
