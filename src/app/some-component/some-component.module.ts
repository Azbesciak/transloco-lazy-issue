import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SomeComponentComponent } from './some-component.component';
import {I18nLazyModule} from '../i18n-lazy.module';



@NgModule({
  declarations: [SomeComponentComponent],
    imports: [
        CommonModule,
        I18nLazyModule
    ]
})
export class SomeComponentModule { }
