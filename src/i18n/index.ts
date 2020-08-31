import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';

i18n.defaultLocale = 'en';
i18n.fallbacks = true;
i18n.translations = { en, es };
i18n.locale = Localization.locale;
export default i18n;
