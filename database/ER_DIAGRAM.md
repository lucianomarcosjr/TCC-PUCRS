# Diagrama Entidade-Relacionamento (ER) - OmniFlow

## Entidades e Relacionamentos

```
┌─────────────────┐
│     PLANS       │
├─────────────────┤
│ PK id           │
│    name         │
│    price        │
│    max_users    │
│    max_messages │
│    features     │
│    created_at   │
│    updated_at   │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   COMPANIES     │
├─────────────────┤
│ PK id           │
│    name         │
│    cnpj         │
│    email        │
│ FK plan_id      │
│    status       │
│    created_at   │
│    updated_at   │
└─────────────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         │ 1:N          │ 1:N          │ 1:N          │ 1:N
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    USERS    │  │  CHANNELS   │  │  CUSTOMERS  │  │CONVERSATIONS│
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ PK id       │  │ PK id       │  │ PK id       │  │ PK id       │
│ FK company  │  │ FK company  │  │ FK company  │  │ FK company  │
│    name     │  │    type     │  │    name     │  │ FK customer │
│    email    │  │    creds    │  │    phone    │  │ FK channel  │
│    password │  │    status   │  │    email    │  │ FK assigned │
│    role     │  │    created  │  │    avatar   │  │    status   │
│    active   │  │    updated  │  │    tags     │  │    created  │
│    created  │  └─────────────┘  │    metadata │  │    updated  │
│    updated  │                   │    created  │  └─────────────┘
└─────────────┘                   │    updated  │         │
                                  └─────────────┘         │
                                                          │
                                  ┌───────────────────────┘
                                  │ N:1
                                  ▼
                          ┌─────────────┐
                          │    USERS    │
                          │ (assigned)  │
                          └─────────────┘
```

## Relacionamentos Detalhados

### 1. PLANS → COMPANIES (1:N)
- Um plano pode ter várias empresas
- Uma empresa tem apenas um plano
- Chave estrangeira: `companies.plan_id`

### 2. COMPANIES → USERS (1:N)
- Uma empresa pode ter vários usuários
- Um usuário pertence a uma empresa
- Chave estrangeira: `users.company_id`
- Cascade delete: Deletar empresa remove usuários

### 3. COMPANIES → CHANNELS (1:N)
- Uma empresa pode ter vários canais
- Um canal pertence a uma empresa
- Chave estrangeira: `channels.company_id`
- Unique constraint: (company_id, type)

### 4. COMPANIES → CUSTOMERS (1:N)
- Uma empresa pode ter vários clientes
- Um cliente pertence a uma empresa
- Chave estrangeira: `customers.company_id`

### 5. COMPANIES → CONVERSATIONS (1:N)
- Uma empresa pode ter várias conversas
- Uma conversa pertence a uma empresa
- Chave estrangeira: `conversations.company_id`

### 6. CUSTOMERS → CONVERSATIONS (1:N)
- Um cliente pode ter várias conversas
- Uma conversa pertence a um cliente
- Chave estrangeira: `conversations.customer_id`

### 7. CHANNELS → CONVERSATIONS (1:N)
- Um canal pode ter várias conversas
- Uma conversa usa um canal
- Chave estrangeira: `conversations.channel_id`

### 8. USERS → CONVERSATIONS (1:N) [Opcional]
- Um usuário pode ter várias conversas atribuídas
- Uma conversa pode ser atribuída a um usuário
- Chave estrangeira: `conversations.assigned_to`
- Nullable: Conversa pode não estar atribuída

## Índices Criados

### Performance
- `idx_companies_cnpj`: Busca rápida por CNPJ
- `idx_users_email`: Login rápido
- `idx_customers_phone`: Busca por telefone
- `idx_conversations_status`: Filtro por status

### Relacionamentos
- `idx_companies_plan_id`: Join com plans
- `idx_users_company_id`: Join com companies
- `idx_conversations_customer_id`: Join com customers
- `idx_conversations_assigned_to`: Join com users

## Constraints

### Primary Keys
- Todas as tabelas usam UUID como PK
- Gerado automaticamente com `uuid_generate_v4()`

### Foreign Keys
- Todas com `ON DELETE CASCADE` ou `ON DELETE SET NULL`
- Garantem integridade referencial

### Check Constraints
- `companies.status`: ACTIVE, SUSPENDED, CANCELLED
- `users.role`: OWNER, MANAGER, AGENT
- `channels.type`: whatsapp, instagram, email
- `conversations.status`: OPEN, CLOSED, ARCHIVED

### Unique Constraints
- `companies.cnpj`: CNPJ único
- `companies.email`: Email único
- `users.email`: Email único
- `channels(company_id, type)`: Um canal de cada tipo por empresa

## Triggers

### updated_at
- Todas as tabelas têm trigger para atualizar `updated_at`
- Executado automaticamente em UPDATE
- Usa função `update_updated_at_column()`

## Tipos de Dados

### UUID
- Identificadores únicos universais
- Melhor para sistemas distribuídos
- Evita colisão de IDs

### JSONB
- `plans.features`: Array de features
- `channels.credentials`: Credenciais do canal
- `customers.metadata`: Dados adicionais
- Permite queries e índices

### ARRAY
- `customers.tags`: Tags do cliente
- Suporte nativo do PostgreSQL

### TIMESTAMP
- `created_at`: Data de criação
- `updated_at`: Data de atualização
- Timezone aware
