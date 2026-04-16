import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { motion } from 'framer-motion';

export function TaxonomySection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="taxonomy" chapterNum={t.taxonomy.chapterNum} title={t.taxonomy.title}>
      <p className="font-body text-lg text-muted-foreground italic mb-12">{t.taxonomy.subtitle}</p>

      <div className="space-y-8">
        {t.taxonomy.types.map((type, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="taxonomy-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
              <span className="font-mono text-xs text-accent tracking-widest">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                {type.name}
              </h3>
            </div>

            <div className="structure-formula mb-4">{type.structure}</div>

            <p className="font-body text-foreground/80 leading-relaxed mb-4">{type.definition}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {type.effect.map((e, i) => (
                <span key={i} className="text-xs font-mono bg-secondary text-secondary-foreground px-3 py-1 rounded-sm">
                  {e}
                </span>
              ))}
            </div>

            <div className="literary-blockquote text-base">
              {type.example}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
