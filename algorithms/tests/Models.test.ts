import { User, UserRole } from '../src/models/User';
import { Company, Plan, CompanyStatus } from '../src/models/Company';
import { WhatsAppMessage, MessageDirection } from '../src/models/Message';

describe('User', () => {
  test('deve criar usuário válido', () => {
    const user = new User('1', 'João Silva', 'joao@test.com', 'hash123', UserRole.AGENT, 'company1');
    
    expect(user.name).toBe('João Silva');
    expect(user.email).toBe('joao@test.com');
    expect(user.role).toBe(UserRole.AGENT);
    expect(user.isActive).toBe(true);
  });

  test('deve validar nome mínimo', () => {
    expect(() => {
      new User('1', 'Jo', 'joao@test.com', 'hash123', UserRole.AGENT, 'company1');
    }).toThrow('Nome deve ter no mínimo 3 caracteres');
  });

  test('deve validar email', () => {
    expect(() => {
      new User('1', 'João Silva', 'email-invalido', 'hash123', UserRole.AGENT, 'company1');
    }).toThrow('Email inválido');
  });

  test('deve verificar permissões corretamente', () => {
    const owner = new User('1', 'Owner', 'owner@test.com', 'hash', UserRole.OWNER, 'c1');
    const agent = new User('2', 'Agent', 'agent@test.com', 'hash', UserRole.AGENT, 'c1');

    expect(owner.hasPermission(UserRole.AGENT)).toBe(true);
    expect(agent.hasPermission(UserRole.OWNER)).toBe(false);
  });
});

describe('Company', () => {
  let plan: Plan;

  beforeEach(() => {
    plan = new Plan('p1', 'Básico', 97, 5, 1000, ['whatsapp', 'email']);
  });

  test('deve criar empresa válida', () => {
    const company = new Company('1', 'Empresa Teste', '12345678901234', 'empresa@test.com', plan);
    
    expect(company.name).toBe('Empresa Teste');
    expect(company.status).toBe(CompanyStatus.ACTIVE);
  });

  test('deve validar CNPJ', () => {
    expect(() => {
      new Company('1', 'Empresa', '123', 'empresa@test.com', plan);
    }).toThrow('CNPJ deve ter 14 dígitos');
  });

  test('deve adicionar usuários respeitando limite do plano', () => {
    const company = new Company('1', 'Empresa', '12345678901234', 'empresa@test.com', plan);
    
    expect(company.addUser('u1')).toBe(true);
    expect(company.addUser('u2')).toBe(true);
    expect(company.userIds.length).toBe(2);
  });

  test('deve fazer upgrade de plano', () => {
    const company = new Company('1', 'Empresa', '12345678901234', 'empresa@test.com', plan);
    const newPlan = new Plan('p2', 'Pro', 297, 10, 10000, ['whatsapp', 'instagram', 'email']);
    
    company.upgradePlan(newPlan);
    expect(company.plan.name).toBe('Pro');
  });
});

describe('Message', () => {
  test('deve criar mensagem WhatsApp', () => {
    const msg = new WhatsAppMessage(
      '1',
      'Olá!',
      'customer1',
      'company1',
      MessageDirection.INBOUND,
      '+5511999999999'
    );

    expect(msg.getChannel()).toBe('whatsapp');
    expect(msg.content).toBe('Olá!');
    expect(msg.phoneNumber).toBe('+5511999999999');
  });

  test('deve verificar se tem mídia', () => {
    const msg = new WhatsAppMessage(
      '1',
      'Foto',
      'c1',
      'comp1',
      MessageDirection.INBOUND,
      '+5511999999999',
      'https://example.com/photo.jpg'
    );

    expect(msg.hasMedia()).toBe(true);
  });
});
