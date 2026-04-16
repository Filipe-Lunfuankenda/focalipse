import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  id: string;
  chapterNum: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, chapterNum, title, children, className = '' }: Props) {
  return (
    <section id={id} className={`py-20 md:py-28 px-4 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="chapter-number mb-3">{chapterNum}</p>
          <h2 className="chapter-title mb-10">{title}</h2>
          <div className="section-divider !mx-0 !mb-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
