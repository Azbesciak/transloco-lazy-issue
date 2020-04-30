import {Component, Injector} from '@angular/core';
import {CFG_TOKEN, DynamicConfig} from './dynamic-config';
import {ModuleLoaderService} from './module-loader.service';

const moduleLoad = {
  loadChildren: () => import('./dynamic.module').then(m => m.DynamicModule)
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ModuleLoaderService]
})
export class AppComponent {
  constructor(private loader: ModuleLoaderService, private injector: Injector) {
  }

  cfg: DynamicConfig = {
    isProduction: true,
    i18n: {
      availableLanguages: ['xyz'],
      defaultLanguage: 'xyz',
      translationsPath: './assets'
    }
  };

  create() {
    this.loader.provideModule(moduleLoad, Injector.create({
      parent: this.injector,
      name: 'xyz',
      providers: [{
        provide: CFG_TOKEN,
        useValue: this.cfg,
        deps: []
      }]
    }));
  }
}
