# Segurança de Software e Conformidade com LGPD

## 1. Introdução

A segurança de software é um requisito não-funcional crítico em sistemas que manipulam dados pessoais e comunicações de clientes (OWASP, 2021). O OmniFlow, por lidar com mensagens de atendimento ao cliente e dados de PMEs, implementou múltiplas camadas de segurança alinhadas às recomendações do OWASP Top 10 e aos requisitos da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).

Este documento descreve as medidas de segurança implementadas, os mecanismos de proteção contra vulnerabilidades comuns, a conformidade com a LGPD e as estratégias de auditoria e monitoramento.

## 2. Medidas de Segurança Implementadas

### 2.1 Proteção de Headers HTTP (Helmet.js)

O middleware Helmet.js foi integrado ao Express para configuração automática de headers de segurança:

| Header | Proteção |
|--------|----------|
| X-DNS-Prefetch-Control: off | Previne vazamento de informações via DNS prefetch |
| X-Frame-Options: SAMEORIGIN | Proteção contra clickjacking |
| Strict-Transport-Security | Força uso de HTTPS (HSTS) |
| X-Content-Type-Options: nosniff | Previne MIME type sniffing |
| X-Download-Options: noopen | Previne execução automática de downloads |

### 2.2 Rate Limiting

Proteção contra ataques de força bruta e DDoS por meio de limitação de requisições:

