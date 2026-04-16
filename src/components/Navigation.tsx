import { useLanguage } from '@/i18n/LanguageContext';
import { Language, LANGUAGE_LABELS } from '@/i18n/types';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

const NAV_SECTIONS = [
  'etymology', 'concept', 'psychology', 'structure', 
  'taxonomy', 'examples', 'generator', 'verifier', 'manifesto', 'philosophy', 'articles', 'faq'
] as const;

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <a href="#" className="font-display text-lg md:text-xl font-bold text-foreground tracking-wide shrink-0 mr-6">
            Focalipse
          </a>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-4 min-w-0">
            {NAV_SECTIONS.map((section) => (
              <a key={section} href={`#${section}`} className="nav-link-literary whitespace-nowrap text-[0.65rem] 2xl:text-[0.7rem]">
                {t.nav[section as keyof typeof t.nav]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="language-selector text-xs max-w-[120px] sm:max-w-none sm:text-sm"
            >
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>

            <button
              className="xl:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="xl:hidden pb-4 border-t border-border pt-3 flex flex-col gap-2">
            {NAV_SECTIONS.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="nav-link-literary py-2"
                onClick={() => setMobileOpen(false)}
              >
                {t.nav[section as keyof typeof t.nav]}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
