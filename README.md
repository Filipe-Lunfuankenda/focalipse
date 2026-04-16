# Focalipse

Plataforma web dedicada ao Focalipse, uma figura de estilo narrativa centrada numa transição brusca entre escala macro (caos, impacto, rutura) e escala micro (detalhe silencioso, quase invisível).

O projeto foi construído com React + TypeScript + Vite, inclui internacionalização multi-idioma, animações com Framer Motion, secção de geração de exemplos e verificação heurística de textos.

## Idioma padrão

O idioma padrão da aplicação é `pt-PT`.

## Objetivo do projeto

Esta aplicação funciona como:

1. Manifesto e arquivo conceptual do recurso expressivo Focalipse.
2. Ferramenta pedagógica para explicar estrutura, taxonomia e efeitos.
3. Laboratório prático com:
   - gerador de frases Focalipse por tipo e tema;
   - verificador textual com pontuação e diagnóstico de elementos estruturais.

## Funcionalidades principais

### 1) Landing literária em secções

A página principal agrega secções narrativas/teóricas em sequência:

- Hero
- Etimologia
- Conceito
- Psicologia
- Estrutura
- Taxonomia
- Tipos avançados
- Efeitos
- Exemplos
- Gerador
- Verificador
- Manifesto
- Filosofia
- Chekhov
- Artigos
- Diferenças
- FAQ
- Footer

Cada secção usa componentes com animação de entrada e tipografia editorial, mantendo um ritmo visual coerente com o tema literário.

### 2) Navegação e UX

- Navegação fixa no topo com âncoras para secções.
- Menu responsivo (desktop + mobile).
- Seletor de idioma.
- Alternância claro/escuro via classe `dark` no `documentElement`.
- Scroll suave entre secções.

### 3) Internacionalização (i18n)

A app usa `LanguageProvider` e `getTranslation()` para resolver textos por idioma.

Idiomas suportados:

- `pt-PT` (padrão)
- `pt-BR`
- `en-US`
- `en-GB`
- `fr`
- `es`
- `de`
- `it`
- `nl`
- `ru`
- `ja`
- `zh`
- `ko`
- `ar`

Notas técnicas:

- A língua do documento (`<html lang="...">`) é atualizada em runtime.
- Para árabe, a direção é alterada para `rtl`.
- Metadados SEO e OpenGraph também mudam dinamicamente por idioma.

### 4) Gerador de Focalipse

O gerador permite:

- escolher 1 entre 8 tipos estruturais;
- escolher tema semântico;
- montar frase por combinação de macro-elementos, micro-elementos e conectores;
- copiar resultado para clipboard.

Tipos estruturais usados:

- Macro -> Micro
- Macro -> Micro -> Micro
- Macro -> Micro -> Macro -> Micro
- Macro -> Micro -> micro
- Micro -> Macro
- Macro -> (Micro...)
- (Macro -> Micro) x 2
- Macro -> Micro -> (contraste)

### 5) Verificador de Focalipse

O verificador implementa uma análise heurística multi-etapa com:

- dicionários/padrões regex para macro-eventos, micro-detalhes e conectores;
- deteção de padrões estruturais (simples, composto, encadeado, invertido, suspenso, progressivo, paralelo, recursivo);
- scoring (0-5) com critérios ponderados;
- classificação final: `is`, `almost`, `not`;
- checklist de elementos encontrados;
- sugestões de melhoria quando faltam componentes-chave.

Também inclui exemplos multilingues para testes rápidos no UI.

## Stack técnica

### Frontend

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui (infra de componentes)
- Radix UI (primitivos)
- Framer Motion (animações)
- Lucide React (ícones)

### Estado e infraestrutura

- React Query (`@tanstack/react-query`) preparado no `App`.
- React Router (rota principal + fallback 404).

### Testes

- Vitest + Testing Library + JSDOM para testes unitários/componentes.
- Playwright configurado para E2E (base URL local em `http://localhost:7078`).

## Estrutura do projeto (resumo)

```text
src/
  components/
    ... secções da página + UI base
  i18n/
    LanguageContext.tsx
    types.ts
    translations/
  pages/
    Index.tsx
    NotFound.tsx
  test/
    setup.ts
    example.test.ts
  App.tsx
  main.tsx
  index.css
```

Ficheiros de configuração principais:

- `vite.config.ts`
- `tailwind.config.ts`
- `vitest.config.ts`
- `playwright.config.ts`
- `eslint.config.js`

## Executar localmente

### Requisitos

- Node.js 18+ (recomendado)
- npm

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Servidor local configurado para:

- `http://localhost:7078`

### Build de produção

```bash
npm run build
```

O build gera ficheiros com hash e inclui `version.json` para detetar novas versões automaticamente no browser.

Para usar Groq localmente, o site pede a chave no browser e guarda-a apenas em `localStorage`. O deploy público continua a cair automaticamente para o modo estático.

O site inclui duas cópias assistidas por Groq: um Gerador IA e um Verificador IA. Ambas fazem fallback automático para a lógica local quando a API não responde.

### Cache em produção

Para evitar hard refresh manual e manter o comportamento profissional de SaaS/sites modernos:

- `index.html` e `version.json` devem ser servidos com `no-cache` ou `no-store`.
- Os ficheiros dentro de `assets/` devem usar cache longa com `immutable`.
- O frontend verifica a versão publicada e recarrega automaticamente quando existe um deploy novo.

O repositório já inclui configuração pronta para Netlify em `public/_headers` e para Vercel em `vercel.json`.

### Preview da build

```bash
npm run preview
```

### Testes

```bash
npm run test
```

## Publicação no GitHub Pages

Este repositório está preparado para publicação em GitHub Pages no caminho `/focalipse/`.

Comandos de deploy:

```bash
npm install
npm run deploy
```

O script `deploy` compila a aplicação e publica a pasta `dist` na branch de Pages.

## Licenciamento

- O código do site está sob licença MIT. Ver [LICENSE](LICENSE).
- O conteúdo conceptual e os textos explicativos do Focalipse estão sob CC BY 4.0. Ver [CONCEPT-LICENSE.txt](CONCEPT-LICENSE.txt).
- A atribuição obrigatória é: "Embora existissem insights prévios na literatura, a sistematização do Focalipse foi desenvolvida e definida por Filipe Lunfuankenda."

## Nota de autoria conceptual

Embora existissem insights prévios na literatura, a sistematização do Focalipse foi desenvolvida por Filipe Lunfuankenda.
