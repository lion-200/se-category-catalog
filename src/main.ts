import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

import { initFirebase } from './common/firebase';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  initFirebase();

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
