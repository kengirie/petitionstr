import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻訳ファイルのインポート
import translationEN from './locales/en.json';
import translationJA from './locales/ja.json';

// サポートする言語
const resources = {
  en: {
    translation: translationEN
  },
  ja: {
    translation: translationJA
  }
};

i18n
  // ブラウザの言語を検出
  .use(LanguageDetector)
  // react-i18nextを初期化
  .use(initReactI18next)
  // i18nの初期化
  .init({
    resources,
    fallbackLng: 'ja', // フォールバック言語
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // XSSを防ぐためにReactはデフォルトでエスケープする
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
