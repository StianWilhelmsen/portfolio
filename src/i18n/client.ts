'use client';

import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from './settings';

let initialized: Promise<I18nInstance> | null = null;

export function getI18nClient(lng: string): Promise<I18nInstance> {
  if (!initialized) {
    initialized = i18next
      .use(initReactI18next)
      .use(
        resourcesToBackend((language: string, ns: string) =>
          import(`@/app/languages/${language}/${ns}.json`)
        )
      )
      .init({
        lng,
        ...i18nConfig
      })
      // init() returns Promise<TFunction>; map it to the instance
      .then(() => i18next);
  } else if (i18next.language !== lng) {
    // keep the same promise but switch language for subsequent calls
    i18next.changeLanguage(lng);
  }
  return initialized;
}
