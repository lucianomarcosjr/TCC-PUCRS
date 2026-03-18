# Banco de Dados NoSQL: Integração com MongoDB

## 1. Introdução

Sistemas modernos frequentemente adotam uma arquitetura de persistência poliglota, combinando bancos de dados relacionais e NoSQL para atender a diferentes requisitos de armazenamento (SADALAGE; FOWLER, 2012). No projeto OmniFlow, o MongoDB foi integrado como complemento ao PostgreSQL, sendo responsável pelo armazenamento de logs de chat e dados de analytics, onde a flexibilidade de schema e a alta performance em operações de escrita são prioritárias.

Este documento descreve a justificativa da arquitetura híbrida, o modelo de dados no MongoDB, os serviços implementados e as estratégias de indexação e performance adotadas.

## 2. Arquitetura Híbrida de Persistência

A decisão de utilizar dois SGBDs distintos baseou-se na análise dos requisitos de cada tipo de dado:

| Requisito | PostgreSQL | MongoDB |
|-----------|-----------|---------|
| Dados estruturados (usuários, empresas, conversas) | ✓ | — |
| Integridade referencial (foreign keys) | ✓ | — |
| Transações ACID | ✓ | — |
| Logs de eventos com schema flexível | — | ✓ |
| Alta taxa de escrita (write-heavy) | — | ✓ |
| Dados semi-estruturados com metadata variável | — | ✓ |
| Escalabilidade horizontal | — | ✓ |

Essa separação segue o princípio de persistência poliglota proposto por Sadalage e Fowler (2012), onde cada tipo de dado é armazenado no SGBD mais adequado às suas características de acesso.

## 3. Modelo de Dados

### 3.1 Collection: ChatLogs

A collection `chat_logs` armazena eventos de interação do sistema:

```typescript
{
  _id: ObjectId,              // Identificador gerado pelo MongoDB
  conversationId: string,     // Referência cruzada ao PostgreSQL
  messageId: string,          // ID da mensagem associada
  event: string,              // Tipo do evento
  userId: string,             // Agente que executou a ação (opcional)
  customerId: string,         // Cliente envolvido (opcional)
  metadata: object,           // Dados flexíveis específicos do evento
  timestamp: Date             // Momento do evento
}
```

### 3.2 Eventos Rastreados

| Evento | Descrição | Metadata típica |
|--------|-----------|----------------|
| message_sent | Mensagem enviada pelo agente | content, type, channel |
| message_received | Mensagem recebida do cliente | content, type, source |
| message_read | Mensagem marcada como lida | readBy, readAt |
| conversation_assigned | Conversa atribuída a agente | assignedTo, assignedBy |
| conversation_closed | Conversa encerrada | closedBy, reason |

O campo `metadata` utiliza a flexibilidade de schema do MongoDB para armazenar dados específicos de cada tipo de evento sem necessidade de migração de schema.

## 4. Serviço de Logs (ChatLogService)

O `ChatLogService` encapsula todas as operações de leitura e escrita na collection de logs:

| Método | Descrição | Complexidade |
|--------|-----------|-------------|
| logEvent(data) | Registra novo evento | O(1) — inserção |
| getConversationLogs(id) | Retorna logs de uma conversa | O(log n) — busca indexada |
| getUserActivity(userId, limit) | Retorna atividade recente do usuário | O(log n) — busca indexada com limit |
| getEventsByType(event, startDate, endDate) | Filtra eventos por tipo e período | O(log n) — busca com índice composto |

## 5. Endpoints de Analytics

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/analytics/conversations/:id/logs | Logs de uma conversa específica |
| GET | /api/analytics/users/:userId/activity | Atividade recente de um usuário |
| GET | /api/analytics/events/:event | Estatísticas de eventos por tipo e período |

Todos os endpoints requerem autenticação via JWT e são protegidos pelo middleware de auditoria.

## 6. Estratégia de Indexação

Os seguintes índices foram criados para otimizar as queries mais frequentes:

| Índice | Campo(s) | Justificativa |
|--------|----------|---------------|
| Simples | conversationId: 1 | Busca de logs por conversa |
| Simples | userId: 1 | Busca de atividade por usuário |
| Simples | customerId: 1 | Busca de interações por cliente |
| Simples | timestamp: -1 | Ordenação temporal descendente |
| Simples | event: 1 | Filtragem por tipo de evento |

A indexação em `timestamp` com ordem descendente (-1) otimiza a query mais comum: buscar os eventos mais recentes.

## 7. Queries de Analytics

Exemplos de aggregation pipelines implementadas para geração de métricas:

### Top 10 usuários mais ativos
```javascript
db.chatlogs.aggregate([
  { $group: { _id: '$userId', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Distribuição de mensagens por hora
```javascript
db.chatlogs.aggregate([
  { $group: { _id: { $hour: '$timestamp' }, count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

Essas aggregations utilizam o framework de agregação do MongoDB, que processa os dados no servidor sem necessidade de transferência para a aplicação.

## 8. Comparação SQL vs NoSQL no Projeto

| Aspecto | PostgreSQL (OmniFlow) | MongoDB (OmniFlow) |
|---------|----------------------|-------------------|
| Dados armazenados | Usuários, empresas, conversas, mensagens | Logs de eventos, analytics |
| Schema | Rígido, normalizado (3FN) | Flexível, orientado a documentos |
| Relacionamentos | Foreign keys com CASCADE | Referências cruzadas por ID |
| Consistência | ACID | Eventual (adequado para logs) |
| Padrão de acesso | Leitura e escrita balanceadas | Write-heavy com leituras analíticas |

## 9. Configuração e Conexão

A conexão com MongoDB é gerenciada pelo Mongoose, com reconexão automática em caso de falha:

```typescript
// config/mongodb.ts
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);
```

No ambiente Docker, a URI de conexão utiliza o nome do serviço como hostname: `mongodb://mongodb:27017/omniflow`.

## 10. Considerações

A integração do MongoDB ao OmniFlow demonstrou a aplicação prática de persistência poliglota em um sistema real. A separação entre dados transacionais (PostgreSQL) e dados analíticos (MongoDB) permitiu otimizar cada camada de persistência para seu padrão de acesso específico. A flexibilidade de schema do MongoDB mostrou-se particularmente adequada para logs de eventos com metadata variável, enquanto o framework de agregação possibilitou a geração de métricas analíticas diretamente no banco de dados.

## 11. Referências

- SADALAGE, P. J.; FOWLER, M. **NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence**. Addison-Wesley, 2012.
- MONGODB. **MongoDB Documentation**. Disponível em: https://docs.mongodb.com. Acesso em: 2024.
- MONGOOSE. **Mongoose Documentation**. Disponível em: https://mongoosejs.com/docs/guide.html. Acesso em: 2024.
- CHODOROW, K. **MongoDB: The Definitive Guide**. 3rd ed. O'Reilly Media, 2019.
