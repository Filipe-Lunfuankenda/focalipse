import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function ManifestoSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="manifesto" chapterNum={t.manifesto.chapterNum} title={t.manifesto.title}>
      <p className="font-display text-2xl md:text-3xl italic text-foreground/70 mb-10">
        {t.manifesto.subtitle}
      </p>

      <div className="space-y-6 mb-12">
        {t.manifesto.text.map((paragraph, i) => (
          <p key={i} className="font-body text-lg leading-relaxed text-foreground/85">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="space-y-8 mb-12">
        {t.manifesto.principles.map((principle, i) => (
          <div key={i} className="taxonomy-card border-l-4 border-l-accent">
            <h3 className="font-display text-lg font-bold text-foreground mb-2">
              {i + 1}. {principle.name}
            </h3>
            <p className="font-body text-foreground/80 leading-relaxed">{principle.desc}</p>
          </div>
        ))}
      </div>

      <div className="literary-blockquote text-lg md:text-xl font-display">
        {t.manifesto.closing}
      </div>
    </SectionWrapper>
  );
}
