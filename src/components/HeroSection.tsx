import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="max-w-4xl"
      >
        <p className="chapter-number mb-6">{t.hero.subtitle}</p>
        
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground tracking-tight mb-8 leading-none">
          Focalipse
        </h1>

        <div className="section-divider !my-8" />

        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 italic leading-relaxed">
          {t.hero.tagline}
        </p>

        <p className="text-sm text-primary font-medium tracking-widest uppercase">
          {t.hero.author}
        </p>
      </motion.div>

      <motion.a
        href="#etymology"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">{t.hero.scrollDown}</span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
