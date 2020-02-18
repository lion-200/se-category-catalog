import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject, PLATFORM } from 'aurelia-framework';

@autoinject()
export class App {
  router: Router;

  constructor() { }

  configureRouter(config: RouterConfiguration, router: Router) {
    console.log('test');
    config.title = 'SE Category Catalog';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('init'), title: 'Catalog' },            
      { route: 'categories/:level', moduleId: PLATFORM.moduleName('categories'), name: 'categories' },
      { route: 'add-category', moduleId: PLATFORM.moduleName('add-category'), name: 'add-category' },
      //{ route: 'testcategory/:level', moduleId: PLATFORM.moduleName('./testcategory', 'testcategory'), name: 'testcategory', href: 'testcategory' }
    ]);

    this.router = router;
  }
}


