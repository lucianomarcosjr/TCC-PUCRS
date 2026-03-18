/**
 * Classe Company - Representa uma empresa no sistema
 * Demonstra: Composição, Agregação
 */

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED'
}

export class Plan {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public maxUsers: number,
    public maxMessages: number,
    public features: string[]
  ) {}
}

export class Company {
  private _id: string;
  private _name: string;
  private _cnpj: string;
  private _email: string;
  private _plan: Plan;
  private _status: CompanyStatus;
  private _userIds: string[];
  private _createdAt: Date;

  constructor(
    id: string,
    name: string,
    cnpj: string,
    email: string,
    plan: Plan
  ) {
    this._id = id;
    this._name = name;
    this._cnpj = this.validateCNPJ(cnpj);
    this._email = email;
    this._plan = plan;
    this._status = CompanyStatus.ACTIVE;
    this._userIds = [];
    this._createdAt = new Date();
  }

  private validateCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }
    return cleaned;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get cnpj(): string {
    return this._cnpj;
  }

  get email(): string {
    return this._email;
  }

  get plan(): Plan {
    return this._plan;
  }

  get status(): CompanyStatus {
    return this._status;
  }

  get userIds(): string[] {
    return [...this._userIds];
  }

  addUser(userId: string): boolean {
    if (this._userIds.length >= this._plan.maxUsers) {
      return false;
    }
    if (!this._userIds.includes(userId)) {
      this._userIds.push(userId);
      return true;
    }
    return false;
  }

  removeUser(userId: string): boolean {
    const index = this._userIds.indexOf(userId);
    if (index > -1) {
      this._userIds.splice(index, 1);
      return true;
    }
    return false;
  }

  upgradePlan(newPlan: Plan): void {
    if (newPlan.price > this._plan.price) {
      this._plan = newPlan;
    }
  }

  suspend(): void {
    this._status = CompanyStatus.SUSPENDED;
  }

  activate(): void {
    this._status = CompanyStatus.ACTIVE;
  }

  cancel(): void {
    this._status = CompanyStatus.CANCELLED;
  }

  canAddUser(): boolean {
    return this._userIds.length < this._plan.maxUsers;
  }

  toJSON(): object {
    return {
      id: this._id,
      name: this._name,
      cnpj: this._cnpj,
      email: this._email,
      plan: this._plan,
      status: this._status,
      userCount: this._userIds.length,
      createdAt: this._createdAt
    };
  }
}
