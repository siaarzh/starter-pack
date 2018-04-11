import React from 'react';
import WithBackdrop from 'components/WithBackdrop';
import c from 'classnames';
import s from './styles.css';

export default function Button({ children, container = {}, backdrop = {}, className, ...restProps }) {
  container.className = ((container.className || '') + ' inline-block').trim();
  backdrop.className = ((backdrop.className || '') + s.backdrop).trim();
  return (
    <WithBackdrop container={container} backdrop={backdrop}>
      <button className={c('z1', className)} {...restProps}>
        {children}
      </button>
    </WithBackdrop>
  );
}

// class Button extends React.Component {
//   render() {
//     const { containerProps = {}, buttonProps = {}, backdropProps = {}, children } = this.props;
//     const { className: containerClassName, ...otherContainerProps } = containerProps;
//     const { className: buttonClassName, ...otherButtonProps } = buttonProps;
//     const { className: backdropClassName, ...otherBackdropProps } = backdropProps;
//     return (
//       <div className={c('relative inline-block', s.container, containerClassName)} {...otherContainerProps}>
//         <button className={c('button z1', buttonClassName)} {...otherButtonProps}>
//           {children}
//         </button>
//         <div className={c(s.backdrop, backdropClassName)} {...otherBackdropProps} />
//       </div>
//     );
//   }
// }

// export default Button;
