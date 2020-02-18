import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CategoryUpdated, CategoryViewed, CategoryCreated } from './messages';
import { areEqual } from './utility';
import * as firebase from 'firebase';

@autoinject()
export class Categories {
  private level: number;
  private db;
  private categories;
  private selectedId;

  constructor(private ea: EventAggregator) { }

  async activate(params) {    
    this.level = params.level;

    this.db = firebase.firestore();
    this.categories = await this.getCategoriesByLevel(this.level);
  }

  async getCategoriesByLevel(level) {    
    let catCol = this.db.collection("categories");    
    let list = catCol.where("level", "==", parseInt(level));

    let cats = [];

    await list.get().then(function (querySnapshot) {      
      querySnapshot.forEach(function (doc) {
        cats.push(doc.data());
      });      
    });  

    return cats;
  }
}