| Escopo | Limite | Janela | Aplicação |
|--------|--------|--------|-----------|
| Autenticação | 5 tentativas | 15 minutos | /api/auth/login, /api/auth/register |
| API geral | 100 requisições | 15 minutos | Todas as rotas /api/* |

Requisições que excedem o limite recebem resposta HTTP 429 (Too Many Requests).

### 2.3 Sanitização de Input

Um middleware de sanitização processa todas as requisições, removendo:
- Tags `<script>` e conteúdo potencialmente malicioso (prevenção de XSS)
- Espaços em branco desnecessários (trim)
- Caracteres especiais em campos sensíveis

A sanitização é aplicada nos objetos `body`, `query` e `params` de cada requisição.

### 2.4 Autenticação com JWT

O sistema utiliza JSON Web Tokens para autenticação stateless:

| Aspecto | Implementação |
|---------|---------------|
| Algoritmo | HS256 (HMAC-SHA256) |
| Expiração | 24 horas (configurável) |
| Payload | userId, companyId, role |
| Armazenamento | LocalStorage no cliente |

### 2.5 Hashing de Senhas

Senhas são armazenadas utilizando Bcrypt com 10 salt rounds, tornando ataques de rainbow table computacionalmente inviáveis. O custo de 10 rounds representa um equilíbrio entre segurança e performance, conforme recomendado por OWASP (2021).

### 2.6 Prevenção de SQL Injection

Todas as queries ao PostgreSQL utilizam parâmetros posicionais (`$1`, `$2`), impedindo a injeção de código SQL malicioso:

```typescript
// Seguro: query parametrizada
pool.query('SELECT * FROM users WHERE id = $1', [id]);
```

### 2.7 Configuração de CORS

O Cross-Origin Resource Sharing é configurado para aceitar requisições apenas da origem específica do frontend, impedindo requisições de domínios não autorizados.

### 2.8 Limite de Payload

O Express está configurado para rejeitar payloads JSON superiores a 10MB, prevenindo ataques de negação de serviço por payloads excessivamente grandes.

## 3. Criptografia de Dados Sensíveis

### 3.1 EncryptionService

Um serviço de criptografia foi implementado para proteção de dados pessoais em repouso:

| Método | Algoritmo | Uso |
|--------|-----------|-----|
| encrypt(text) | AES | Criptografia de dados sensíveis (telefones, endereços) |
| decrypt(encrypted) | AES | Descriptografia para exibição autorizada |
| hashSensitiveData(data) | SHA-256 | Hash irreversível para dados que não precisam ser recuperados |

A chave de criptografia é armazenada em variável de ambiente (`ENCRYPTION_KEY`), separada do código-fonte.

### 3.2 Dados Criptografados vs. Não Criptografados

| Criptografados | Não Criptografados | Justificativa |
|---------------|-------------------|---------------|
| Telefones de clientes | Emails (necessário para login) | Emails são identificadores de acesso |
| Endereços | Nomes (necessário para exibição) | Nomes são dados de exibição frequente |
| Dados bancários | IDs (necessário para relações) | IDs são chaves de referência |

## 4. Conformidade com a LGPD

### 4.1 Princípios Implementados

A LGPD (Lei nº 13.709/2018) estabelece princípios que foram implementados no sistema:

| Princípio | Implementação no OmniFlow |
|-----------|--------------------------|
| Finalidade | Dados coletados exclusivamente para operação do atendimento |
| Adequação | Coleta limitada a: nome, email, telefone, empresa |
| Necessidade | Nenhum dado sensível coletado (raça, religião, saúde) |
| Transparência | Política de privacidade disponível ao usuário |
| Segurança | Criptografia AES, bcrypt, JWT com expiração |
| Prevenção | Rate limiting, auditoria, sanitização |

### 4.2 Direitos do Titular

Os seguintes direitos do titular de dados foram implementados via API:

| Direito | Endpoint | Método |
|---------|----------|--------|
| Acesso aos dados | GET /api/users/me | Consulta dos dados pessoais |
| Correção | PATCH /api/users/me | Atualização de dados pessoais |
| Exclusão | DELETE /api/users/me | Soft delete dos dados |
| Portabilidade | GET /api/users/me/export | Exportação em formato estruturado |
| Revogação de consentimento | DELETE /api/auth/revoke | Revogação do token de acesso |

### 4.3 Auditoria

Um middleware de auditoria registra ações sensíveis no MongoDB:

| Dado Registrado | Descrição |
|----------------|-----------|
| userId | Identificador do usuário que executou a ação |
| action | Tipo da ação (view_logs, export_data, delete_user) |
| IP address | Endereço IP de origem |
| User agent | Navegador/cliente utilizado |
| Timestamp | Data e hora da ação |
| Path e method | Rota e método HTTP da requisição |

## 5. Testes de Segurança

Foram realizados testes manuais para validação das medidas implementadas:

### 5.1 SQL Injection
Tentativas de injeção via campos de login foram bloqueadas pelas queries parametrizadas.

### 5.2 XSS (Cross-Site Scripting)
Tentativas de injeção de tags `<script>` em campos de mensagem foram neutralizadas pelo middleware de sanitização.

### 5.3 Rate Limiting
Sequências de requisições rápidas ao endpoint de login resultaram em bloqueio após 5 tentativas, com resposta HTTP 429.

### 5.4 Testes Unitários
Testes automatizados cobrem: EncryptionService (encrypt/decrypt), sanitização de input, middleware de autenticação e classes de erro.

## 6. Procedimento de Resposta a Incidentes

Em caso de incidente de segurança, o procedimento definido é:

1. **Detecção:** via monitoramento de logs e alertas
2. **Contenção:** bloqueio de acesso comprometido
3. **Investigação:** análise de logs de auditoria
4. **Remediação:** correção da vulnerabilidade
5. **Notificação:** comunicação à ANPD quando aplicável (conforme Art. 48 da LGPD)

## 7. Considerações

A implementação de segurança no OmniFlow adotou uma abordagem de defesa em profundidade, com múltiplas camadas de proteção que se complementam. A conformidade com a LGPD foi tratada como requisito funcional desde o início do projeto, resultando em mecanismos de criptografia, auditoria e direitos do titular integrados à arquitetura do sistema. As medidas implementadas cobrem as principais vulnerabilidades listadas no OWASP Top 10, proporcionando um nível de segurança adequado para uma aplicação SaaS que manipula dados de comunicação empresarial.

## 8. Referências

- OWASP. **OWASP Top 10 — 2021**. Disponível em: https://owasp.org/www-project-top-ten/. Acesso em: 2024.
- BRASIL. **Lei nº 13.709, de 14 de agosto de 2018 (LGPD)**. Disponível em: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Acesso em: 2024.
- ANPD. **Autoridade Nacional de Proteção de Dados**. Disponível em: https://www.gov.br/anpd. Acesso em: 2024.
- HELMET.JS. **Helmet Documentation**. Disponível em: https://helmetjs.github.io. Acesso em: 2024.
- STALLINGS, W. **Cryptography and Network Security: Principles and Practice**. 7th ed. Pearson, 2017.
