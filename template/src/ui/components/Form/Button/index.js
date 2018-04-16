import c from 'classnames';
import { isEqual } from 'components-di';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';

import s from './styles.css';

export default class Button extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    let { children, container = {}, backdrop = {}, className, ...restProps } = this.props;
    container.className = ((container.className || '') + ` inline-block ${s.container || ''}`).trim();
    backdrop.className = ((backdrop.className || '') + s.backdrop).trim();
    restProps = Object.assign({ type: 'button' }, restProps);
    return (
      <WithBackdrop container={container} backdrop={backdrop}>
        <button className={c('z1 cursor-pointer', className)} {...restProps}>
          {children}
        </button>
      </WithBackdrop>
    );
  }
}
