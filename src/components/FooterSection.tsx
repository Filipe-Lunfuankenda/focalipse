import { useLanguage } from '@/i18n/LanguageContext';
import { BookOpen, Newspaper, Github, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

// Custom SVG icons for Dev.to, Medium, Amazon
const DevToIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .67-.08.87-.25.21-.19.3-.49.3-.95v-1.9c0-.47-.11-.8-.33-.98zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.29 2.72 0 2.24-.04 2.37-.44 3.15zm4.93-1.98c0 1.07-.02 1.27-.26 1.68-.46.78-1.62.78-2.08 0-.24-.42-.26-.6-.26-1.68v-1.35c0-1.07.02-1.27.26-1.68.46-.78 1.62-.78 2.08 0 .24.42.26.6.26 1.68v1.35zm4.93-.06l-1.58-4.73h-1.38l2.2 6.41c.07.2.07.4.07.56v2.56h1.33v-2.56c0-.18 0-.36.07-.56l2.2-6.41h-1.38l-1.53 4.73z"/>
  </svg>
);

const MediumIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const AmazonIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.126.12.19.065.377-.169.558-.96.744-2.056 1.376-3.292 1.898a19.187 19.187 0 01-3.752 1.246 19.533 19.533 0 01-3.913.394c-4.139 0-7.77-1.17-10.899-3.503-.137-.1-.17-.2-.094-.33zm6.93-5.7c0-1.17.27-2.137.813-2.9.542-.762 1.26-1.143 2.153-1.143.86 0 1.54.343 2.04 1.03.498.684.748 1.572.748 2.664 0 1.108-.256 2.022-.77 2.74-.51.716-1.165 1.076-1.968 1.076-.85 0-1.54-.36-2.066-1.078-.525-.718-.788-1.64-.788-2.764l-.162-.625zm-1.476 0c0 1.58.468 2.858 1.404 3.835.936.976 2.15 1.465 3.643 1.465 1.56 0 2.78-.525 3.658-1.573.878-1.049 1.317-2.413 1.317-4.09 0-1.553-.44-2.82-1.317-3.8-.878-1.043-2.073-1.564-3.586-1.564-1.557 0-2.78.5-3.672 1.5-.892 1-.1447 2.33-1.447 3.85v.377z"/>
    <path d="M21.047 17.082c.158-.064.33-.132.518-.2.188-.07.298.02.33.27.03.25-.04.46-.22.64-.36.35-.89.71-1.59 1.09-.7.38-1.43.57-2.19.57-1.24 0-2.28-.41-3.11-1.22-.83-.81-1.24-1.83-1.24-3.06 0-1.3.46-2.39 1.37-3.27.91-.88 2.03-1.32 3.35-1.32 1.22 0 2.18.37 2.89 1.11.71.74 1.06 1.72 1.06 2.95 0 .28-.02.55-.06.8H15.89c.04.87.32 1.56.85 2.07.53.51 1.2.76 2.01.76.81 0 1.55-.27 2.3-.8v.01z"/>
  </svg>
);

const BookMarkedIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    <polyline points="10 2 10 10 13 7 16 10 16 2"/>
  </svg>
);

const SOCIAL_LINKS = [
  { href: 'https://github.com/Filipe-Lunfuankenda', icon: Github, label: 'GitHub', hoverColor: 'hover:text-[#333] dark:hover:text-[#f0f0f0]', hoverBorder: 'hover:border-[#333]/50 dark:hover:border-[#f0f0f0]/50' },
  { href: 'https://www.linkedin.com/in/filipe-lunfuankenda/', icon: Linkedin, label: 'LinkedIn', hoverColor: 'hover:text-[#0A66C2]', hoverBorder: 'hover:border-[#0A66C2]/50' },
  { href: 'https://www.facebook.com/filipe.lunfuankenda/', icon: Facebook, label: 'Facebook', hoverColor: 'hover:text-[#1877F2]', hoverBorder: 'hover:border-[#1877F2]/50' },
  { href: 'https://www.instagram.com/filipelanda7/', icon: Instagram, label: 'Instagram', hoverColor: 'hover:text-[#E4405F]', hoverBorder: 'hover:border-[#E4405F]/50' },
  { href: 'https://www.youtube.com/@filipelunfuankenda', icon: Youtube, label: 'YouTube', hoverColor: 'hover:text-[#FF0000]', hoverBorder: 'hover:border-[#FF0000]/50' },
  { href: 'https://dev.to/filipe_lunfuankenda', icon: DevToIcon, label: 'Dev.to', hoverColor: 'hover:text-[#0A0A0A] dark:hover:text-[#f0f0f0]', hoverBorder: 'hover:border-[#0A0A0A]/50 dark:hover:border-[#f0f0f0]/50' },
  { href: 'https://medium.com/@filipelunfuankenda', icon: MediumIcon, label: 'Medium', hoverColor: 'hover:text-[#000000] dark:hover:text-[#f0f0f0]', hoverBorder: 'hover:border-[#000000]/50 dark:hover:border-[#f0f0f0]/50' },
  { href: 'https://www.amazon.com/author/filipelunfuankenda', icon: AmazonIcon, label: 'Amazon Author', hoverColor: 'hover:text-[#FF9900]', hoverBorder: 'hover:border-[#FF9900]/50' },
];

