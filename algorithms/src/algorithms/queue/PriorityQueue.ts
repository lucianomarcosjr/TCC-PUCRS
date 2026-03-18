/**
 * Fila de Prioridade para gerenciamento de mensagens
 * Complexidade: O(log n) para inserção e remoção
 */

export enum MessagePriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4
}

export interface Message {
  id: string;
  content: string;
  priority: MessagePriority;
  timestamp: Date;
  customerId: string;
}

export class PriorityQueue {
  private heap: Message[];

  constructor() {
    this.heap = [];
  }

  /**
   * Adiciona uma mensagem à fila
   */
  enqueue(message: Message): void {
    this.heap.push(message);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove e retorna a mensagem de maior prioridade
   */
  dequeue(): Message | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);

    return root;
  }

  /**
   * Retorna a mensagem de maior prioridade sem removê-la
   */
  peek(): Message | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Retorna o tamanho da fila
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Verifica se a fila está vazia
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Move um elemento para cima na heap
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this.compare(this.heap[index], this.heap[parentIndex]) <= 0) {
        break;
      }

      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  /**
   * Move um elemento para baixo na heap
   */
  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let largest = index;

      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild], this.heap[largest]) > 0) {
        largest = leftChild;
      }

      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild], this.heap[largest]) > 0) {
        largest = rightChild;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }

  /**
   * Compara duas mensagens por prioridade e timestamp
   */
  private compare(a: Message, b: Message): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.timestamp.getTime() - b.timestamp.getTime();
  }
}
