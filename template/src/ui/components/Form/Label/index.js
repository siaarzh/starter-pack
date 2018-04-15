import c from 'classnames';
import { isEqual } from 'components-di';
import React, { Component } from 'react';

export default class Label extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { children, className, ...restProps } = this.props;
    return (
      <label className={c(className, 'block max-content cursor-pointer')} {...restProps}>
        {children}
      </label>
    );
  }
}
