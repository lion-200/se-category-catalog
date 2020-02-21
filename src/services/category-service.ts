import { autoinject } from 'aurelia-framework';

import { ToastService, ToastMessage } from './toast-service';
import { I18N } from 'aurelia-i18n';
import * as firebase from 'firebase';
import moment from 'moment';

@autoinject()
export class CategoryService {
  private db;
  private categoryPrefix = "category";

  constructor(private toast: ToastService, private i18n: I18N) {
    this.db = firebase.firestore();
  }  

  async getCategoriesByNameAndLevel(name, level, id) {    
    let categories = this.db.collection('categories');

    let list = categories.where("level", "==", parseInt(level)).where("name", "==", name);

    // as != is not supported we check for id's greater than and less then current id to see if the name already exists
    if (id) {
      list = list.where("id", "<", id).where("id", ">", id);
    }

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

  async updateCategory(cat) {
    const i18n = this.i18n;
    const toastService = this.toast;

    let key = this.categoryPrefix + cat.id;
    let updateCat = this.db.collection("categories").doc(key);

    return updateCat.set(cat).then(function () {
      const toast = new ToastMessage();

      toast.message = i18n.tr('updateCategorySuccess', {
        name: cat.name,
        level: cat.level,
        ns: 'notifications'
      });

      toastService.success(toast);

      return true;
    }).catch(function (error) {
      console.log(error);
      const toast = new ToastMessage();

      toast.message = i18n.tr('updateCategoryFailure', {
        name: cat.name,
        level: cat.level,
        ns: 'errors'
      });

      toastService.error(toast);

      return false;
    });
  }

  async getCategoryById(id) {
    const i18n = this.i18n;
    const toastService = this.toast;

    let catCol = this.db.collection("categories");    
    let catQ = catCol.doc(this.categoryPrefix + id);
    let cat;
    await catQ.get().then(function (doc) {
      if (doc.exists) {
        cat = doc.data();
      } else {
        const toast = new ToastMessage();

        toast.message = i18n.tr('categoryNotFound', {
          id: id,
          ns: 'errors'
        });

        toastService.error(toast);
      }
    });    

    return cat;
  }

  async getCategoriesByLevel(level, includeParentData = false) {
    const categoryPrefix = this.categoryPrefix;
    let catCol = this.db.collection("categories");
    let list = catCol.where("level", "==", parseInt(level));

    let cats = [];

    await list.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let cat = doc.data();
        if (level > 0 && cat.parentId > 0 && includeParentData) {                    
          catCol.doc(categoryPrefix + cat.parentId).get().then(function (pDoc) {
            if (pDoc.exists) {
              cat.parentData = pDoc.data();
            }            
          });
        }

        cats.push(cat);
      });
    });

    return cats;
  }

  async getCategoryProposals() {
    let proposals = this.db.collection('categoryProposals');
    let props = [];

    await proposals.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let prop = doc.data();
        prop.key = doc.id;
        prop.timestamp_string = moment.unix(prop.timestamp).format('YYYY-MM-DD HH:mm');
        if (prop.handlingTimestamp) {
          prop.handlingTimestamp_string = moment.unix(prop.timestamp).format('YYYY-MM-DD HH:mm');
        }        
        props.push(prop);
      });
    });

    return props;
  }

  async addCategoryProposal(proposal) {
    const i18n = this.i18n;
    const toastService = this.toast;

    let newCat = this.db.collection("categoryProposals").doc();

    return newCat.set(proposal).then(function () {
      const toast = new ToastMessage();

      toast.message = i18n.tr('addCategoryProposalSuccess', {
        name: proposal.name,
        level: proposal.level,
        ns: 'notifications'
      });

      toastService.success(toast);

      return true;
    }).catch(function (error) {
      console.log(error);
      const toast = new ToastMessage();

      toast.message = i18n.tr('addCategoryProposalFailure', {
        name: proposal.name,
        level: proposal.level,
        ns: 'errors'
      });

      toastService.error(toast);

      return false;
    });
  }

  async getCategoryProposalByKey(key) {
    const i18n = this.i18n;
    const toastService = this.toast;

    let catCol = this.db.collection("categoryProposals");
    let catQ = catCol.doc(key);
    let cat;
    await catQ.get().then(function (doc) {
      if (doc.exists) {
        cat = doc.data();
      } else {
        const toast = new ToastMessage();

        toast.message = i18n.tr('categoryProposalNotFound', {
          id: key,
          ns: 'errors'
        });

        toastService.error(toast);
      }
    });

    return cat;
  }

  async updateCategoryProposalStatus(key, status) {
    const i18n = this.i18n;
    const toastService = this.toast;

    let prop = await this.getCategoryProposalByKey(key);
    prop.status = status;
    prop.handledBy = "lion200";
    prop.handlingTimestamp = moment().unix();

    let proposals = this.db.collection("categoryProposals").doc(key);

    return proposals.set(prop).then(function () {
      const toast = new ToastMessage();

      toast.message = i18n.tr('categoryProposalStatusChange', {
        name: prop.name,
        level: prop.level,
        status: prop.status,
        ns: 'notifications'
      });

      toastService.success(toast);

      return true;
    }).catch(function (error) {
      console.log(error);
      const toast = new ToastMessage();

      toast.message = i18n.tr('categoryProposalStatusChangeFailure', {
        name: prop.name,
        level: prop.level,
        ns: 'errors'
      });

      toastService.error(toast);

      return false;
    });
  }
}
