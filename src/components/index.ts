import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([PLATFORM.moduleName('./loader/loader'),
                          PLATFORM.moduleName('./nav-bar/nav-bar')]);
}

