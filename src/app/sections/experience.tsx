'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getI18nClient } from '../../i18n/client';

type Kind = 'work' | 'edu';

type Item = {
  type: Kind;
  title: string;
  company: string;
  location?: string;
  date: string;
  highlights: string[];
  tech: string[];
};

type CardProps = {
  item: Item;
  showMoreLabel: string;
  showLessLabel: string;
};

export default function ExperienceSection({ lng }: { lng: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getI18nClient(lng).then(() => setReady(true));
  }, [lng]);

  if (!ready) return null;

  return <ExperienceSectionInner key={lng} />;
}

function ExperienceSectionInner() {
  const { t } = useTranslation('experience');

  const items = t('items', { returnObjects: true }) as Item[];
  const [tab, setTab] = useState<Kind>('work');

  const visible = useMemo(() => items.filter((i) => i.type === tab), [items, tab]);

  return (
    <section id="experience" className="mx-auto my-16 w-full max-w-3xl px-4">
      <div className="mx-auto mb-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('title')}</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t('subtitle')}</p>
      </div>

      {/* Tabs */}
      <div
        className="
          mx-auto mb-8 flex w-full max-w-md items-center justify-center gap-2 rounded-xl border p-1
          border-zinc-200 bg-white/70
          dark:border-zinc-800 dark:bg-zinc-950/50
        "
      >
        <button
          onClick={() => setTab('work')}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm transition ${
            tab === 'work'
              ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          {t('work')}
        </button>
        <button
          onClick={() => setTab('edu')}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm transition ${
            tab === 'edu'
              ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          {t('education')}
        </button>
      </div>

      {/* Single-column timeline */}
      <ol className="relative border-l border-zinc-200 pl-6 dark:border-zinc-800/70">
        {visible.map((item, idx) => (
          <li key={idx} className="mb-8 ml-6">
            <span className="absolute -left-[22px] top-1">
              <TimelineDot kind={item.type} />
            </span>
            <Card
              item={item}
              showMoreLabel={t('showMore', { defaultValue: 'Show more' })}
              showLessLabel={t('showLess', { defaultValue: 'Show less' })}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        rounded-full border px-2 py-0.5 text-xs
        border-zinc-300 text-zinc-700
        dark:border-zinc-800/70 dark:text-zinc-300
      "
    >
      {children}
    </span>
  );
}

function TimelineDot({ kind }: { kind: Kind }) {
  const label = kind === 'work' ? 'W' : 'E';
  return (
    <div
      className="
        flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold shadow
        border-zinc-300 bg-white text-zinc-700
        dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200
      "
    >
      {label}
    </div>
  );
}

function Card({ item, showMoreLabel, showLessLabel }: CardProps) {
  const [expanded, setExpanded] = useState(false);

  const shownHighlights = expanded ? item.highlights : item.highlights.slice(0, 2);
  const hasMore = item.highlights.length > 2;

  const shownTech = item.tech.slice(0, 4);
  const restCount = Math.max(0, item.tech.length - 4);

  return (
    <div
      className="
        rounded-2xl border p-4 shadow-sm backdrop-blur
        border-zinc-200 bg-white/70
        dark:border-zinc-800/70 dark:bg-zinc-900/60
      "
    >
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
        <span className="text-zinc-400 dark:text-zinc-600">•</span>
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.company}</span>
        {item.location && (
          <>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.location}</span>
          </>
        )}
        <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-400">{item.date}</div>
      </div>

      {shownHighlights.length > 0 && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {shownHighlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {(item.tech.length > 0 || hasMore) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {shownTech.map((t, i) => (
            <Pill key={i}>{t}</Pill>
          ))}
          {restCount > 0 && <Pill>+{restCount} more</Pill>}
          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="
                ml-auto text-xs underline underline-offset-2 transition
                text-zinc-600 hover:text-zinc-800
                dark:text-zinc-400 dark:hover:text-zinc-200
              "
            >
              {expanded ? showLessLabel : showMoreLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}