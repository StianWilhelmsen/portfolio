// src/app/components/navbar.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { getI18nClient } from '../../i18n/client';

const LOCALES = ['en', 'no'] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(x: string | undefined): x is Locale {
  return !!x && (LOCALES as readonly string[]).includes(x);
}

const SECTION_IDS = ['me', 'skills', 'experience', 'projects', 'contact'] as const;

export default function Navbar() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string>('me');

  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  // determine current locale from the URL
  const currentLocale: Locale = useMemo(() => {
    const p = pathname.split('/');
    return isLocale(p[1]) ? p[1] : 'en';
  }, [pathname]);

  // init i18n for current locale BEFORE calling useTranslation
  useEffect(() => {
    let alive = true;
    setReady(false);
    getI18nClient(currentLocale).finally(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [currentLocale]);

  // intersection observer: which section is in view
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => Boolean(n)
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // smooth scroll
  const onClick = (id: string, after?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    after?.();
  };

  // change locale (preserve path, query, hash)
  const changeLocale = async (lng: string) => {
    if (!isLocale(lng)) return;
    try {
      await getI18nClient(lng);
    } catch {}
    const parts = pathname.split('/');
    const hasLocale = isLocale(parts[1]);
    if (hasLocale) parts[1] = lng;
    else parts.splice(1, 0, lng);
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
  onClick: (id: string, after?: () => void) => (e: React.MouseEvent) => void;
  currentLocale: Locale;
  changeLocale: (lng: string) => void;
}) {
  const { t } = useTranslation('navbar');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-[var(--background)]/80 backdrop-blur dark:border-gray-800">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Language select */}
          <div className="flex items-center gap-2">
            <label htmlFor="lang" className="sr-only">
              Language
            </label>
            <select
              id="lang"
              value={currentLocale}
              onChange={(e) => changeLocale(e.target.value)}
              className="h-8 rounded-md border border-gray-300 bg-[var(--background)] px-2 text-sm text-[var(--foreground)] dark:border-gray-700"
            >
              <option value="en">EN</option>
              <option value="no">NO</option>
            </select>
          </div>

          {/* Center: Tabs (hidden on mobile) */}
          <ul className="hidden items-center gap-6 md:flex md:gap-8">
            {SECTION_IDS.map((id) => {
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
                        : 'text-[var(--foreground)]/70 hover:text-[var(--foreground)]',
                    ].join(' ')}
                  >
                    {t(`navbar.${id}`)}
                  </a>
                  <span
                    className={[
                      'absolute left-0 right-0 -bottom-3 h-[2px] rounded-full',
                      'bg-indigo-500 transition-all duration-300',
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
                    ].join(' ')}
                  />
                </li>
              );
            })}
          </ul>

          {/* Right: Theme + Hamburger (mobile only shows hamburger) */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-[var(--foreground)] hover:bg-black/5 dark:border-gray-700 dark:hover:bg-white/5 md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? 'Close' : 'Open'}</span>
              <div className="relative h-4 w-4">
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-full transform rounded bg-current transition ${
                    open ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-0.5 w-full transform rounded bg-current transition ${
                    open ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 block h-0.5 w-full transform rounded bg-current transition ${
                    open ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet menu */}
      <div
        className={[
          'fixed inset-x-0 top-14 z-40 border-b border-gray-200 bg-[var(--background)] shadow-lg transition-transform duration-300 dark:border-gray-800 md:hidden',
          open ? 'translate-y-0' : '-translate-y-full',
        ].join(' ')}
      >
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center justify-end">
            <ThemeToggle />
          </div>

          <ul className="flex flex-col gap-2">
            {SECTION_IDS.map((id) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={onClick(id, () => setOpen(false))}
                    className={[
                      'block rounded-lg px-3 py-2 text-base',
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-500'
                        : 'text-[var(--foreground)]/80 hover:bg-black/5 dark:hover:bg-white/5',
                    ].join(' ')}
                  >
                    {t(`navbar.${id}`)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
