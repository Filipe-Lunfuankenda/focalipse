import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';

export function DifferencesSection() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="differences" chapterNum={t.differences.chapterNum} title={t.differences.title}>
      <div className="overflow-x-auto mb-8">
        <table className="w-full font-body text-left">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="py-3 pr-4 font-display text-foreground">
                {t.differences.chapterNum === 'Capítulo XII' ? 'Recurso' : 'Device'}
              </th>
              <th className="py-3 font-display text-foreground">
                {t.differences.chapterNum === 'Capítulo XII' ? 'Diferença' : 'Difference'}
              </th>
            </tr>
          </thead>
          <tbody>
            {t.differences.items.map((item, i) => (
              <tr key={i} className="border-b border-border">
                <td className="py-3 pr-4 font-semibold text-primary">{item.resource}</td>
                <td className="py-3 text-foreground/80">{item.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">
          {t.differences.chapterNum === 'Capítulo XII' ? 'O Focalipse é único porque combina:' : 'The Focalipse is unique because it combines:'}
        </h3>
        <div className="flex flex-wrap gap-3">
          {t.differences.uniqueFeatures.map((f, i) => (
            <span key={i} className="structure-formula text-sm">{f}</span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
