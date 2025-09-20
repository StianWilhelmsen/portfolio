import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from './settings';

export async function getServerT(lng: string, ns?: string | string[]) {
  const i18n = createInstance();
  await i18n
    .use(
      resourcesToBackend((language: string, namespace: string) =>
        import(`@/app/languages/${language}/${namespace}.json`)
      )
    )
    .init({ lng, ...i18nConfig });
  return { t: i18n.getFixedT(lng, ns) };
}
