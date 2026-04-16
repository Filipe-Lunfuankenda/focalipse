import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/types';

const SEO_DATA: Record<Language, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  'pt-PT': {
    title: 'Focalipse — Uma Nova Figura de Estilo Narrativa | Filipe Lunfuankenda',
    description: 'O Focalipse é uma figura de estilo narrativa criada por Filipe Lunfuankenda. Transição abrupta entre o caos macroscópico e o micro-detalhe silencioso.',
    ogTitle: 'Focalipse — Uma Nova Figura de Estilo Narrativa',
    ogDescription: 'Quando o caos se apaga e só resta um detalhe — nasce o Focalipse. Criado por Filipe Lunfuankenda.',
  },
  'pt-BR': {
    title: 'Focalipse — Uma Nova Figura de Estilo Narrativa | Filipe Lunfuankenda',
    description: 'O Focalipse é uma figura de estilo narrativa criada por Filipe Lunfuankenda. Transição abrupta entre o caos macroscópico e o micro-detalhe silencioso.',
    ogTitle: 'Focalipse — Uma Nova Figura de Estilo Narrativa',
    ogDescription: 'Quando o caos se apaga e só resta um detalhe — nasce o Focalipse. Criado por Filipe Lunfuankenda.',
  },
  'en-US': {
    title: 'Focalipse — A New Narrative Figure of Speech | Filipe Lunfuankenda',
    description: 'Focalipse is a narrative figure of speech created by Filipe Lunfuankenda. An abrupt transition from macroscopic chaos to a silent micro-detail.',
    ogTitle: 'Focalipse — A New Narrative Figure of Speech',
    ogDescription: 'When chaos fades and only a detail remains — the Focalipse is born. Created by Filipe Lunfuankenda.',
  },
  'en-GB': {
    title: 'Focalipse — A New Narrative Figure of Speech | Filipe Lunfuankenda',
    description: 'Focalipse is a narrative figure of speech created by Filipe Lunfuankenda. An abrupt transition from macroscopic chaos to a silent micro-detail.',
    ogTitle: 'Focalipse — A New Narrative Figure of Speech',
    ogDescription: 'When chaos fades and only a detail remains — the Focalipse is born. Created by Filipe Lunfuankenda.',
  },
  'fr': {
    title: 'Focalipse — Une Nouvelle Figure de Style Narrative | Filipe Lunfuankenda',
    description: 'Le Focalipse est une figure de style narrative créée par Filipe Lunfuankenda. Transition abrupte entre le chaos macroscopique et le micro-détail silencieux.',
    ogTitle: 'Focalipse — Une Nouvelle Figure de Style Narrative',
    ogDescription: "Quand le chaos s'éteint et qu'il ne reste qu'un détail — naît le Focalipse. Créé par Filipe Lunfuankenda.",
  },
  'es': {
    title: 'Focalipse — Una Nueva Figura de Estilo Narrativa | Filipe Lunfuankenda',
    description: 'El Focalipse es una figura de estilo narrativa creada por Filipe Lunfuankenda. Transición abrupta entre el caos macroscópico y el micro-detalle silencioso.',
    ogTitle: 'Focalipse — Una Nueva Figura de Estilo Narrativa',
    ogDescription: 'Cuando el caos se apaga y solo queda un detalle — nace el Focalipse. Creado por Filipe Lunfuankenda.',
  },
  'de': {
    title: 'Focalipse — Eine Neue Narrative Stilfigur | Filipe Lunfuankenda',
    description: 'Die Focalipse ist eine narrative Stilfigur, geschaffen von Filipe Lunfuankenda. Abrupter Übergang vom makroskopischen Chaos zum stillen Mikro-Detail.',
    ogTitle: 'Focalipse — Eine Neue Narrative Stilfigur',
    ogDescription: 'Wenn das Chaos erlischt und nur ein Detail bleibt — entsteht der Focalipse. Von Filipe Lunfuankenda.',
  },
  'it': {
    title: 'Focalipse — Una Nuova Figura Retorica Narrativa | Filipe Lunfuankenda',
    description: "Il Focalipse è una figura retorica narrativa creata da Filipe Lunfuankenda. Transizione brusca dal caos macroscopico al micro-dettaglio silenzioso.",
    ogTitle: 'Focalipse — Una Nuova Figura Retorica Narrativa',
    ogDescription: 'Quando il caos si spegne e resta solo un dettaglio — nasce il Focalipse. Creato da Filipe Lunfuankenda.',
  },
  'nl': {
    title: 'Focalipse — Een Nieuw Narratief Stijlfiguur | Filipe Lunfuankenda',
    description: 'De Focalipse is een narratief stijlfiguur gecreëerd door Filipe Lunfuankenda. Abrupte overgang van macroscopische chaos naar een stil micro-detail.',
    ogTitle: 'Focalipse — Een Nieuw Narratief Stijlfiguur',
    ogDescription: 'Wanneer de chaos dooft en slechts één detail overblijft — ontstaat de Focalipse. Door Filipe Lunfuankenda.',
  },
  'ru': {
    title: 'Фокалипс — Новая Нарративная Стилистическая Фигура | Филипе Лунфуанкенда',
    description: 'Фокалипс — нарративная стилистическая фигура, созданная Филипе Лунфуанкенда. Резкий переход от макроскопического хаоса к тихой микро-детали.',
    ogTitle: 'Фокалипс — Новая Нарративная Стилистическая Фигура',
    ogDescription: 'Когда хаос гаснет и остаётся лишь одна деталь — рождается Фокалипс. Создано Филипе Лунфуанкенда.',
  },
  'ja': {
    title: 'フォカリプス — 新しい物語の修辞技法 | フィリペ・ルンフアンケンダ',
    description: 'フォカリプスはフィリペ・ルンフアンケンダが創作した物語の修辞技法。巨視的混沌から静かな微視的ディテールへの急激な転換。',
    ogTitle: 'フォカリプス — 新しい物語の修辞技法',
    ogDescription: '混沌が消え、ただ一つのディテールだけが残る時——フォカリプスが生まれる。フィリペ・ルンフアンケンダ創作。',
  },
  'zh': {
    title: '焦蚀 — 一种新的叙事修辞手法 | Filipe Lunfuankenda',
    description: '焦蚀是由 Filipe Lunfuankenda 创作的叙事修辞手法。从宏观混乱到静默微观细节的突然转换。',
    ogTitle: '焦蚀 — 一种新的叙事修辞手法',
    ogDescription: '当混乱消退，只剩一个细节——焦蚀诞生了。由 Filipe Lunfuankenda 创作。',
  },
  'ko': {
    title: '포칼립스 — 새로운 서사 수사법 | Filipe Lunfuankenda',
    description: '포칼립스는 Filipe Lunfuankenda가 창작한 서사 수사법입니다. 거시적 혼돈에서 조용한 미시적 디테일로의 급격한 전환.',
    ogTitle: '포칼립스 — 새로운 서사 수사법',
    ogDescription: '혼돈이 사라지고 오직 하나의 디테일만 남을 때 — 포칼립스가 탄생한다. Filipe Lunfuankenda 창작.',
  },
  'ar': {
    title: 'فوكاليبس — أسلوب بلاغي سردي جديد | فيليبي لونفوانكيندا',
    description: 'الفوكاليبس هو أسلوب بلاغي سردي ابتكره فيليبي لونفوانكيندا. انتقال مفاجئ من الفوضى الكلية إلى تفصيل صامت.',
    ogTitle: 'فوكاليبس — أسلوب بلاغي سردي جديد',
    ogDescription: 'عندما تنطفئ الفوضى ولا يبقى سوى تفصيل واحد — يولد الفوكاليبس. ابتكار فيليبي لونفوانكيندا.',
  },
};

export function SEOHead() {
  const { language } = useLanguage();
  const seo = SEO_DATA[language];

  useEffect(() => {
    // Title
    document.title = seo.title;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.description);

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.ogDescription);

    // Lang attribute
    document.documentElement.lang = language;

    // JSON-LD
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      jsonLd.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: seo.ogTitle,
        author: { '@type': 'Person', name: 'Filipe Lunfuankenda' },
        description: seo.description,
        inLanguage: language,
        keywords: 'Focalipse, figura de estilo, narrative device, literary technique, Filipe Lunfuankenda',
        publisher: { '@type': 'Person', name: 'Filipe Lunfuankenda' },
      });
    }
  }, [language, seo]);

  return null;
}
