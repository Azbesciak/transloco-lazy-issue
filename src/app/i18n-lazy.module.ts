import {Inject, Injectable, NgModule} from '@angular/core';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';
import {HttpClient} from '@angular/common/http';
import {CFG_TOKEN, DynamicConfig} from './dynamic-config';

@Injectable()
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly translationsPath: string;

  constructor(private http: HttpClient, @Inject(CFG_TOKEN) config: DynamicConfig) {
    this.translationsPath = config.i18n.translationsPath;
  }

  getTranslation(lang: string) {
    return this.http.get<Translation>(`${this.translationsPath}/${lang}.json`);
  }
}

export function createConfig(config: DynamicConfig) {
  const {availableLanguages, defaultLanguage} = config.i18n;
  return translocoConfig({
    availableLangs: availableLanguages,
    defaultLang: defaultLanguage,
    prodMode: config.isProduction,
    reRenderOnLangChange: true,
  });
}

@NgModule({
  exports: [TranslocoModule],
  providers: [{
    provide: TRANSLOCO_CONFIG,
    useFactory: createConfig,
    deps: [CFG_TOKEN]
  }, {
    provide: TRANSLOCO_LOADER,
    useClass: TranslocoHttpLoader
  }]
})
export class I18nLazyModule {
  constructor(private transloco: TranslocoService) {
    transloco.selectTranslate('hello')
      .subscribe(value => console.log('because it is not eager', value));
  }

}