const CTA_LABELS: Record<string, { newsletter: string; article: string; book: string }> = {
  'pt-PT': { newsletter: 'Newsletter no LinkedIn', article: 'Artigo no Medium', book: 'Livro na Amazon' },
  'pt-BR': { newsletter: 'Newsletter no LinkedIn', article: 'Artigo no Medium', book: 'Livro na Amazon' },
  'en-US': { newsletter: 'LinkedIn Newsletter', article: 'Article on Medium', book: 'Book on Amazon' },
  'en-GB': { newsletter: 'LinkedIn Newsletter', article: 'Article on Medium', book: 'Book on Amazon' },
  'fr': { newsletter: 'Newsletter LinkedIn', article: 'Article sur Medium', book: 'Livre sur Amazon' },
  'es': { newsletter: 'Newsletter en LinkedIn', article: 'Artículo en Medium', book: 'Libro en Amazon' },
  'de': { newsletter: 'LinkedIn Newsletter', article: 'Artikel auf Medium', book: 'Buch auf Amazon' },
  'it': { newsletter: 'Newsletter su LinkedIn', article: 'Articolo su Medium', book: 'Libro su Amazon' },
  'nl': { newsletter: 'LinkedIn Nieuwsbrief', article: 'Artikel op Medium', book: 'Boek op Amazon' },
  'ru': { newsletter: 'Рассылка LinkedIn', article: 'Статья на Medium', book: 'Книга на Amazon' },
  'ja': { newsletter: 'LinkedInニュースレター', article: 'Mediumの記事', book: 'Amazonの本' },
  'zh': { newsletter: 'LinkedIn通讯', article: 'Medium文章', book: 'Amazon书籍' },
  'ko': { newsletter: 'LinkedIn 뉴스레터', article: 'Medium 기사', book: 'Amazon 책' },
  'ar': { newsletter: 'نشرة LinkedIn', article: 'مقال على Medium', book: 'كتاب على Amazon' },
};

export function FooterSection() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();
  const cta = CTA_LABELS[language] || CTA_LABELS['en-US'];

  return (
    <footer className="py-16 px-4 border-t border-border bg-card">
      <div className="max-w-5xl mx-auto">
        {/* Brand */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Focalipse</h2>
          <div className="section-divider" />
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
          <a
            href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7449114057833406464"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-border bg-background hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/5 transition-all duration-300"
          >
            <Newspaper size={28} className="text-[#0A66C2] group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm font-semibold text-foreground text-center">{cta.newsletter}</span>
          </a>
          <a
            href="https://medium.com/@filipelunfuankenda/o-efeito-focalipse-como-manipular-o-tempo-e-o-caos-na-literatura-9d96f6ddb8ec"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-border bg-background hover:border-[#000]/30 hover:bg-[#000]/5 dark:hover:border-[#fff]/30 dark:hover:bg-[#fff]/5 transition-all duration-300"
          >
            <BookOpen size={28} className="text-foreground group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm font-semibold text-foreground text-center">{cta.article}</span>
          </a>
          <a
            href="https://a.co/d/0huiyizk"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-border bg-background hover:border-[#FF9900]/50 hover:bg-[#FF9900]/5 transition-all duration-300"
          >
            <BookMarkedIcon size={28} />
            <span className="font-display text-sm font-semibold text-foreground text-center">{cta.book}</span>
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-10">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label, hoverColor, hoverBorder }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-sm border border-border bg-background text-muted-foreground ${hoverColor} ${hoverBorder} hover:bg-primary/5 transition-all duration-200`}
              aria-label={label}
              title={label}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="font-body text-foreground/70 mb-2">{t.footer.copyright.replace('2025', String(year))}</p>
          <p className="font-body text-foreground/60 mb-1 text-sm">{t.footer.allRights}</p>
          <p className="font-body text-foreground/50 text-xs">{t.footer.concept}</p>
          <p className="font-body text-foreground/50 text-xs mt-2 max-w-2xl mx-auto">
            Embora existissem insights prévios na literatura, a sistematização do Focalipse foi desenvolvida por Filipe Lunfuankenda.
          </p>
        </div>
      </div>
    </footer>
  );
}
