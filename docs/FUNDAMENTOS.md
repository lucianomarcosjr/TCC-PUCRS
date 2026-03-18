# Fundamentos de Computação e Algoritmos

## 1. Introdução

A escolha adequada de algoritmos e estruturas de dados é determinante para a eficiência e escalabilidade de sistemas de software (CORMEN et al., 2009). No projeto OmniFlow, três algoritmos fundamentais foram implementados para resolver problemas específicos do domínio de atendimento ao cliente: distribuição de carga entre atendentes, priorização de mensagens e busca em histórico de conversas.

Este documento descreve os algoritmos implementados, suas complexidades computacionais, as estruturas de dados utilizadas e a aplicação prática de cada um no contexto do sistema.

## 2. Algoritmos Implementados

### 2.1 Round Robin Router

**Localização:** `algorithms/src/algorithms/routing/RoundRobinRouter.ts`

**Problema:** Distribuir mensagens recebidas de forma equitativa entre os atendentes disponíveis, evitando sobrecarga de um único agente.

**Solução:** Implementação do algoritmo Round Robin, que percorre circularmente a lista de atendentes, atribuindo cada nova mensagem ao próximo agente disponível.

**Complexidade:**

| Operação | Complexidade | Justificativa |
|----------|-------------|---------------|
| getNextAgent() | O(n) pior caso | Percorre a lista até encontrar agente disponível |
| addAgent() | O(1) | Inserção no final do array |
| removeAgent() | O(n) | Busca linear pelo ID do agente |
| updateAgentAvailability() | O(n) | Busca linear pelo ID do agente |

**Aplicação no OmniFlow:** Quando uma nova conversa é iniciada por um cliente via WhatsApp, o Round Robin Router seleciona automaticamente o próximo atendente disponível para atribuição.

### 2.2 Priority Queue (Min-Heap)

**Localização:** `algorithms/src/algorithms/queue/PriorityQueue.ts`

**Problema:** Gerenciar mensagens com diferentes níveis de urgência, garantindo que mensagens prioritárias (reclamações, urgências) sejam atendidas antes de mensagens comuns.

**Solução:** Implementação de uma fila de prioridade baseada em Min-Heap binário, onde o elemento de menor valor de prioridade (maior urgência) é sempre acessível em tempo constante.

**Complexidade:**

| Operação | Complexidade | Justificativa |
|----------|-------------|---------------|
| enqueue() | O(log n) | Inserção seguida de heapify-up |
| dequeue() | O(log n) | Remoção da raiz seguida de heapify-down |
| peek() | O(1) | Acesso direto à raiz do heap |

**Aplicação no OmniFlow:** Mensagens classificadas como urgentes (por exemplo, reclamações identificadas por palavras-chave) são enfileiradas com prioridade superior, garantindo atendimento preferencial.

### 2.3 Conversation Search

**Localização:** `algorithms/src/algorithms/search/ConversationSearch.ts`

**Problema:** Permitir busca eficiente no histórico de conversas por data, palavras-chave e tags.

**Solução:** Conjunto de algoritmos de busca e ordenação:

| Algoritmo | Complexidade | Aplicação |
|-----------|-------------|-----------|
| Binary Search by Date | O(log n) | Busca em conversas ordenadas por data |
| Keyword Search | O(n × m) | Busca linear por palavras-chave no conteúdo |
| Tag Search | O(n × t) | Filtragem por tags associadas |
| Sort by Date (QuickSort) | O(n log n) | Ordenação de resultados por data |

Onde n = número de conversas, m = tamanho médio do conteúdo e t = número médio de tags.

**Aplicação no OmniFlow:** Atendentes utilizam a busca para localizar conversas anteriores de um cliente, filtrar por período ou encontrar conversas com temas específicos.

## 3. Estruturas de Dados Utilizadas

| Estrutura | Uso no Projeto | Justificativa |
|-----------|---------------|---------------|
| Array | Lista de agentes no Round Robin, lista de conversas | Acesso indexado O(1), iteração sequencial |
| Binary Heap | Fila de prioridade de mensagens | Acesso ao mínimo em O(1), inserção/remoção em O(log n) |
| Hash Map | Indexação de agentes por ID (implícito em objetos JS) | Busca por chave em O(1) amortizado |

## 4. Análise de Complexidade

Todos os algoritmos foram analisados considerando:

- **Complexidade de tempo:** notação Big-O para melhor, médio e pior caso
- **Complexidade de espaço:** memória adicional requerida além da entrada
- **Trade-offs:** decisões entre tempo e espaço conforme o contexto de uso

A análise de complexidade seguiu a metodologia proposta por Cormen et al. (2009), considerando o modelo RAM (Random Access Machine) como referência.

## 5. Testes

Todos os algoritmos possuem testes unitários implementados com Jest:

- `algorithms/tests/RoundRobinRouter.test.ts` — testes de distribuição circular, adição/remoção de agentes, tratamento de agentes indisponíveis
- `algorithms/tests/PriorityQueue.test.ts` — testes de enqueue/dequeue, ordenação por prioridade, operações em fila vazia

Execução:
```bash
cd algorithms && npm test
```

## 6. Considerações

A implementação de algoritmos fundamentais no OmniFlow demonstrou a aplicação prática de conceitos teóricos de ciência da computação em um sistema real. O Round Robin garantiu distribuição justa de carga, a Priority Queue possibilitou atendimento diferenciado por urgência, e os algoritmos de busca proporcionaram acesso eficiente ao histórico de conversas. A análise de complexidade orientou as escolhas de implementação, priorizando eficiência nas operações mais frequentes do sistema.

## 7. Referências

- CORMEN, T. H. et al. **Introduction to Algorithms**. 3rd ed. MIT Press, 2009.
- SEDGEWICK, R.; WAYNE, K. **Algorithms**. 4th ed. Addison-Wesley, 2011.
- KNUTH, D. E. **The Art of Computer Programming, Volume 3: Sorting and Searching**. 2nd ed. Addison-Wesley, 1998.
- Big O Cheat Sheet. Disponível em: https://www.bigocheatsheet.com. Acesso em: 2024.
