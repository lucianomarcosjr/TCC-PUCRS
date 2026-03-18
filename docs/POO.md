# Programação Orientada a Objetos

## 1. Introdução

A Programação Orientada a Objetos (POO) é um paradigma de desenvolvimento que organiza o software em torno de objetos que encapsulam dados e comportamentos, promovendo reutilização, modularidade e manutenibilidade (GAMMA et al., 1994). No projeto OmniFlow, os princípios de POO foram aplicados na modelagem das entidades do domínio e na implementação de padrões de design que suportam a extensibilidade do sistema.

Este documento descreve os princípios de POO aplicados, a hierarquia de classes implementada, os padrões de design utilizados e os relacionamentos entre objetos.

## 2. Princípios de POO Aplicados

### 2.1 Encapsulamento

As classes do domínio utilizam modificadores de acesso para proteger o estado interno dos objetos:

- Atributos declarados como `private` com prefixo `_`
- Acesso controlado via getters e setters
- Validações internas executadas antes de alterações de estado
- Dados sensíveis (como senhas) protegidos contra acesso direto

**Classes que exemplificam:** User, Company, Message, Conversation

### 2.2 Herança

Uma hierarquia de classes foi implementada para representar os diferentes tipos de mensagem suportados pelo sistema:

```
BaseMessage (abstrata)
├── WhatsAppMessage
├── InstagramMessage
└── EmailMessage
```

A classe abstrata `BaseMessage` define a estrutura comum (content, timestamp, sender) e declara métodos abstratos (`getChannel()`, `toJSON()`) que cada subclasse implementa de acordo com as especificidades do canal.

### 2.3 Polimorfismo

O polimorfismo foi aplicado por meio da interface `MessageSender`, que define um contrato comum para envio de mensagens:

```typescript
interface MessageSender {
  send(message: BaseMessage): Promise<boolean>;
}
```

Cada canal de comunicação possui sua implementação específica (WhatsAppSender, InstagramSender, EmailSender), permitindo que o `MessageService` envie mensagens sem conhecer os detalhes de cada canal — um exemplo do padrão Strategy (GAMMA et al., 1994).

### 2.4 Abstração

A classe `BaseMessage` exemplifica o princípio de abstração ao definir um contrato (métodos abstratos) sem fornecer implementação. Isso força cada subclasse a implementar o comportamento específico do seu canal, enquanto a interface pública permanece uniforme.

### 2.5 Composição

Relacionamentos de composição (HAS-A) foram utilizados onde o ciclo de vida dos objetos é dependente:

| Composição | Descrição |
|-----------|-----------|
| Company HAS-A Plan | Empresa possui um plano de assinatura |
| Conversation HAS-A Customer | Conversa está vinculada a um cliente |
| Conversation HAS-MANY Messages | Conversa contém uma coleção de mensagens |

### 2.6 Agregação

Relacionamentos de agregação foram utilizados onde os objetos podem existir independentemente:

| Agregação | Descrição |
|-----------|-----------|
| Company HAS-MANY Users | Empresa referencia usuários por ID |
| Conversation HAS-A assignedTo | Conversa referencia o atendente atribuído |

## 3. Estrutura de Classes do Domínio

### 3.1 User
Representa os usuários do sistema com papéis hierárquicos (OWNER, MANAGER, AGENT). Implementa validações de nome e email, controle de ativação e verificação de permissões baseada em role.

### 3.2 Company
Representa as empresas clientes da plataforma. Utiliza composição com Plan e gerencia a coleção de usuários. Status possíveis: ACTIVE, SUSPENDED, CANCELLED.

### 3.3 BaseMessage e Subclasses
Hierarquia de mensagens com classe abstrata base e especializações por canal. Cada subclasse implementa `getChannel()` retornando o identificador do canal e `toJSON()` com serialização específica.

### 3.4 Conversation
Gerencia o ciclo de vida de uma conversa, incluindo associação com Customer, coleção de Messages e atribuição a um atendente. Status possíveis: OPEN, CLOSED, ARCHIVED.

### 3.5 MessageService
Implementa o padrão Strategy para gerenciar o envio de mensagens por diferentes canais. Permite registro dinâmico de novos senders sem modificação do código existente.

## 4. Padrões de Design Aplicados

### 4.1 Strategy Pattern
**Onde:** MessageService com MessageSender
**Motivação:** Permitir a troca do algoritmo de envio de mensagens em tempo de execução, sem alterar o código cliente. Cada canal (WhatsApp, Instagram, Email) implementa a interface MessageSender com sua lógica específica.

### 4.2 Template Method
**Onde:** BaseMessage
**Motivação:** Definir a estrutura comum de processamento de mensagens na classe base, delegando os detalhes específicos de cada canal para as subclasses.

## 5. Diagrama de Classes

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ - id: UUID      │
│ - name: string  │
│ - email: string │
│ - role: Role    │
├─────────────────┤
│ + activate()    │
│ + hasPermission()│
└─────────────────┘

┌─────────────────┐      ┌──────────┐
│    Company      │◆────→│   Plan   │
├─────────────────┤      └──────────┘
│ - id: UUID      │
│ - name: string  │
│ - plan: Plan    │
├─────────────────┤
│ + addUser()     │
│ + upgradePlan() │
└─────────────────┘

┌──────────────────┐
│  BaseMessage     │ «abstract»
├──────────────────┤
│ # content: string│
│ # timestamp: Date│
├──────────────────┤
│ + getChannel()   │ «abstract»
│ + toJSON()       │ «abstract»
└──────────────────┘
         △
    ┌────┴────┬──────────────┐
    │         │              │
WhatsApp  Instagram      Email
Message    Message       Message
```

## 6. Testes

Os modelos orientados a objetos possuem testes unitários em `tests/Models.test.ts`, cobrindo:

- Validações de atributos (email, nome, role)
- Comportamentos de métodos (activate, hasPermission)
- Relacionamentos entre objetos (composição e agregação)
- Polimorfismo (envio de mensagens por diferentes canais)

## 7. Considerações

A aplicação dos princípios de POO no OmniFlow resultou em um modelo de domínio expressivo e extensível. A hierarquia de mensagens com polimorfismo permite a adição de novos canais de comunicação sem modificação do código existente, enquanto o encapsulamento protege a integridade dos dados das entidades. Os padrões Strategy e Template Method proporcionaram flexibilidade na implementação de comportamentos variáveis entre canais.

## 8. Referências

- GAMMA, E. et al. **Design Patterns: Elements of Reusable Object-Oriented Software**. Addison-Wesley, 1994.
- MARTIN, R. C. **Agile Software Development: Principles, Patterns, and Practices**. Prentice Hall, 2003.
- BLOCH, J. **Effective Java**. 3rd ed. Addison-Wesley, 2018.
- FREEMAN, E. et al. **Head First Design Patterns**. 2nd ed. O'Reilly Media, 2020.
