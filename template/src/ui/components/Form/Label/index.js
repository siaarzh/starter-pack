import c from 'classnames';
import React from 'react';

export default function Label({ children, className, ...restProps }) {
  return (
    <label className={c(className, 'block max-content cursor-pointer user-select-none')} {...restProps}>
      {children}
    </label>
  );
}
