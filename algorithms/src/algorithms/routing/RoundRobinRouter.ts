/**
 * Algoritmo Round Robin para distribuição de mensagens entre atendentes
 * Complexidade: O(1) para próximo atendente
 */

export interface Agent {
  id: string;
  name: string;
  isAvailable: boolean;
  currentLoad: number;
}

export class RoundRobinRouter {
  private agents: Agent[];
  private currentIndex: number;

  constructor(agents: Agent[]) {
    this.agents = agents;
    this.currentIndex = 0;
  }

  /**
   * Retorna o próximo atendente disponível usando Round Robin
   */
  getNextAgent(): Agent | null {
    if (this.agents.length === 0) return null;

    const availableAgents = this.agents.filter(agent => agent.isAvailable);
    if (availableAgents.length === 0) return null;

    const startIndex = this.currentIndex;
    
    do {
      const agent = this.agents[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.agents.length;

      if (agent.isAvailable) {
        return agent;
      }
    } while (this.currentIndex !== startIndex);

    return null;
  }

  /**
   * Adiciona um novo atendente ao pool
   */
  addAgent(agent: Agent): void {
    this.agents.push(agent);
  }

  /**
   * Remove um atendente do pool
   */
  removeAgent(agentId: string): boolean {
    const index = this.agents.findIndex(agent => agent.id === agentId);
    if (index === -1) return false;

    this.agents.splice(index, 1);
    if (this.currentIndex >= this.agents.length) {
      this.currentIndex = 0;
    }
    return true;
  }

  /**
   * Atualiza disponibilidade de um atendente
   */
  updateAgentAvailability(agentId: string, isAvailable: boolean): boolean {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return false;

    agent.isAvailable = isAvailable;
    return true;
  }

  /**
   * Retorna estatísticas do pool de atendentes
   */
  getStats(): { total: number; available: number; busy: number } {
    const available = this.agents.filter(a => a.isAvailable).length;
    return {
      total: this.agents.length,
      available,
      busy: this.agents.length - available
    };
  }
}
