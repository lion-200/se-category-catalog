import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'izitoast/dist/css/iziToast.css';
import './styles/toast.css';
import './styles/main.css';
import './styles/navbar.css';

import modalCss from './styles/modal.css';

import { initFirebase } from './common/firebase';

import { AppRouter } from 'aurelia-router';

import { TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';

import { EventAggregator } from 'aurelia-event-aggregator';

import { I18N } from 'aurelia-i18n';
import { ValidationMessageProvider } from 'aurelia-validation';

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .feature(PLATFORM.moduleName('components/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
    config
      .useDefaults()
      .useCSS(modalCss.toString());
  });

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
    const aliases = ['t', 'i18n'];
    TCustomAttribute.configureAliases(aliases);

    // register backend plugin
    instance.i18next
      .use(Backend);

    return instance.setup({
      backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json',
      },
      attributes: aliases,
      ns: ['translation', 'titles', 'errors', 'notifications'],
      defaultNS: 'titles',
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    }).then(() => {
      const router = aurelia.container.get(AppRouter);

      router.transformTitle = title => instance.tr(`titles:${title}`);

      const eventAggregator = aurelia.container.get(EventAggregator);
      eventAggregator.subscribe('i18n:locale:changed', () => {
        router.updateTitle();
      });
    });
  });

  ValidationMessageProvider.prototype.getMessage = function (key: string) {
    const i18n = aurelia.container.get(I18N);    
    const translation = i18n.tr(`${key}`);
    return this.parser.parse(translation);
  };

  ValidationMessageProvider.prototype.getDisplayName = function (propertyName: string, displayName: string) {
    if (displayName !== null && displayName !== undefined) {
      return displayName;
    }
    const i18n = aurelia.container.get(I18N);
    return i18n.tr(propertyName);
  };

  await initFirebase();

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
