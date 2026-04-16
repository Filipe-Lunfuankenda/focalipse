import { Navigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { SEOHead } from '@/components/SEOHead';
import { ReadingNavigation } from '@/components/ReadingNavigation';
import { FooterSection } from '@/components/FooterSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { PhilosophySection } from '@/components/PhilosophySection';
import { ChekhovSection } from '@/components/ChekhovSection';
import { ArticlesSection } from '@/components/ArticlesSection';
import { DifferencesSection } from '@/components/DifferencesSection';
import { FaqSection } from '@/components/FaqSection';

const LONG_READ_COMPONENTS = {
  manifesto: ManifestoSection,
  philosophy: PhilosophySection,
  chekhov: ChekhovSection,
  articles: ArticlesSection,
  differences: DifferencesSection,
  faq: FaqSection,
} as const;

function getIntroText(slug: keyof typeof LONG_READ_COMPONENTS, isPt: boolean): string {
  if (isPt) {
    const pt = {
      manifesto: 'Página dedicada para leitura integral do manifesto do Focalipse, sem interrupções de scroll técnico.',
      philosophy: 'Página dedicada para aprofundar os princípios filosóficos e os limites estruturais do efeito.',
      chekhov: 'Página dedicada para análise comparada entre Focalipse, arma de Tchekhov e red herring.',
      articles: 'Página dedicada ao artigo editorial completo e interpretação crítica.',
      differences: 'Página dedicada ao quadro comparativo com outras técnicas narrativas.',
      faq: 'Página dedicada a dúvidas recorrentes e respostas extensas para estudo e docência.',
    } as const;

    return pt[slug];
  }

  const en = {
    manifesto: 'Dedicated page for full reading of the Focalipse manifesto without technical scroll interruptions.',
    philosophy: 'Dedicated page to dive deeper into the philosophical principles and structural limits of the effect.',
    chekhov: 'Dedicated page for comparative analysis between Focalipse, Chekhov\'s gun and red herring.',
    articles: 'Dedicated page for the complete editorial article and critical interpretation.',
    differences: 'Dedicated page for the comparative framework against other narrative techniques.',
    faq: 'Dedicated page for recurring questions and expanded answers for study and teaching.',
  } as const;

  return en[slug];
}

export function LongReadPage() {
  const { slug } = useParams<{ slug: keyof typeof LONG_READ_COMPONENTS }>();
  const { t, language } = useLanguage();

  if (!slug || !(slug in LONG_READ_COMPONENTS)) {
    return <Navigate to="/" replace />;
  }

  const CurrentSection = LONG_READ_COMPONENTS[slug];
  const isPt = language.startsWith('pt');

  const titleBySlug = {
    manifesto: t.manifesto.title,
    philosophy: t.philosophy.title,
    chekhov: t.chekhov.title,
    articles: t.articles.title,
    differences: t.differences.title,
    faq: t.faq.title,
  } as const;

  return (
    <>
      <SEOHead />
      <ReadingNavigation />
      <main className="pt-4 md:pt-6">
        <section className="px-4 pt-8">
          <div className="max-w-5xl mx-auto rounded-sm border border-border bg-card/70 p-6 md:p-8">
            <p className="chapter-number mb-2">{isPt ? 'Leitura Dedicada' : 'Dedicated Reading'}</p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">{titleBySlug[slug]}</h1>
            <p className="font-body text-foreground/75 leading-relaxed">{getIntroText(slug, isPt)}</p>
          </div>
        </section>

        <CurrentSection />
        <FooterSection />
      </main>
    </>
  );
}
