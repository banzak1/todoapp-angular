# TodoApp Front-End — Laboratório Evolutivo de Engenharia de Software e UI/UX

O **TodoApp Front-End** é a interface de usuário do laboratório de aprendizado contínuo, construída para evoluir em paralelo à API REST do projeto principal. O objetivo é desenvolver a aplicação cliente ao longo de diversas fases, com foco em design de interfaces (UI), experiência do usuário (UX), arquitetura de front-end moderna e deploy automatizado.

Este repositório serve como ambiente de experimentação de boas práticas no Angular, implementação de Design Systems e arquitetura baseada em componentes escaláveis.

---

## 🚀 O Roadmap das Fases (Front-End)

O projeto de interface evolui adicionando novas camadas e refinações:

1. **Fase 1 — Fundação & UI Base** (✅ Concluída): Estruturação inicial do projeto com Angular 17+ (Standalone Components), roteamento básico e implementação de Mocks de serviços para trabalho offline (sem necessidade imediata do Back-End).
2. **Fase 2 — Design System & Estilização** (✅ Concluída): Integração do **Stitch Design System**, estilização global com TailwindCSS e mapeamento de variáveis CSS. Refatoração da estrutura de componentes separando `.ts`, `.html` e `.scss`. Criação da UI principal: Dashboard e Calendário Dinâmico reativos.
3. **Fase 3 — Deploy & Configuração de Ambientes** (✅ Concluída): Configuração de roteamento tipo SPA e preparação dos diretórios de build (arquivos `vercel.json` e fallback) para deploy direto no Vercel.
4. **Fase 4 — Integração Real com API** (✅ Concluída): Substituição dos dados mockados (em memória) pela comunicação HTTP real consumindo a API REST de tarefas e IA do projeto Back-End. Implementação da atualização otimista local com reversão em caso de erro da API.
5. **Fase 5 — Gerenciamento de Estado Avançado**: Adoção de estado reativo complexo utilizando Signals (Angular 17+) ou padrão Redux e cacheamento otimista.
6. **Fase 6 — Testes Unitários Automatizados** (✅ Concluída): Implementação completa da suíte de testes unitários com Vitest cobrindo os componentes e páginas modificados (ex: `TaskCardComponent` e `TaskListPage`).

---

## 🛠️ Stack Tecnológica Atualizada

*   **Angular 17+** (Framework, Standalone Components, e Signals)
*   **Tailwind CSS v3** (Framework Utility-first para estilização rápida e responsiva)
*   **Stitch Design System** (Tokens de design, cores neutras, tipografia e espaçamento)
*   **TypeScript** (Tipagem estática, segurança em tempo de desenvolvimento)
*   **Vercel** (Hospedagem, CI/CD e configuração de rotas SPA)
*   **Vitest** (Test runner otimizado e integrado para testes unitários rápidos e confiáveis)

---

## 🏛️ Arquitetura do Projeto (Feature-Based / Component-Driven)

O projeto adota uma arquitetura modular por features (funcionalidades), mantendo separação rigorosa de responsabilidades e facilitando a manutenção e escala:

```text
src/app/
│
├── core/                        # Módulo Core: Recursos singleton, models de domínio e serviços
│   ├── models/                  # Interfaces de tipagem de domínio (ex: Task, Priority)
│   └── services/                # Serviços genéricos, HTTP clients e Mock Services
│
├── shared/                      # Módulo Compartilhado: UI Components genéricos, pipes e diretivas
│   └── components/              # Componentes de layout (ex: Header, Botões base)
│
├── features/                    # Domínios / Funcionalidades da Aplicação
│   └── tasks/                   # Feature específica de Tarefas
│       ├── components/          # Componentes menores isolados da feature (ex: TaskCard, Calendar)
│       └── pages/               # Telas/Smart Components que agrupam dados e roteamento (ex: TaskList)
│
└── app.routes.ts                # Configuração de roteamento global da Single Page Application (SPA)
```

---

## 🔌 Interação e Consumo de Dados

Atualmente a aplicação possui uma versão baseada em **Mocks** (através do serviço local), retornando dados estáticos e pré-configurados para facilitar o desenvolvimento de UI sem depender do back-end em tempo real. Nas próximas fases do roadmap, a aplicação será configurada (usando `environment.ts`) para realizar requisições REST completas com `HttpClient` para a API Java.

---

## 🏃 Como Executar Localmente

### Pré-requisitos
*   **Node.js** (LTS recomendado, 18+ ou 20+).
*   **Angular CLI** (Instalável via `npm install -g @angular/cli`).

---

### Modo de Desenvolvimento

1.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```
2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    ng serve
    # ou alternativamente: npm start
    ```
3.  **Acesse a aplicação no seu navegador:**
    Abra `http://localhost:4200/`. A página atualizará automaticamente (Hot Module Replacement) assim que qualquer alteração no código fonte for salva.

---

### Construção para Produção (Build)

Para compilar e minificar o projeto para um ambiente de produção:

```bash
ng build
# ou: npm run build
```
Os arquivos otimizados e prontos para deploy (com suporte ao padrão SPA) serão gerados no diretório `dist/`. O projeto também possui `vercel.json` na raiz para redirecionamento correto de rotas diretamente no servidor de hospedagem.

---

## 🧪 Rodando os Testes Automatizados

A base está preparada para rodar testes utilizando o **Vitest** integrado com o Angular.

Para executar os testes configurados em modo watch:
```bash
npm run test
# ou: ng test
```

Para executar os testes apenas uma vez e sair:
```bash
npx ng test --no-watch
```

---

## 🧑‍💻 Desenvolvedor
*   **Leonardo Santana** (Pleno)
*   LinkedIn: [linkedin.com/in/banzak](https://linkedin.com/in/banzak)
*   GitHub: [github.com/banzak1](https://github.com/banzak1)
