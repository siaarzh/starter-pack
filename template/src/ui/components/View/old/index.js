import c from 'classnames';
import { useDeps } from 'components-di';
import React, { Component, Fragment } from 'react';
import tabbable from 'tabbable';

import mapper from './mapper';
import s from './styles.css';

const ESC = 27;

class View extends Component {
  constructor(props) {
    super(props);
    this.tabbables = [];

    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.modal !== null && this.props.modal === null) {
      // hide modal
      global.window.scroll(0, this.props.scrollY);
      global.document.removeEventListener('keydown', this.onKeyDown);
      global.document.removeEventListener('focusout', this.onFocusOut);
      global.document.removeEventListener('focusin', this.onFocusIn);
    } else if (prevProps.modal === null && this.props.modal !== null) {
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
    this.props.onHideModal();
  }
  componentWillUnmount() {
    global.document.removeEventListener('keydown', this.onKeyDown);
    global.document.removeEventListener('focusout', this.onFocusOut);
    global.document.removeEventListener('focusin', this.onFocusIn);
  }
  render() {
    const { modal, scrollY, children } = this.props;
    return (
      <Fragment>
        <div style={{ top: `-${scrollY}px` }} className={c(s.content, { fixed: !!modal })}>
          {children}
        </div>
        <div
          role="dialog"
          ref={el => {
            this._modalContainer = el;
          }}
          className={c('relative z999 minvh-100 flex flex-column flex-center box-xl', { none: !modal })}>
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-5 opacity-50"
            onClick={this.hideModal.bind(this)}
          />
          {modal}
        </div>
      </Fragment>
    );
  }
}

export default useDeps(mapper)(View);
