import { RoundRobinRouter, Agent } from '../src/algorithms/routing/RoundRobinRouter';

describe('RoundRobinRouter', () => {
  let agents: Agent[];
  let router: RoundRobinRouter;

  beforeEach(() => {
    agents = [
      { id: '1', name: 'Agent 1', isAvailable: true, currentLoad: 0 },
      { id: '2', name: 'Agent 2', isAvailable: true, currentLoad: 0 },
      { id: '3', name: 'Agent 3', isAvailable: true, currentLoad: 0 }
    ];
    router = new RoundRobinRouter(agents);
  });

  test('deve retornar agentes em sequência circular', () => {
    const agent1 = router.getNextAgent();
    const agent2 = router.getNextAgent();
    const agent3 = router.getNextAgent();
    const agent4 = router.getNextAgent();

    expect(agent1?.id).toBe('1');
    expect(agent2?.id).toBe('2');
    expect(agent3?.id).toBe('3');
    expect(agent4?.id).toBe('1'); // Volta ao primeiro
  });

  test('deve pular agentes indisponíveis', () => {
    router.updateAgentAvailability('2', false);

    const agent1 = router.getNextAgent();
    const agent2 = router.getNextAgent();
    const agent3 = router.getNextAgent();

    expect(agent1?.id).toBe('1');
    expect(agent2?.id).toBe('3');
    expect(agent3?.id).toBe('1');
  });

  test('deve retornar null quando não há agentes disponíveis', () => {
    router.updateAgentAvailability('1', false);
    router.updateAgentAvailability('2', false);
    router.updateAgentAvailability('3', false);

    const agent = router.getNextAgent();
    expect(agent).toBeNull();
  });

  test('deve adicionar novo agente corretamente', () => {
    const newAgent: Agent = { id: '4', name: 'Agent 4', isAvailable: true, currentLoad: 0 };
    router.addAgent(newAgent);

    const stats = router.getStats();
    expect(stats.total).toBe(4);
    expect(stats.available).toBe(4);
  });

  test('deve remover agente corretamente', () => {
    const removed = router.removeAgent('2');
    expect(removed).toBe(true);

    const stats = router.getStats();
    expect(stats.total).toBe(2);
  });

  test('deve retornar estatísticas corretas', () => {
    router.updateAgentAvailability('2', false);

    const stats = router.getStats();
    expect(stats.total).toBe(3);
    expect(stats.available).toBe(2);
    expect(stats.busy).toBe(1);
  });
});
