import c from 'classnames';
import React from 'react';

import s from './styles.css';

class Link extends React.Component {
  render() {
    const { containerProps = {}, linkProps = {}, backdropProps = {}, children } = this.props;
    const { className: containerClassName, ...otherContainerProps } = containerProps;
    const { className: linkClassName, ...otherLinkProps } = linkProps;
    const { className: backdropClassName, ...otherBackdropProps } = backdropProps;
    return (
      <div className={c('relative inline-block', s.container, containerClassName)} {...otherContainerProps}>
        <a className={c('link z1', linkClassName)} {...otherLinkProps}>
          {children}
        </a>
        <div className={c(s.backdrop, backdropClassName)} {...otherBackdropProps} />
      </div>
    );
  }
}

export default Link;
