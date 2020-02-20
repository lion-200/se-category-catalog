import { autoinject } from 'aurelia-framework';

import { ToastService, ToastMessage } from './toast-service';
import { I18N } from 'aurelia-i18n';
import * as firebase from 'firebase';

@autoinject()
export class CategoryService {
  private db;
  private categoryPrefix = "category";

  constructor(private toast: ToastService, private i18n: I18N) {
    this.db = firebase.firestore();
  }  

  async getCategoriesByNameAndLevel(name, level) {    
    let categories = this.db.collection('categories');

    let list = categories.where("level", "==", parseInt(level)).where("name", "==", name);

    let cats = [];

    await list.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        cats.push(doc.data());
      });
    });

    return cats;
  }

  async generateNewCategoryId() {
    let newId = 1;
    let categories = this.db.collection('categories');

    await categories.orderBy("id", "desc").limit(1).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var lastId = doc.data() && doc.data().id ? doc.data().id : 0;
        newId = parseInt(lastId) + 1;
      })
    });

    return newId;
  }

  async generateNewOrderId() {
    let newOrderId = 100;
    let categories = this.db.collection('categories');

    await categories.orderBy("orderId", "desc").limit(1).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var lastOrderId = doc.data().orderId;
        newOrderId = parseInt(lastOrderId) + 100;
      })
    });

    return newOrderId;
  }

  async addCategory(cat) {
    const i18n = this.i18n;
    const toastService = this.toast;

    let key = this.categoryPrefix + cat.id;
    let newCat = this.db.collection("categories").doc(key);

    return newCat.set(cat).then(function () {  
      const toast = new ToastMessage();

      toast.message = i18n.tr('addCategorySuccess', {
        name: cat.name,
        level: cat.level,
        ns: 'notifications'
      });

      toastService.success(toast);

      return true;
    }).catch(function (error) {
        console.log(error);
        const toast = new ToastMessage();

        toast.message = i18n.tr('addCategoryFailure', {
          name: cat.name,
          level: cat.level,
          ns: 'errors'
        });

        toastService.error(toast);        

        return false;
    });
  }

  async getCategoryById(id) {
    let catCol = this.db.collection("categories");
    let cat = await catCol.doc(this.categoryPrefix + id);

    return cat;
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
