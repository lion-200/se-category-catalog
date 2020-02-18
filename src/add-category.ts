import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CategoryCreated, CategoryViewed } from './messages';
import { areEqual } from './utility';
import * as firebase from 'firebase';
import { makeid } from './common/functions';

@inject(EventAggregator)
export class AddCategory {
  routeConfig;

  private name;
  private guid;
  private parentId;
  private level;
  private restricted;
  private image;
  private db;
  private orderId;
  private catId;

  constructor(private ea: EventAggregator) { }

  activate(params, routeConfig) {
    this.parentId = 0;
    this.level = 0;
    this.restricted = true;
  }

  async bind() {
    this.db = firebase.firestore();

    this.setNewId();
    this.setNewOrderId();
    this.image = "";
  }

  get canSave() {
    return this.name && this.level >= 0 && (this.level > 0 ? this.parentId : true);
  }

  async setNewId() {
    let categories = this.db.collection("categories");
    let newId = 0;
    await categories.orderBy("catId", "desc").limit(1).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var lastId = doc.data().catId;
        newId = lastId+1;
      })
    });

    this.catId = newId;
  }

  async setNewOrderId() {
    let categories = this.db.collection("categories");
    let newOrderId = 0;
    await categories.orderBy("orderId", "desc").limit(1).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var lastOrderId = doc.data().orderId;
        newOrderId = lastOrderId + 100;
      })
    });

    this.orderId = newOrderId;
  }

  save() {    
    var newCat = this.db.collection("categories").doc();

    newCat.set({
      name: this.name,
      level: this.level,
      parentId: this.parentId,
      restricted: this.restricted,
      image: this.image,
      orderId: this.orderId,
      catId: this.catId
    });
  }

}

