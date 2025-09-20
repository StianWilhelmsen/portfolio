export const languages = ['en', 'no'] as const;
export type Language = (typeof languages)[number];

export const defaultNS = 'common';
export const namespaces = ['common', 'me'] as const;

export const i18nConfig = {
    fallbackLng: 'no',
    supportedLngs: languages as unknown as string[],
    defaultNS,
    ns: namespaces as unknown as string[],
    interpolation: { escapeValue: false}
} as const