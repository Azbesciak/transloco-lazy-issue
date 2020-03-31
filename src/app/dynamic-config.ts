import {InjectionToken} from '@angular/core';

export interface DynamicConfig {
  isProduction: boolean;
  i18n: {
    translationsPath: string;
    availableLanguages: string[];
    defaultLanguage: string;
  };
}

export const CFG_TOKEN = new InjectionToken('cfg_token');
