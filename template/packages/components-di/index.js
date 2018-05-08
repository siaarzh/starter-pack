import { getJsonType } from 'object-state-storage';
import { defer } from 'promise-utils';
import React from 'react';

export function bindActions(actions = {}, context, accum = {}) {
  Object.keys(actions).forEach(key => {
    const value = actions[key];

    if (typeof value === 'function') {
      accum[key] = value.bind(null, context);
    } else if (getJsonType(value) === 'object') {
      accum[key] = bindActions(value, context, {});
    }
  });

  return accum;
}

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

export class MapDeps extends React.Component {
  constructor(props) {
    super(props);
    const { mapper = () => ({}), deps, args } = this.props;
    this.state = mapper(deps, args);
  }
  componentDidMount() {
    let { mapper, deps } = this.props;
    const component = this;
    this._setState = function setState() {
      component.setState(mapper(component.props.deps, component.props.args));
    };
    this._deferredSetState = defer(this._setState);
    this.stopReceivingUpdates = deps.context.session.store.subscribe(function listener() {
      component._deferredSetState.cancel();
      component._deferredSetState = defer(component._setState);
    }, true);
  }
  componentDidUpdate(prevProps) {
    const { children: prevChildren, ...otherPrevProps } = prevProps;
    const { children: currentChildren, ...otherCurrentProps } = this.props;
    if (!isEqual(otherPrevProps, otherCurrentProps)) {
      this._deferredSetState.cancel();
      this._deferredSetState = defer(this._setState);
    }
  }
  componentWillUnmount() {
    this.stopReceivingUpdates();
    if (this._deferredSetState) {
      this._deferredSetState.cancel();
    }
  }
  render() {
    return (
      <React.Fragment>
        {React.Children.map(this.props.children, child => React.cloneElement(child, { ...this.state }))}
      </React.Fragment>
    );
  }
}

function createContextProviderComponents() {
  const Context = React.createContext();
  return {
    Provider: Context.Provider,
    Consumer: function Consumer(props) {
      const { mapper, children, ...restProps } = props;
      return (
        <Context.Consumer>
          {props => {
            const { deps } = props;
            return (
              <MapDeps deps={deps} mapper={mapper} {...restProps}>
                {children}
              </MapDeps>
            );
          }}
        </Context.Consumer>
      );
    },
  };
}

const instanceId = Symbol.for('components-di');

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasInstance = globalSymbols.indexOf(instanceId) > -1;
if (!hasInstance) {
  global[instanceId] = createContextProviderComponents();
}

export const Consumer = global[instanceId].Consumer;
export const Provider = global[instanceId].Provider;
