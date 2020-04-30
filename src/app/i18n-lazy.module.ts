import {Inject, Injectable, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {
  DefaultFallbackStrategy,
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_FALLBACK_STRATEGY,
  TRANSLOCO_INTERCEPTOR,
  TRANSLOCO_LOADER,
  TRANSLOCO_MISSING_HANDLER,
  TRANSLOCO_TRANSPILER,
  TranslocoConfig,
  translocoConfig,
  TranslocoDirective,
  TranslocoInterceptor,
  TranslocoLoader,
  TranslocoMissingHandler,
  TranslocoPipe,
  TranslocoService
} from '@ngneat/transloco';
import {HttpClient} from '@angular/common/http';
import {CFG_TOKEN, DynamicConfig} from './dynamic-config';
import {MessageFormatTranspiler, TRANSLOCO_MESSAGE_FORMAT_CONFIG} from '@ngneat/transloco-messageformat';


@Injectable()
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly translationsPath: string;

  constructor(private http: HttpClient, @Inject(CFG_TOKEN) config: DynamicConfig) {
    this.translationsPath = config.i18n.translationsPath;
  }

  getTranslation(lang: string) {
    console.log('GET TRANSLATIONS', lang);
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

// not exported from transloco
export class MissingTranslationsHandler implements TranslocoMissingHandler {
  handle(key: string, config: TranslocoConfig) {
    if (config.missingHandler.logMissingKey && !config.prodMode) {
      const msg = `Missing translation for '${key}'`;
      console.debug(`%c ${msg}`, 'font-size: 16px; color: red');
    }

    return key;
  }
}


// not exported from transloco
export class NoOpTranslocoTranslationInterceptor implements TranslocoInterceptor {
  preSaveTranslation(translation: Translation, lang: string): Translation {
    return translation;
  }

  preSaveTranslationKey(key: string, value: string, lang: string): string {
    return value;
  }
}

export function translocoFactor(other: TranslocoService, ...services: any[]) {
  console.log('SERVICE', other);
  // @ts-ignore
  return new TranslocoService(...services);
}

@NgModule({
  declarations: [TranslocoDirective, TranslocoPipe],
  exports: [TranslocoDirective, TranslocoPipe]
})
export class I18nLazyModule {
  static forRoot(): ModuleWithProviders<I18nLazyModule> {
    return {
      ngModule: I18nLazyModule,
      providers: [{
        provide: TranslocoService,
        useFactory: translocoFactor,
        deps: [
          [new Optional(), new SkipSelf(), TranslocoService],
          [new Optional(), TRANSLOCO_LOADER],
          TRANSLOCO_TRANSPILER,
          TRANSLOCO_MISSING_HANDLER,
          TRANSLOCO_INTERCEPTOR,
          TRANSLOCO_CONFIG,
          TRANSLOCO_FALLBACK_STRATEGY
        ]
      }, {
        provide: TRANSLOCO_CONFIG,
        useFactory: createConfig,
        deps: [CFG_TOKEN]
      }, {
        provide: TRANSLOCO_MISSING_HANDLER,
        useClass: MissingTranslationsHandler
      }, {
        provide: TRANSLOCO_INTERCEPTOR,
        useClass: NoOpTranslocoTranslationInterceptor
      }, {
        provide: TRANSLOCO_FALLBACK_STRATEGY,
        useClass: DefaultFallbackStrategy,
        deps: [TRANSLOCO_CONFIG]
      }, {
        provide: TRANSLOCO_MESSAGE_FORMAT_CONFIG,
        useValue: undefined
      }, {
        provide: TRANSLOCO_TRANSPILER,
        useClass: MessageFormatTranspiler
      }, {
        provide: TRANSLOCO_LOADER,
        useClass: TranslocoHttpLoader
      }]
    };
  }
}
