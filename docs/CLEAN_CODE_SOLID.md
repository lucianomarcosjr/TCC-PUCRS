# Técnicas Ágeis de Programação: Clean Code e SOLID

## 1. Introdução

A qualidade interna do código-fonte é um fator determinante para a manutenibilidade, testabilidade e evolução de sistemas de software (MARTIN, 2008). No projeto OmniFlow, foram aplicados os princípios de Clean Code e os princípios SOLID de design orientado a objetos, resultando em refatorações significativas na base de código do backend. Este documento descreve os princípios adotados, as refatorações realizadas e os impactos mensuráveis na qualidade do código.

## 2. Fundamentação Teórica

### 2.1 Clean Code

Segundo Martin (2008), código limpo é aquele que pode ser lido e compreendido por outros desenvolvedores sem esforço excessivo. Os principais atributos de código limpo incluem: funções pequenas com responsabilidade única, nomes descritivos, ausência de duplicação (princípio DRY) e comentários mínimos.

### 2.2 Princípios SOLID

Os princípios SOLID, propostos por Martin (2003), constituem cinco diretrizes para design de software orientado a objetos que promovem baixo acoplamento e alta coesão.

## 3. Aplicação dos Princípios SOLID

### 3.1 Single Responsibility Principle (SRP)

Cada classe do sistema possui uma única razão para mudar:

| Classe | Responsabilidade |
|--------|-----------------|
| UserRepository | Acesso a dados de usuários no PostgreSQL |
| AuthController | Orquestração da lógica de autenticação |
| WhatsAppService | Comunicação com a API externa do WhatsApp |
| ChatLogService | Registro de eventos no MongoDB |

Essa separação permite que alterações na lógica de persistência não afetem a lógica de negócio, e vice-versa.

### 3.2 Open/Closed Principle (OCP)

As classes de erro customizadas exemplificam o OCP: a classe base `AppError` é fechada para modificação, mas aberta para extensão via subclasses:

```
AppError (base)
├── UnauthorizedError (status 401)
├── NotFoundError (status 404)
└── ValidationError (status 422)
```

Novos tipos de erro podem ser adicionados sem modificar o middleware de tratamento de erros existente.

### 3.3 Liskov Substitution Principle (LSP)

Todas as subclasses de `AppError` podem ser utilizadas onde a classe base é esperada. O middleware `errorHandler` trata qualquer instância de `AppError` de forma polimórfica, extraindo o status code e a mensagem sem conhecer a subclasse específica.

### 3.4 Interface Segregation Principle (ISP)

Os repositórios expõem apenas os métodos necessários para seus consumidores. O `UserRepository`, por exemplo, oferece métodos específicos (`findByEmail`, `findById`, `create`) ao invés de uma interface genérica com operações não utilizadas.

### 3.5 Dependency Inversion Principle (DIP)

Os controllers dependem de abstrações (repositórios e serviços) e não de implementações concretas de acesso a dados. Essa inversão facilita a substituição de implementações (por exemplo, trocar PostgreSQL por outro SGBD) e a criação de mocks para testes unitários.

## 4. Refatorações Realizadas

### 4.1 Error Handling Centralizado

**Antes:** Tratamento de erros duplicado em cada controller com `try/catch` e respostas inconsistentes.

**Depois:** Classes de erro customizadas lançadas nos controllers e tratadas por um único middleware centralizado, garantindo respostas padronizadas e eliminando duplicação.

### 4.2 Repository Pattern

**Antes:** Queries SQL diretamente nos controllers, acoplando lógica de negócio à camada de persistência.

**Depois:** Camada de repositório que encapsula todas as queries, expondo métodos semânticos como `findByEmail(email)` ao invés de queries SQL brutas.

### 4.3 Validação Declarativa com Zod

**Antes:** Validações imperativas com condicionais manuais em cada endpoint.

**Depois:** Schemas de validação declarativos com Zod, aplicados via middleware `validate()`, proporcionando validação type-safe e mensagens de erro consistentes.

### 4.4 Linting e Formatação Automatizada

- ESLint para análise estática e detecção de code smells
- Prettier para formatação consistente
- TypeScript em modo strict para eliminação de tipos implícitos `any`

## 5. Estrutura Resultante

A refatoração resultou na seguinte organização de camadas:

```
backend/src/
├── controllers/    → Orquestração (recebe request, chama services/repos, retorna response)
├── repositories/   → Acesso a dados (queries SQL parametrizadas)
├── services/       → Lógica de integração externa (WhatsApp, MongoDB)
├── middlewares/     → Funcionalidades transversais (auth, validação, erros, rate limit)
├── validators/     → Schemas Zod para validação de entrada
├── utils/          → Classes de erro e utilitários
└── config/         → Configurações de conexão
```

## 6. Padrões de Código Adotados

| Padrão | Regra |
|--------|-------|
| Nomenclatura de classes | PascalCase (UserRepository, AuthController) |
| Nomenclatura de funções | camelCase (findByEmail, handleLogin) |
| Nomenclatura de constantes | UPPER_SNAKE_CASE (JWT_SECRET, ENCRYPTION_KEY) |
| Tamanho de funções | Máximo 20 linhas |
| Comentários | Apenas para lógica complexa não-óbvia |
| Tipagem | TypeScript strict, sem uso de `any` |

## 7. Impacto Mensurável

| Métrica | Antes | Depois |
|---------|-------|--------|
| Duplicação de código | Alta | Baixa |
| Acoplamento entre camadas | Alto | Baixo |
| Testabilidade | Baixa | Alta (mocks via DIP) |
| Manutenibilidade | Média | Alta |
| Cobertura de testes | — | > 70% |

## 8. Considerações

A aplicação sistemática de Clean Code e SOLID no backend do OmniFlow resultou em uma base de código mais coesa, desacoplada e testável. As refatorações realizadas não alteraram o comportamento externo do sistema, mas melhoraram significativamente sua qualidade interna, facilitando a adição de novas funcionalidades e a manutenção do código existente.

## 9. Referências

- MARTIN, R. C. **Clean Code: A Handbook of Agile Software Craftsmanship**. Prentice Hall, 2008.
- MARTIN, R. C. **Agile Software Development: Principles, Patterns, and Practices**. Prentice Hall, 2003.
- FOWLER, M. **Refactoring: Improving the Design of Existing Code**. 2nd ed. Addison-Wesley, 2018.
- ZOD. **Zod Documentation**. Disponível em: https://zod.dev. Acesso em: 2024.
