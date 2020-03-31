import {Compiler, Injectable, Injector, NgModuleFactory, NgModuleRef, Type} from '@angular/core';

@Injectable()
export class ModuleLoaderService {
  constructor(private compiler: Compiler) {
  }

  provideModule<T>(module: ModuleProvision<T>, injector: Injector): Promise<NgModuleRef<T>> {
    return module.loadChildren()
      .then(elementModuleOrFactory => this.compileModule(elementModuleOrFactory))
      .then(moduleFactory => moduleFactory.create(injector));
  }

  private compileModule<T>(elementModuleOrFactory: ModuleType<T>): NgModuleFactory<T> | Promise<NgModuleFactory<T>> {
    if (elementModuleOrFactory instanceof NgModuleFactory) {
      // if ViewEngine
      return elementModuleOrFactory;
    } else {
      // if Ivy
      return this.compiler.compileModuleAsync(elementModuleOrFactory);
    }
  }
}

export type ModuleType<T> = NgModuleFactory<T> | Type<T>;
export type ModuleProvisionFunction<T> = () => Promise<ModuleType<T>>;

export interface ModuleProvision<T> {
  loadChildren: ModuleProvisionFunction<T>;
}

