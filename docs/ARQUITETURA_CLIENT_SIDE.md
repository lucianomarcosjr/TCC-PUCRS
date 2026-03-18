# Arquitetura Client-Side

## 1. Introdução

A arquitetura client-side do OmniFlow foi projetada para oferecer uma interface de usuário responsiva, tipada e componentizada, seguindo os princípios de Single Page Application (SPA). A escolha do React 18 como biblioteca principal, combinada com TypeScript para tipagem estática e Zustand para gerenciamento de estado, resultou em uma arquitetura que prioriza manutenibilidade, performance e experiência do desenvolvedor.

Este documento descreve as decisões arquiteturais, a organização do código, os padrões de componentização e o fluxo de dados implementado no frontend da aplicação.

## 2. Stack Tecnológica

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| React | 18.2.0 | Biblioteca UI declarativa com virtual DOM e ecossistema maduro |
| TypeScript | 5.2.2 | Tipagem estática que reduz erros em tempo de desenvolvimento |
| Vite | 5.0.8 | Build tool com Hot Module Replacement (HMR) e tempo de build otimizado |
| Zustand | 4.4.7 | Gerenciamento de estado minimalista, sem boilerplate excessivo |
| React Router | 6.20.0 | Roteamento declarativo para SPA |
| Axios | 1.6.2 | Cliente HTTP com interceptors para autenticação |

A escolha do Vite sobre alternativas como Create React App (CRA) ou Webpack justifica-se pela performance superior em desenvolvimento (HMR < 1 segundo) e pelo tempo de build reduzido (< 30 segundos), conforme documentado por You (2020).

## 3. Estrutura do Projeto

A organização do código segue o padrão de separação por responsabilidade:

```
frontend-react/src/
├── components/       # Componentes reutilizáveis de UI
│   ├── ConversationList.tsx
│   ├── ChatArea.tsx
│   ├── CustomerDetails.tsx
│   └── Layout.tsx
├── pages/            # Componentes de página (22 páginas)
│   ├── Landing.tsx, Login.tsx, Register.tsx
│   ├── Dashboard.tsx, Clients.tsx, ClientProfile.tsx
│   ├── Analytics.tsx, Reports.tsx, AgentReport.tsx
│   ├── Settings.tsx, CompanySettings.tsx, Integrations.tsx
│   └── Profile.tsx, Help.tsx, Automations.tsx, ...
├── store/            # Zustand stores (estado global)
├── services/         # Camada de comunicação com API
├── types/            # Definições de tipos TypeScript
├── App.tsx           # Componente raiz com roteamento
└── main.tsx          # Ponto de entrada da aplicação
```

## 4. Páginas Implementadas

A aplicação contempla 22 páginas organizadas em 5 grupos funcionais:

| Grupo | Páginas | Rotas |
|-------|---------|-------|
| Autenticação | Landing, Login, Register, Forgot Password, Onboarding | `/`, `/login`, `/register`, `/forgot-password`, `/onboarding` |
| Dashboard | Dashboard 3 Colunas, Clientes, Perfil do Cliente, Novo Cliente, Editar Cliente | `/dashboard`, `/clients`, `/clients/:id`, `/clients/new`, `/clients/:id/edit` |
| Analytics | Dashboard Analytics, Relatório por Atendente, Relatórios | `/analytics`, `/analytics/agent/:id`, `/reports` |
| Configurações | Notificações, Gerais, Empresa, Notificações Config, Integrações, Planos | `/notifications`, `/settings`, `/settings/company`, `/settings/notifications`, `/integrations`, `/billing` |
| Outros | Perfil, Ajuda, Automações | `/profile`, `/help`, `/automations` |

## 5. Gerenciamento de Estado com Zustand

O Zustand foi escolhido como alternativa ao Redux por sua API minimalista e ausência de boilerplate. O estado global foi dividido em dois stores:

### 5.1 AuthStore
Responsável pelo estado de autenticação:
- Armazenamento do token JWT e dados do usuário
- Métodos de login, logout e verificação de autenticação
- Persistência do token no localStorage

### 5.2 ChatStore
Responsável pelo estado das conversas:
- Lista de conversas ativas
- Conversa selecionada e suas mensagens
- Métodos para seleção de conversa e adição de mensagens

O fluxo de dados segue o padrão unidirecional:

```
Ação do Usuário → Componente → Zustand Store → Atualização de Estado → Re-renderização
```

## 6. Padrões Arquiteturais

### 6.1 Component Composition
O dashboard principal exemplifica o padrão de composição, onde componentes menores e focados são combinados para formar a interface completa:

```
<Dashboard>
  <ConversationList />   (sidebar esquerda — lista de conversas)
  <ChatArea />           (centro — área de mensagens)
  <CustomerDetails />    (sidebar direita — detalhes do cliente)
</Dashboard>
```

### 6.2 Protected Routes
Rotas que requerem autenticação são protegidas por um componente PrivateRoute que verifica a existência de token válido no AuthStore, redirecionando para `/login` quando necessário.

### 6.3 Service Layer
A comunicação com o backend é abstraída em uma camada de serviços (`services/api.ts`) que utiliza Axios com interceptors para injeção automática do token JWT nos headers de requisição.

## 7. Design System

A interface segue um design system consistente:

| Propriedade | Valor |
|-------------|-------|
| Cor primária | #6366f1 (Indigo) |
| Cor secundária | #8b5cf6 |
| Cor de sucesso | #10b981 |
| Cor de erro | #ef4444 |
| Background | #fafafa |
| Tipografia | Inter (Google Fonts) |

A estilização utiliza CSS Modules para escopo local de estilos, evitando conflitos de nomenclatura entre componentes.

## 8. Considerações de Performance

- Code splitting implícito via Vite para carregamento sob demanda
- Virtual DOM do React para minimizar manipulações do DOM real
- Tipagem estrita com TypeScript para detecção de erros em tempo de compilação
- Hot Module Replacement para ciclo de desenvolvimento < 1 segundo

## 9. Considerações

A arquitetura client-side adotada demonstrou-se adequada para uma aplicação SPA de média complexidade, oferecendo boa experiência de desenvolvimento (DX) e manutenibilidade. A combinação de React com TypeScript e Zustand proporcionou um equilíbrio entre robustez e simplicidade, enquanto o Vite garantiu tempos de build e reload competitivos.

## 10. Referências

- REACT. **React Documentation**. Disponível em: https://react.dev. Acesso em: 2024.
- YOU, E. **Vite: Next Generation Frontend Tooling**. Disponível em: https://vitejs.dev. Acesso em: 2024.
- ZUSTAND. **Zustand Documentation**. Disponível em: https://github.com/pmndrs/zustand. Acesso em: 2024.
- ABRAMOV, D. **Presentational and Container Components**. Medium, 2015.
