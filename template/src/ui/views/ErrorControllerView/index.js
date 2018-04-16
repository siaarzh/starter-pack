import { Consumer } from 'components-di';
import View from 'components/View';
import React, { Component } from 'react';

class ErrorControllerView extends Component {
  render() {
    const { error, message } = this.props;
    return (
      <View>
        <div className="box-xl">
          <h1 className="ff-mono m-bottom-l">{error}</h1>
          <p>{message}</p>
        </div>
      </View>
    );
  }
}

function provideErrorProps({ context }) {
  const state = context.session.store.state;
  return {
    error: state.error,
    message: state.message,
  };
}

export default function RootComponent() {
  return (
    <Consumer mapper={provideErrorProps}>
      <ErrorControllerView />
    </Consumer>
  );
}
