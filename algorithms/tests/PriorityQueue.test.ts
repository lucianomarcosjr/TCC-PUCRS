import { PriorityQueue, Message, MessagePriority } from '../src/algorithms/queue/PriorityQueue';

describe('PriorityQueue', () => {
  let queue: PriorityQueue;

  beforeEach(() => {
    queue = new PriorityQueue();
  });

  test('deve retornar mensagens por ordem de prioridade', () => {
    const msg1: Message = {
      id: '1',
      content: 'Normal message',
      priority: MessagePriority.NORMAL,
      timestamp: new Date(),
      customerId: 'c1'
    };

    const msg2: Message = {
      id: '2',
      content: 'Urgent message',
      priority: MessagePriority.URGENT,
      timestamp: new Date(),
      customerId: 'c2'
    };

    const msg3: Message = {
      id: '3',
      content: 'Low message',
      priority: MessagePriority.LOW,
      timestamp: new Date(),
      customerId: 'c3'
    };

    queue.enqueue(msg1);
    queue.enqueue(msg2);
    queue.enqueue(msg3);

    expect(queue.dequeue()?.id).toBe('2'); // URGENT
    expect(queue.dequeue()?.id).toBe('1'); // NORMAL
    expect(queue.dequeue()?.id).toBe('3'); // LOW
  });

  test('deve respeitar timestamp quando prioridades são iguais', () => {
    const now = new Date();
    const msg1: Message = {
      id: '1',
      content: 'First',
      priority: MessagePriority.NORMAL,
      timestamp: new Date(now.getTime() + 1000),
      customerId: 'c1'
    };

    const msg2: Message = {
      id: '2',
      content: 'Second',
      priority: MessagePriority.NORMAL,
      timestamp: new Date(now.getTime() + 2000),
      customerId: 'c2'
    };

    queue.enqueue(msg2);
    queue.enqueue(msg1);

    expect(queue.dequeue()?.id).toBe('2');
    expect(queue.dequeue()?.id).toBe('1');
  });

  test('deve retornar null quando fila está vazia', () => {
    expect(queue.dequeue()).toBeNull();
    expect(queue.peek()).toBeNull();
  });

  test('deve retornar tamanho correto', () => {
    expect(queue.size()).toBe(0);
    expect(queue.isEmpty()).toBe(true);

    queue.enqueue({
      id: '1',
      content: 'Test',
      priority: MessagePriority.NORMAL,
      timestamp: new Date(),
      customerId: 'c1'
    });

    expect(queue.size()).toBe(1);
    expect(queue.isEmpty()).toBe(false);
  });

  test('peek não deve remover elemento', () => {
    const msg: Message = {
      id: '1',
      content: 'Test',
      priority: MessagePriority.HIGH,
      timestamp: new Date(),
      customerId: 'c1'
    };

    queue.enqueue(msg);
    expect(queue.peek()?.id).toBe('1');
    expect(queue.size()).toBe(1);
    expect(queue.peek()?.id).toBe('1');
  });
});
