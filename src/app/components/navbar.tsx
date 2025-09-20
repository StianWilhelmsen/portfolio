'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { getI18nClient } from '../../i18n/client';

const LOCALES = ['en', 'no'] as const;
const SECTION_IDS = ['me', 'skills', 'experience', 'projects', 'contact'] as const;

export default function Navbar() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string>('me');

  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  // determine current locale from the URL
  const currentLocale = useMemo(() => {
    const p = pathname.split('/');
    return (LOCALES as readonly string[]).includes(p[1]) ? (p[1] as (typeof LOCALES)[number]) : 'en';
  }, [pathname]);

  // init i18n for current locale BEFORE calling useTranslation
  useEffect(() => {
    let alive = true;
    setReady(false);
    getI18nClient(currentLocale).finally(() => alive && setReady(true));
    return () => { alive = false; };
  }, [currentLocale]);

  // intersection observer: which section is in view
  useEffect(() => {
    const els = SECTION_IDS.map(id => document.getElementById(id)).filter(
      (n): n is HTMLElement => Boolean(n)
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // smooth scroll
  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // change locale (preserve path, query, hash)
  const changeLocale = async (lng: string) => {
    try { await getI18nClient(lng); } catch {}
    const parts = pathname.split('/');
    const hasLocale = (LOCALES as readonly string[]).includes(parts[1]);
    if (hasLocale) parts[1] = lng; else parts.splice(1, 0, lng);
    const newPath = parts.join('/') || `/${lng}`;
    const qs = searchParams?.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    router.replace(qs ? `${newPath}?${qs}${hash}` : `${newPath}${hash}`);
  };

  if (!ready) return null; // or a small skeleton bar

  return (
    <NavbarInner
      active={active}
      onClick={onClick}
      currentLocale={currentLocale}
      changeLocale={changeLocale}
    />
  );
}

function NavbarInner({
  active,
  onClick,
  currentLocale,
  changeLocale,
}: {
  active: string;
  onClick: (id: string) => (e: React.MouseEvent) => void;
  currentLocale: 'en' | 'no';
  changeLocale: (lng: string) => void;
}) {
  // Safe to use now—i18n is initialized
  const { t } = useTranslation('navbar');

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Left: Language */}
          <div className="flex items-center gap-2">
            <label htmlFor="lang" className="sr-only">Language</label>
            <select
              id="lang"
              value={currentLocale}
              onChange={(e) => changeLocale(e.target.value as 'en' | 'no')}
              className="h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-[var(--background)] text-[var(--foreground)] px-2 text-sm"
            >
              <option value="en">EN</option>
              <option value="no">NO</option>
            </select>
          </div>

          {/* Center: Tabs */}
          <ul className="flex items-center gap-6 md:gap-8">
            {SECTION_IDS.map(id => {
              const isActive = active === id;
              return (
                <li key={id} className="relative">
                  <a
                    href={`#${id}`}
                    onClick={onClick(id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'text-sm md:text-base transition-colors',
                      isActive
                        ? 'text-[var(--foreground)]'
                        : 'text-[var(--foreground)]/70 hover:text-[var(--foreground)]'
                    ].join(' ')}
                  >
                    {t(`navbar.${id}`)}
                  </a>
                  <span
                    className={[
                      'absolute left-0 right-0 -bottom-3 h-[2px] rounded-full',
                      'bg-indigo-500 transition-all duration-300',
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    ].join(' ')}
                  />
                </li>
              );
            })}
          </ul>

          {/* Right: Theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
