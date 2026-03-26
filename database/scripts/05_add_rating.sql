-- Adicionar avaliação de satisfação nas conversas
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS rating SMALLINT CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS awaiting_rating BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_conversations_rating ON conversations(rating);
