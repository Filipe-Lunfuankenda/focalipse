# Focalipse

Plataforma web dedicada ao Focalipse, uma figura de estilo narrativa centrada numa transicao brusca entre escala macro (caos, impacto, ruptura) e escala micro (detalhe silencioso, quase invisivel).

O projeto esta construido com React + TypeScript + Vite, inclui internacionalizacao multi-idioma, animacoes com Framer Motion, secao de geracao de exemplos e um verificador heuristico para classificar textos.

## Idioma padrao

O idioma padrao da aplicacao e `pt-PT`.

## Objetivo do projeto

Esta aplicacao funciona como:

1. Manifesto e arquivo conceptual do recurso expressivo Focalipse.
2. Ferramenta pedagogica para explicar estrutura, taxonomia e efeitos.
3. Laboratorio pratico com:
	 - gerador de frases Focalipse por tipo e tema;
	 - verificador textual com pontuacao e diagnostico de elementos estruturais.

## Funcionalidades principais

### 1) Landing literaria em secoes

A pagina principal agrega secoes narrativas/teoricas em sequencia:

- Hero
- Etimologia
- Conceito
- Psicologia
- Estrutura
- Taxonomia
- Tipos avancados
- Efeitos
- Exemplos
- Gerador
- Verificador
- Manifesto
- Filosofia
- Chekhov
- Artigos
- Diferencas
- FAQ
- Footer

Cada secao usa componentes com animacao de entrada e tipografia editorial, mantendo um ritmo visual coerente com o tema literario.

### 2) Navegacao e UX

- Navegacao fixa no topo com anchors para secoes.
- Menu responsivo (desktop + mobile).
- Seletor de idioma.
- Alternancia claro/escuro via classe `dark` no `documentElement`.
- Scroll suave entre secoes.

### 3) Internacionalizacao (i18n)

A app usa `LanguageProvider` e `getTranslation()` para resolver textos por idioma.

Idiomas suportados:

- `pt-PT` (padrao)
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

Notas tecnicas:

- A lingua do documento (`<html lang="...">`) e atualizada em runtime.
- Para arabe, a direcao e alterada para `rtl`.
- Metadados SEO e OpenGraph tambem mudam dinamicamente por idioma.

### 4) Gerador de Focalipse

O gerador permite:

- escolher 1 entre 8 tipos estruturais;
- escolher tema semantico;
- montar frase por combinacao de macro-elementos, micro-elementos e conectores;
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

O verificador implementa uma analise heuristica multi-etapa com:

- dicionarios/padroes regex para macro-eventos, micro-detalhes e conectores;
- deteccao de padroes estruturais (simples, composto, encadeado, invertido, suspenso, progressivo, paralelo, recursivo);
- scoring (0-5) com criterios ponderados;
- classificacao final: `is`, `almost`, `not`;
- checklist de elementos encontrados;
- sugestoes de melhoria quando faltam componentes-chave.

Tambem inclui exemplos multilingues para testes rapidos no UI.

## Stack tecnica

### Frontend

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui (infra de componentes)
- Radix UI (primitivos)
- Framer Motion (animacoes)
- Lucide React (icons)

### Estado e infraestrutura

- React Query (`@tanstack/react-query`) preparado no `App`.
- React Router (rota principal + fallback 404).

### Testes

- Vitest + Testing Library + JSDOM para testes unitarios/componentes.
- Playwright configurado para E2E (base URL local em `http://localhost:7078`).

## Estrutura do projeto (resumo)

```text
src/
	components/
		... secoes da pagina + UI base
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

Ficheiros de configuracao principais:

- `vite.config.ts`
- `tailwind.config.ts`
- `vitest.config.ts`
- `playwright.config.ts`
- `eslint.config.js`

## Executar localmente

### Requisitos

- Node.js 18+ (recomendado)
- npm

### Instalacao

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Servidor local configurado para:

- `http://localhost:7078`

### Build de producao

```bash
npm run build
```

O build gera ficheiros com hash e inclui `version.json` para detetar novas versoes automaticamente no browser.

Para usar Groq localmente, o site pede a chave no browser e guarda-a apenas em `localStorage`. O deploy publico continua a cair automaticamente para o modo estatico.

O site inclui duas copias assistidas por Groq: um Gerador IA e um Verificador IA. Ambas fazem fallback automatico para a logica local quando a API nao responde.

### Cache em producao

Para evitar hard refresh manual e manter o comportamento profissional de SaaS/sites modernos:

- `index.html` e `version.json` devem ser servidos com `no-cache` ou `no-store`.
- Os ficheiros dentro de `assets/` devem usar cache longa com `immutable`.
- O frontend verifica a versao publicada e recarrega automaticamente quando existe um deploy novo.

O repositório já inclui configuracao pronta para Netlify em `public/_headers` e para Vercel em `vercel.json`.

### Preview da build

```bash
npm run preview
```

### Testes

```bash
npm run test
```

## Estado atual da limpeza de dependencias

Foram removidas as referencias e dependencias da integracao anterior no projeto:

- plugin de tagger no Vite;
- imports/configuracoes Playwright de pacote externo especifico;
- dependencia de tagger de componentes usada na integracao anterior.

O projeto esta agora desacoplado dessa integracao.

## Publicacao no GitHub Pages

Este repositório está preparado para publicação em GitHub Pages no caminho `/focalipse/`.

Comandos de deploy:

```bash
npm install
npm run deploy
```

O script `deploy` compila a aplicação e publica a pasta `dist` com `gh-pages`.

## Licenciamento

- O código do site está sob licença MIT. Ver [LICENSE](LICENSE).
- O conteúdo conceptual e os textos explicativos do Focalipse estão sob CC BY 4.0. Ver [CONCEPT-LICENSE.txt](CONCEPT-LICENSE.txt).
- A atribuição obrigatória é: "Embora existissem insights prévios na literatura, a sistematização do Focalipse foi desenvolvida e definida por Filipe Lunfuankenda."

## Observacoes tecnicas

- Existe um `src/App.css` com conteudo de template Vite que nao esta a ser importado por `main.tsx`; pode ser removido se desejares reduzir ruido.
- A configuracao Playwright aponta para a pasta `tests/`. Se quiseres, posso acrescentar um exemplo E2E nessa pasta para validar fluxo real no browser.
