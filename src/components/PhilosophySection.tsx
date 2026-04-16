import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function PhilosophySection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="philosophy" chapterNum={t.philosophy.chapterNum} title={t.philosophy.title}>
      <p className="font-display text-xl italic text-foreground/70 mb-8">{t.philosophy.subtitle}</p>

      <div className="literary-blockquote text-lg mb-10">
        {t.philosophy.statement}
      </div>

      <div className="space-y-6 mb-10">
        {t.philosophy.principles.map((p, i) => (
          <div key={i} className="taxonomy-card">
            <h3 className="font-display text-lg font-bold text-primary mb-2">{p.name}</h3>
            <p className="font-body text-foreground/80 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="taxonomy-card border-l-4 border-l-gold mb-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          {t.philosophy.chapterNum === 'Capítulo VIII' ? 'Limite Estrutural' : 'Structural Limit'}
        </h3>
        <p className="font-body text-foreground/80 leading-relaxed">{t.philosophy.structuralLimit}</p>
      </div>

      <div className="literary-blockquote text-base">
        {t.philosophy.synthesis}
      </div>
    </SectionWrapper>
  );
}
