import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { motion } from 'framer-motion';
import { Zap, Brain, Cloud, GitBranch } from 'lucide-react';

const TYPE_ICONS = [Brain, Zap, Cloud, GitBranch];

export function AdvancedTypesSection() {
  const { t } = useLanguage();
  const adv = t.advancedTypes;

  return (
    <SectionWrapper id="advanced-types" chapterNum={adv.chapterNum} title={adv.title}>
      <p className="font-body text-lg text-muted-foreground italic mb-4">{adv.subtitle}</p>
      <p className="font-body text-foreground/80 leading-relaxed mb-12">{adv.intro}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adv.types.map((type, idx) => {
          const Icon = TYPE_ICONS[idx] || Brain;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="taxonomy-card border-l-4 border-l-accent"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-sm bg-accent/10">
                  <Icon size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{type.name}</h3>
                  <span className="font-mono text-xs text-accent">{type.subtitle}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="font-display text-xs font-semibold text-foreground/60 uppercase tracking-wider">Objetivo</span>
                  <p className="font-body text-sm text-foreground/80 mt-1">{type.objective}</p>
                </div>
                <div>
                  <span className="font-display text-xs font-semibold text-foreground/60 uppercase tracking-wider">Mecanismo</span>
                  <p className="font-body text-sm text-foreground/80 mt-1">{type.mechanism}</p>
                </div>
              </div>

              <div className="literary-blockquote text-sm mb-3">{type.example}</div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-sm">{type.tacticalUse}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-body text-foreground/70 italic text-center mt-10 max-w-3xl mx-auto"
      >
        {adv.closing}
      </motion.p>
    </SectionWrapper>
  );
}
