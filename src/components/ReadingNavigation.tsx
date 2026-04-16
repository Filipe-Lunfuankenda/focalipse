import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language, LANGUAGE_LABELS } from '@/i18n/types';

export function ReadingNavigation() {
  const { language, setLanguage, t } = useLanguage();
  const readingLinks = [
    { label: t.nav.manifesto, to: '/leituras/manifesto' },
    { label: t.nav.philosophy, to: '/leituras/philosophy' },
    { label: t.chekhov.title, to: '/leituras/chekhov' },
    { label: t.nav.articles, to: '/leituras/articles' },
    { label: t.differences.title, to: '/leituras/differences' },
    { label: t.nav.faq, to: '/leituras/faq' },
  ] as const;
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
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="font-display text-lg font-bold text-foreground tracking-wide">
            Focalipse
          </Link>

          <div className="flex items-center gap-2">
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
              className="language-selector text-xs sm:text-sm"
            >
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {readingLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs md:text-sm rounded-sm border transition-colors ${
                  isActive
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
