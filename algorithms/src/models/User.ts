/**
 * Classe User - Representa um usuário do sistema
 * Demonstra: Encapsulamento, Validação, Getters/Setters
 */

export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT'
}

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _passwordHash: string;
  private _role: UserRole;
  private _companyId: string;
  private _isActive: boolean;
  private _createdAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    companyId: string
  ) {
    this._id = id;
    this._name = this.validateName(name);
    this._email = this.validateEmail(email);
    this._passwordHash = passwordHash;
    this._role = role;
    this._companyId = companyId;
    this._isActive = true;
    this._createdAt = new Date();
  }

  private validateName(name: string): string {
    if (!name || name.trim().length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }
    return name.trim();
  }

  private validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
    return email.toLowerCase();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = this.validateName(value);
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  set role(value: UserRole) {
    this._role = value;
  }

  get companyId(): string {
    return this._companyId;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  hasPermission(requiredRole: UserRole): boolean {
    const hierarchy = {
      [UserRole.OWNER]: 3,
      [UserRole.MANAGER]: 2,
      [UserRole.AGENT]: 1
    };
    return hierarchy[this._role] >= hierarchy[requiredRole];
  }

  toJSON(): object {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
      companyId: this._companyId,
      isActive: this._isActive,
      createdAt: this._createdAt
    };
  }
}
