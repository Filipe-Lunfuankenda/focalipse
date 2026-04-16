import { Language, TranslationKeys } from '../types';
import { ptPT } from './pt-PT';
import { ptBR } from './pt-BR';
import { enUS } from './en-US';
import { enGB } from './en-GB';
import { fr } from './fr';
import { es } from './es';
import { de } from './de';
import { it } from './it';
import { nl } from './nl';
import { ru } from './ru';
import { ja } from './ja';
import { zh } from './zh';
import { ko } from './ko';
import { ar } from './ar';

const translations: Record<Language, TranslationKeys> = {
  'pt-PT': ptPT,
  'pt-BR': ptBR,
  'en-US': enUS,
  'en-GB': enGB,
  'fr': fr,
  'es': es,
  'de': de,
  'it': it,
  'nl': nl,
  'ru': ru,
  'ja': ja,
  'zh': zh,
  'ko': ko,
  'ar': ar,
};

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang] || enUS;
}
