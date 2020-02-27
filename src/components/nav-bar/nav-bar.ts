import { DialogService } from 'aurelia-dialog';
import { customElement, bindable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';

import styles from './nav-bar.module.css';
import { SeCatalogService } from 'services/se-catalog-service';
import { SigninModal } from 'modals/account/signin';
import { connectTo } from 'aurelia-store';

@autoinject()
@customElement('nav-bar')
@connectTo()
export class NavBar {
  @bindable router;
  @bindable level;
  private levels = [];

  private styles = styles;
  private state: IState;

  constructor(private dialogService: DialogService, private se: SeCatalogService) {
  }

  async logout() {
    await this.se.logout();
    this.router.navigateToRoute('home');
  }

  signin() {
    this.dialogService.open({ viewModel: SigninModal }).whenClosed(response => {
      console.log(response);
      if (!response.wasCancelled) {
        // redirect to home if login was successfull
        this.router.navigateToRoute('tokens');
      }
    });
  }

  bind() {   
    this.levels.push({ level: 0 });
    this.levels.push({ level: 1 });
    this.levels.push({ level: 2 });
    this.levels.push({ level: 3 });
    this.levels.push({ level: 4 });
  }
}
