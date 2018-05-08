import { Consumer } from 'components-di';
import Button from 'components/Form/Button';
import { LinkTo } from 'components/Link';
import Modal from 'components/Modal';
import View from 'components/View';
import React from 'react';
import renderIf from 'utils/renderIf';
import { addComponent } from '../Session.js';

function provideButtonProps({ context }) {
  return {
    onClick: () => {
      context.controller.setModal('example');
    },
  };
}

function provideModalProps({ context, actions }, multiplier) {
  const state = context.session.store.state;
  return {
    name: state.modal,
    counter: state.counter,
    bonus: `x${multiplier} ${Math.ceil(multiplier * state.counter)}`,
    closeModal: () => {
      context.controller.setModal();
    },
    actions,
  };
}

function ExampleModal({ name, actions, counter, bonus }) {
  return renderIf(name === 'example', () => {
    return (
      <Modal>
        <div className="bg-neutral-0 r-m box-xl" style={{ width: '420px' }}>
          <div className="h2 m-bottom-l">Hello world: {counter}</div>
          <div className="h2 m-bottom-l">Bonus: {bonus}</div>
          <Button className="landscape-m" onClick={actions.increment}>
            Increment counter
          </Button>
        </div>
      </Modal>
    );
  });
}

export default () =>
  addComponent(
    'modal',
    class ModalExample extends React.Component {
      constructor(props) {
        super(props);
        this.state = { multiplier: 2 };
      }
      render() {
        return (
          <View>
            <div className="box-xl">
              <div className="m-bottom-l">
                <LinkTo page="playground" className="ff-mono">
                  {'> PL4YGR0UND 👾'}
                </LinkTo>
              </div>
              <div>{'Scroll down a bit 👇'}</div>
              <div style={{ height: '1000px' }} />
              <div className="bg-neutral-5 color-neutral-0 m-bottom-m">Stop! Here is your modal:</div>
              <Consumer mapper={provideButtonProps}>
                <Button className="landscape-m">Open modal</Button>
              </Consumer>
              <Consumer mapper={provideModalProps} args={this.state.multiplier}>
                <ExampleModal />
              </Consumer>
              <div style={{ height: '1000px' }} />
            </div>
          </View>
        );
      }
    },
    {
      counter: 0,
    },
    {
      increment: context => {
        context.controller.setState(state => {
          return { counter: state.counter + 1 };
        });
      },
    }
  );
