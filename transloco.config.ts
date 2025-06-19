import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: ['en', 'ru'],
  defaultLang: 'ru',
  keysManager: {}
};

export default config;
