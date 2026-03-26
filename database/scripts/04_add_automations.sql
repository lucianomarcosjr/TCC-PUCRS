-- Tabela de automações
CREATE TABLE IF NOT EXISTS automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('new_conversation', 'new_message', 'keyword', 'off_hours')),
    trigger_value TEXT,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('send_message', 'assign_agent', 'add_tag', 'close_conversation')),
    action_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_automations_company_id ON automations(company_id);
CREATE INDEX IF NOT EXISTS idx_automations_trigger ON automations(trigger_type);

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
