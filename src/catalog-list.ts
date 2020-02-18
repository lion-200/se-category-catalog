import { EventAggregator } from 'aurelia-event-aggregator';
import { CategoryViewed, CategoryCreated, CategoryUpdated } from './messages';
import { inject } from 'aurelia-framework';
import * as firebase from 'firebase';
import { Router } from 'aurelia-router';

@inject(EventAggregator)
export class CatalogList {
  private levels = [];
  selectedId = 0;
  private db;

  constructor(ea: EventAggregator) {    
    ea.subscribe(CategoryViewed, msg => this.select(msg.contact));
    ea.subscribe(CategoryUpdated, msg => {
      //let id = msg.contact.id;
      //let found = this.level0cats.find(x => x.id == id);
      //Object.assign(found, msg.contact);
    });
  }

  bind() {   
    this.levels.push({ level: 0, className: 'primary' });
    this.levels.push({ level: 1, className: 'secondary' });
    this.levels.push({ level: 2, className: 'success' });
    this.levels.push({ level: 3, className: 'danger' });
    this.levels.push({ level: 4, className: 'warning' });
    //console.log(this.level0cats);
    //this.level0cats = 
  }  

  created() {
    
  }

  select(contact) {
    this.selectedId = contact.id;
    return true;
  }
}


