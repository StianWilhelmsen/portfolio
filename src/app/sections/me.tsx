'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getI18nClient } from '../../i18n/client';
import { Typewriter } from 'react-simple-typewriter';

export default function MeSection({ lng }: { lng: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getI18nClient(lng).then(() => setReady(true));
  }, [lng]);

  if (!ready) return null;

  return <MeSectionInner key={lng} />;
}

function MeSectionInner() {
  const { t } = useTranslation('me');
  const skills: string[] = t('skills', { returnObjects: true }) as string[];

  return (
    <section className="w-full pb-6 pt-6">
      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT: profile card */}
        <div className="md:w-2/5 w-full">
          <div className="h-148 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md bg-[var(--background)] text-[var(--foreground)]">
            <div className="p-8 flex flex-col items-center gap-4">
              <img
                src="/profilbilde.jpg"
                alt="Profile Picture"
                className="w-48 h-48 rounded-full object-cover shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-2xl font-bold">Stian Wilhelmsen</h2>
              <p className="text-lg opacity-90">{t('details.work')}</p>
              <p className="text-sm italic opacity-70">{t('details.student')}</p>
            </div>
          </div>
        </div>

        {/* RIGHT: about content (no card) */}
        <div className="md:w-3/5 w-full flex flex-col justify-center text-[var(--foreground)]">
          <h3 className="text-2xl font-semibold mb-2">
            {t('about.title', { defaultValue: 'Mine ferdigheter inkluderer:' })}
          </h3>

          {/* Typewriter line */}
          <p className="text-xl font-mono text-indigo-500 mb-4">
            <Typewriter
              words={skills}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </p>

          {/* Short intro paragraph */}
          <p className="leading-relaxed opacity-90 mb-5">
            {t('about.blurb', {
              defaultValue:
                'Jeg bygger moderne, raske og tilgjengelige løsninger med fokus på kvalitet i både kode og brukeropplevelse.'
            })}
          </p>

          {/* Skill chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.slice(0, 8).map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-sm opacity-90"
              >
                {s}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="/cv.pdf"
              className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition"
            >
              {t('about.downloadCv', { defaultValue: 'Last ned CV' })}
            </a>
            <a
              href="mailto:stian@example.com"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-[var(--background)]/60 transition"
            >
              {t('about.contact', { defaultValue: 'Kontakt meg' })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
