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
    this.context.session.store.setState(() => ({
      foo: 'bar',
    }));
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
