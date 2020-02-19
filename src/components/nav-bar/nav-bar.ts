import { DialogService } from 'aurelia-dialog';
import { customElement, bindable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';

import styles from './nav-bar.module.css';

@autoinject()
@customElement('nav-bar')
export class NavBar {
  @bindable router;

  private styles = styles;

  
  constructor(private dialogService: DialogService) {
  }
}
