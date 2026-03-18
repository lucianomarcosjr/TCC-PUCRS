# Roteiro de Wireframes - OmniFlow

## 🎯 Objetivo do Design
Criar uma interface intuitiva que permita PMEs gerenciarem atendimento omnichannel sem curva de aprendizado, inspirada no WhatsApp Web.

## 👥 Personas

### Persona 1: Maria - Proprietária de Loja de Roupas
- **Idade:** 38 anos
- **Dor:** Perde vendas porque esquece de responder mensagens no WhatsApp
- **Objetivo:** Centralizar atendimento e não perder nenhum cliente
- **Comportamento:** Usa celular o dia todo, familiarizada com WhatsApp
- **Frustração:** Apps complicados que exigem treinamento

### Persona 2: João - Atendente de Pet Shop
- **Idade:** 24 anos
- **Dor:** Atende por WhatsApp, Instagram e telefone simultaneamente
- **Objetivo:** Responder rápido sem trocar de app
- **Comportamento:** Nativo digital, espera interfaces rápidas
- **Frustração:** Sistemas lentos e com muitos cliques

### Persona 3: Ana - Gerente de Oficina Mecânica
- **Idade:** 45 anos
- **Dor:** Não consegue medir desempenho da equipe de atendimento
- **Objetivo:** Ver métricas e relatórios simples
- **Comportamento:** Usa computador, prefere dashboards visuais
- **Frustração:** Relatórios complexos e difíceis de entender

## 🗺️ Jornada do Usuário

### Jornada 1: Primeiro Acesso (Onboarding)
1. **Landing Page** → Cadastro
2. **Cadastro** → Confirmação de email
3. **Onboarding** → Conectar WhatsApp (5 passos)
4. **Dashboard** → Primeira mensagem recebida
5. **Resposta** → Cliente recebe no WhatsApp

### Jornada 2: Atendimento Diário
1. **Login** → Dashboard com conversas
2. **Notificação** → Nova mensagem
3. **Abrir conversa** → Ver histórico
4. **Responder** → Enviar mensagem
5. **Fechar conversa** → Marcar como resolvida

### Jornada 3: Gestão (Gerente)
1. **Login** → Dashboard
2. **Menu Analytics** → Ver relatórios
3. **Filtrar período** → Últimos 7 dias
4. **Exportar** → Download PDF
5. **Compartilhar** → Enviar para equipe

## 📱 Estrutura de Telas (Wireframes)

### 1. AUTENTICAÇÃO

#### 1.1 Landing Page
**Elementos:**
- Hero section com proposta de valor
- Screenshot do dashboard
- Botão CTA: "Começar Grátis"
- Depoimentos de clientes
- Preços dos planos
- Footer com links

**Layout:** Desktop (1440px)

#### 1.2 Tela de Cadastro
**Elementos:**
- Logo OmniFlow (topo esquerdo)
- Formulário centralizado:
  - Nome da empresa
  - CNPJ
  - Email
  - Senha
  - Confirmar senha
- Checkbox: "Aceito os termos"
- Botão: "Criar conta"
- Link: "Já tem conta? Faça login"

**Layout:** Desktop (1440px) e Mobile (375px)

#### 1.3 Tela de Login
**Elementos:**
- Logo OmniFlow
- Formulário:
  - Email
  - Senha
  - Checkbox: "Lembrar-me"
- Botão: "Entrar"
- Link: "Esqueci minha senha"
- Link: "Criar conta"

**Layout:** Desktop e Mobile

#### 1.4 Recuperação de Senha
**Elementos:**
- Título: "Recuperar senha"
- Campo: Email
- Botão: "Enviar link"
- Link: "Voltar ao login"

**Layout:** Desktop e Mobile

### 2. ONBOARDING

#### 2.1 Boas-vindas
**Elementos:**
- Ilustração de boas-vindas
- Título: "Bem-vindo ao OmniFlow!"
- Texto: "Vamos configurar sua conta em 5 passos"
- Botão: "Começar"
- Indicador de progresso: 1/5

**Layout:** Desktop

#### 2.2 Passo 1 - Dados da Empresa
**Elementos:**
- Indicador: 1/5
- Título: "Sobre sua empresa"
- Campos:
  - Nome fantasia
  - Telefone
  - Segmento (dropdown)
- Botões: "Voltar" | "Próximo"

#### 2.3 Passo 2 - Conectar WhatsApp
**Elementos:**
- Indicador: 2/5
- Título: "Conecte seu WhatsApp"
- Instruções passo a passo com imagens
- QR Code para escanear
- Status: "Aguardando conexão..."
- Botões: "Voltar" | "Próximo"

#### 2.4 Passo 3 - Adicionar Usuários
**Elementos:**
- Indicador: 3/5
- Título: "Adicione sua equipe"
- Lista de usuários:
  - Nome
  - Email
  - Role (dropdown)
  - Botão "Remover"
- Botão: "+ Adicionar usuário"
- Botões: "Pular" | "Próximo"

