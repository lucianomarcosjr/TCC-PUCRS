# Arquitetura Server-Side

## 1. Introdução

A arquitetura server-side do OmniFlow foi projetada como uma API RESTful seguindo os princípios de separação de responsabilidades e modularidade. O backend é responsável pela lógica de negócio, autenticação, persistência de dados e integração com serviços externos (WhatsApp Cloud API). Este documento descreve as decisões arquiteturais, a organização do código, os endpoints implementados e os mecanismos de segurança adotados.

## 2. Stack Tecnológica

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| Node.js | 20 LTS | Runtime JavaScript assíncrono com alto throughput para I/O |
| Express | 4.18.2 | Framework web minimalista e extensível via middlewares |
| TypeScript | 5.3.3 | Tipagem estática para maior confiabilidade do código |
| PostgreSQL | 15 | SGBD relacional robusto com suporte a JSONB e arrays |
| JWT | 9.0.2 | Autenticação stateless baseada em tokens |
| Bcrypt | 2.4.3 | Hashing de senhas com salt rounds configurável |
| Helmet | 7.1.0 | Proteção de headers HTTP contra vulnerabilidades comuns |

A escolha do Node.js com Express justifica-se pelo modelo de I/O não-bloqueante, adequado para aplicações que lidam com múltiplas conexões simultâneas, como um sistema de atendimento em tempo real (TILKOV; VINOSKI, 2010).

## 3. Estrutura do Projeto

O código segue uma arquitetura em camadas inspirada no padrão MVC, com adição de camadas de repositório e serviço:

```
backend/src/
├── controllers/        # Lógica de negócio e orquestração
│   ├── AuthController.ts
│   ├── ConversationController.ts
│   ├── CustomerController.ts
│   ├── MessageController.ts
│   ├── NotificationController.ts
│   ├── UserController.ts
│   ├── AnalyticsController.ts
│   └── WebhookController.ts
├── repositories/       # Acesso a dados (abstração do banco)
│   └── UserRepository.ts
├── services/           # Integração com serviços externos
│   ├── WhatsAppService.ts
│   └── ChatLogService.ts
├── middlewares/         # Interceptadores de requisição
│   ├── auth.ts, validate.ts, sanitize.ts
│   ├── rateLimiter.ts, audit.ts
│   └── errorHandler.ts
├── validators/         # Schemas de validação (Zod)
│   └── schemas.ts
├── models/             # Modelos de dados (MongoDB)
│   └── ChatLog.ts
├── config/             # Configurações de conexão
│   ├── database.ts     # Pool PostgreSQL
│   └── mongodb.ts      # Conexão Mongoose
├── utils/              # Utilitários e classes de erro
│   ├── errors.ts
│   └── encryption.ts
├── routes/             # Definição de rotas
│   └── index.ts
├── app.ts              # Configuração do Express
└── server.ts           # Inicialização do servidor
```

## 4. Endpoints da API

A API expõe 24 endpoints organizados em 7 módulos:

### 4.1 Autenticação (4 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/login | Autenticação com retorno de token JWT |
| POST | /api/auth/register | Registro de empresa e usuário proprietário |
| POST | /api/auth/forgot-password | Solicitação de recuperação de senha |
| POST | /api/auth/reset-password | Redefinição de senha com token |

### 4.2 Conversas (5 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/conversations | Listar conversas da empresa |
| POST | /api/conversations | Criar nova conversa |
| GET | /api/conversations/:id | Detalhes de uma conversa |
| PATCH | /api/conversations/:id/assign | Atribuir conversa a atendente |
| PATCH | /api/conversations/:id/close | Encerrar conversa |

### 4.3 Mensagens (2 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/messages/send | Enviar mensagem via WhatsApp |
| GET | /api/messages/:conversationId | Histórico de mensagens |

### 4.4 Clientes (6 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | /api/customers | Listar e criar clientes |
| GET/PUT/DELETE | /api/customers/:id | CRUD individual |
| GET | /api/customers/:id/conversations | Conversas do cliente |
| POST | /api/customers/:id/notes | Adicionar nota ao cliente |

### 4.5 Notificações (4 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/notifications | Listar notificações |
| PUT | /api/notifications/:id/read | Marcar como lida |
| PUT | /api/notifications/read-all | Marcar todas como lidas |
| DELETE | /api/notifications | Limpar notificações |

### 4.6 Usuários (3 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/PUT | /api/users/profile | Consultar e atualizar perfil |
| PUT | /api/users/password | Alterar senha |

### 4.7 Analytics (múltiplos endpoints)

Endpoints para consulta de logs de atividade, métricas de conversas e relatórios de atendentes, com dados provenientes do MongoDB.

## 5. Fluxo de Requisição

Cada requisição HTTP percorre a seguinte cadeia de middlewares antes de atingir o controller:

```
Request → CORS → Helmet → JSON Parser → Rate Limiter → Sanitização
        → Auth Middleware → Validação (Zod) → Controller → Repository/Service
        → Response
```

Em caso de erro em qualquer etapa, o middleware centralizado de tratamento de erros (`errorHandler`) intercepta a exceção e retorna uma resposta padronizada com status code e mensagem apropriados.

## 6. Autenticação e Autorização

O sistema utiliza JSON Web Tokens (JWT) para autenticação stateless:

- Token gerado no login contendo: userId, companyId e role
- Expiração configurável (padrão: 24 horas)
- Middleware de autenticação valida o token e injeta os dados do usuário no objeto `req.user`
- Senhas armazenadas com hash Bcrypt (10 salt rounds)

## 7. Padrões Arquiteturais Aplicados

### 7.1 Repository Pattern
A camada de repositório abstrai o acesso ao banco de dados, permitindo que controllers e services não conheçam detalhes de implementação das queries SQL. Isso facilita a testabilidade via mocks e a eventual troca de SGBD.

### 7.2 Middleware Chain
O Express utiliza o padrão Chain of Responsibility para processar requisições, onde cada middleware pode interceptar, transformar ou rejeitar a requisição antes de passá-la adiante.

### 7.3 Error Handling Centralizado
Classes de erro customizadas (AppError, UnauthorizedError, NotFoundError, ValidationError) estendem a classe base Error e são tratadas por um único middleware, garantindo consistência nas respostas de erro.

## 8. Conexão com Banco de Dados

A conexão com PostgreSQL utiliza um pool de conexões (`pg.Pool`) para reutilização eficiente de conexões. Todas as queries utilizam parâmetros posicionais (`$1`, `$2`) para prevenção de SQL Injection.

A conexão com MongoDB é gerenciada pelo Mongoose, com reconexão automática em caso de falha.

## 9. Considerações

A arquitetura em camadas adotada no backend proporcionou separação clara de responsabilidades, facilitando tanto o desenvolvimento quanto a manutenção e testabilidade do código. A combinação de Express com TypeScript ofereceu flexibilidade com segurança de tipos, enquanto o padrão de middlewares permitiu a composição modular de funcionalidades transversais como autenticação, validação e rate limiting.

## 10. Referências

- TILKOV, S.; VINOSKI, S. **Node.js: Using JavaScript to Build High-Performance Network Programs**. IEEE Internet Computing, v. 14, n. 6, 2010.
- FIELDING, R. T. **Architectural Styles and the Design of Network-based Software Architectures**. Tese de Doutorado, University of California, Irvine, 2000.
- EXPRESS. **Express.js Documentation**. Disponível em: https://expressjs.com. Acesso em: 2024.
- JWT. **JSON Web Tokens Introduction**. Disponível em: https://jwt.io/introduction. Acesso em: 2024.
