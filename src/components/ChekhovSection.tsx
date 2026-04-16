import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function ChekhovSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="chekhov" chapterNum={t.chekhov.chapterNum} title={t.chekhov.title}>
      <p className="font-body text-lg text-foreground/85 leading-relaxed mb-10">
        {t.chekhov.intro}
      </p>

      <div className="space-y-8">
        <div className="taxonomy-card border-l-4 border-l-primary">
          <h3 className="font-display text-xl font-bold text-foreground mb-3">{t.chekhov.gunTitle}</h3>
          <p className="font-body text-foreground/80 leading-relaxed">{t.chekhov.gunDesc}</p>
        </div>

        <div className="taxonomy-card border-l-4 border-l-accent">
          <h3 className="font-display text-xl font-bold text-foreground mb-3">{t.chekhov.redHerringTitle}</h3>
          <p className="font-body text-foreground/80 leading-relaxed">{t.chekhov.redHerringDesc}</p>
        </div>

        <div className="taxonomy-card border-l-4 border-l-gold">
          <h3 className="font-display text-xl font-bold text-foreground mb-3">{t.chekhov.combinationTitle}</h3>
          <p className="font-body text-foreground/80 leading-relaxed">{t.chekhov.combinationDesc}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
