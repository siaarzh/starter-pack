import React from 'react';
import c from 'classnames';

export default function WithBackdrop({ container = {}, backdrop = {}, children }) {
  const { className: containerClassName, ...restContainerProps } = container;
  const { className: backdropClassName, ...restBackdropProps } = backdrop;
  return (
    <div className={c('relative', containerClassName)} {...restContainerProps}>
      {children}
      <div
        className={c('absolute top-0 left-0 right-0 bottom-0 r-inherit', backdropClassName)}
        {...restBackdropProps}
      />
    </div>
  );
}
