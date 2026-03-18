# OmniFlow — Sistema de Atendimento Omnichannel para PMEs

**Trabalho de Conclusão de Curso** — Pós-Graduação em Desenvolvimento Full Stack | PUCRS

**Autor:** Luciano Marcos Jr

**Orientação:** PUCRS — Pontifícia Universidade Católica do Rio Grande do Sul

---

## 1. Resumo

O OmniFlow é um sistema SaaS (Software as a Service) que centraliza a comunicação de Pequenas e Médias Empresas (PMEs) em um único dashboard inteligente, integrando canais como WhatsApp, Instagram e Email. O projeto foi desenvolvido como Trabalho de Conclusão de Curso da Pós-Graduação em Desenvolvimento Full Stack da PUCRS, abrangendo todas as disciplinas do currículo por meio de uma aplicação completa e funcional.

A solução aborda o problema da comunicação descentralizada em PMEs, onde atendentes precisam alternar entre múltiplos aplicativos, resultando em perda de mensagens, ausência de histórico unificado e dificuldade de gestão do atendimento.

## 2. Objetivos

### 2.1 Objetivo Geral

Desenvolver uma plataforma web de atendimento omnichannel que centralize a comunicação de PMEs, aplicando de forma integrada os conhecimentos adquiridos ao longo da pós-graduação em Desenvolvimento Full Stack.

### 2.2 Objetivos Específicos

- Implementar uma API RESTful com Node.js, Express e TypeScript
- Desenvolver uma interface SPA com React 18, TypeScript e Zustand
- Modelar e implementar banco de dados relacional (PostgreSQL) e NoSQL (MongoDB)
- Integrar com a WhatsApp Cloud API para envio e recebimento de mensagens
- Aplicar princípios de segurança (OWASP Top 10) e conformidade com LGPD
- Containerizar a aplicação com Docker e Docker Compose
- Implementar testes automatizados com cobertura superior a 70%
- Aplicar princípios SOLID e Clean Code

## 3. Tecnologias Utilizadas

| Camada | Tecnologias | Versões |
|--------|------------|---------|
| Frontend | React, TypeScript, Zustand, React Router, Axios, Vite | 18.2.0, 5.2.2, 4.4.7, 6.20.0, 1.6.2, 5.0.8 |
| Backend | Node.js, Express, TypeScript, JWT, Bcrypt, Helmet, Rate Limit | 20 LTS, 4.18.2, 5.3.3, 9.0.2, 2.4.3, 7.1.0, 7.1.5 |
| Banco de Dados | PostgreSQL (pg), MongoDB (Mongoose) | 15 (8.11.3), 7 (8.0.3) |
| DevOps | Docker, Docker Compose | 29.3.0, 5.1.0 |
| Testes | Vitest, Jest | — |

## 4. Arquitetura do Sistema

```
┌──────────────────────────────────────────┐
│    Frontend (React + TypeScript)         │
│    Porta: 3000                           │
└──────────────────┬───────────────────────┘
                   │ HTTP/REST
┌──────────────────▼───────────────────────┐
│    Backend (Node.js + Express)           │
│    Porta: 3333                           │
└──────────┬───────────────┬───────────────┘
           │               │
┌──────────▼──────┐  ┌─────▼───────┐
│   PostgreSQL    │  │   MongoDB   │
│   Porta: 5432   │  │  Porta: 27017│
└─────────────────┘  └─────────────┘
```

### 4.1 Banco de Dados Relacional — PostgreSQL

O modelo relacional contempla 8 tabelas normalizadas até a 3FN, com 15 índices, triggers para atualização automática de timestamps e foreign keys com políticas CASCADE e SET NULL.

| Tabela | Descrição | Relacionamentos |
|--------|-----------|-----------------|
| plans | Planos de assinatura SaaS | 1:N → companies |
| companies | Empresas clientes (PMEs) | 1:N → users, channels, customers, conversations |
| users | Usuários do sistema (OWNER, MANAGER, AGENT) | 1:N → notifications |
| channels | Canais de comunicação conectados | N:1 → companies |
| customers | Clientes finais das empresas | N:1 → companies |
| conversations | Sessões de atendimento | 1:N → messages |
| messages | Mensagens trocadas | N:1 → conversations |
| notifications | Notificações do sistema | N:1 → users |

### 4.2 Banco de Dados NoSQL — MongoDB

Collection `chat_logs` para armazenamento de eventos de interação (message_sent, message_received, conversation_assigned), utilizada para analytics e auditoria.

### 4.3 Segurança

