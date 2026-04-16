import { useCallback, useState } from 'react';
import { Check, Copy, RefreshCw, Sparkles, Bot } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { TYPE_STRUCTURES, generateFocalipse, type TypeIndex } from './GeneratorSection';
import { callGroqChat, loadFocalipseKnowledge, promptAndStoreGroqApiKey } from '@/lib/groq';

type GenerationSource = 'groq' | 'local' | null;

export function GroqGeneratorSection() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<TypeIndex>(0);
  const [selectedTheme, setSelectedTheme] = useState(t.generator.themes[0]?.name || 'war');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<GenerationSource>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const createLocalResult = useCallback(() => {
    const themeKey = selectedTheme;
    const macros = t.generator.macroElements[themeKey] || t.generator.macroElements[t.generator.themes[0]?.name] || [];
    const micros = t.generator.microElements[themeKey] || t.generator.microElements[t.generator.themes[0]?.name] || [];

    const generated = generateFocalipse(
      selectedType,
      themeKey,
      macros,
      micros,
      t.generator.connectors,
      t.generator.microConnectors,
    );

    setResult(generated);
    setSource('local');
    setStatus('Modo local activo');
  }, [selectedTheme, selectedType, t]);

  const generateWithGroq = useCallback(async () => {
    setLoading(true);
    setStatus('');

    try {
      const knowledge = await loadFocalipseKnowledge();
      const typeName = t.generator.typeNames[selectedType];
      const themeLabel = t.generator.themes.find((theme) => theme.name === selectedTheme)?.label || selectedTheme;
      const prompt = [
        `Cria um unico exemplo de Focalipse em portugues europeus`,
        `Tipo escolhido: ${typeName}`,
        `Tema escolhido: ${themeLabel}`,
        `Regras: uma unica frase, contraste de escala forte, detalhe concreto, sem explicacao meta, sem lista, sem aspas, sem markdown.`,
        `Contexto de referencia:\n${knowledge}`,
      ].join('\n');

      const response = await callGroqChat([
        {
          role: 'system',
          content: 'Tu es um especialista em Focalipse. Segue exatamente a formula narrativa e responde apenas com o texto final solicitado.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ], {
        temperature: 0.85,
        maxTokens: 180,
      });

      const generated = response.trim().replace(/^['"`]+|['"`]+$/g, '');
      setResult(generated);
      setSource('groq');
      setStatus('Gerado por Groq');
    } catch {
      const storedKey = promptAndStoreGroqApiKey();

      if (storedKey) {
        try {
          const knowledge = await loadFocalipseKnowledge();
          const typeName = t.generator.typeNames[selectedType];
          const themeLabel = t.generator.themes.find((theme) => theme.name === selectedTheme)?.label || selectedTheme;
          const prompt = [
            `Cria um unico exemplo de Focalipse em portugues europeus`,
            `Tipo escolhido: ${typeName}`,
            `Tema escolhido: ${themeLabel}`,
            `Regras: uma unica frase, contraste de escala forte, detalhe concreto, sem explicacao meta, sem lista, sem aspas, sem markdown.`,
            `Contexto de referencia:\n${knowledge}`,
          ].join('\n');

          const response = await callGroqChat([
            {
              role: 'system',
              content: 'Tu es um especialista em Focalipse. Segue exatamente a formula narrativa e responde apenas com o texto final solicitado.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ], {
            temperature: 0.85,
            maxTokens: 180,
          });

          const generated = response.trim().replace(/^['"`]+|['"`]+$/g, '');
          setResult(generated);
          setSource('groq');
          setStatus('Gerado por Groq');
          return;
        } catch {
          createLocalResult();
          return;
        }
      }

      createLocalResult();
    } finally {
      setLoading(false);
    }
  }, [createLocalResult, selectedTheme, selectedType, t.generator.themes, t.generator.typeNames]);

  const copyToClipboard = useCallback(() => {
    if (!result) return;

    navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const generateLabel = loading ? 'A gerar...' : 'Gerar com Groq';

  return (
    <SectionWrapper id="generator-groq" chapterNum={t.generator.chapterNum} title={`${t.generator.title} IA`}>
      <p className="font-body text-lg text-muted-foreground italic mb-4">
        Versão assistida por Groq com fallback local automático.
      </p>
      <p className="font-body text-foreground/80 leading-relaxed mb-10">
        Esta cópia usa o conhecimento do site para gerar Focalipses mais próximos da teoria original.
      </p>

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <label className="block font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">
            {t.generator.selectType}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {t.generator.typeNames.map((name, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedType(idx as TypeIndex)}
                className={`text-left px-3 py-2.5 rounded-sm border text-sm font-body transition-all duration-200 ${
                  selectedType === idx
                    ? 'border-primary bg-primary/10 text-foreground font-medium'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <span className="block text-xs font-mono text-accent mb-0.5">{String(idx + 1).padStart(2, '0')}</span>
                {name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs font-mono text-muted-foreground">
            {t.generator.structureLabel}: {TYPE_STRUCTURES[selectedType]}
          </p>
        </div>

        <div>
          <label className="block font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">
            {t.generator.selectTheme}
          </label>
          <div className="flex flex-wrap gap-2">
            {t.generator.themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setSelectedTheme(theme.name)}
                className={`px-4 py-2 rounded-sm border text-sm font-body transition-all duration-200 ${
                  selectedTheme === theme.name
                    ? 'border-primary bg-primary/10 text-foreground font-medium'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={generateWithGroq}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generateLabel}
          </button>
          <button
            onClick={createLocalResult}
            className="inline-flex items-center gap-2 px-8 py-3 border border-border text-foreground font-display text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-muted transition-colors duration-200"
          >
            <Bot size={16} />
            Gerar local
          </button>
        </div>

        {status && (
          <div className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {status}
          </div>
        )}

        {result && (
          <div className="relative">
            <div className="literary-blockquote text-lg leading-relaxed">
              <p className="font-body italic">{result}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-mono text-muted-foreground">
                {t.generator.typeNames[selectedType]} — {TYPE_STRUCTURES[selectedType]} — {source === 'groq' ? 'Groq' : 'Local'}
              </span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '✓' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
