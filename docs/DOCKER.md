# DevOps Básico: Containerização com Docker

## 1. Introdução

A containerização é uma técnica de virtualização em nível de sistema operacional que permite empacotar uma aplicação e suas dependências em unidades isoladas e portáveis denominadas containers (MERKEL, 2014). No projeto OmniFlow, o Docker e o Docker Compose foram adotados para orquestrar o ambiente de desenvolvimento, garantindo reprodutibilidade e eliminando problemas de configuração entre diferentes máquinas.

Este documento descreve a arquitetura de containers, a configuração do Docker Compose, os mecanismos de health check e as estratégias de persistência de dados adotadas.

## 2. Justificativa

A adoção de containers no OmniFlow atendeu aos seguintes requisitos:

- **Reprodutibilidade:** qualquer desenvolvedor pode executar o projeto com um único comando, independente do sistema operacional
- **Isolamento:** cada serviço (backend, PostgreSQL, MongoDB) executa em seu próprio container com dependências isoladas
- **Paridade dev/prod:** o ambiente de desenvolvimento replica a topologia de produção
- **Automação:** scripts Makefile abstraem comandos complexos do Docker

## 3. Arquitetura de Containers

O ambiente é composto por 4 containers orquestrados pelo Docker Compose:

```
┌──────────────────────────────────────────┐
│         Docker Compose Network           │
│                                          │
│  ┌────────────┐    ┌────────────┐       │
│  │ PostgreSQL │    │  MongoDB   │       │
│  │   :5432    │    │   :27017   │       │
│  └─────┬──────┘    └─────┬──────┘       │
│        │                 │               │
│  ┌─────┴─────────────────┴──────┐       │
│  │       Backend API            │       │
│  │         :3333                │       │
│  └──────────────────────────────┘       │
│                                          │
│  ┌──────────────────────────────┐       │
│  │       Frontend React         │       │
│  │         :3000                │       │
│  └──────────────────────────────┘       │
└──────────────────────────────────────────┘
```

### 3.1 Especificação dos Containers

| Container | Imagem | Porta | Função |
|-----------|--------|-------|--------|
| omniflow-postgres | postgres:15-alpine | 5432 | Banco de dados relacional |
| omniflow-mongodb | mongo:7-jammy | 27017 | Banco de dados NoSQL para logs |
| omniflow-backend | Build customizado (Node.js 20) | 3333 | API REST |
| omniflow-frontend | Build customizado (Vite) | 3000 | Interface web |

## 4. Configuração do Docker Compose

O arquivo `docker-compose.yml` define a orquestração dos serviços com as seguintes características:

### 4.1 Dependências entre Serviços

O backend depende da saúde dos bancos de dados antes de iniciar, utilizando a diretiva `depends_on` com `condition: service_healthy`. Isso garante que as conexões com PostgreSQL e MongoDB estejam disponíveis antes da inicialização da API.

### 4.2 Health Checks

Cada serviço de banco de dados possui health checks configurados:

- **PostgreSQL:** executa `pg_isready -U omniflow` a cada 10 segundos, com timeout de 5 segundos e 5 tentativas
- **MongoDB:** executa `mongosh --eval "db.adminCommand('ping')"` com os mesmos parâmetros

### 4.3 Volumes

Dois tipos de volumes foram configurados:

| Tipo | Volume | Finalidade |
|------|--------|-----------|
| Named volume | postgres_data | Persistência dos dados do PostgreSQL entre restarts |
| Named volume | mongodb_data | Persistência dos dados do MongoDB entre restarts |
| Bind mount | ./backend/src:/app/src | Hot reload do código-fonte em desenvolvimento |
| Bind mount | ./frontend-react/src:/app/src | Hot reload do frontend em desenvolvimento |

### 4.4 Variáveis de Ambiente

As variáveis de ambiente são injetadas diretamente no `docker-compose.yml` para o ambiente de desenvolvimento, incluindo: DATABASE_URL, MONGODB_URI, JWT_SECRET, ENCRYPTION_KEY e CORS_ORIGIN.

## 5. Dockerfile do Backend

O Dockerfile do backend utiliza Node.js 20 como imagem base, com as seguintes etapas:

1. Cópia do `package.json` e `package-lock.json`
2. Instalação de dependências com `npm install`
3. Cópia do código-fonte
4. Exposição da porta 3333
5. Comando de inicialização com `npm run dev` (desenvolvimento)

## 6. Automação com Makefile

O Makefile abstrai os comandos do Docker Compose em targets semânticos:

| Comando | Ação |
|---------|------|
| `make up` | Inicia todos os containers em modo detached |
| `make down` | Para todos os containers |
| `make logs` | Exibe logs em tempo real |
| `make restart` | Reinicia todos os containers |
| `make clean` | Remove containers e volumes (reset completo) |
| `make seed` | Executa scripts SQL de seed no PostgreSQL |

## 7. Fluxo de Desenvolvimento

O fluxo de trabalho com Docker no projeto segue os seguintes passos:

1. `make up` — inicia o ambiente completo
2. `make seed` — popula o banco com dados de teste
3. Desenvolvimento com hot reload automático (alterações em `src/` refletem imediatamente)
4. `make logs` — monitoramento de logs quando necessário
5. `make down` — encerramento do ambiente

## 8. Considerações sobre Produção

O ambiente atual é otimizado para desenvolvimento. Para produção, as seguintes melhorias seriam necessárias:

- Multi-stage build para redução do tamanho da imagem
- Gerenciamento de secrets (Docker Secrets ou variáveis de ambiente externas)
- Nginx como reverse proxy
- Build otimizado sem hot reload
- Logs estruturados com driver de logging

## 9. Considerações

A containerização com Docker e Docker Compose simplificou significativamente o setup do ambiente de desenvolvimento, reduzindo o tempo de onboarding de novos desenvolvedores e eliminando inconsistências entre ambientes. A combinação de health checks, volumes persistentes e hot reload proporcionou um fluxo de desenvolvimento produtivo e confiável.

## 10. Referências

- MERKEL, D. **Docker: Lightweight Linux Containers for Consistent Development and Deployment**. Linux Journal, v. 2014, n. 239, 2014.
- DOCKER. **Docker Documentation**. Disponível em: https://docs.docker.com. Acesso em: 2024.
- DOCKER. **Docker Compose Documentation**. Disponível em: https://docs.docker.com/compose. Acesso em: 2024.
- TURNBULL, J. **The Docker Book: Containerization is the New Virtualization**. James Turnbull, 2014.
