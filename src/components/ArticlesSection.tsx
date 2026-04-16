import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function ArticlesSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="articles" chapterNum={t.articles.chapterNum} title={t.articles.title}>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 italic">
        {t.articles.articleTitle}
      </h3>

      <div className="space-y-6">
        {t.articles.articleContent.map((paragraph, i) => (
          <p key={i} className="font-body text-lg leading-relaxed text-foreground/85">
            {paragraph}
          </p>
        ))}
      </div>
    </SectionWrapper>
  );
}
