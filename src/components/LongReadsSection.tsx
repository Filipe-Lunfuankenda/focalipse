import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

const DESCRIPTION_BY_SLUG: Record<string, { pt: string; en: string }> = {
  manifesto: {
    pt: 'Declaração completa da proposta estética e estrutural do Focalipse.',
    en: 'Full declaration of the Focalipse aesthetic and structural proposal.',
  },
  philosophy: {
    pt: 'Base filosófica da técnica e os seus limites narrativos.',
    en: 'Philosophical foundation of the technique and its narrative limits.',
  },
  chekhov: {
    pt: 'Comparação entre Focalipse, arma de Tchekhov e red herring.',
    en: 'Comparison between Focalipse, Chekhov\'s gun and red herring.',
  },
  articles: {
    pt: 'Artigo completo e análise editorial do efeito em contexto.',
    en: 'Complete article and editorial analysis of the effect in context.',
  },
  differences: {
    pt: 'Quadro comparativo com outras figuras e recursos literários.',
    en: 'Comparative framework against other literary figures and devices.',
  },
  faq: {
    pt: 'Perguntas e respostas detalhadas para estudo e ensino.',
    en: 'Detailed Q&A for study and teaching.',
  },
};

export function LongReadsSection() {
  const { t, language } = useLanguage();
  const isPt = language.startsWith('pt');

  const longReadLinks = [
    { slug: 'manifesto', chapterNum: t.manifesto.chapterNum, title: t.manifesto.title },
    { slug: 'philosophy', chapterNum: t.philosophy.chapterNum, title: t.philosophy.title },
    { slug: 'chekhov', chapterNum: t.chekhov.chapterNum, title: t.chekhov.title },
    { slug: 'articles', chapterNum: t.articles.chapterNum, title: t.articles.title },
    { slug: 'differences', chapterNum: t.differences.chapterNum, title: t.differences.title },
    { slug: 'faq', chapterNum: t.faq.chapterNum, title: t.faq.title },
  ];

  return (
    <SectionWrapper
      id="manifesto"
      chapterNum={isPt ? 'Capítulo Especial' : 'Special Chapter'}
      title={isPt ? 'Biblioteca de Leitura Aprofundada' : 'Deep Reading Library'}
    >
      <p className="font-body text-lg text-foreground/80 mb-8">
        {isPt
          ? 'As secções mais longas foram reorganizadas em páginas dedicadas para melhorar leitura, foco e navegação.'
          : 'Long-form sections were reorganized into dedicated pages for better reading focus and navigation.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {longReadLinks.map((item) => (
          <article key={item.slug} className="taxonomy-card border-l-4 border-l-primary/70">
            <p className="chapter-number mb-2">{item.chapterNum}</p>
            <h3 className="font-display text-xl text-foreground mb-3">{item.title}</h3>
            <p className="font-body text-foreground/75 mb-4">
              {isPt ? DESCRIPTION_BY_SLUG[item.slug].pt : DESCRIPTION_BY_SLUG[item.slug].en}
            </p>
            <Link
              to={`/leituras/${item.slug}`}
              className="inline-flex items-center px-3 py-2 rounded-sm border border-border text-sm font-semibold text-foreground hover:border-foreground/40 hover:bg-secondary/40 transition-colors"
            >
              {isPt ? 'Abrir página dedicada' : 'Open dedicated page'}
            </Link>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
