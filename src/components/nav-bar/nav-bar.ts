import { DialogService } from 'aurelia-dialog';
import { customElement, bindable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';

import styles from './nav-bar.module.css';

@autoinject()
@customElement('nav-bar')
export class NavBar {
  @bindable router;
  @bindable level;
  private levels = [];

  private styles = styles;

  
  constructor(private dialogService: DialogService) {
  }

  bind() {   
    this.levels.push({ level: 0 });
    this.levels.push({ level: 1 });
    this.levels.push({ level: 2 });
    this.levels.push({ level: 3 });
    this.levels.push({ level: 4 });
  }
}
