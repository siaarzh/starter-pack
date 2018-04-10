import c from 'classnames';
import React, { Component } from 'react';

import s from './styles.css';

class Input extends Component {
  render() {
    const { containerProps = {}, backdropProps = {}, ...inputProps } = this.props;
    const { className: containerClassName, ...otherContainerProps } = containerProps;
    const { className: inputClassName, ...otherInputProps } = inputProps;
    const { className: backdropClassName, ...otherBackdropProps } = backdropProps;
    return (
      <div className={c('relative block', s.container, containerClassName)} {...otherContainerProps}>
        <input className={c('z1', inputClassName)} {...otherInputProps} />
        <div className={c(s.backdrop, backdropClassName)} {...otherBackdropProps} />
      </div>
    );
  }
}

export default Input;
