import {NgModule} from '@angular/core';
import {I18nLazyModule} from './i18n-lazy.module';
import {CommonModule} from '@angular/common';
import {DynamicService} from './dynamic.service';

@NgModule({
  imports: [
    CommonModule,
    I18nLazyModule.forRoot()
  ],
  providers: [
    DynamicService
  ]
})
export class DynamicModule {
  constructor(_: DynamicService) {
  }
}
