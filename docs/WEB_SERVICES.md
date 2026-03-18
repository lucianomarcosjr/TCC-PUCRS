# Web Services: Integração com WhatsApp Cloud API

## 1. Introdução

A integração com serviços externos via APIs RESTful é um requisito fundamental em sistemas modernos que buscam interoperabilidade com plataformas de terceiros (RICHARDSON; RUBY, 2007). No projeto OmniFlow, a integração com a WhatsApp Cloud API (Meta) constitui a funcionalidade central do MVP, permitindo o envio e recebimento de mensagens em tempo real entre o dashboard web e os clientes finais via WhatsApp.

Este documento descreve a arquitetura de integração, os componentes implementados, o fluxo de dados bidirecional e as considerações sobre limitações da API.

## 2. Arquitetura de Integração

A comunicação com a WhatsApp Cloud API segue um modelo bidirecional:

- **Envio (outbound):** a aplicação envia requisições HTTP POST para a API da Meta
- **Recebimento (inbound):** a Meta envia notificações via webhook para o endpoint da aplicação

```
┌──────────────┐     HTTP POST      ┌─────────────────────┐
│   OmniFlow   │ ──────────────────→│ WhatsApp Cloud API  │
│   Backend    │                    │      (Meta)         │
│              │ ←──────────────────│                     │
└──────┬───────┘   Webhook POST     └─────────────────────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │  (persistência de mensagens e conversas)
└──────────────┘
```

## 3. Componentes Implementados

### 3.1 WhatsAppService

Serviço responsável pela comunicação direta com a API da Meta:

| Método | Descrição | Endpoint da Meta |
|--------|-----------|-----------------|
| sendTextMessage(to, message) | Envia mensagem de texto | POST /v17.0/{phone_id}/messages |
| sendImageMessage(to, url, caption) | Envia mensagem com imagem | POST /v17.0/{phone_id}/messages |
| markAsRead(messageId) | Marca mensagem como lida | POST /v17.0/{phone_id}/messages |
| verifyWebhook(mode, token, challenge) | Valida webhook durante configuração | — (validação local) |
| parseWebhookMessage(body) | Extrai dados do payload do webhook | — (parsing local) |

### 3.2 WebhookController

Gerencia o ciclo de vida do webhook:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| /api/webhook | GET | Verificação do webhook pela Meta (handshake inicial) |
| /api/webhook | POST | Recebimento de notificações de mensagens |

### 3.3 MessageController

Gerencia o envio e consulta de mensagens (endpoints protegidos por JWT):

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| /api/messages/send | POST | Envio de mensagem pelo atendente |
| /api/messages/:conversationId | GET | Histórico de mensagens de uma conversa |

## 4. Fluxo de Recebimento de Mensagens

Quando um cliente envia uma mensagem pelo WhatsApp, o seguinte fluxo é executado:

1. A Meta envia um POST para `/api/webhook` com o payload da mensagem
2. O `WebhookController` valida a estrutura do payload
3. O `WhatsAppService.parseWebhookMessage()` extrai os dados relevantes (remetente, conteúdo, tipo)
4. O sistema busca o cliente pelo número de telefone no PostgreSQL; se não existir, cria automaticamente
5. O sistema busca uma conversa aberta com o cliente; se não existir, cria uma nova
6. A mensagem é persistida na tabela `messages` com `sender_type = 'customer'`
7. O sistema chama `markAsRead()` para confirmar o recebimento ao WhatsApp

## 5. Fluxo de Envio de Mensagens

Quando um atendente envia uma mensagem pelo dashboard:

1. O frontend envia um POST para `/api/messages/send` com token JWT
2. O middleware de autenticação valida o token e identifica o atendente
3. O middleware de validação (Zod) verifica o schema da requisição
4. O `MessageController` chama `WhatsAppService.sendTextMessage()` com o número do cliente e o conteúdo
5. A API da Meta processa o envio e retorna o `whatsapp_message_id`
6. A mensagem é persistida na tabela `messages` com `sender_type = 'agent'` e o ID do WhatsApp

## 6. Modelo de Dados

A tabela `messages` armazena todas as mensagens trocadas:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador interno |
| conversation_id | UUID (FK) | Referência à conversa |
| sender_type | VARCHAR | 'customer', 'agent' ou 'system' |
| sender_id | UUID (FK, nullable) | Referência ao usuário (quando agent) |
| content | TEXT | Conteúdo da mensagem |
| media_url | TEXT | URL de mídia anexada (opcional) |
| whatsapp_message_id | VARCHAR | ID da mensagem na API do WhatsApp |
| created_at | TIMESTAMP | Data e hora do envio |

## 7. Configuração

### 7.1 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| WHATSAPP_ACCESS_TOKEN | Token de acesso permanente da Meta |
| WHATSAPP_PHONE_NUMBER_ID | ID do número de telefone configurado |
| WHATSAPP_VERIFY_TOKEN | Token secreto para validação do webhook |

### 7.2 Configuração na Meta for Developers

O processo de configuração envolve:

1. Criação de um app do tipo "Business" no Meta for Developers
2. Adição do produto "WhatsApp" ao app
3. Configuração do número de telefone de teste
4. Geração do token de acesso permanente
5. Configuração da URL do webhook (`https://dominio.com/api/webhook`)
6. Assinatura do evento `messages` para recebimento de notificações

## 8. Limitações da API

| Limitação | Descrição |
|-----------|-----------|
| Conversas gratuitas | 1.000 conversas/mês no tier gratuito |
| Janela de 24 horas | Após 24h sem resposta do cliente, apenas templates aprovados podem ser enviados |
| HTTPS obrigatório | Webhooks requerem endpoint com certificado SSL válido |
| Aprovação de número | O número de telefone precisa ser verificado e aprovado pela Meta |

## 9. Testes

Os testes do módulo de integração cobrem:

- `WhatsAppService.test.ts` (unitário): mock da API da Meta para validar envio, parsing de webhook e verificação de token
- `webhook.test.ts` (integração): simulação de payloads reais do WhatsApp para validar o fluxo completo de recebimento

## 10. Considerações

A integração com a WhatsApp Cloud API demonstrou a aplicação prática de conceitos de Web Services em um cenário real: consumo de API REST externa, implementação de webhooks para comunicação assíncrona e persistência de dados provenientes de serviços de terceiros. O padrão de webhook adotado pela Meta segue o modelo publish-subscribe, onde o OmniFlow atua como subscriber das notificações de mensagens, processando-as de forma assíncrona e idempotente.

## 11. Referências

- RICHARDSON, L.; RUBY, S. **RESTful Web Services**. O'Reilly Media, 2007.
- META. **WhatsApp Cloud API Documentation**. Disponível em: https://developers.facebook.com/docs/whatsapp/cloud-api. Acesso em: 2024.
- META. **Webhook Setup Guide**. Disponível em: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks. Acesso em: 2024.
- FIELDING, R. T. **Architectural Styles and the Design of Network-based Software Architectures**. Tese de Doutorado, University of California, Irvine, 2000.
