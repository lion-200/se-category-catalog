﻿import { customElement, containerless, bindable, DOM, TaskQueue } from 'aurelia-framework';

import 'select2/dist/css/select2.css';
import 'select2/dist/js/select2';
import './select2.css';
import $ from 'jquery'

@customElement('select2')
export class Select2 {
  static inject = [Element, TaskQueue];

  private element;
  private taskQueue: TaskQueue;

  @bindable placeholder = null;

  constructor(element: HTMLElement, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
  }

  attached() {
    this.taskQueue.queueTask(() => {
      $(this.element.querySelector('select')).select2({
        placeholder: this.placeholder,
        theme: "classic"
      });

      $(this.element.querySelector('select')).on('select2:select select2:unselect', event => {
        const e = DOM.createCustomEvent('change', {
          bubbles: true,
          cancelable: true
        });

        this.element.querySelector('select').dispatchEvent(e);
      });
    });
  }
}
