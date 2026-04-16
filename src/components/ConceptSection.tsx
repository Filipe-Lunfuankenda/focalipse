import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { motion } from 'framer-motion';

export function ConceptSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="concept" chapterNum={t.concept.chapterNum} title={t.concept.title}>
      <p className="font-body text-lg leading-relaxed text-foreground/90 mb-10">
        {t.concept.definition}
      </p>

      <div className="space-y-8">
        <div className="taxonomy-card border-l-4 border-l-primary">
          <h3 className="font-display text-xl font-bold text-foreground mb-3">{t.concept.formalTitle}</h3>
          <p className="font-body text-foreground/80 leading-relaxed">{t.concept.formalDef}</p>
        </div>

        <div className="taxonomy-card border-l-4 border-l-accent">
          <h3 className="font-display text-xl font-bold text-foreground mb-3">{t.concept.simpleTitle}</h3>
          <p className="font-body text-foreground/80 leading-relaxed mb-4">{t.concept.simpleDef}</p>
          <div className="literary-blockquote">
            {t.concept.simplestDef}
          </div>
        </div>
      </div>

      {/* Historical Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
        <h3 className="font-display text-2xl font-bold text-foreground mb-4">{t.concept.historyTitle}</h3>
        <p className="font-body text-foreground/80 leading-relaxed mb-8">{t.concept.historyIntro}</p>

        <div className="space-y-4">
          {t.concept.historyExamples.map((ex, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex gap-4 p-4 rounded-sm border border-border/50 bg-card/50"
            >
              <div className="shrink-0 w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center font-mono text-xs text-primary font-bold">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="font-display text-sm font-bold text-foreground">{ex.author}</span>
                  <span className="font-mono text-xs text-muted-foreground">{ex.work}</span>
                </div>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">{ex.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="font-body text-foreground/70 italic mt-6 border-l-2 border-primary/30 pl-4">
          {t.concept.historyConclusion}
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
