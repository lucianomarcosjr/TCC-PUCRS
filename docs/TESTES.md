# Qualidade e Teste de Software

## 1. Introdução

A qualidade de software é diretamente influenciada pela estratégia de testes adotada durante o desenvolvimento (MYERS; SANDLER; BADGETT, 2011). No projeto OmniFlow, foi implementada uma estratégia de testes em múltiplos níveis — unitários, de integração e end-to-end — utilizando o framework Vitest como ferramenta principal. Este documento descreve a estratégia de testes, a estrutura implementada, as métricas de cobertura e as boas práticas adotadas.

## 2. Fundamentação Teórica

### 2.1 Pirâmide de Testes

A estratégia de testes segue o modelo da Pirâmide de Testes proposto por Cohn (2009), onde a base é composta por testes unitários (maior quantidade, menor custo), o meio por testes de integração e o topo por testes end-to-end (menor quantidade, maior custo):

```
        /\
       /E2E\        ← Poucos, validam fluxos completos
      /------\
     /Integração\   ← Médios, validam interação entre componentes
    /------------\
   /  Unitários   \ ← Muitos, validam funções isoladas
  /----------------\
```

### 2.2 Framework de Testes

O Vitest foi escolhido como framework de testes por sua compatibilidade nativa com o ecossistema Vite/TypeScript e por oferecer API compatível com Jest, facilitando a migração de conhecimento.

## 3. Estrutura de Testes

```
backend/src/__tests__/
├── unit/                          # Testes unitários
│   ├── UserRepository.test.ts     # Acesso a dados de usuários
│   ├── schemas.test.ts            # Validação de schemas Zod
│   ├── errors.test.ts             # Classes de erro customizadas
│   ├── errorHandler.test.ts       # Middleware de tratamento de erros
│   ├── encryption.test.ts         # Serviço de criptografia
│   ├── sanitize.test.ts           # Middleware de sanitização
│   ├── validate.test.ts           # Middleware de validação
│   ├── auth.test.ts               # Middleware de autenticação
│   └── WhatsAppService.test.ts    # Serviço de integração WhatsApp
├── integration/                   # Testes de integração
│   ├── auth.test.ts               # Fluxo completo de autenticação
│   ├── webhook.test.ts            # Recebimento de webhooks
│   ├── chatlog.test.ts            # Integração com MongoDB
│   ├── analytics.test.ts          # Endpoints de analytics
│   ├── audit.test.ts              # Middleware de auditoria
│   └── resetPassword.test.ts      # Fluxo de recuperação de senha
└── e2e/                           # Testes end-to-end
    ├── auth.e2e.test.ts           # Fluxo de autenticação completo
    └── api.e2e.test.ts            # Fluxo de API completo
```

## 4. Tipos de Testes Implementados

### 4.1 Testes Unitários

Testam funções e classes isoladamente, utilizando mocks para dependências externas.

**Componentes testados:**

| Componente | Cenários de Teste |
|-----------|-------------------|
| UserRepository | findByEmail (existe/não existe), findById, create |
| Schemas Zod | loginSchema (válido/inválido), registerSchema (CNPJ inválido), sendMessageSchema (UUID inválido, conteúdo vazio) |
| Custom Errors | AppError (status code), UnauthorizedError (401), NotFoundError (404), ValidationError (422) |
| EncryptionService | encrypt/decrypt, hashSensitiveData |
| WhatsAppService | sendTextMessage, verifyWebhook, parseWebhookMessage |

**Técnica de mock:** `vi.mock()` do Vitest para substituição de dependências externas (pool de conexão PostgreSQL, APIs externas).

### 4.2 Testes de Integração

Testam a interação entre componentes reais, incluindo acesso ao banco de dados:

| Cenário | Validação |
|---------|-----------|
| Fluxo de autenticação | Registro → hash de senha → persistência no banco |
| Webhook WhatsApp | Recebimento → parsing → criação de cliente e conversa |
| ChatLog MongoDB | Registro de evento → consulta por conversa |
| Auditoria | Ação sensível → registro no log de auditoria |

### 4.3 Testes End-to-End

Testam fluxos completos da API, simulando requisições HTTP reais:

| Fluxo | Etapas |
|-------|--------|
| Autenticação | Register → Login → Acesso a rota protegida |
| API completa | Login → Criar conversa → Enviar mensagem → Consultar histórico |

## 5. Configuração

### 5.1 vitest.config.ts

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### 5.2 Comandos de Execução

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Modo watch para desenvolvimento |
| `npm run test:coverage` | Gera relatório de cobertura |

## 6. Métricas de Cobertura

### 6.1 Metas de Cobertura

| Métrica | Meta | Justificativa |
|---------|------|---------------|
| Statements | > 80% | Cobertura geral do código |
| Branches | > 75% | Cobertura de caminhos condicionais |
| Functions | > 80% | Cobertura de funções declaradas |
| Lines | > 80% | Cobertura de linhas executáveis |

### 6.2 Áreas Críticas (meta: 100%)

As seguintes áreas foram identificadas como críticas e possuem meta de cobertura total:
- Lógica de autenticação (login, registro, validação de token)
- Schemas de validação (Zod)
- Tratamento de erros (classes customizadas e middleware)
- Métodos de repositório (acesso a dados)

## 7. Boas Práticas Adotadas

### 7.1 Padrão AAA (Arrange-Act-Assert)

Todos os testes seguem o padrão AAA para clareza e consistência:

```typescript
it('should return user when email exists', async () => {
  // Arrange — preparação dos dados e mocks
  const mockUser = { id: '123', email: 'test@example.com' };
  vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockUser] });

  // Act — execução da operação testada
  const result = await userRepository.findByEmail('test@example.com');

  // Assert — verificação do resultado
  expect(result).toEqual(mockUser);
});
```

### 7.2 Isolamento

Cada teste é independente dos demais, utilizando `beforeEach` para setup e limpeza de mocks após cada execução.

### 7.3 Nomenclatura Descritiva

Os nomes dos testes descrevem o comportamento esperado no formato "should [comportamento] when [condição]".

### 7.4 Mocks Apropriados

Apenas dependências externas são mockadas (banco de dados, APIs externas). O código sob teste nunca é mockado.

## 8. Resultados

A estratégia de testes implementada resultou em:

- Cobertura geral superior a 70% no backend
- Detecção precoce de regressões durante refatorações
- Documentação executável do comportamento esperado do sistema
- Confiança para realizar mudanças no código sem introduzir bugs

## 9. Considerações

A implementação de testes em múltiplos níveis no OmniFlow seguiu a Pirâmide de Testes, priorizando testes unitários pela sua velocidade e baixo custo de manutenção, complementados por testes de integração para validar interações entre componentes e testes E2E para fluxos críticos. O uso do Vitest com TypeScript proporcionou type-safety nos próprios testes, reduzindo erros na escrita dos cenários de teste.

## 10. Referências

- MYERS, G. J.; SANDLER, C.; BADGETT, T. **The Art of Software Testing**. 3rd ed. Wiley, 2011.
- COHN, M. **Succeeding with Agile: Software Development Using Scrum**. Addison-Wesley, 2009.
- FOWLER, M. **Test Pyramid**. Disponível em: https://martinfowler.com/articles/practical-test-pyramid.html. Acesso em: 2024.
- VITEST. **Vitest Documentation**. Disponível em: https://vitest.dev. Acesso em: 2024.
- GOLDBERGYONI. **JavaScript Testing Best Practices**. Disponível em: https://github.com/goldbergyoni/javascript-testing-best-practices. Acesso em: 2024.
