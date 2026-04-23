import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import he from './locales/he.json';

const SUPPORTED_LANGS = ['en', 'he'];
const systemLang = navigator.language?.split('-')[0];
const savedLang =
  localStorage.getItem('lang') ??
  (SUPPORTED_LANGS.includes(systemLang) ? systemLang : null) ??
  'en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            he: { translation: he },
        },
        lng: savedLang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
