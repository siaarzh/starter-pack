import c from 'classnames';
import React, { Component } from 'react';

import s from './styles.css';

class Label extends Component {
  render() {
    const { children, className, ...restProps } = this.props;
    return (
      <label className={c(className, s.label, 'block max-content cursor-pointer user-select-none')} {...restProps}>
        {children}
      </label>
    );
  }
}

export default Label;
