import { useCallback, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, RefreshCcw, Search, Sparkles, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { analyzeFocalipse, EXAMPLE_TEXTS, TYPE_NAMES, type AnalysisResult } from './VerifierSection';
import { callGroqChat, loadFocalipseKnowledge, promptAndStoreGroqApiKey, safeParseJson } from '@/lib/groq';

const AI_EXAMPLE_FALLBACK = 'As sirenes gritavam na rua, e uma formiga caminhava sobre a borda de uma chávena partida.';

type AiAnalysisResult = AnalysisResult & {
  reasoning: string;
  source: 'groq' | 'local';
};

type GroqAnalysisPayload = Partial<AnalysisResult> & {
  reasoning?: string;
  explanation?: string;
};

function CheckRow({ label, value, yes, no }: { label: string; value: boolean; yes: string; no: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="font-body text-sm text-foreground">{label}</span>
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${value ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        {value ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
        {value ? yes : no}
      </span>
    </div>
  );
}

function normalizeAnalysis(payload: GroqAnalysisPayload | null, fallback: AnalysisResult): AiAnalysisResult {
  if (!payload) {
    return {
      ...fallback,
      reasoning: 'Análise local de fallback.',
      source: 'local',
    };
  }

  const verdict = payload.verdict === 'is' || payload.verdict === 'almost' || payload.verdict === 'not'
    ? payload.verdict
    : fallback.verdict;
  const confidence = payload.confidence === 'high' || payload.confidence === 'medium' || payload.confidence === 'low'
    ? payload.confidence
    : fallback.confidence;

  return {
    ...fallback,
    verdict,
    confidence,
    hasMacro: typeof payload.hasMacro === 'boolean' ? payload.hasMacro : fallback.hasMacro,
    hasMicro: typeof payload.hasMicro === 'boolean' ? payload.hasMicro : fallback.hasMicro,
    hasConnector: typeof payload.hasConnector === 'boolean' ? payload.hasConnector : fallback.hasConnector,
    hasAbruptTransition: typeof payload.hasAbruptTransition === 'boolean' ? payload.hasAbruptTransition : fallback.hasAbruptTransition,
    hasScaleContrast: typeof payload.hasScaleContrast === 'boolean' ? payload.hasScaleContrast : fallback.hasScaleContrast,
    detectedType: typeof payload.detectedType === 'string' || payload.detectedType === null ? payload.detectedType : fallback.detectedType,
    missingTips: Array.isArray(payload.missingTips) ? payload.missingTips.filter((tip): tip is string => typeof tip === 'string') : fallback.missingTips,
    score: typeof payload.score === 'number' ? payload.score : fallback.score,
    reasoning: payload.reasoning || payload.explanation || 'Análise Groq sem explicação detalhada.',
    source: 'groq',
  };
}

export function GroqVerifierSection() {
  const { t, language } = useLanguage();
  const [text, setText] = useState('');
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const analyzeLocal = useCallback(() => {
    if (text.trim().length < 10) return;
    const fallback = analyzeFocalipse(text);
    setResult({
      ...fallback,
      reasoning: 'Análise local heurística de fallback.',
      source: 'local',
    });
    setStatus('Modo local activo');
  }, [text]);

  const analyzeWithGroq = useCallback(async () => {
    if (text.trim().length < 10) return;

    setLoading(true);
    setStatus('');

    try {
      const knowledge = await loadFocalipseKnowledge();
      const fallback = analyzeFocalipse(text);
      const prompt = [
        'Analisa o texto seguinte segundo a teoria do Focalipse.',
        'Responde apenas com JSON valido, sem markdown, sem blocos de codigo e sem texto extra.',
        'Chaves obrigatorias: verdict, confidence, hasMacro, hasMicro, hasConnector, hasAbruptTransition, hasScaleContrast, detectedType, missingTips, score, reasoning.',
        'verdict deve ser is, almost ou not.',
        'confidence deve ser high, medium ou low.',
        'detectedType deve ser um dos tipos canonicos em portugues: Simples, Composto, Encadeado, Progressivo, Invertido, Suspenso, Paralelo, Recursivo, ou null.',
        'score deve ser um numero entre 0 e 5.',
        'missingTips deve ser um array de strings curtas com os elementos que faltam.',
        'knowledge:\n' + knowledge,
        'texto:\n' + text,
      ].join('\n');

      const response = await callGroqChat([
        {
          role: 'system',
          content: 'Tu es um verificador especialista em Focalipse. Segue a teoria do site, devolve JSON exacto e nao inventes elementos ausentes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ], {
        temperature: 0.15,
        maxTokens: 320,
      });

      const parsed = safeParseJson<GroqAnalysisPayload>(response);
      setResult(normalizeAnalysis(parsed, fallback));
      setStatus('Análise Groq concluída');
    } catch {
      const storedKey = promptAndStoreGroqApiKey();

      if (storedKey) {
        try {
          const knowledge = await loadFocalipseKnowledge();
          const fallback = analyzeFocalipse(text);
          const prompt = [
            'Analisa o texto seguinte segundo a teoria do Focalipse.',
            'Responde apenas com JSON valido, sem markdown, sem blocos de codigo e sem texto extra.',
            'Chaves obrigatorias: verdict, confidence, hasMacro, hasMicro, hasConnector, hasAbruptTransition, hasScaleContrast, detectedType, missingTips, score, reasoning.',
            'verdict deve ser is, almost ou not.',
            'confidence deve ser high, medium ou low.',
            'detectedType deve ser um dos tipos canonicos em portugues: Simples, Composto, Encadeado, Progressivo, Invertido, Suspenso, Paralelo, Recursivo, ou null.',
            'score deve ser um numero entre 0 e 5.',
            'missingTips deve ser um array de strings curtas com os elementos que faltam.',
            'knowledge:\n' + knowledge,
            'texto:\n' + text,
          ].join('\n');

          const response = await callGroqChat([
            {
              role: 'system',
              content: 'Tu es um verificador especialista em Focalipse. Segue a teoria do site, devolve JSON exacto e nao inventes elementos ausentes.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ], {
            temperature: 0.15,
            maxTokens: 320,
          });

          const parsed = safeParseJson<GroqAnalysisPayload>(response);
          setResult(normalizeAnalysis(parsed, fallback));
          setStatus('Análise Groq concluída');
          return;
        } catch {
          analyzeLocal();
          return;
        }
      }

      analyzeLocal();
    } finally {
      setLoading(false);
    }
  }, [analyzeLocal, text]);

  const clear = useCallback(() => {
    setText('');
    setResult(null);
    setStatus('');
  }, []);

  const tryExample = useCallback(() => {
    const examples = EXAMPLE_TEXTS[language] || EXAMPLE_TEXTS['en-US'];
    const randomExample = examples[Math.floor(Math.random() * examples.length)] || AI_EXAMPLE_FALLBACK;
    setText(randomExample);
    setResult(null);
    setStatus('');
  }, [language]);

  const verdictIcon = result?.verdict === 'is'
    ? <CheckCircle2 size={24} className="text-green-500" />
    : result?.verdict === 'almost'
    ? <AlertTriangle size={24} className="text-yellow-500" />
    : <XCircle size={24} className="text-red-500" />;

  const verdictText = result?.verdict === 'is' ? t.verifier.isFocalipse
    : result?.verdict === 'almost' ? t.verifier.almostFocalipse
    : t.verifier.notFocalipse;

  const verdictBg = result?.verdict === 'is'
    ? 'bg-green-500/10 border-green-500/30'
    : result?.verdict === 'almost'
    ? 'bg-yellow-500/10 border-yellow-500/30'
    : 'bg-red-500/10 border-red-500/30';

  const confidenceLabel = result?.confidence === 'high' ? t.verifier.high
    : result?.confidence === 'medium' ? t.verifier.medium : t.verifier.low;

  const typeNames = TYPE_NAMES[language] || TYPE_NAMES['en-US'];
  const tryExampleLabel = language.startsWith('pt') ? 'Experimentar Exemplo'
    : language === 'fr' ? 'Essayer un Exemple'
    : language === 'es' ? 'Probar Ejemplo'
    : language === 'de' ? 'Beispiel testen'
    : language === 'it' ? 'Provare Esempio'
    : language === 'nl' ? 'Voorbeeld proberen'
    : language === 'ru' ? 'Попробовать пример'
    : language === 'ja' ? '例を試す'
    : language === 'zh' ? '试试例子'
    : language === 'ko' ? '예제 시도'
    : language === 'ar' ? 'جرب مثالاً'
    : 'Try Example';

  return (
    <SectionWrapper id="verifier-groq" chapterNum={t.verifier.chapterNum} title={`${t.verifier.title} IA`}>
      <p className="font-body text-lg text-muted-foreground italic mb-10">
        Versão assistida por Groq com fallback heurístico local.
      </p>

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.verifier.placeholder}
            rows={5}
            className="w-full rounded-sm border border-border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y transition-colors duration-200"
          />
        </div>

        <div className="flex items-center gap-3 justify-center flex-wrap">
          <button
            onClick={analyzeWithGroq}
            disabled={loading || text.trim().length < 10}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-primary-foreground font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <RefreshCcw size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? 'A analisar...' : 'Analisar com Groq'}
          </button>
          <button
            onClick={tryExample}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border border-primary/30 text-primary font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-primary/10 transition-colors duration-200"
          >
            <Sparkles size={16} />
            {tryExampleLabel}
          </button>
          <button
            onClick={analyzeLocal}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border border-border text-foreground font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-muted transition-colors duration-200"
          >
            <Bot size={16} />
            Analisar local
          </button>
          {(text || result) && (
            <button
              onClick={clear}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border border-border text-foreground font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-muted transition-colors duration-200"
            >
              <RefreshCcw size={16} />
              {t.verifier.clearBtn}
            </button>
          )}
        </div>

        {status && (
          <div className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {status}
          </div>
        )}

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={JSON.stringify(result)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className={`rounded-sm border p-4 sm:p-6 ${verdictBg}`}>
                <div className="flex items-center gap-3 mb-2">
                  {verdictIcon}
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground">{verdictText}</h3>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm font-body text-muted-foreground flex-wrap">
                  <span>{t.verifier.confidence}: <strong className="text-foreground">{confidenceLabel}</strong></span>
                  {result.detectedType && (
                    <span>{t.verifier.detectedType}: <strong className="text-foreground">{typeNames[result.detectedType] || result.detectedType}</strong></span>
                  )}
                  <span>Score: <strong className="text-foreground">{result.score}/5</strong></span>
                  <span className="text-primary font-semibold">{result.source === 'groq' ? 'Groq' : 'Local'}</span>
                </div>
              </div>

              {result.reasoning && (
                <div className="rounded-sm border border-border bg-card p-4 sm:p-5">
                  <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">Explicação</h4>
                  <p className="font-body text-sm leading-relaxed text-foreground/80">{result.reasoning}</p>
                </div>
              )}

              <div className="rounded-sm border border-border bg-card p-4 sm:p-5">
                <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">{t.verifier.resultTitle}</h4>
                <CheckRow label={t.verifier.hasMacro} value={result.hasMacro} yes={t.verifier.yes} no={t.verifier.no} />
                <CheckRow label={t.verifier.hasMicro} value={result.hasMicro} yes={t.verifier.yes} no={t.verifier.no} />
                <CheckRow label={t.verifier.hasConnector} value={result.hasConnector} yes={t.verifier.yes} no={t.verifier.no} />
                <CheckRow label={t.verifier.hasAbruptTransition} value={result.hasAbruptTransition} yes={t.verifier.yes} no={t.verifier.no} />
                <CheckRow label={t.verifier.hasScaleContrast} value={result.hasScaleContrast} yes={t.verifier.yes} no={t.verifier.no} />
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">Score</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(result.score / 5) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          result.score >= 4 ? 'bg-green-500' : result.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-mono text-foreground font-bold">{result.score}/5</span>
                  </div>
                </div>
              </div>

              {result.missingTips.length > 0 && result.verdict !== 'is' && (
                <div className="rounded-sm border border-border bg-card p-4 sm:p-5">
                  <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">{t.verifier.suggestions}</h4>
                  <ul className="space-y-2">
                    {result.missingTips.map((tipKey, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span>
                        {t.verifier[tipKey as keyof typeof t.verifier] as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
