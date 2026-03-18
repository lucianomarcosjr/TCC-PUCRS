# Programação para Web

## 1. Introdução

A programação para web constitui a base tecnológica sobre a qual aplicações modernas são construídas, utilizando as linguagens padronizadas pelo W3C: HTML5 para estruturação semântica, CSS3 para estilização e JavaScript para interatividade (FLANAGAN, 2020). No projeto OmniFlow, um protótipo inicial foi desenvolvido com essas tecnologias em sua forma vanilla (sem frameworks), servindo como prova de conceito e base para a posterior evolução para a versão React descrita no documento de Arquitetura Client-Side.

Este documento descreve as tecnologias web fundamentais aplicadas, o design system implementado, as práticas de acessibilidade e responsividade adotadas e a evolução do protótipo para a versão final.

## 2. Tecnologias Fundamentais

### 2.1 HTML5

A marcação seguiu os princípios de semântica do HTML5:

| Elemento | Uso no Projeto |
|----------|---------------|
| `<header>` | Cabeçalho da aplicação com logo e navegação |
| `<main>` | Conteúdo principal de cada página |
| `<aside>` | Sidebars do dashboard (lista de conversas, detalhes do cliente) |
| `<footer>` | Rodapé com informações complementares |
| `<form>` | Formulários de login e cadastro com validação nativa |

Atributos de acessibilidade (ARIA labels, alt text) foram incluídos para conformidade com as diretrizes WCAG 2.1 nível AA.

### 2.2 CSS3

A estilização utilizou recursos modernos do CSS3:

- **CSS Custom Properties (variáveis):** centralização do design system em variáveis reutilizáveis
- **Flexbox:** layout unidimensional para alinhamento de componentes
- **CSS Grid:** layout bidimensional para a estrutura de 3 colunas do dashboard
- **Media Queries:** responsividade com abordagem mobile-first
- **Transições e animações:** feedback visual em interações do usuário

### 2.3 JavaScript (ES6+)

O JavaScript vanilla utilizou recursos modernos da especificação ECMAScript 2015+:

- Arrow functions para sintaxe concisa
- Async/await para operações assíncronas
- Destructuring para extração de propriedades
- Template literals para interpolação de strings
- Fetch API para comunicação com o backend
- LocalStorage para persistência de tokens de autenticação

## 3. Design System

O design system foi definido com CSS Custom Properties para garantir consistência visual:

| Propriedade | Valor | Uso |
|-------------|-------|-----|
| --color-primary | #25D366 | Elementos principais, botões de ação |
| --color-secondary | #0084FF | Elementos secundários, links |
| --color-text | #1F2937 | Texto principal |
| --color-bg | #F3F4F6 | Background da aplicação |
| --color-border | #E5E7EB | Bordas e separadores |

**Tipografia:** Inter (Google Fonts) com escala de tamanhos (12px, 14px, 16px, 20px, 24px, 32px) e pesos (400, 600, 700).

**Espaçamento:** Sistema baseado em múltiplos de 8px (8, 16, 24, 32px).

## 4. Páginas do Protótipo

### 4.1 Página de Login

Funcionalidades implementadas:
- Formulário com validação de email via JavaScript
- Checkbox "Lembrar-me" com persistência em LocalStorage
- Autenticação mock com redirecionamento para dashboard
- Links para recuperação de senha e cadastro

### 4.2 Dashboard

Layout de 3 colunas inspirado no WhatsApp Web:
- **Sidebar esquerda:** lista de conversas com busca e filtros (Todas, Não lidas, Abertas)
- **Área central:** chat com histórico de mensagens e campo de envio
- **Sidebar direita:** detalhes do cliente e notas internas

Funcionalidades JavaScript: carregamento dinâmico de conversas, abertura de conversa com scroll automático, envio de mensagens com atualização da interface.

## 5. Responsividade

A abordagem mobile-first definiu três breakpoints:

| Breakpoint | Layout | Colunas visíveis |
|-----------|--------|-------------------|
| < 768px (Mobile) | Coluna única | Apenas lista de conversas ou chat |
| 768px–1023px (Tablet) | Duas colunas | Lista de conversas + chat |
| ≥ 1024px (Desktop) | Três colunas | Lista + chat + detalhes do cliente |

## 6. Acessibilidade

As seguintes práticas de acessibilidade foram implementadas em conformidade com WCAG 2.1:

- Labels associados a todos os inputs via atributo `for`
- Alt text descritivo em todas as imagens
- Contraste de cores adequado (ratio ≥ 4.5:1 para texto normal)
- Navegação completa por teclado (Tab, Enter, Escape)
- ARIA labels em elementos interativos sem texto visível
- Indicador de foco visível em todos os elementos interativos

## 7. Evolução para React

O protótipo HTML/CSS/JS serviu como prova de conceito e validação do design, sendo posteriormente substituído pela versão React em `frontend-react/`. A evolução manteve:

- O design system (cores, tipografia, espaçamento)
- A estrutura de layout do dashboard (3 colunas)
- Os padrões de interação validados no protótipo

E adicionou:
- Componentização com React
- Tipagem estática com TypeScript
- Gerenciamento de estado com Zustand
- Roteamento com React Router
- Build otimizado com Vite

## 8. Boas Práticas Aplicadas

| Área | Prática |
|------|---------|
| HTML | Semântica correta, hierarquia de headings, meta tags completas |
| CSS | BEM naming convention, CSS Variables, mobile-first, sem !important |
| JavaScript | Código modular, funções pequenas e focadas, async/await, tratamento de erros |

## 9. Considerações

O desenvolvimento do protótipo com tecnologias web fundamentais (HTML5, CSS3, JavaScript vanilla) proporcionou uma compreensão sólida dos mecanismos nativos da plataforma web antes da adoção de frameworks. Essa abordagem bottom-up permitiu decisões mais informadas na escolha do React e suas bibliotecas complementares, além de resultar em um design system validado que foi reutilizado na versão final da aplicação.

## 10. Referências

- FLANAGAN, D. **JavaScript: The Definitive Guide**. 7th ed. O'Reilly Media, 2020.
- MDN WEB DOCS. **Web technology for developers**. Disponível em: https://developer.mozilla.org. Acesso em: 2024.
- W3C. **Web Content Accessibility Guidelines (WCAG) 2.1**. Disponível em: https://www.w3.org/TR/WCAG21/. Acesso em: 2024.
- MEYER, E. A.; WEYL, E. **CSS: The Definitive Guide**. 4th ed. O'Reilly Media, 2017.
