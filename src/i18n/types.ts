export type Language = 
  | 'pt-PT' | 'pt-BR' | 'en-US' | 'en-GB' 
  | 'fr' | 'es' | 'de' | 'it' | 'nl' | 'ru' | 'ja' | 'zh' | 'ko' | 'ar';

export const LANGUAGE_LABELS: Record<Language, string> = {
  'pt-PT': 'Português (Portugal)',
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'fr': 'Français',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'nl': 'Nederlands',
  'ru': 'Русский',
  'ja': '日本語',
  'zh': '中文',
  'ko': '한국어',
  'ar': 'العربية',
};

export type TranslationKeys = {
  nav: {
    etymology: string;
    concept: string;
    psychology: string;
    structure: string;
    taxonomy: string;
    examples: string;
    generator: string;
    manifesto: string;
    philosophy: string;
    articles: string;
    faq: string;
    verifier: string;
  };
  generator: {
    chapterNum: string;
    title: string;
    subtitle: string;
    selectType: string;
    selectTheme: string;
    generateBtn: string;
    regenerateBtn: string;
    resultTitle: string;
    structureLabel: string;
    typeNames: string[];
    themes: Array<{ name: string; label: string }>;
    macroElements: Record<string, string[]>;
    microElements: Record<string, string[]>;
    connectors: string[];
    microConnectors: string[];
  };
  hero: {
    subtitle: string;
    tagline: string;
    author: string;
    scrollDown: string;
  };
  etymology: {
    chapterNum: string;
    title: string;
    focus: string;
    focusDesc: string;
    eclipse: string;
    eclipseDesc: string;
    interpretation: string;
    interpretationText: string;
  };
  concept: {
    chapterNum: string;
    title: string;
    definition: string;
    formalTitle: string;
    formalDef: string;
    simpleTitle: string;
    simpleDef: string;
    simplestDef: string;
    historyTitle: string;
    historyIntro: string;
    historyExamples: Array<{ author: string; work: string; desc: string }>;
    historyConclusion: string;
  };
  advancedTypes: {
    chapterNum: string;
    title: string;
    subtitle: string;
    intro: string;
    types: Array<{
      name: string;
      subtitle: string;
      objective: string;
      mechanism: string;
      example: string;
      tacticalUse: string;
    }>;
    closing: string;
  };
  psychology: {
    chapterNum: string;
    title: string;
    intro: string;
    situations: string[];
    brainReactions: string[];
    resultTitle: string;
    perceptionResults: string[];
    conclusion: string;
  };
  structure: {
    chapterNum: string;
    title: string;
    formula: string;
    macroTitle: string;
    macroItems: string[];
    microTitle: string;
    microItems: string[];
  };
  taxonomy: {
    chapterNum: string;
    title: string;
    subtitle: string;
    types: Array<{
      name: string;
      structure: string;
      definition: string;
      effect: string[];
      example: string;
    }>;
  };
  effects: {
    chapterNum: string;
    title: string;
    items: Array<{ name: string; desc: string }>;
  };
  manifesto: {
    chapterNum: string;
    title: string;
    subtitle: string;
    text: string[];
    principles: Array<{ name: string; desc: string }>;
    closing: string;
  };
  philosophy: {
    chapterNum: string;
    title: string;
    subtitle: string;
    statement: string;
    principles: Array<{ name: string; desc: string }>;
    structuralLimit: string;
    synthesis: string;
  };
  chekhov: {
    chapterNum: string;
    title: string;
    intro: string;
    gunTitle: string;
    gunDesc: string;
    redHerringTitle: string;
    redHerringDesc: string;
    combinationTitle: string;
    combinationDesc: string;
  };
  articles: {
    chapterNum: string;
    title: string;
    articleTitle: string;
    articleContent: string[];
  };
  examples: {
    chapterNum: string;
    title: string;
    categories: Array<{
      genre: string;
      examples: string[];
    }>;
  };
  differences: {
    chapterNum: string;
    title: string;
    items: Array<{ resource: string; difference: string }>;
    uniqueFeatures: string[];
  };
  faq: {
    chapterNum: string;
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  verifier: {
    chapterNum: string;
    title: string;
    subtitle: string;
    placeholder: string;
    analyzeBtn: string;
    clearBtn: string;
    resultTitle: string;
    isFocalipse: string;
    almostFocalipse: string;
    notFocalipse: string;
    detectedType: string;
    confidence: string;
    hasMacro: string;
    hasMicro: string;
    hasConnector: string;
    hasAbruptTransition: string;
    hasScaleContrast: string;
    missingElements: string;
    suggestions: string;
    yes: string;
    no: string;
    high: string;
    medium: string;
    low: string;
    tipMacro: string;
    tipMicro: string;
    tipConnector: string;
    tipContrast: string;
    tipTransition: string;
  };
  footer: {
    copyright: string;
    allRights: string;
    concept: string;
  };
};
