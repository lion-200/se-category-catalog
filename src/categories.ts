import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CategoryUpdated, CategoryViewed, CategoryCreated } from './messages';
import { areEqual } from './utility';
import * as firebase from 'firebase';
import { CategoryService } from './services/category-service';

@autoinject()
export class Categories {
  private level: number;
  private db;
  private categories;
  private selectedId;

  constructor(private categoryService: CategoryService) { }

  async activate(params) {    
    this.level = params.level;

    this.db = firebase.firestore();
    this.categories = await this.categoryService.getCategoriesByLevel(this.level);
  }

  
}

