import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { motion } from 'framer-motion';

export function ExamplesSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="examples" chapterNum={t.examples.chapterNum} title={t.examples.title}>
      <div className="space-y-10">
        {t.examples.categories.map((cat, catIdx) => (
          <motion.div
            key={catIdx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: catIdx * 0.05 }}
          >
            <h3 className="font-display text-xl font-bold text-primary mb-4 flex items-center gap-3">
              <span className="font-mono text-xs text-accent tracking-widest">
                {String(catIdx + 1).padStart(2, '0')}
              </span>
              {cat.genre}
            </h3>
            <div className="space-y-4">
              {cat.examples.map((example, exIdx) => (
                <div key={exIdx} className="literary-blockquote">
                  {example}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
