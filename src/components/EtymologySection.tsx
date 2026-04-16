import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function EtymologySection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="etymology" chapterNum={t.etymology.chapterNum} title={t.etymology.title}>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="taxonomy-card">
          <h3 className="font-display text-xl font-bold text-primary mb-3">{t.etymology.focus}</h3>
          <p className="font-body text-foreground/80 leading-relaxed">{t.etymology.focusDesc}</p>
        </div>
        <div className="taxonomy-card">
          <h3 className="font-display text-xl font-bold text-accent mb-3">{t.etymology.eclipse}</h3>
          <p className="font-body text-foreground/80 leading-relaxed">{t.etymology.eclipseDesc}</p>
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">{t.etymology.interpretation}</h3>
        <div className="literary-blockquote max-w-3xl mx-auto text-lg">
          {t.etymology.interpretationText}
        </div>
      </div>
    </SectionWrapper>
  );
}