#### 2.5 Passo 4 - Configurações Iniciais
**Elementos:**
- Indicador: 4/5
- Título: "Personalize seu atendimento"
- Opções:
  - Mensagem de boas-vindas automática (toggle)
  - Horário de atendimento (campos)
  - Mensagem fora do horário (textarea)
- Botões: "Voltar" | "Próximo"

#### 2.6 Passo 5 - Concluído
**Elementos:**
- Indicador: 5/5
- Ilustração de sucesso
- Título: "Tudo pronto!"
- Texto: "Você já pode começar a atender"
- Botão: "Ir para o Dashboard"

### 3. DASHBOARD PRINCIPAL

#### 3.1 Layout Geral (Inspirado no WhatsApp Web)
**Estrutura de 3 colunas:**

**Coluna 1 - Sidebar Esquerda (320px):**
- Header:
  - Logo OmniFlow
  - Avatar do usuário
  - Menu dropdown (Configurações, Sair)
- Barra de busca
- Filtros:
  - Todas
  - Não lidas
  - Abertas
  - Fechadas
- Lista de conversas:
  - Avatar do cliente
  - Nome do cliente
  - Última mensagem (preview)
  - Timestamp
  - Badge de não lidas
  - Canal (ícone WhatsApp/Instagram/Email)

**Coluna 2 - Área de Chat (Central):**
- Header da conversa:
  - Avatar e nome do cliente
  - Status (online/offline)
  - Botões: Atribuir | Fechar | Mais opções
- Área de mensagens:
  - Mensagens do cliente (esquerda, cinza)
  - Mensagens do atendente (direita, verde)
  - Timestamp
  - Status de entrega (✓✓)
  - Suporte a mídias (imagens, áudios)
- Input de mensagem:
  - Campo de texto
  - Botão anexar
  - Botão emoji
  - Botão enviar

**Coluna 3 - Sidebar Direita (280px):**
- Informações do cliente:
  - Avatar grande
  - Nome
  - Telefone/Email
  - Tags (badges coloridos)
  - Botão: "Editar"
- Histórico:
  - Total de conversas
  - Última interação
  - Tempo médio de resposta
- Notas internas:
  - Textarea
  - Botão: "Salvar nota"

**Layout:** Desktop (1440px)

#### 3.2 Dashboard Mobile
**Estrutura:**
- Tela 1: Lista de conversas (igual sidebar esquerda)
- Tela 2: Chat (ao clicar em conversa)
- Tela 3: Detalhes do cliente (botão no header)

**Navegação:** Bottom tab bar
- Conversas
- Clientes
- Relatórios
- Perfil

**Layout:** Mobile (375px)

### 4. GESTÃO DE CLIENTES

#### 4.1 Lista de Clientes
**Elementos:**
- Header:
  - Título: "Clientes"
  - Barra de busca
  - Filtros: Tags, Canal, Período
  - Botão: "+ Novo cliente"
- Tabela:
  - Avatar | Nome | Telefone | Email | Tags | Última interação | Ações
- Paginação

**Layout:** Desktop

#### 4.2 Perfil do Cliente
**Elementos:**
- Header com avatar e nome
- Abas:
  - Informações
  - Conversas
  - Notas
- Seção Informações:
  - Dados pessoais (editável)
  - Tags
  - Canais conectados
- Seção Conversas:
  - Timeline de todas as conversas
  - Filtro por canal
- Seção Notas:
  - Lista de notas internas
  - Botão: "+ Nova nota"

**Layout:** Desktop

### 5. ANALYTICS E RELATÓRIOS

#### 5.1 Dashboard de Métricas
**Elementos:**
- Header:
  - Título: "Analytics"
  - Seletor de período (dropdown)
  - Botão: "Exportar PDF"
- Cards de métricas (4 colunas):
  - Total de conversas
  - Tempo médio de resposta
  - Taxa de resolução
  - Satisfação do cliente
- Gráficos:
  - Linha: Conversas por dia
  - Barra: Mensagens por canal
  - Pizza: Distribuição por atendente
  - Heatmap: Horários de pico
- Tabela: Top 10 clientes mais ativos

**Layout:** Desktop

#### 5.2 Relatório de Atendente
**Elementos:**
- Filtro: Selecionar atendente
- Cards individuais:
  - Conversas atendidas
  - Tempo médio de resposta
  - Avaliação média
- Gráfico de desempenho semanal
- Lista de conversas recentes

**Layout:** Desktop

### 6. CONFIGURAÇÕES

#### 6.1 Menu de Configurações
**Estrutura:**
- Sidebar com menu:
  - Perfil
  - Empresa
  - Canais
  - Usuários
  - Planos e Pagamento
  - Notificações
  - Integrações

**Layout:** Desktop

#### 6.2 Configurações de Canais
**Elementos:**
- Lista de canais:
  - WhatsApp (conectado - verde)
  - Instagram (desconectado - cinza)
  - Email (desconectado - cinza)
- Card por canal:
  - Status
  - Botão: "Conectar" ou "Desconectar"
  - Configurações específicas

**Layout:** Desktop

#### 6.3 Gestão de Usuários
**Elementos:**
- Botão: "+ Convidar usuário"
- Tabela:
  - Avatar | Nome | Email | Role | Status | Ações
