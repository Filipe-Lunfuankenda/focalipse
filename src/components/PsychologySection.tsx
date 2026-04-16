import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function PsychologySection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="psychology" chapterNum={t.psychology.chapterNum} title={t.psychology.title}>
      <p className="font-body text-lg leading-relaxed text-foreground/90 mb-10">
        {t.psychology.intro}
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="taxonomy-card">
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-accent mb-4">
            {t.psychology.chapterNum === 'Capítulo III' ? 'Situações' : 'Situations'}
          </h4>
          <ul className="space-y-2">
            {t.psychology.situations.map((s, i) => (
              <li key={i} className="font-body text-foreground/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="taxonomy-card">
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-primary mb-4">
            {t.psychology.chapterNum === 'Capítulo III' ? 'O Cérebro' : 'The Brain'}
          </h4>
          <ul className="space-y-2">
            {t.psychology.brainReactions.map((r, i) => (
              <li key={i} className="font-body text-foreground/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="taxonomy-card">
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-gold mb-4">
            {t.psychology.resultTitle}
          </h4>
          <ul className="space-y-2">
            {t.psychology.perceptionResults.map((r, i) => (
              <li key={i} className="font-body text-foreground/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="literary-blockquote text-lg">
        {t.psychology.conclusion}
      </div>
    </SectionWrapper>
  );
}
