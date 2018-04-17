import c from 'classnames';
import { isEqual } from 'components-di';
import Icon from 'components/Icon';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';

import s from './styles.css';

function labelOrOption(option, labels = {}) {
  return labels[option] === undefined ? option : labels[option];
}

export default class Select extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { container = {}, backdrop = {}, className, options, labels = {}, value, ...restProps } = this.props;
    container.className = ((container.className || '') + `${s.container || ''}`).trim();
    backdrop.className = ((backdrop.className || '') + ` ${s.backdrop}`).trim();
    return (
      <WithBackdrop container={container} backdrop={backdrop}>
        <div className={c(className, 'flex z1')}>
          <div className="flex-auto truncate">
            {value === '' ? 'Select from the list' : labelOrOption(value, labels)}
          </div>
          <Icon name="svg-select" />{' '}
        </div>
        <select
          className={'z2 absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer'}
          value={value}
          {...restProps}>
          {options.map(option => (
            <option key={option} value={option}>
              {labelOrOption(option, labels)}
            </option>
          ))}
        </select>
      </WithBackdrop>
    );
  }
}