| Mecanismo | Implementação |
|-----------|---------------|
| Autenticação | JWT com expiração de 24h |
| Senhas | Bcrypt com 10 salt rounds |
| Headers HTTP | Helmet.js (XSS, Clickjacking, MIME sniffing) |
| Rate Limiting | 5 login/15min, 100 API/15min |
| CORS | Origem específica configurável |
| SQL Injection | Queries parametrizadas |
| LGPD | Criptografia AES, auditoria de acessos, direitos do titular |
| Sanitização | Remoção de scripts maliciosos em inputs |

## 5. Funcionalidades Implementadas

### 5.1 API REST — 24 Endpoints

| Módulo | Endpoints | Descrição |
|--------|-----------|-----------|
| Autenticação | 4 | Login, registro, recuperação e redefinição de senha |
| Conversas | 5 | CRUD, atribuição e encerramento |
| Mensagens | 2 | Envio via WhatsApp e histórico |
| Clientes | 6 | CRUD, conversas do cliente, notas |
| Notificações | 4 | Listagem, leitura e limpeza |
| Usuários | 3 | Perfil e alteração de senha |
| Analytics | Múltiplos | Logs, métricas e relatórios |

### 5.2 Interface Web — 22 Páginas

| Grupo | Páginas |
|-------|---------|
| Autenticação | Landing, Login, Registro, Recuperação de Senha, Onboarding |
| Dashboard | Dashboard 3 Colunas, Clientes, Perfil do Cliente, Novo Cliente, Editar Cliente |
| Analytics | Dashboard Analytics, Relatório por Atendente, Relatórios |
| Configurações | Notificações, Gerais, Empresa, Config. Notificações, Integrações, Planos |
| Outros | Perfil, Ajuda, Automações |

### 5.3 Design System

| Propriedade | Valor |
|-------------|-------|
| Cor primária | #6366f1 (Indigo) |
| Cor secundária | #8b5cf6 |
| Sucesso / Erro | #10b981 / #ef4444 |
| Background | #fafafa |
| Tipografia | Inter |

## 6. Estrutura do Repositório

```
TCC-PUCRS/
├── algorithms/          # Algoritmos fundamentais (Round Robin, Priority Queue, Search)
├── backend/             # API Node.js + Express + TypeScript
├── frontend-react/      # Frontend React 18 + TypeScript + Vite (22 páginas)
├── database/            # Scripts SQL, seeds e diagrama ER (PostgreSQL)
├── docs/                # Documentação técnica por disciplina
├── design/              # Wireframes e guias de design
├── docker-compose.yml   # Orquestração dos containers
├── Makefile             # Automação de comandos
└── README.md            # Este documento
```

## 7. Testes e Qualidade

| Tipo | Ferramenta | Cobertura |
|------|-----------|-----------|
| Unitários | Vitest + mocks | Repositories, Validators, Errors, Services |
| Integração | Vitest + banco real | Auth flow, Webhooks, ChatLogs, Auditoria |
| End-to-End | Vitest | Fluxos completos de autenticação e API |

Meta de cobertura: > 70% (statements, branches, functions, lines).

```bash
cd backend && npm test && npm run test:coverage
```

## 8. Versionamento

### 8.1 Git Flow

