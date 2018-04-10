**Session Controller** is an entry point for your React application, it:

* provides application-wide state storage
* re-renders app on state updates
* provides sensible way of splitting multi-page applications into asynchronously loaded modules

## How does it work?

There are two classes in the module: `Controller` and `Session`:

* `Controller` passes business logic and application state data to page components. It helps to group common actions and UI components, and load them asynchronously from a separate chunk (assuming Webpack is used). One Controller per application page should be fine.
* `Session` provides [state storage](https://www.npmjs.com/package/object-state-storage) and a method to change currently active controller.

`Session` constructor takes two arguments: mount-point for React and a list of controllers. For example:

```javascript
import { Session } from 'session-controller';
import ControllerB from './ControllerB';

const controllers = {
  ControllerA: () => import('./ControllerA'),
  ControllerB: () => { return Promise.resolve({ default: ControllerB }) };
}

const session = new Session(document.getElementById('mount-point'), controllers);
```

Note that for `controllers` object:

* each value is a function that returns a Promise, that resolves a module
  * It will be either a `() => import('./ControllerA')` that **creates a new async chunk**.
  * or `() => { return Promise.resolve({ default: ControllerB }) }`, where `ControllerB` was previously imported
* resolved modules default export should be a class. that's why `ControllerB` value resolves `{ default: ControllerB }` value. It also has to conform to provided `Controller` interface
* every key should be the same as resolved controller's value returned by `name` getter

To change currently active application page, call `session.mountController(controllerName: String)` - this function will try to import controller from `controllers` object. E.g. `session.mountController('ControllerA')` will try to import `ControllerA` and render it's `view` property on success.

Session will try to `mountController('ErrorController', { error })` in case of import failure. If no `ErrorController` is found, an error will be thrown. I suggest not to load ErrorController asynchronously.

A sample controller might look like this:

```javascript
import { Consumer } from 'components-di';
import { Controller } from 'session-controller';
import React from 'react';

class ExampleView extends React.Component {
  render() {
    return <div>{this.props.foo}</div>;
  }
}

export default class ExampleController extends Controller {
  get name() {
    return 'ExampleController';
  }
  controllerWillMount() {
    this.actions = {};
    this.view = (
      <Consumer
        mapper={({ context }) => {
          return { foo: context.session.store.state.foo || null };
        }}>
        <ExampleView />
      </Consumer>
    );
  }
  controllerWillUpdate() {}
  controllerWillUnmount() {}
}
```
