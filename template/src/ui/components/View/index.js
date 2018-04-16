import c from 'classnames';
import { Consumer } from 'components-di';
import Model from 'json-model';
import React, { Component, Fragment } from 'react';
import tabbable from 'tabbable';

const ESC = 27;

export const viewPropsModel = new Model({
  __type: 'object',
  __value: {
    scrollY: {
      __type: 'number',
      __value: 0,
    },
    modal: {
      __type: 'string',
      __value: 'none',
    },
  },
});

export function setModal(context, modalname = 'none') {
  const modifier = {
    modal: modalname,
  };
  context.controller.setState(() => {
    if (modalname !== 'none') {
      modifier.scrollY = global.window.scrollY;
    }
    return modifier;
  });
}

function mapper({ context }) {
  const state = context.session.store.state;
  return {
    scrollY: state.scrollY,
    modal: state.modal,
    actions: {
      setModal: context.controller.setModal,
    },
  };
}

class ModalMountPoint extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div id="modal-mount-point" />;
  }
}

class View extends Component {
  constructor(props) {
    super(props);
    this.tabbables = [];

    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modal !== 'none' && this.props.modal === 'none') {
      // hide modal
      global.window.scroll(0, this.props.scrollY);
      global.document.removeEventListener('keydown', this.onKeyDown);
      global.document.removeEventListener('focusout', this.onFocusOut);
      global.document.removeEventListener('focusin', this.onFocusIn);
    } else if (prevProps.modal === 'none' && this.props.modal !== 'none') {
      // display modal
      global.window.scroll(0, 0);
      global.document.addEventListener('keydown', this.onKeyDown);
      global.document.addEventListener('focusout', this.onFocusOut);
      global.document.addEventListener('focusin', this.onFocusIn);
    }
  }
  onFocusIn(evt) {
    if (!this._modalContainer.contains(evt.target)) {
      this.tabbables[0].focus();
    }
  }
  onFocusOut(evt) {
    this.tabbables = tabbable(this._modalContainer);
    if (!this._modalContainer.contains(evt.relatedTarget) && evt.relatedTarget !== null) {
      evt.preventDefault();
      const prevIdx = this.tabbables.indexOf(evt.target);
      if (prevIdx === this.tabbables.length - 1 && this.tabbables[0]) {
        this.tabbables[0].focus();
      } else if (prevIdx === 0 && this.tabbables[this.tabbables.length - 1]) {
        this.tabbables[this.tabbables.length - 1].focus();
      }
    }
  }
  onKeyDown(evt) {
    if (evt.keyCode === ESC) {
      this.hideModal();
    }
  }
  hideModal() {
    this.props.actions.setModal('none');
  }
  componentWillUnmount() {
    global.document.removeEventListener('keydown', this.onKeyDown);
    global.document.removeEventListener('focusout', this.onFocusOut);
    global.document.removeEventListener('focusin', this.onFocusIn);
  }
  render() {
    const { children, scrollY, modal } = this.props;
    return (
      <Fragment>
        <div style={{ top: `-${scrollY}px` }} className={c('left-0 w-100', { fixed: modal !== 'none' })}>
          {children}
        </div>
        <div
          role="dialog"
          ref={el => {
            this._modalContainer = el;
          }}
          className={c('relative z999 minvh-100 flex flex-column flex-center box-xl', { none: modal === 'none' })}>
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-5 opacity-50"
            onClick={this.hideModal.bind(this)}
          />
          <ModalMountPoint />
        </div>
      </Fragment>
    );
  }
}

export default function ViewWithDeps({ children }) {
  return (
    <Consumer mapper={mapper}>
      <View>{children}</View>
    </Consumer>
  );
}
