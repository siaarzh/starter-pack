// get json type of an object
// string, number, object, array, boolean, null
export function getJsonType(obj) {
  if (Array.isArray(obj)) {
    return 'array';
  } else if (obj === null) {
    return 'null';
  } else {
    const type = (typeof obj).toLowerCase();
    if (['string', 'number', 'object', 'boolean'].indexOf(type) < 0) {
      throw new Error(`${type} is not a JSON-compatible type`);
    }
    return type;
  }
}

export function clone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    if (console && console.error) {
      console.error(err);
    }
    return {};
  }
}

// merge function recursively replaces values of target object with values of modifier object
// of [number, string, null, boolean, array] types
export function merge(target, modifier) {
  const modifierType = getJsonType(modifier);
  if (modifierType === 'object') {
    // dive in
    let accum = clone(target);
    for (const key in modifier) {
      if (Object.prototype.hasOwnProperty.call(modifier, key)) {
        const targetKeyType = target[key] && getJsonType(target[key]);
        if (targetKeyType === 'object') {
          accum[key] = merge(target[key], modifier[key]);
        } else if (targetKeyType === 'array') {
          const modifierKeyType = getJsonType(modifier[key]);
          if (modifierKeyType === 'array') {
            // just replace with new array
            accum[key] = modifier[key];
          } else {
            // seems like we want to dive into array item
            accum[key] = merge(target[key], modifier[key]);
          }
        } else {
          accum[key] = merge({}, modifier[key]);
        }
      }
    }
    return accum;
  } else {
    // assign
    return modifier;
  }
}

function withExecutionPerf(fn, ...args) {
  // use fn call and provide fn as a context, so that it is possible to access _isSubscribed parameter inside handler
  if (process.env.NODE_ENV === 'production' || !performance) {
    fn.call(fn, ...args);
  } else {
    const t1 = performance.now();
    fn.call(fn, ...args);
    const t2 = performance.now();
    const delta = Math.ceil(t2 - t1);
    if (console && console.warn && delta > 15) {
      console.warn(`subscription handler took ${delta}ms`);
    }
  }
}

function withPromise(fn, store) {
  return function (...args) {
    const version = store.stateVersion;
    const handlerContext = this;
    Promise.resolve().then(function () {
      if (version !== store.stateVersion || !handlerContext._isSubscribed) {
        return;
      }
      fn.call(fn, ...args);
    });
  };
}

// store with subscriptions
export default class ObjectStateStorage {
  constructor(initialState = {}, options = {}) {
    this._stateVersion = 0;
    this._currentState = initialState;
    this._currentListeners = [];
    this._nextListeners = [];

    this._config = merge(
      {
        handlerExecutionTimeout: 16,
      },
      options
    );

    // binds
    this.setState = this.setState.bind(this);
    this.replaceState = this.replaceState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  setState(patch, label) {
    if (typeof patch !== 'function') {
      throw new Error('patch is not a function');
    }

    const provider = patch(this.state);
    if (!provider) {
      return;
    }
    const prevState = clone(this._currentState);
    this._currentState = merge(this._currentState, patch(this.state));
    this._stateVersion += 1;

    this._currentListeners = this._nextListeners.slice();
    for (const listener of this._currentListeners) {
      withExecutionPerf(listener, this._currentState, prevState, label);
    }
  }
  replaceState(patch, label) {
    if (typeof patch !== 'function') {
      throw new Error('patch is not a function');
    }

    const provider = patch(this.state);
    if (!provider) {
      return;
    }
    const prevState = clone(this._currentState);
    this._currentState = clone(provider);
    this._stateVersion += 1;

    this._currentListeners = this._nextListeners.slice();
    for (const listener of this._currentListeners) {
      withExecutionPerf(listener, this._currentState, prevState, label);
    }
  }
  subscribe(fn, asynchronous = false) {
    if (typeof fn !== 'function') {
      throw new Error('expected listener to be a function.');
    }
    let listener = fn;

    if (asynchronous) {
      listener = withPromise(fn, this);
    }

    listener._isSubscribed = true;

    // add listener to the list
    this._nextListeners.push(listener);

    // unsubscribe function
    return () => {
      // remove listener only once
      if (!!listener._isSubscribed === false) {
        return;
      }

      listener._isSubscribed = false;

      // remove listener from the list
      const index = this._nextListeners.indexOf(listener);
      this._nextListeners.splice(index, 1);
    };
  }
  get state() {
    // return copy of currentState
    return clone(this._currentState);
  }
  get stateVersion() {
    return this._stateVersion;
  }
}