- Modal de convite:
  - Email
  - Role (dropdown)
  - Botão: "Enviar convite"

**Layout:** Desktop

### 7. ESTADOS E COMPONENTES

#### 7.1 Estados Vazios (Empty States)
- **Sem conversas:** Ilustração + "Nenhuma conversa ainda"
- **Sem clientes:** Ilustração + "Adicione seu primeiro cliente"
- **Sem dados:** Ilustração + "Sem dados para exibir"

#### 7.2 Estados de Carregamento
- Skeleton screens para:
  - Lista de conversas
  - Mensagens
  - Tabelas
- Spinner para ações

#### 7.3 Notificações e Alertas
- Toast notifications (canto superior direito):
  - Sucesso (verde)
  - Erro (vermelho)
  - Aviso (amarelo)
  - Info (azul)
- Modal de confirmação:
  - Título
  - Mensagem
  - Botões: "Cancelar" | "Confirmar"

#### 7.4 Componentes Reutilizáveis
- Botões (Primary, Secondary, Outline, Ghost)
- Inputs (Text, Email, Password, Textarea, Select)
- Cards
- Badges
- Avatares
- Tabs
- Dropdowns
- Modais
- Tooltips

## 🎨 Design System

### Cores
**Primárias:**
- Verde: #25D366 (WhatsApp)
- Azul: #0084FF (Facebook/Instagram)
- Cinza escuro: #1F2937 (Texto)

**Secundárias:**
- Cinza claro: #F3F4F6 (Background)
- Branco: #FFFFFF
- Vermelho: #EF4444 (Erro)
- Amarelo: #F59E0B (Aviso)

### Tipografia
- **Fonte:** Inter ou Roboto
- **Tamanhos:**
  - H1: 32px (Bold)
  - H2: 24px (Bold)
  - H3: 20px (Semibold)
  - Body: 16px (Regular)
  - Small: 14px (Regular)
  - Tiny: 12px (Regular)

### Espaçamento
- **Grid:** 8px base
- **Padding:** 8px, 16px, 24px, 32px
- **Margin:** 8px, 16px, 24px, 32px

### Ícones
- **Biblioteca:** Heroicons ou Feather Icons
- **Tamanho:** 16px, 20px, 24px

### Bordas
- **Radius:** 4px (pequeno), 8px (médio), 12px (grande)
- **Border:** 1px solid #E5E7EB

### Sombras
- **Pequena:** 0 1px 2px rgba(0,0,0,0.05)
- **Média:** 0 4px 6px rgba(0,0,0,0.1)
- **Grande:** 0 10px 15px rgba(0,0,0,0.1)

## 📐 Breakpoints

- **Mobile:** 375px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1440px
- **Large Desktop:** 1441px+

## ✅ Checklist de Wireframes

### Low Fidelity (Papel/Balsamiq)
- [ ] Estrutura de navegação
- [ ] Layout de 3 colunas do dashboard
- [ ] Fluxo de onboarding
- [ ] Principais telas (Login, Dashboard, Clientes, Analytics)

### Mid Fidelity (Figma - Grayscale)
- [ ] Todas as 20+ telas mapeadas
- [ ] Componentes reutilizáveis criados
- [ ] Estados (hover, active, disabled)
- [ ] Empty states e loading states
- [ ] Responsividade (Desktop + Mobile)

### High Fidelity (Figma - Colorido)
- [ ] Design system aplicado
- [ ] Cores, tipografia, ícones
- [ ] Imagens e ilustrações
- [ ] Animações e transições (protótipo)
- [ ] Acessibilidade (contraste, tamanhos)

## 🔄 Fluxos de Interação (Protótipo)

### Fluxo 1: Onboarding Completo
Landing → Cadastro → Email → Onboarding (5 passos) → Dashboard

### Fluxo 2: Atender Cliente
Dashboard → Clicar conversa → Ver histórico → Digitar resposta → Enviar

### Fluxo 3: Adicionar Usuário
Dashboard → Configurações → Usuários → Convidar → Preencher → Enviar

### Fluxo 4: Ver Relatório
Dashboard → Analytics → Selecionar período → Ver gráficos → Exportar PDF

## 📝 Anotações para Desenvolvimento

### Prioridade Alta (MVP)
- Login/Cadastro
- Dashboard principal (3 colunas)
- Chat em tempo real
- Lista de conversas
- Perfil do cliente (básico)

### Prioridade Média (V1.0)
- Onboarding completo
- Analytics básico
- Configurações de canais
- Gestão de usuários

### Prioridade Baixa (V2.0)
- Relatórios avançados
- Automação
- Integrações
- App mobile nativo

## 🎯 Métricas de Sucesso do Design

- **Onboarding:** < 5 minutos para conectar WhatsApp
- **Usabilidade:** Usuário consegue responder mensagem sem ajuda
- **Performance:** Telas carregam em < 2 segundos
- **Acessibilidade:** Contraste mínimo WCAG AA
- **Responsividade:** Funciona em mobile e desktop
