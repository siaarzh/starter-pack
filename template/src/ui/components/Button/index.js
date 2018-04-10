import c from 'classnames';
import React from 'react';

import s from './styles.css';

class Button extends React.Component {
  render() {
    const { containerProps = {}, buttonProps = {}, backdropProps = {}, children } = this.props;
    const { className: containerClassName, ...otherContainerProps } = containerProps;
    const { className: buttonClassName, ...otherButtonProps } = buttonProps;
    const { className: backdropClassName, ...otherBackdropProps } = backdropProps;
    return (
      <div className={c('relative inline-block', s.container, containerClassName)} {...otherContainerProps}>
        <button className={c('button z1', buttonClassName)} {...otherButtonProps}>
          {children}
        </button>
        <div className={c(s.backdrop, backdropClassName)} {...otherBackdropProps} />
      </div>
    );
  }
}

export default Button;
