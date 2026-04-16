import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function StructureSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="structure" chapterNum={t.structure.chapterNum} title={t.structure.title}>
      <div className="text-center mb-12">
        <div className="structure-formula text-base md:text-lg">
          {t.structure.formula}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="taxonomy-card border-t-4 border-t-accent">
          <h3 className="font-display text-xl font-bold text-accent mb-4">{t.structure.macroTitle}</h3>
          <ul className="space-y-3">
            {t.structure.macroItems.map((item, i) => (
              <li key={i} className="font-body text-foreground/80 flex items-center gap-3">
                <span className="text-accent font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="taxonomy-card border-t-4 border-t-primary">
          <h3 className="font-display text-xl font-bold text-primary mb-4">{t.structure.microTitle}</h3>
          <ul className="space-y-3">
            {t.structure.microItems.map((item, i) => (
              <li key={i} className="font-body text-foreground/80 flex items-center gap-3">
                <span className="text-primary font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
