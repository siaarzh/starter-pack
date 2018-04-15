import c from 'classnames';
import { isEqual } from 'components-di';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';

import s from './styles.css';

export default class Toggle extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { checked, children, container = {}, value, name, ...restProps } = this.props;
    // handleChange deposits a "{ [value]: checked }" value at "name" path
    // toggle uses "name" prop and should ignore incoming "value"
    // so, to handle deep names (e.g. "parent.toggle") we have to split the name and pop the value
    const inputName = name.split('.');
    const inputValue = inputName.pop();
    return (
      <label className={c('block max-content cursor-pointer', s.container, container.className)}>
        <input type="checkbox" checked={checked} name={inputName} value={inputValue} {...restProps} />
        <WithBackdrop container={{ className: c(s.toggle) }} backdrop={{ className: s['toggle-backdrop'] }}>
          <div className={c('z1', s['toggle-mark'])} />
        </WithBackdrop>
        {children}
      </label>
    );
  }
}
