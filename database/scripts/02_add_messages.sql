-- Adicionar tabela de mensagens para histórico de conversas

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    whatsapp_message_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_whatsapp_id ON messages(whatsapp_message_id);

-- Adicionar campo last_message_at em conversations
ALTER TABLE conversations ADD COLUMN last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);

-- Adicionar company_id em customers (caso não exista)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'company_id'
    ) THEN
        ALTER TABLE customers ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
        CREATE INDEX idx_customers_company_id_new ON customers(company_id);
    END IF;
END $$;

COMMENT ON TABLE messages IS 'Histórico de mensagens das conversas';
