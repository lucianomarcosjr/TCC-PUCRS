# Banco de Dados Relacional

## 1. Introdução

A modelagem e implementação do banco de dados relacional constituem um dos pilares fundamentais do sistema OmniFlow. O PostgreSQL foi adotado como Sistema Gerenciador de Banco de Dados (SGBD) relacional, responsável pelo armazenamento de dados estruturados como usuários, empresas, conversas, mensagens e clientes. Este documento descreve o modelo conceitual, o modelo lógico, as decisões de normalização, os índices criados e as estratégias de integridade referencial adotadas.

## 2. Justificativa da Escolha do PostgreSQL

O PostgreSQL 15 foi selecionado com base nos seguintes critérios:

| Critério | Justificativa |
|----------|---------------|
| Licença | Open source (PostgreSQL License), sem custos de licenciamento |
| Tipos de dados | Suporte nativo a JSONB, arrays e UUID |
| Extensibilidade | Triggers, stored procedures e funções customizadas |
| Performance | Otimizador de queries robusto com suporte a índices parciais e compostos |
| Ecossistema | Compatibilidade com serviços gerenciados (Supabase, Neon.tech, AWS RDS) |

## 3. Modelo de Dados

### 3.1 Entidades

O modelo contempla 8 tabelas inter-relacionadas:

#### Plans (Planos de Assinatura)
Armazena os planos disponíveis no sistema SaaS.
- Atributos: id (UUID, PK), name, price (DECIMAL), max_users, max_messages, features (JSONB), created_at, updated_at

#### Companies (Empresas)
Representa as PMEs clientes da plataforma.
- Atributos: id (UUID, PK), name, cnpj (UNIQUE), email (UNIQUE), plan_id (FK → plans), status (ENUM), created_at, updated_at

#### Users (Usuários)
Usuários do sistema com papéis hierárquicos.
- Atributos: id (UUID, PK), company_id (FK → companies), name, email (UNIQUE), password_hash, role (ENUM: OWNER, MANAGER, AGENT), is_active, created_at, updated_at

#### Channels (Canais de Comunicação)
Canais conectados por cada empresa.
- Atributos: id (UUID, PK), company_id (FK → companies), type (ENUM: whatsapp, instagram, email), credentials (JSONB), status, created_at, updated_at
- Constraint: UNIQUE(company_id, type) — um canal de cada tipo por empresa

#### Customers (Clientes das Empresas)
Clientes finais que interagem via canais de comunicação.
- Atributos: id (UUID, PK), company_id (FK → companies), name, phone, email, avatar_url, tags (TEXT[]), metadata (JSONB), created_at, updated_at

#### Conversations (Conversas)
Sessões de atendimento entre empresa e cliente.
- Atributos: id (UUID, PK), company_id (FK), customer_id (FK), channel_id (FK), assigned_to (FK → users, NULLABLE), status (ENUM: OPEN, CLOSED, ARCHIVED), created_at, updated_at

#### Messages (Mensagens)
Mensagens trocadas dentro de cada conversa.
- Atributos: id (UUID, PK), conversation_id (FK), sender_type (customer, agent, system), sender_id (FK → users), content (TEXT), media_url, whatsapp_message_id, created_at

#### Notifications (Notificações)
Notificações do sistema para os usuários.
- Atributos: id (UUID, PK), user_id (FK → users), type, title, content, read, created_at

### 3.2 Relacionamentos

| Relacionamento | Cardinalidade | Chave Estrangeira |
|---------------|---------------|-------------------|
| Plans → Companies | 1:N | companies.plan_id |
| Companies → Users | 1:N | users.company_id (CASCADE) |
| Companies → Channels | 1:N | channels.company_id (CASCADE) |
| Companies → Customers | 1:N | customers.company_id (CASCADE) |
| Companies → Conversations | 1:N | conversations.company_id (CASCADE) |
| Customers → Conversations | 1:N | conversations.customer_id (CASCADE) |
| Channels → Conversations | 1:N | conversations.channel_id |
| Users → Conversations | 1:N | conversations.assigned_to (SET NULL) |
| Users → Notifications | 1:N | notifications.user_id |
| Conversations → Messages | 1:N | messages.conversation_id |

## 4. Normalização

O modelo foi normalizado até a Terceira Forma Normal (3FN):

- **1FN:** Todos os atributos são atômicos, sem grupos repetidos
- **2FN:** Todos os atributos não-chave dependem integralmente da chave primária
- **3FN:** Não existem dependências transitivas entre atributos não-chave

### 4.1 Desnormalização Estratégica

Em três casos, optou-se por desnormalização controlada para otimizar performance e flexibilidade:

| Campo | Tipo | Justificativa |
|-------|------|---------------|
| customers.tags | TEXT[] | Evita tabela de junção para tags simples |
| channels.credentials | JSONB | Credenciais variam por tipo de canal |
| customers.metadata | JSONB | Dados adicionais sem necessidade de alterar o schema |

Essa abordagem segue a recomendação de Karwin (2010) para casos onde a flexibilidade do schema supera os benefícios da normalização estrita.

## 5. Índices

### 5.1 Índices de Performance

```sql
CREATE INDEX idx_companies_cnpj ON companies(cnpj);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_conversations_status ON conversations(status);
```

### 5.2 Índices de Relacionamento

```sql
CREATE INDEX idx_companies_plan_id ON companies(plan_id);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_assigned_to ON conversations(assigned_to);
```

No total, 15 índices foram criados para otimizar as queries mais frequentes do sistema.

## 6. Triggers

Um trigger genérico foi implementado para atualização automática do campo `updated_at` em todas as tabelas:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

Esse trigger é aplicado em todas as tabelas via `CREATE TRIGGER ... BEFORE UPDATE`, garantindo consistência temporal sem intervenção da aplicação.

## 7. Integridade Referencial

As foreign keys foram configuradas com políticas de deleção apropriadas:

- **CASCADE:** Deleção de empresa remove automaticamente seus usuários, canais, clientes e conversas
- **SET NULL:** Deleção de um atendente define `assigned_to` como NULL nas conversas atribuídas, preservando o histórico

## 8. Tipos de Dados

| Tipo | Uso | Justificativa |
|------|-----|---------------|
| UUID | Chaves primárias | Unicidade global, adequado para sistemas distribuídos |
| TIMESTAMP WITH TIME ZONE | Datas | Consistência temporal independente de fuso horário |
| JSONB | Dados flexíveis | Permite queries e indexação sobre dados semi-estruturados |
| TEXT[] | Arrays | Suporte nativo do PostgreSQL para listas simples |
| DECIMAL | Valores monetários | Precisão exata para cálculos financeiros |

## 9. Considerações

A modelagem relacional do OmniFlow demonstrou a aplicação prática de conceitos fundamentais de banco de dados: normalização, integridade referencial, indexação e uso estratégico de tipos de dados avançados do PostgreSQL. A combinação de um modelo normalizado com desnormalizações pontuais em JSONB proporcionou o equilíbrio entre consistência dos dados e flexibilidade do schema.

## 10. Referências

- DATE, C. J. **An Introduction to Database Systems**. 8th ed. Addison-Wesley, 2003.
- KARWIN, B. **SQL Antipatterns: Avoiding the Pitfalls of Database Programming**. Pragmatic Bookshelf, 2010.
- POSTGRESQL. **PostgreSQL 15 Documentation**. Disponível em: https://www.postgresql.org/docs/15/. Acesso em: 2024.
- ELMASRI, R.; NAVATHE, S. B. **Fundamentals of Database Systems**. 7th ed. Pearson, 2015.
