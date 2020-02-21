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
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('init'), title: 'Catalog', nav: false },            
      { route: 'categories/:level', moduleId: PLATFORM.moduleName('categories'), name: 'categories', nav: false },      
      { route: 'edit-category/:id', moduleId: PLATFORM.moduleName('edit-category'), name: 'edit-category', nav: false },
      { route: 'category-proposals', title: 'Category proposals', moduleId: PLATFORM.moduleName('./routes/proposals/category-proposals', 'category-proposals'), name: 'category-proposals', nav: true },
      { route: 'add-category', title: 'Add category', moduleId: PLATFORM.moduleName('add-category'), name: 'add-category', nav: true },
      { route: 'add-category-proposal', title: 'Propose category', moduleId: PLATFORM.moduleName('./routes/proposals/add-category-proposal', 'add-category-proposal'), name: 'add-category-proposal', nav: true }      
    ]);

    this.router = router;
  }
}


