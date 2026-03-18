# Guia Rápido - Implementação no Figma

## 🚀 Setup Inicial

### 1. Criar Novo Projeto
- Nome: "OmniFlow - TCC PUCRS"
- Criar 3 páginas:
  - 📱 Wireframes Low-Fi
  - 🎨 Wireframes Mid-Fi
  - ✨ High-Fidelity

### 2. Configurar Grid e Layout
- **Desktop:** 1440px (12 colunas, gutter 24px)
- **Mobile:** 375px (4 colunas, gutter 16px)
- **Margin:** 80px (desktop), 16px (mobile)

### 3. Instalar Plugins Úteis
- **Iconify:** Biblioteca de ícones
- **Unsplash:** Imagens gratuitas
- **Content Reel:** Gerar conteúdo fake
- **Stark:** Verificar acessibilidade

## 📦 Ordem de Criação

### Fase 1: Design System (2-3 horas)
1. Criar paleta de cores
2. Definir tipografia (Inter ou Roboto)
3. Criar componentes base:
   - Buttons (4 variantes)
   - Inputs (6 tipos)
   - Cards
   - Badges
   - Avatares

### Fase 2: Wireframes Low-Fi (3-4 horas)
1. Landing Page
2. Login/Cadastro
3. Dashboard (3 colunas)
4. Chat
5. Lista de clientes

### Fase 3: Wireframes Mid-Fi (5-6 horas)
1. Todas as 20+ telas em grayscale
2. Adicionar estados (hover, active)
3. Empty states
4. Loading states

### Fase 4: High-Fidelity (6-8 horas)
1. Aplicar cores
2. Adicionar ícones
3. Inserir imagens/ilustrações
4. Criar protótipo interativo

## 🎨 Estrutura de Frames

### Desktop (1440x1024)
```
Frame: Login
Frame: Cadastro
Frame: Onboarding-1
Frame: Onboarding-2
Frame: Onboarding-3
Frame: Onboarding-4
Frame: Onboarding-5
Frame: Dashboard
Frame: Clientes
Frame: Analytics
Frame: Configuracoes
```

### Mobile (375x812)
```
Frame: Login-Mobile
Frame: Dashboard-Mobile
Frame: Chat-Mobile
Frame: Clientes-Mobile
```

## 🔗 Protótipo - Conexões

### Fluxo Principal
```
Landing → Cadastro → Email → Onboarding-1 → ... → Onboarding-5 → Dashboard
```

### Interações no Dashboard
```
Dashboard → Click conversa → Chat aberto
Dashboard → Menu → Clientes
Dashboard → Menu → Analytics
```

## ✅ Checklist Final

- [ ] Todas as telas criadas
- [ ] Componentes organizados
- [ ] Protótipo funcional
- [ ] Responsivo (Desktop + Mobile)
- [ ] Acessibilidade verificada
- [ ] Exportar para desenvolvimento
- [ ] Documentação de handoff

## 📤 Entrega

### Para Desenvolvimento
- Exportar assets (ícones, logos)
- Gerar CSS de cores e tipografia
- Compartilhar link do Figma
- Criar guia de estilos

### Para Apresentação
- Criar apresentação com principais telas
- Gravar vídeo do protótipo
- Screenshots em alta resolução
