import { Provider, bindActions } from 'components-di';

import React from 'react';
import ReactDOM from 'react-dom';
import Store from 'object-state-storage';

export class Controller {
  constructor(context) {
    this.context = {
      session: context,
      controller: {},
    };
  }
  get name() {
    throw new Error('Implement name getter');
  }
  provideDeps() {
    return {
      context: this.context,
      actions: bindActions(this.actions || {}, this.context),
    };
  }
  controllerWillMount() {
    throw new Error(`Implement controllerWillMount() function for "${this.name}"`);
  }
  controllerWillUpdate() {}
  controllerWillUnmount() {
    throw new Error(`Implement controllerWillUnmount() function for "${this.name}"`);
  }
}

export class Session {
  constructor(mountPoint, controllers) {
    this._mountVersion = 0;
    this.mountPoint = mountPoint;
    this.controllers = controllers;
    this.context = {
      store: new Store(),
      mountController: this.mountController.bind(this),
    };
  }
  get mountVersion() {
    return this._mountVersion;
  }
  mountController(controllerName, data) {
    this._mountVersion += 1;
    if (this.controller) {
      if (this.controller.name.toLowerCase() === controllerName.toLowerCase()) {
        if (
          this.controller.name !== controllerName &&
          process.env.NODE_ENV !== 'production' &&
          console &&
          console.warn
        ) {
          console.warn(`Controller names should have consistent case (${this.controller.name} - ${controllerName})`);
        }
        this.controller.controllerWillUpdate(data);
      } else {
        this.controller.controllerWillUnmount();
      }
    }

    // try to import controller, display ErrorController or throw an Error
    let importController = this.controllers[controllerName];
    if (importController === undefined) {
      importController = this.controllers('ErrorController');
    }
    if (importController === undefined) {
      throw new Error(`Error loading controller "${controllerName}"`);
    }
    const version = this.mountVersion;
    importController().then(({ default: NextController }) => {
      if (version === this.mountVersion) {
        this.controller = new NextController(this.context);
        this.controller.controllerWillMount(data);
        this.render();
      }
    });
  }
  render() {
    if (!this.controller.view) {
      throw new Error(`Controller "${this.controller.name}" should have view`);
    }
    ReactDOM.render(
      <Provider value={{ deps: this.controller.provideDeps() }}>{this.controller.view}</Provider>,
      this.mountPoint
    );
  }
}
