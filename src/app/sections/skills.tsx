'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getI18nClient } from '../../i18n/client';
import TechnologyCard from '../components/TechnologyCard';

const TECH_META: Record<string, { color: string; icon: string; href?: string }> = {
  Java:        { color: '#f89820', icon: '/TechnologyIcons/JavaLogo.png' },
  Python:      { color: '#3776AB', icon: '/TechnologyIcons/PythonLogo.png' },
  'C#':        { color: '#68217A', icon: '/TechnologyIcons/CSharpLogo.png' }, // rename file to avoid # issues
  JavaScript:  { color: '#F7DF1E', icon: '/TechnologyIcons/JavaScriptLogo.png' },
  TypeScript:  { color: '#3178C6', icon: '/TechnologyIcons/TypescriptLogo.png' },
  React:       { color: '#61DAFB', icon: '/TechnologyIcons/ReactLogo.png' },
  'Next.js':   { color: '#000000', icon: '/TechnologyIcons/NextJSLogo.png' },
  'Vue.js':    { color: '#42B883', icon: '/TechnologyIcons/VueJSLogo.png' },
  MySQL:       { color: '#4479A1', icon: '/TechnologyIcons/MySQLLogo.png' },
  Firebase:    { color: '#FFCA28', icon: '/TechnologyIcons/FirebaseLogo.png' },
};

export default function SkillsSection({ lng }: { lng: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getI18nClient(lng).then(() => setReady(true));
  }, [lng]);

  if (!ready) return null;

  return <SkillsSectionInner key={lng} />;
}

function SkillsSectionInner() {
  const { t } = useTranslation('skills');

  // From translations
  const technologies: string[] = t('technologies', { returnObjects: true }) as string[];
  const otherTechnologies: string[] = t('otherTechnologies', { returnObjects: true }) as string[];

  return (
    <section className="space-y-12 text-[var(--foreground)]">
      {/* Title and intro */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h2 className="text-3xl font-bold">{t('title', 'My Technical Skills')}</h2>
        <p className="text-base opacity-80">
          {t(
            'intro',
            'Here are some of the technologies and tools I use regularly to build scalable, modern applications.'
          )}
        </p>
      </div>

      {/* Main technologies grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">{t('mainTech', 'Core Technologies')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {technologies.map((name) => {
            const meta = TECH_META[name] ?? { color: '#8b8b8b', icon: '/TechnologyIcons/Default.png' };
            return (
              <TechnologyCard
                key={name}
                name={name}
                color={meta.color}
                iconSrc={meta.icon}
                href={meta.href}
              />
            );
          })}
        </div>
      </div>

      {/* Other technologies list */}
      <div>
        <h3 className="text-xl font-semibold mb-4">{t('otherTech', 'Other Technologies')}</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {otherTechnologies
              .filter(Boolean)
              .map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-[var(--background)] text-[var(--foreground)] hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  {name}
                </span>
              ))}
          </div>
      </div>
    </section>
  );
}
