import c from 'classnames';
import { isEqual } from 'components-di';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';
import renderIf from 'utils/renderIf';

import s from './styles.css';

export default class Radio extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { checked, children, container = {}, ...restProps } = this.props;
    return (
      <label className={c('block max-content cursor-pointer', s.container, container.className)}>
        <input type="radio" checked={checked} {...restProps} />
        <WithBackdrop container={{ className: s.radio }} backdrop={{ className: s['radio-backdrop'] }}>
          {renderIf(checked, <div className={s['radio-mark']} />)}
        </WithBackdrop>
        {children}
      </label>
    );
  }
}
