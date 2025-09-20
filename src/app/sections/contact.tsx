'use client';

import React, { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import en from '../languages/en/contact.json';
import no from '../languages/no/contact.json';

type Messages = typeof en;

const EMAIL = 'stianw@hotmail.no';

function useLocaleMessages(): Messages {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] === 'no' ? 'no' : 'en';
  return (locale === 'no' ? no : en) as Messages;
}

export default function ContactSection() {
  const t = useLocaleMessages();

  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [msg, setMsg] = useState('');
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);

  const subject = t.form.subject;
  const body = useMemo(() => {
    const intro = name ? `Name: ${name}\n` : '';
    const reply = from ? `Reply-to: ${from}\n\n` : '';
    return `${intro}${reply}${msg}`.trim();
  }, [name, from, msg]);

  function openMailClient(e: React.FormEvent) {
    e.preventDefault();
    setOpening(true);
    const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // open in same tab to ensure mail client triggers reliably
    window.location.href = url;
    // small delay before resetting the state
    setTimeout(() => setOpening(false), 1200);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <section id="contact" className="mx-auto my-16 w-full max-w-3xl px-4">
      <div className="mx-auto mb-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-100">{t.title}</h2>
        <p className="mt-2 text-sm text-zinc-400">{t.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/60 p-5 shadow-sm backdrop-blur">
        {/* Email block */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-400">{t.emailLabel}:</span>
          <a
            href={`mailto:${EMAIL}`}
            className="font-medium text-zinc-100 underline decoration-zinc-700 underline-offset-4 hover:text-white"
          >
            {EMAIL}
          </a>
          <button
            onClick={handleCopy}
            className="ml-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
            aria-label={t.copy}
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>

        {/* Lightweight form -> mailto */}
        <form onSubmit={openMailClient} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-zinc-400">{t.form.name}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
                placeholder="Ada Lovelace"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-zinc-400">{t.form.email}</span>
              <input
                type="email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs text-zinc-400">{t.form.message}</span>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={6}
              className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
              placeholder="Write a short message…"
            />
          </label>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">{t.fallback.privacy}</p>
            <button
              type="submit"
              disabled={opening}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-70"
            >
              {opening ? t.form.sending : t.form.send}
            </button>
          </div>
        </form>

        {/* Fallback text link */}
        <div className="mt-4 text-sm text-zinc-400">
          {t.fallback.orWrite}{' '}
          <a
            className="font-medium text-zinc-100 underline decoration-zinc-700 underline-offset-4 hover:text-white"
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
