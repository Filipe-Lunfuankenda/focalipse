import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTwo<T>(arr: T[]): [T, T] {
  const i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * (arr.length - 1));
  if (j >= i) j++;
  return [arr[i], arr[j]];
}

export type TypeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function generateFocalipse(
  type: TypeIndex,
  theme: string,
  macros: string[],
  micros: string[],
  connectors: string[],
  microConnectors: string[],
): string {
  const conn = () => pickRandom(connectors);
  const mConn = () => pickRandom(microConnectors);

  switch (type) {
    case 0: // Simple: Macro → Micro
      return `${pickRandom(macros)}, ${conn()} ${pickRandom(micros)}.`;
    case 1: { // Compound: Macro → Micro → Micro
      const [m1, m2] = pickTwo(micros);
      return `${pickRandom(macros)}, ${conn()} ${m1}, ${mConn()} ${m2}.`;
    }
    case 2: { // Chain: Macro → Micro → New Macro → New Micro
      const [ma1, ma2] = pickTwo(macros);
      const [mi1, mi2] = pickTwo(micros);
      return `${ma1}, ${conn()} ${mi1}, ${mConn()} ${ma2}, ${conn()} ${mi2}.`;
    }
    case 3: { // Progressive: Macro → Micro → even smaller micro
      const [m1, m2] = pickTwo(micros);
      return `${pickRandom(macros)}, ${conn()} ${m1}, ${mConn()} ${m2}.`;
    }
    case 4: // Inverted: Micro → Macro
      return `${pickRandom(micros)}, ${mConn()} ${pickRandom(macros)}.`;
    case 5: // Suspended: Macro → (Implicit Micro)
      return `${pickRandom(macros)}, ${conn()} ${pickRandom(micros).split(',')[0]}…`;
    case 6: { // Parallel: (Macro → Micro) × 2
      const [ma1, ma2] = pickTwo(macros);
      const [mi1, mi2] = pickTwo(micros);
      return `${ma1}, ${conn()} ${mi1}; ${ma2}, ${conn()} ${mi2}.`;
    }
    case 7: { // Recursive: Macro → Micro → (internal contrast)
      return `${pickRandom(macros)}, ${conn()} ${pickRandom(micros)}, ${mConn()} ${pickRandom(macros).toLowerCase()}.`;
    }
    default:
      return '';
  }
}

export const TYPE_STRUCTURES = [
  'Macro → Micro',
  'Macro → Micro → Micro',
  'Macro → Micro → Macro → Micro',
  'Macro → Micro → micro',
  'Micro → Macro',
  'Macro → (Micro…)',
  '(Macro → Micro) × 2',
  'Macro → Micro → (contraste)',
];

export function GeneratorSection() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<TypeIndex>(0);
  const [selectedTheme, setSelectedTheme] = useState(t.generator.themes[0]?.name || 'war');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const themeKey = selectedTheme;
    const macros = t.generator.macroElements[themeKey] || t.generator.macroElements[t.generator.themes[0]?.name] || [];
    const micros = t.generator.microElements[themeKey] || t.generator.microElements[t.generator.themes[0]?.name] || [];
    
    setResult(generateFocalipse(
      selectedType,
      themeKey,
      macros,
      micros,
      t.generator.connectors,
      t.generator.microConnectors,
    ));
  }, [selectedType, selectedTheme, t]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionWrapper id="generator" chapterNum={t.generator.chapterNum} title={t.generator.title}>
      <p className="font-body text-lg text-muted-foreground italic mb-10">{t.generator.subtitle}</p>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Type selector */}
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

        {/* Theme selector */}
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

        {/* Generate button */}
        <div className="flex justify-center">
          <button
            onClick={generate}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-200"
          >
            {result ? (
              <>
                <RefreshCw size={16} />
                {t.generator.regenerateBtn}
              </>
            ) : (
              <>
                <Sparkles size={16} />
                {t.generator.generateBtn}
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="literary-blockquote text-lg leading-relaxed">
                <p className="font-body italic">{result}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-mono text-muted-foreground">
                  {t.generator.typeNames[selectedType]} — {TYPE_STRUCTURES[selectedType]}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