| Branch | Descrição |
|--------|-----------|
| main | Versão estável em produção |
| develop | Integração das funcionalidades |
| feature/* | Desenvolvimento isolado por funcionalidade |

## 9. Guia de Execução

### 9.1 Pré-requisitos

| Software | Versão Mínima | Finalidade |
|----------|--------------|-----------|
| Docker | 20.10+ | Execução dos containers |
| Docker Compose | 2.0+ | Orquestração dos serviços |
| Git | 2.0+ | Clonagem do repositório |

Para verificar as versões instaladas:

```bash
docker --version
docker compose version
git --version
```

### 9.2 Instalação com Docker (Recomendado)

```bash
git clone https://github.com/lucianomarcosjr/TCC-PUCRS.git
cd TCC-PUCRS
make up        # Inicia todos os containers (~30-60s na primeira execução)
make seed      # Popula o banco com dados de teste
```

Verificar funcionamento:

```bash
curl http://localhost:3333/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 9.3 Instalação Local (sem Docker)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 9.4 Acessos ao Sistema

| Serviço | URL/Endereço | Descrição |
|---------|-------------|-----------|
| API Backend | http://localhost:3333 | API REST (Express + TypeScript) |
| Frontend | http://localhost:3000 | Interface web (React + Vite) |
| PostgreSQL | localhost:5432 | Banco de dados relacional |
| MongoDB | localhost:27017 | Banco de dados NoSQL |

**Credenciais do banco:** database `omniflow`, usuário `omniflow`, senha `omniflow123`.

### 9.5 Usuários de Teste

Após a execução do `make seed`:

| Usuário | Email | Senha | Papel |
|---------|-------|-------|-------|
| João (Proprietário) | joao@lojaexemplo.com | senha123 | OWNER |
| Maria (Atendente) | maria@lojaexemplo.com | senha123 | AGENT |

Teste de autenticação:

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@lojaexemplo.com",
    "password": "senha123"
  }'
```

### 9.6 Comandos de Gerenciamento

| Comando | Descrição |
|---------|-----------|
| `make up` | Iniciar todos os containers |
| `make down` | Parar todos os containers |
| `make logs` | Exibir logs em tempo real |
| `make restart` | Reiniciar todos os containers |
| `make clean` | Remover containers e volumes (reset completo) |
| `make seed` | Popular banco com dados iniciais |

### 9.7 Desenvolvimento com Hot Reload

O ambiente Docker está configurado com hot reload: alterações nos arquivos de `backend/src/` e `frontend-react/src/` são detectadas automaticamente e o servidor reinicia sem necessidade de intervenção manual.

### 9.8 Resolução de Problemas

**Container não inicia:**
```bash
docker-compose logs backend    # Verificar logs do backend
docker-compose ps              # Verificar status dos containers
```

**Porta já em uso:**
```bash
sudo lsof -i :3333            # Identificar processo na porta
sudo kill -9 <PID>            # Encerrar processo conflitante
```

**Reset completo do ambiente:**
```bash
make clean    # Remove containers e volumes
make up       # Reinicia do zero
make seed     # Repopula o banco
```

## 10. Documentação Técnica

Cada disciplina do curso possui documentação técnica dedicada:

| Documento | Disciplina |
|-----------|-----------|
| [docs/FUNDAMENTOS.md](docs/FUNDAMENTOS.md) | Fundamentos de Computação e Algoritmos |
| [docs/POO.md](docs/POO.md) | Programação Orientada a Objetos |
| [docs/PROGRAMACAO_WEB.md](docs/PROGRAMACAO_WEB.md) | Programação para Web |
| [docs/ARQUITETURA_CLIENT_SIDE.md](docs/ARQUITETURA_CLIENT_SIDE.md) | Arquitetura Client-Side |
| [docs/BANCO_DADOS_RELACIONAL.md](docs/BANCO_DADOS_RELACIONAL.md) | Banco de Dados Relacional |
| [docs/ARQUITETURA_SERVER_SIDE.md](docs/ARQUITETURA_SERVER_SIDE.md) | Arquitetura Server-Side |
| [docs/WEB_SERVICES.md](docs/WEB_SERVICES.md) | Web Services |
| [docs/CLEAN_CODE_SOLID.md](docs/CLEAN_CODE_SOLID.md) | Técnicas Ágeis de Programação |
| [docs/TESTES.md](docs/TESTES.md) | Qualidade e Teste de Software |
| [docs/MONGODB.md](docs/MONGODB.md) | Bancos de Dados NoSQL |
| [docs/SEGURANCA.md](docs/SEGURANCA.md) | Segurança de Software |
| [docs/DOCKER.md](docs/DOCKER.md) | DevOps Básico |

## 11. Considerações Finais

O desenvolvimento do OmniFlow permitiu a aplicação integrada de todos os conhecimentos adquiridos ao longo da pós-graduação, desde fundamentos de algoritmos e estruturas de dados até práticas de DevOps e segurança. O projeto demonstra a viabilidade técnica de uma plataforma de atendimento omnichannel construída com tecnologias modernas do ecossistema JavaScript/TypeScript, seguindo boas práticas de engenharia de software.

## 12. Referências Gerais

- MARTIN, R. C. **Clean Code: A Handbook of Agile Software Craftsmanship**. Prentice Hall, 2008.
- GAMMA, E. et al. **Design Patterns: Elements of Reusable Object-Oriented Software**. Addison-Wesley, 1994.
- CORMEN, T. H. et al. **Introduction to Algorithms**. 3rd ed. MIT Press, 2009.
- FIELDING, R. T. **Architectural Styles and the Design of Network-based Software Architectures**. UC Irvine, 2000.
- OWASP. **OWASP Top 10 — 2021**. Disponível em: https://owasp.org/www-project-top-ten/.
- BRASIL. **Lei nº 13.709/2018 (LGPD)**. Disponível em: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm.
