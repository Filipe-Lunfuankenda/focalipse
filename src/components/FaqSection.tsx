import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="faq" chapterNum={t.faq.chapterNum} title={t.faq.title}>
      <p className="font-body text-lg text-muted-foreground italic mb-10 max-w-3xl mx-auto">
        {t.faq.subtitle}
      </p>

      <div className="max-w-3xl mx-auto">
        <Accordion type="multiple" className="space-y-2">
          {t.faq.items.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-border rounded-sm bg-card px-6 data-[state=open]:bg-secondary/30"
            >
              <AccordionTrigger className="font-display text-sm md:text-base font-semibold text-foreground text-left py-4 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm md:text-base text-muted-foreground leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
}
