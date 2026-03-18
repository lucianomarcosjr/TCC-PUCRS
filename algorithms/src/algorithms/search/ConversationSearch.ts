/**
 * Algoritmo de busca para histórico de conversas
 * Implementa busca binária e busca por palavras-chave
 */

export interface Conversation {
  id: string;
  customerId: string;
  messages: string[];
  timestamp: Date;
  tags: string[];
}

export class ConversationSearch {
  /**
   * Busca binária em conversas ordenadas por timestamp
   * Complexidade: O(log n)
   */
  static binarySearchByDate(
    conversations: Conversation[],
    targetDate: Date
  ): Conversation | null {
    let left = 0;
    let right = conversations.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midDate = conversations[mid].timestamp.getTime();
      const target = targetDate.getTime();

      if (midDate === target) {
        return conversations[mid];
      }

      if (midDate < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return null;
  }

  /**
   * Busca por palavra-chave nas mensagens
   * Complexidade: O(n * m) onde n = conversas, m = mensagens
   */
  static searchByKeyword(
    conversations: Conversation[],
    keyword: string
  ): Conversation[] {
    const results: Conversation[] = [];
    const lowerKeyword = keyword.toLowerCase();

    for (const conversation of conversations) {
      for (const message of conversation.messages) {
        if (message.toLowerCase().includes(lowerKeyword)) {
          results.push(conversation);
          break;
        }
      }
    }

    return results;
  }

  /**
   * Busca por múltiplas tags
   * Complexidade: O(n * t) onde n = conversas, t = tags
   */
  static searchByTags(
    conversations: Conversation[],
    tags: string[]
  ): Conversation[] {
    return conversations.filter(conversation =>
      tags.every(tag => conversation.tags.includes(tag))
    );
  }

  /**
   * Busca por cliente
   * Complexidade: O(n)
   */
  static searchByCustomer(
    conversations: Conversation[],
    customerId: string
  ): Conversation[] {
    return conversations.filter(c => c.customerId === customerId);
  }

  /**
   * Busca por intervalo de datas
   * Complexidade: O(n)
   */
  static searchByDateRange(
    conversations: Conversation[],
    startDate: Date,
    endDate: Date
  ): Conversation[] {
    const start = startDate.getTime();
    const end = endDate.getTime();

    return conversations.filter(conversation => {
      const timestamp = conversation.timestamp.getTime();
      return timestamp >= start && timestamp <= end;
    });
  }

  /**
   * Algoritmo de ordenação QuickSort para conversas
   * Complexidade: O(n log n) médio, O(n²) pior caso
   */
  static sortByDate(conversations: Conversation[]): Conversation[] {
    if (conversations.length <= 1) return conversations;

    const pivot = conversations[Math.floor(conversations.length / 2)];
    const left = conversations.filter(c => c.timestamp < pivot.timestamp);
    const middle = conversations.filter(c => c.timestamp.getTime() === pivot.timestamp.getTime());
    const right = conversations.filter(c => c.timestamp > pivot.timestamp);

    return [
      ...this.sortByDate(left),
      ...middle,
      ...this.sortByDate(right)
    ];
  }
}
