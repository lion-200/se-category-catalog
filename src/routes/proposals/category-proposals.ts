import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CategoryUpdated, CategoryViewed, CategoryCreated } from '../../messages';
import { areEqual } from '../../utility';
import * as firebase from 'firebase';
import { CategoryService } from '../../services/category-service';

@autoinject()
export class CategoryProposals {
  private level: number;
  private db;
  private proposals;
  private selectedId;

  constructor(private categoryService: CategoryService) { }

  async activate(params) {
    this.level = params.level;

    this.db = firebase.firestore();
    await this.loadProposals();
  }

  async loadProposals() {
    this.proposals = await this.categoryService.getCategoryProposals();    
  }

  async approve(prop) {
    await this.categoryService.updateCategoryProposalStatus(prop.key, 'Approved');
    this.loadProposals();
  }

  async reject(prop) {
    await this.categoryService.updateCategoryProposalStatus(prop.key, 'Rejected');
    this.loadProposals();
  }
}

