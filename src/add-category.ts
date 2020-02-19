import { autoinject } from 'aurelia-framework';
import * as firebase from 'firebase';
import { ValidationControllerFactory, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { ToastService, ToastMessage } from 'services/toast-service';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { I18N } from 'aurelia-i18n';
import { AppRouter } from 'aurelia-router';

@autoinject()
export class AddCategory {
  routeConfig;

  private name;
  private parentId;
  private level;
  private restricted;
  private image;
  private db;
  private orderId;
  private id;
  private categoryPrefix = "category";
  private validationController;
  private renderer;
  private loading = false;

  constructor(private toast: ToastService, private controllerFactory: ValidationControllerFactory, private i18n: I18N, private router: AppRouter) {
      this.validationController = controllerFactory.createForCurrentScope();

      this.renderer = new BootstrapFormRenderer();
      this.validationController.addRenderer(this.renderer);      
  }

  activate(params, routeConfig) {
    this.parentId = 0;
    this.level = 0;
    this.restricted = false;
  }

  async bind() {
    this.loading = true;

    this.db = firebase.firestore();

    this.setNewId();
    this.setNewOrderId();
    this.image = "";    

    this.createValidationRules();
        
    this.loading = false;
  }

  private createValidationRules() {
    const rules = ValidationRules
      .ensure('name')
      .required()
      .withMessageKey('errors:addCategoryNameRequired')
      .then()
      .satisfies((value: any, object: AddCategory) => {
        //const amount = parseFloat(value);

        return true;//(amount <= object);
      })
      .withMessageKey('errors:addCategoryNameExists')
      .ensure('level')
      .required()
      .withMessageKey('errors:addCategoryLevelRequired')
      .rules;

    this.validationController.addObject(this, rules);
  }

  get canSave() {
    return this.name && this.level >= 0 && (this.level > 0 ? this.parentId : true);
  }

  async setNewId() {
    let categories = this.db.collection("categories");
    let newId = 1;
    await categories.orderBy("id", "desc").limit(1).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var lastId = doc.data() && doc.data().id ? doc.data().id : 0;
        newId = parseInt(lastId)+1;
      })
    });

    this.id = newId;
  }

  async setNewOrderId() {
    let categories = this.db.collection("categories");
    let newOrderId = 100;
    await categories.orderBy("orderId", "desc").limit(1).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var lastOrderId = doc.data().orderId;
        newOrderId = parseInt(lastOrderId) + 100;
      })
    });

    this.orderId = newOrderId;
  }

  async save() {
    const i18n = this.i18n;
    const toastService = this.toast;
    const validationResult: ControllerValidateResult = await this.validationController.validate();
    const router = this.router;
    let loading = this.loading;

    loading = true;

    for (const result of validationResult.results) {
      if (!result.valid) {
        const toast = new ToastMessage();

        toast.message = i18n.tr(result.rule.messageKey, {          
          ns: 'errors'
        });

        this.toast.error(toast);        
      }
    }

    if (validationResult.valid) {
      let catId = this.categoryPrefix + this.id;
      let newCat = this.db.collection("categories").doc(catId);
      let name = this.name;
      let level = this.level;

      newCat.set({
        id: this.id,
        name: this.name,
        level: this.level,
        parentId: this.parentId,
        restricted: this.restricted,
        image: this.image,
        orderId: this.orderId
      }).then(function (docRef) {
        console.log(docRef);
        const toast = new ToastMessage();

        toast.message = i18n.tr('addCategorySuccess', {
          name: name,
          level: level,
          ns: 'notifications'
        });

        toastService.success(toast);

        loading = false;

        router.navigateToRoute('categories', { level: level });
      })
      .catch(function (error) {
        console.log(error);
        const toast = new ToastMessage();

        toast.message = i18n.tr('addCategoryFailure', {
          name: name,
          level: level,
          ns: 'errors'
        });

        toastService.error(toast);

        loading = false;
      });
    }

    loading = false;    
  }

}

