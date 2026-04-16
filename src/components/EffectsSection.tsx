import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function EffectsSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="effects" chapterNum={t.effects.chapterNum} title={t.effects.title}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.effects.items.map((item, i) => (
          <div key={i} className="taxonomy-card text-center">
            <span className="font-mono text-3xl font-bold text-accent/30 block mb-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.name}</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
