import { Consumer } from 'components-di';
import React from 'react';
import { addComponent } from '../Session.js';

function MayBeStaticComponent() {
  return <div className="box-xl">I am static</div>;
}

function Echo(props) {
  return <div className="box-xl">{props.value}</div>;
}

function DynamicComponent() {
  return (
    <Consumer mapper={deps => ({ value: deps.context.session.store.state.value })}>
      <Echo />
    </Consumer>
  );
}

addComponent(
  'async-test',
  <div className="box-xl">
    <MayBeStaticComponent />
    <DynamicComponent />
  </div>
);
