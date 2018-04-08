import Store, { getJsonType } from 'object-state-storage';

import Keeper from 'keeper';
import React from 'react';
import ReactDOM from 'react-dom';

// function values are always equal
export function isEqual(valueA, valueB) {
  if (typeof valueA === 'function' || typeof valueB === 'function') {
    if (typeof valueA !== 'function' || typeof valueB !== 'function') {
      return false;
    }
    return true;
  }
  if (valueA === undefined || valueB === undefined) {
    if (valueA === valueB) {
      return true;
    }
    return false;
  }
  const typeA = getJsonType(valueA);
  const typeB = getJsonType(valueB);
  if (typeA === typeB) {
    if (typeA === 'object') {
      const keysA = Object.keys(valueA);
      const keysB = Object.keys(valueB);
      if (keysA.length !== keysB.length) {
        return false;
      }
      for (const keyA of keysA) {
        if (keysB.indexOf(keyA) < 0) {
          return false;
        }
        if (!isEqual(valueA[keyA], valueB[keyA])) {
          return false;
        }
      }
      return true;
    } else if (typeA === 'array') {
      if (valueA.length !== valueB.length) {
        return false;
      }
      for (const [idx, keyA] of valueA.entries()) {
        if (!isEqual(keyA, valueB[idx])) {
          return false;
        }
      }
      return true;
    }
    return valueA === valueB;
  }
  return false;
}

export class WithProps extends React.Component {
  constructor(props) {
    super(props);
    const { mapper, context, actions } = this.props;
    this.state = mapper(context, actions);
  }
  componentDidMount() {
    const { mapper, context, actions } = this.props;
    const component = this;
    // in case state already changed
    this.setState(mapper(context, actions));
    this.unsub = context.store.subscribe(function listener() {
      component.setState(mapper(context, actions));
    }, true);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // compare this.state and nextState
    return isEqual(this.state, nextState);
  }
  render() {
    return (
      <React.Fragment>
        {React.Children.map(this.props.children, child => React.cloneElement(child, { ...this.state }))}
      </React.Fragment>
    );
  }
}

export class Controller {
  constructor(context) {
    this.context = { global: context };
  }
  get name() {
    throw new Error('Implement name getter');
  }
  getReactContextValue() {
    throw new Error(`Implement getReactContextValue() function for "${this.name}"`);
  }
  controllerWillMount() {
    throw new Error(`Implement controllerWillMount() function for "${this.name}"`);
  }
  controllerWillUpdate() {}
  controllerWillUnmount() {
    throw new Error(`Implement controllerWillUnmount() function for "${this.name}"`);
  }
}

export class SessionController {
  constructor(mountPoint, controllers) {
    this.mountPoint = mountPoint;
    this.controllers = controllers;
    this.context = {
      store: new Store(),
      mountController: this.mountController.bind(this),
    };
    this._version = 0;
  }
  get version() {
    return this._version;
  }
  mountController(controllerName) {
    this._version += 1;
    if (this.controller.name === controllerName) {
      this.controller.controllerWillUpdate();
    } else {
      this.controller.controllerWillUnmount();
    }
    // try to import controller, display ErrorController or throw an Error
    let importController = this.controllers[controllerName];
    if (importController === undefined) {
      importController = this.controllers('ErrorController');
    }
    if (importController === undefined) {
      throw new Error(`Error loading controller "${controllerName}"`);
    }
    const version = this._version;
    importController().then(({ default: NextController }) => {
      if (version === this.version) {
        this.controller = new NextController(this.context);
        this.controller.controllerWillMount();
        this.render();
      }
    });
  }
  render() {
    const contextValue = this.controller.getReactContextValue();
    const { Consumer: Konsumer, Provider } = React.createContext(contextValue);
    function Consumer(props) {
      const { mapper, children } = props;
      return (
        <Konsumer>
          <WithProps mapper={mapper}>{children}</WithProps>
        </Konsumer>
      );
    }
    Keeper.set('consumer', Consumer);
    ReactDOM.render(<Provider>{this.controller.view}</Provider>, this.mountPoint);
  }
}
