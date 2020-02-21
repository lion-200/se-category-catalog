import { autoinject, bindable } from 'aurelia-framework';
import { ValidationControllerFactory, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { ToastService, ToastMessage } from 'services/toast-service';
import { CategoryService } from 'services/category-service';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { I18N } from 'aurelia-i18n';
import { AppRouter } from 'aurelia-router';
import moment from 'moment';

@autoinject()
export class AddCategoryProposal {
  routeConfig;

  private from;
  private name;
  private parentId;
  @bindable level;
  private parentCats: ICategory[];
  private restricted;
  private image;
  private message;

  private validationController;
  private renderer;
  private loading = false;

  constructor(private toast: ToastService, private categoryService: CategoryService, private controllerFactory: ValidationControllerFactory, private i18n: I18N, private router: AppRouter) {
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

    this.image = "";
    this.parentCats = [];

    this.createValidationRules();

    this.loading = false;
  }

  async levelChanged(newVal) {
    this.parentCats = [];

    if (newVal > 0) {
      // get parent categories
      let cats = await this.categoryService.getCategoriesByLevel(newVal - 1);

      if (cats) {
        cats.forEach(x => this.parentCats.push({ id: x.id, name: x.name }));
      }
    }
  }

  async categoryAlreadyExists(name, level) {
    let cats = await this.categoryService.getCategoriesByNameAndLevel(name, level)
    if (cats && cats.length > 0) {
      return true;
    }

    return false;
  }

  private createValidationRules() {
    const rules = ValidationRules
      .ensure('name')
      .required()
      .withMessageKey('errors:addCategoryNameRequired')
      .then()
      .satisfies(async (value: any, object: AddCategoryProposal) => {
        let catExists = await this.categoryAlreadyExists(value, object.level);
        return !catExists;
      })
      .withMessageKey('errors:addCategoryNameExists')
      .ensure('level')
      .required()
      .withMessageKey('errors:addCategoryLevelRequired')
      .ensure('parentId')
      .required()
      .withMessageKey('errors:addCategoryParentRequired')
      .ensure('from')
      .required()
      .withMessageKey('errors:addCategoryProposalFromRequired')
      .ensure('message')
      .maxLength(255)
      .withMessageKey('errors:addCategoryProposalMessageMaxLength')
      .rules;

    this.validationController.addObject(this, rules);
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
      let cat = {
        from: this.from,
        name: this.name,
        level: parseInt(this.level),
        parentId: parseInt(this.parentId),
        restricted: this.restricted,
        image: this.image,
        timestamp: moment().unix(),
        message: this.message,
        status: "Awaiting approval",
        handledBy: "",
        handlingTimestamp: 0,
        handlerMessage: ""
      } as ICategoryProposal;

      let addResult = await this.categoryService.addCategoryProposal(cat);

      if (addResult) {
        router.navigateToRoute('category-proposals');
      }
    }

    loading = false;
  }

}

