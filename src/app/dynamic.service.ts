import {Injectable} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';

@Injectable()
export class DynamicService {
  constructor(private transloco: TranslocoService) {
    transloco.selectTranslate('hello')
      .subscribe(value => console.log('because it is not eager', value));
  }
}
