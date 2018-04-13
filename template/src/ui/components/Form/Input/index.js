import c from 'classnames';
import { isEqual } from 'components-di';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';

import s from './styles.css';

export default class Input extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { container = {}, backdrop = {}, className, ...restProps } = this.props;
    container.className = ((container.className || '') + `${s.container || ''}`).trim();
    backdrop.className = ((backdrop.className || '') + s.backdrop).trim();
    return (
      <WithBackdrop container={container} backdrop={backdrop}>
        <input className={c('z1', className)} {...restProps} />
      </WithBackdrop>
    );
  }
}
