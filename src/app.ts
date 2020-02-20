import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject, PLATFORM } from 'aurelia-framework';

@autoinject()
export class App {
  router: Router;
  private loading = false;

  constructor() { }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'SE Category Catalog';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('init'), title: 'Catalog' },            
      { route: 'categories/:level', moduleId: PLATFORM.moduleName('categories'), name: 'categories' },
      { route: 'add-category', moduleId: PLATFORM.moduleName('add-category'), name: 'add-category' },
      { route: 'edit-category/:id', moduleId: PLATFORM.moduleName('edit-category'), name: 'edit-category' }
    ]);

    this.router = router;
  }
}


